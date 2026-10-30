import { cache } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Category } from '@/types';

export type ApiLang = Locale | 'all';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiFetchOptions extends RequestInit {
  lang?: ApiLang;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

function getBaseApiUrl(): string {
  // In the browser, use relative /api/v1 (proxied via Next.js or Nginx)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  }

  // On the server:
  // 1. If DJANGO_API_URL is configured (e.g. http://sudur_backend:8000), use that:
  if (process.env.DJANGO_API_URL) {
    const base = process.env.DJANGO_API_URL.replace(/\/+$/, '');
    return `${base}/api/v1`;
  }

  // 2. If NEXT_PUBLIC_API_URL is an absolute HTTP URL, use that:
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  // 3. Fallback to default local Django port
  return 'http://127.0.0.1:8001/api/v1';
}

function getBuildTimeFallback<T = any>(endpoint: string): T {
  const clean = endpoint.split('?')[0].replace(/^\/+|\/+$/g, '');

  // Specific array endpoints (menu, sitemap)
  if (clean === 'categories/menu' || clean === 'sitemap') {
    return [] as unknown as T;
  }

  // List/collection endpoints (articles, districts, categories, hotels, partners, comments)
  const segments = clean.split('/');
  if (segments.length === 1) {
    return { count: 0, next: null, previous: null, results: [] } as unknown as T;
  }

  // Single detail endpoints (articles/slug, districts/slug, categories/slug, hotels/slug)
  return null as unknown as T;
}

export async function apiFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  // During Docker image build time (npm run build), the backend container is offline.
  // Return safe fallbacks so SSG/prerendering immediately completes with fallback data
  // instead of hanging for 60s per page or throwing build-breaking exceptions!
  if (process.env.SKIP_BUILD_FETCH === 'true') {
    return getBuildTimeFallback<T>(endpoint);
  }

  const isServer = typeof window === 'undefined';
  const { lang, params, timeout, ...fetchOptions } = options;

  // Build query string
  const urlObj = new URL(
    endpoint.startsWith('http') ? endpoint : `http://dummy${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  );
  
  if (lang) {
    urlObj.searchParams.set('lang', lang);
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) {
        urlObj.searchParams.set(k, String(v));
      }
    }
  }

  const queryPath = `${urlObj.pathname}${urlObj.search}`;
  const base = getBaseApiUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${base}${queryPath}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Enforce a strict timeout (default 4s on server, 10s on client)
  const timeoutMs = timeout ?? (isServer ? 4000 : 10000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal || controller.signal,
    });

    if (!res.ok) {
      let errorData: any;
      try {
        errorData = await res.json();
      } catch {
        errorData = res.statusText;
      }
      const errorObj = new Error(`Failed to fetch from ${endpoint}: ${res.status}`);
      (errorObj as any).response = { status: res.status, data: errorData };
      throw errorObj;
    }

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const serverFetch = apiFetch;

export const newsApi = {
  // Client side fetch using native fetch + TanStack Query
  getArticlesClient: async (params: Record<string, any> = {}) => {
    return apiFetch<PaginatedResponse<any>>('/articles/', { params });
  },

  // Server side fetch with caching per locale
  getArticlesServer: cache(async (params?: { lang?: ApiLang; [key: string]: any }) => {
    const { lang, ...rest } = params || {};
    return apiFetch<PaginatedResponse<any>>('/articles/', {
      lang,
      params: rest,
      next: { revalidate: 60, tags: ['articles', ...(lang ? [`articles-${lang}`] : [])] },
    });
  }),

  getArticleBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    const lowerSlug = slug.toLowerCase();
    return apiFetch(`/articles/${encodeURIComponent(lowerSlug)}/`, {
      lang,
      next: { revalidate: 60, tags: [`article-${lowerSlug}`, ...(lang ? [`article-${lowerSlug}-${lang}`] : [])] },
    });
  }),

  getDistrictsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/districts/', {
      lang,
      next: { revalidate: 3600, tags: ['districts', ...(lang ? [`districts-${lang}`] : [])] },
    });
  }),

  getDistrictBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    return apiFetch(`/districts/${encodeURIComponent(slug)}/`, {
      lang,
      next: { revalidate: 60, tags: [`district-${slug}`, ...(lang ? [`district-${slug}-${lang}`] : [])] },
    });
  }),

  getDistrictsClient: async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/districts/', { lang });
  },

  getCategoriesServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<Category>>('/categories/', {
      lang,
      next: { revalidate: 3600, tags: ['categories', ...(lang ? [`categories-${lang}`] : [])] },
    });
  }),

  /** Header menu tree: top-level categories with their visible sub-categories */
  getMenuServer: cache(async (lang?: ApiLang) => {
    return apiFetch<Category[]>('/categories/menu/', {
      lang,
      next: { revalidate: 300, tags: ['categories', ...(lang ? [`categories-${lang}`] : [])] },
    });
  }),

  /** Single category with parent + children */
  getCategoryBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    try {
      return await apiFetch<Category>(`/categories/${encodeURIComponent(slug)}/`, {
        lang,
        next: { revalidate: 300, tags: ['categories', `category-${slug}`] },
      });
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
  }),

  /** Returns a bare array (not paginated) */
  getSitemapServer: cache(async () => {
    return apiFetch<{ type: string; slug: string; updated_at: string; has_ne: boolean }[]>('/sitemap/', {
      next: { revalidate: 3600, tags: ['sitemap'] },
    });
  }),

  getPartnersServer: cache(async (params?: Record<string, string | number>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/partners/', {
      lang,
      params,
      next: { revalidate: 3600, tags: ['partners', ...(lang ? [`partners-${lang}`] : [])] },
    });
  }),

  getHotelsServer: cache(async (params?: Record<string, string | number>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/hotels/', {
      lang,
      params,
      next: { revalidate: 60, tags: ['hotels', ...(lang ? [`hotels-${lang}`] : [])] },
    });
  }),

  getHotelBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    return apiFetch<any>(`/hotels/${encodeURIComponent(slug)}/`, {
      lang,
      next: { revalidate: 60, tags: [`hotel-${slug}`, ...(lang ? [`hotel-${slug}-${lang}`] : [])] },
    });
  }),
};
