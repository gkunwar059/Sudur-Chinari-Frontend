import type { Locale } from '@/lib/i18n/config';
import type { Article, District, VideoItem, ArticleComment, HeroSlide } from '@/types';
import { normalizeImageUrl } from '@/lib/utils';

const CLIENT_ARTICLE_LIMIT = 24;
const FULL_LIST_LIMIT = 100;

export type ApiLang = Locale | 'all';

export type ApiDistrictRecord = Omit<District, 'id'> & {
  id: number | string;
};

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

export interface PartnerRecord {
  id: number | string;
  name?: string;
  nameNe?: string;
  nameEn?: string;
  role?: string;
  roleNe?: string;
  roleEn?: string;
  image?: string | null;
  url?: string | null;
  district?: number | string | null;
  district_slug?: string | null;
  district_name?: string | null;
}

export function normalizeApiImages<T>(data: T): T {
  if (!data) return data;
  if (typeof data === 'string') {
    if (
      data.includes('sudurchinari.com/images/') ||
      data.includes('127.0.0.1:8001/images/') ||
      data.includes('localhost:8001/images/') ||
      data.includes('sudurchinari.com/media/') ||
      data.includes('127.0.0.1:8001/media/') ||
      data.includes('localhost:8001/media/')
    ) {
      return normalizeImageUrl(data) as unknown as T;
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => normalizeApiImages(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const copy: any = { ...data };
    for (const [key, value] of Object.entries(copy)) {
      if (typeof value === 'string') {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('image') ||
          lowerKey === 'avatar' ||
          lowerKey === 'thumbnail' ||
          lowerKey === 'coverimage' ||
          lowerKey === 'featuredimage' ||
          lowerKey === 'heroimage' ||
          lowerKey === 'og_image'
        ) {
          copy[key] = normalizeImageUrl(value);
        }
      } else if (typeof value === 'object' && value !== null) {
        copy[key] = normalizeApiImages(value);
      }
    }
    return copy;
  }
  return data;
}

function getBaseApiUrl(): string {
  // In the browser, use relative /api/v1 (proxied via Next.js or Nginx)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  }

  // On the server:
  // 1. If DJANGO_API_URL is configured (e.g. https://api.sudurchinari.com), use that:
  if (process.env.DJANGO_API_URL) {
    const base = process.env.DJANGO_API_URL.replace(/\/+$/, '');
    return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
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

  if (clean === 'popup-ads/active' || clean === 'banner-ads/active') {
    return { active: false, data: null } as unknown as T;
  }

  // List/collection endpoints (articles, districts, categories, hotels, partners, comments, videos, etc.)
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
  // Guard on NEXT_PHASE so a leaked SKIP_BUILD_FETCH env var in the running
  // container can never blank out all server-rendered data at runtime.
  if (
    process.env.SKIP_BUILD_FETCH === 'true' &&
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
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

  const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; SudurChinari/1.0; +https://sudurchinari.com)',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  } else if (isFormData) {
    delete headers['Content-Type'];
  }

  // Enforce a resilient timeout (12s on server, 15s on client)
  const timeoutMs = timeout ?? (isServer ? 12000 : 15000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      credentials: 'include',
      ...fetchOptions,
      headers,
      signal: fetchOptions.signal || controller.signal,
    });

    if (!res.ok) {
      let errorData: any;
      try {
        const cloned = res.clone();
        try {
          errorData = await cloned.json();
        } catch {
          const text = await res.text().catch(() => '');
          errorData = text || res.statusText;
        }
      } catch {
        errorData = res.statusText;
      }
      const errorObj = new Error(`Failed to fetch from ${endpoint}: ${res.status}`);
      (errorObj as any).response = { status: res.status, data: errorData };
      throw errorObj;
    }

    const data = await res.json();
    return normalizeApiImages(data) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const serverFetch = apiFetch;

export const newsApi = {
  // Articles
  getArticlesClient: async (params: Record<string, string | number | boolean | undefined> = {}) => {
    return apiFetch<PaginatedResponse<Article>>('/articles/', {
      params: { limit: CLIENT_ARTICLE_LIMIT, ...params },
    });
  },

  // Hero Slides
  getHeroSlidesClient: (params?: { lang?: ApiLang; [key: string]: any }) => {
    return apiFetch<PaginatedResponse<HeroSlide>>('/hero-slides/', {
      params,
    });
  },

  // Districts
  getDistrictsClient: async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<ApiDistrictRecord>>('/districts/', {
      lang,
      params: { limit: FULL_LIST_LIMIT },
    });
  },

  // Videos
  getVideosClient: async (params: Record<string, any> = {}) => {
    return apiFetch<PaginatedResponse<VideoItem>>('/videos/', { params });
  },

  postVideoClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/videos/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Comments
  getCommentsClient: async (params: { articleId?: string | number; [key: string]: any } = {}) => {
    return apiFetch<PaginatedResponse<ArticleComment>>('/comments/', { params });
  },

  postCommentClient: async (data: any) => {
    return apiFetch<ArticleComment>('/comments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  likeCommentClient: async (commentId: string | number) => {
    return apiFetch<{ likes: number }>(`/comments/${commentId}/like/`, {
      method: 'POST',
    });
  },

  // Popup Ads
  getActivePopupAdClient: async (lang?: ApiLang) => {
    return apiFetch<{ active: boolean; data: any }>('/popup-ads/active/', {
      lang,
    });
  },

  // Banner Ads
  getActiveBannerAdClient: async (placement: string, page?: string, lang?: ApiLang) => {
    const params: Record<string, string> = { placement };
    if (page) params.page = page;
    return apiFetch<{ active: boolean; data: any }>('/banner-ads/active/', {
      lang,
      params,
    });
  },

  requestBannerAdClient: async (formData: FormData) => {
    return apiFetch<{ success: boolean; message: string; data: any }>('/banner-ads/request_ad/', {
      method: 'POST',
      body: formData,
    });
  },

  getMyBannerAdsClient: async () => {
    return apiFetch<any[]>('/banner-ads/my_ads/');
  },

  clickBannerAdClient: async (adId: string | number) => {
    return apiFetch<{ clicks: number }>(`/banner-ads/${adId}/click/`, {
      method: 'POST',
    });
  },

  recordBannerImpressionClient: async (adId: string | number) => {
    return apiFetch<{ impressions: number }>(`/banner-ads/${adId}/impression/`, {
      method: 'POST',
    });
  },

  // Local Products
  getProductCategoriesClient: async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/product-categories/', {
      lang,
    });
  },

  postProductContributionClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/products/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Transit / Yatayat
  postYatayatRegistrationClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/yatayat/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  postYatayatReportClient: async (data: any) => {
    return apiFetch('/yatayat-reports/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Community Submissions
  getStoryContributionsClient: async (params?: Record<string, any>) => {
    return apiFetch<PaginatedResponse<any>>('/story-contributions/', {
      params,
    });
  },

  getPhotoContributionsClient: async (params?: Record<string, any>) => {
    return apiFetch<PaginatedResponse<any>>('/photo-contributions/', {
      params,
    });
  },

  postPhotoContributionClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/photo-contributions/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  postPhotoStoryClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/photo-stories/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  postStoryContributionClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/story-contributions/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Article Actions
  likeArticleClient: async (slug: string) => {
    return apiFetch<{ likes: number }>(`/articles/${encodeURIComponent(slug)}/like/`, {
      method: 'POST',
    });
  },

  viewArticleClient: async (slug: string) => {
    return apiFetch<{ views: number }>(`/articles/${encodeURIComponent(slug)}/view/`, {
      method: 'POST',
    });
  },

  // Video Actions & Comments
  likeVideoClient: async (videoId: string | number) => {
    return apiFetch<{ likes: number; has_liked: boolean }>(`/videos/${videoId}/like/`, {
      method: 'POST',
    });
  },

  getVideoLikeStatusClient: async (videoId: string | number) => {
    return apiFetch<{ likes: number; has_liked: boolean }>(`/videos/${videoId}/like_status/`);
  },

  viewVideoClient: async (videoId: string | number) => {
    return apiFetch<{ views: number }>(`/videos/${videoId}/view/`, {
      method: 'POST',
    });
  },

  getVideoCommentsClient: async (params?: string | number | { videoId?: string | number; [key: string]: any }) => {
    const queryParams = typeof params === 'object' ? params : (params !== undefined ? { video: params } : {});
    return apiFetch<PaginatedResponse<any>>('/video-comments/', { params: queryParams });
  },

  postVideoCommentClient: async (data: any) => {
    return apiFetch('/video-comments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  likeVideoCommentClient: async (commentId: string | number) => {
    return apiFetch<{ likes: number; has_liked: boolean }>(`/video-comments/${commentId}/like/`, {
      method: 'POST',
    });
  },

  // Global Search
  globalSearchClient: async (query: string, lang?: ApiLang) => {
    return apiFetch<any>('/search/', {
      lang,
      params: { q: query },
    });
  },

  // Inquiries & Newsletter
  postContactInquiryClient: async (data: any) => {
    return apiFetch('/contact-inquiries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  postNewsletterSubscriptionClient: async (email: string) => {
    return apiFetch('/newsletter/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

