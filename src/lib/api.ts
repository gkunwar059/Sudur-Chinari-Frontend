import { cache } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Article, Category, District, VideoItem, PhotoStory, ArticleComment, Author, HeroSlide } from '@/types';
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

  getArticlesServer: cache(async (params?: { lang?: ApiLang; [key: string]: any }) => {
    const { lang, ...rest } = params || {};
    return apiFetch<PaginatedResponse<Article>>('/articles/', {
      lang,
      params: rest,
      next: { revalidate: 60, tags: ['articles', ...(lang ? [`articles-${lang}`] : [])] },
    });
  }),

  getArticleBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    const lowerSlug = slug.toLowerCase();
    return apiFetch<Article>(`/articles/${encodeURIComponent(lowerSlug)}/`, {
      lang,
      next: { revalidate: 60, tags: [`article-${lowerSlug}`, ...(lang ? [`article-${lowerSlug}-${lang}`] : [])] },
    });
  }),

  // Hero Slides
  getHeroSlidesClient: (params?: { lang?: ApiLang; [key: string]: any }) => {
    return apiFetch<PaginatedResponse<HeroSlide>>('/hero-slides/', {
      params,
    });
  },

  getHeroSlidesServer: cache(async (params?: { lang?: ApiLang; [key: string]: any }) => {
    const { lang, ...rest } = params || {};
    return apiFetch<PaginatedResponse<HeroSlide>>('/hero-slides/', {
      lang,
      params: rest,
      next: { revalidate: 60, tags: ['hero-slides', ...(lang ? [`hero-slides-${lang}`] : [])] },
    });
  }),

  // Districts
  getDistrictsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<ApiDistrictRecord>>('/districts/', {
      lang,
      next: { revalidate: 3600, tags: ['districts', ...(lang ? [`districts-${lang}`] : [])] },
    });
  }),

  getDistrictBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    return apiFetch<ApiDistrictRecord>(`/districts/${encodeURIComponent(slug)}/`, {
      lang,
      next: { revalidate: 60, tags: [`district-${slug}`, ...(lang ? [`district-${slug}-${lang}`] : [])] },
    });
  }),

  getDistrictsClient: async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<ApiDistrictRecord>>('/districts/', {
      lang,
      params: { limit: FULL_LIST_LIMIT },
    });
  },

  // Categories
  getCategoriesServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<Category>>('/categories/', {
      lang,
      next: { revalidate: 3600, tags: ['categories', ...(lang ? [`categories-${lang}`] : [])] },
    });
  }),

  getMenuServer: cache(async (lang?: ApiLang) => {
    return apiFetch<Category[]>('/categories/menu/', {
      lang,
      next: { revalidate: 300, tags: ['categories', ...(lang ? [`categories-${lang}`] : [])] },
    });
  }),

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

  // Authors
  getAuthorsServer: cache(async (params?: Record<string, any>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<Author>>('/authors/', {
      lang,
      params,
      next: { revalidate: 3600, tags: ['authors', ...(lang ? [`authors-${lang}`] : [])] },
    });
  }),

  getAuthorBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    return apiFetch<Author>(`/authors/${encodeURIComponent(slug)}/`, {
      lang,
      next: { revalidate: 3600, tags: [`author-${slug}`] },
    });
  }),

  // Partners
  getPartnersServer: cache(async (params?: Record<string, string | number>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<PartnerRecord>>('/partners/', {
      lang,
      params,
      next: { revalidate: 3600, tags: ['partners', ...(lang ? [`partners-${lang}`] : [])] },
    });
  }),

  // Hotels
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

  // Videos
  getVideosServer: cache(async (params?: Record<string, any>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<VideoItem>>('/videos/', {
      lang,
      params,
      next: { revalidate: 300, tags: ['videos', ...(lang ? [`videos-${lang}`] : [])] },
    });
  }),

  getVideosClient: async (params: Record<string, any> = {}) => {
    return apiFetch<PaginatedResponse<VideoItem>>('/videos/', { params });
  },

  getVideoByIdServer: cache(async (id: string | number, lang?: ApiLang) => {
    return apiFetch<VideoItem>(`/videos/${encodeURIComponent(String(id))}/`, {
      lang,
      next: { revalidate: 300, tags: [`video-${id}`] },
    });
  }),

  postVideoClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/videos/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Photo Stories
  getPhotoStoriesServer: cache(async (params?: Record<string, any>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<PhotoStory>>('/photo-stories/', {
      lang,
      params,
      next: { revalidate: 300, tags: ['photo-stories', ...(lang ? [`photo-stories-${lang}`] : [])] },
    });
  }),

  getPhotoStoryByIdServer: cache(async (id: string | number, lang?: ApiLang) => {
    return apiFetch<PhotoStory>(`/photo-stories/${encodeURIComponent(String(id))}/`, {
      lang,
      next: { revalidate: 300, tags: [`photo-story-${id}`] },
    });
  }),

  // Breaking News
  getBreakingNewsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/breaking-news/', {
      lang,
      next: { revalidate: 60, tags: ['breaking-news'] },
    });
  }),

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
  getPopupAdsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/popup-ads/', {
      lang,
      next: { revalidate: 300, tags: ['popup-ads'] },
    });
  }),

  getActivePopupAdClient: async (lang?: ApiLang) => {
    return apiFetch<{ active: boolean; data: any }>('/popup-ads/active/', {
      lang,
    });
  },

  // Homepage Placements
  getHomepagePlacementsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/homepage-placements/', {
      lang,
      next: { revalidate: 300, tags: ['homepage-placements'] },
    });
  }),

  // Banner Ads
  getBannerAdsServer: cache(async (placement?: string, page?: string, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/banner-ads/', {
      lang,
      params: { ...(placement ? { placement } : {}), ...(page ? { page } : {}) },
      next: { revalidate: 300, tags: ['banner-ads', ...(placement ? [`banner-ads-${placement}`] : [])] },
    });
  }),

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
  getProductsServer: cache(async (params?: Record<string, any>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/products/', {
      lang,
      params,
      next: { revalidate: 60, tags: ['products', ...(lang ? [`products-${lang}`] : [])] },
    });
  }),

  getProductBySlugServer: cache(async (slug: string, lang?: ApiLang) => {
    return apiFetch<any>(`/products/${encodeURIComponent(slug)}/`, {
      lang,
      next: { revalidate: 60, tags: [`product-${slug}`, ...(lang ? [`product-${slug}-${lang}`] : [])] },
    });
  }),

  getProductCategoriesServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/product-categories/', {
      lang,
      next: { revalidate: 3600, tags: ['product-categories'] },
    });
  }),

  getFarmersServer: cache(async (params?: Record<string, any>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/producers/', {
      lang,
      params,
      next: { revalidate: 60, tags: ['producers'] },
    });
  }),

  postProductContributionClient: async (data: any) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiFetch('/products/', {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Transit / Yatayat
  getYatayatServicesServer: cache(async (params?: Record<string, any>, lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/yatayat/', {
      lang,
      params,
      next: { revalidate: 60, tags: ['yatayat'] },
    });
  }),

  getYatayatLocationsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/yatayat-locations/', {
      lang,
      next: { revalidate: 3600, tags: ['yatayat-locations'] },
    });
  }),

  getYatayatHelplinesServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/yatayat-helplines/', {
      lang,
      next: { revalidate: 3600, tags: ['yatayat-helplines'] },
    });
  }),

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

  getSitemapServer: cache(async () => {
    return apiFetch<any[]>('/sitemap/', {
      next: { revalidate: 3600, tags: ['sitemap'] },
    });
  }),

  // Trending Topics & Global Search
  getTrendingTopicsServer: cache(async (lang?: ApiLang) => {
    return apiFetch<PaginatedResponse<any>>('/trending-topics/', {
      lang,
      next: { revalidate: 300, tags: ['trending-topics'] },
    });
  }),

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

