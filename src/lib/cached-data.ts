import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api";
import type { ApiDistrictRecord, ApiLang, PaginatedResponse, PartnerRecord } from "@/lib/api";
import type { Article, Category, Hotel, VideoItem, PhotoStory, Author, HeroSlide } from "@/types";

const ARTICLE_LIST_LIMIT = 24;
const FULL_LIST_LIMIT = 100;

export async function getArticlesCached(params?: {
  lang?: ApiLang;
  [key: string]: any;
}) {
  "use cache";
  cacheLife("minutes");
  const { lang, ...rest } = params || {};
  cacheTag("articles");
  if (lang) cacheTag(`articles-${lang}`);
  return apiFetch<PaginatedResponse<Article>>("/articles/", {
    lang,
    params: { limit: ARTICLE_LIST_LIMIT, ...rest },
  });
}

export async function getArticleBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  const lowerSlug = slug.toLowerCase();
  cacheTag(`article-${lowerSlug}`);
  if (lang) cacheTag(`article-${lowerSlug}-${lang}`);
  try {
    return await apiFetch(`/articles/${encodeURIComponent(lowerSlug)}/`, { lang });
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getDistrictsCached(lang?: ApiLang) {
  "use cache";
  cacheLife("hours");
  cacheTag("districts");
  if (lang) cacheTag(`districts-${lang}`);
  return apiFetch<PaginatedResponse<ApiDistrictRecord>>("/districts/", {
    lang,
    params: { limit: FULL_LIST_LIMIT },
  });
}

export async function getCategoriesCached(lang?: ApiLang) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  if (lang) cacheTag(`categories-${lang}`);
  return apiFetch<PaginatedResponse<Category>>("/categories/", {
    lang,
    params: { limit: FULL_LIST_LIMIT },
  });
}

export async function getMenuCached(lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories");
  if (lang) cacheTag(`categories-${lang}`);
  return apiFetch<Category[]>("/categories/menu/", { lang }).catch(() => []);
}

export async function getCategoryBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag("categories", `category-${slug}`);
  try {
    return await apiFetch<Category>(`/categories/${encodeURIComponent(slug)}/`, {
      lang,
    });
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getDistrictBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`district-${slug}`);
  if (lang) cacheTag(`district-${slug}-${lang}`);
  return apiFetch<ApiDistrictRecord>(`/districts/${encodeURIComponent(slug)}/`, {
    lang,
  }).catch(() => null);
}

export async function getPartnersCached(
  params?: Record<string, string | number>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("hours");
  cacheTag("partners");
  if (lang) cacheTag(`partners-${lang}`);
  return apiFetch<PaginatedResponse<PartnerRecord>>("/partners/", {
    lang,
    params: { limit: FULL_LIST_LIMIT, ...params },
  }).catch(() => ({ count: 0, next: null, previous: null, results: [] }));
}

export async function getHotelsCached(
  params?: Record<string, string | number>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("hotels");
  if (lang) cacheTag(`hotels-${lang}`);
  return apiFetch<PaginatedResponse<Hotel>>("/hotels/", {
    lang,
    params: { limit: FULL_LIST_LIMIT, ...params },
  });
}

export async function getHotelBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`hotel-${slug}`);
  if (lang) cacheTag(`hotel-${slug}-${lang}`);
  try {
    return await apiFetch<any>(`/hotels/${encodeURIComponent(slug)}/`, { lang });
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getVideosCached(
  params?: Record<string, string | number>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("videos");
  if (lang) cacheTag(`videos-${lang}`);
  return apiFetch<PaginatedResponse<VideoItem>>("/videos/", {
    lang,
    params: { limit: FULL_LIST_LIMIT, ...params },
  });
}

export async function getPhotoStoriesCached(
  params?: Record<string, string | number>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("photo-stories");
  if (lang) cacheTag(`photo-stories-${lang}`);
  return apiFetch<PaginatedResponse<PhotoStory>>("/photo-stories/", {
    lang,
    params: { limit: FULL_LIST_LIMIT, ...params },
  });
}

export async function getAuthorsCached(
  params?: Record<string, string | number>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("hours");
  cacheTag("authors");
  if (lang) cacheTag(`authors-${lang}`);
  return apiFetch<PaginatedResponse<Author>>("/authors/", {
    lang,
    params: { limit: FULL_LIST_LIMIT, ...params },
  });
}

export async function getBreakingNewsCached(lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag("breaking-news");
  if (lang) cacheTag(`breaking-news-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/breaking-news/", { lang });
}

export async function getHeroSlidesCached(params?: {
  lang?: ApiLang;
  [key: string]: any;
}) {
  "use cache";
  cacheLife("minutes");
  const { lang, ...rest } = params || {};
  cacheTag("hero-slides");
  if (lang) cacheTag(`hero-slides-${lang}`);
  return apiFetch<PaginatedResponse<HeroSlide>>("/hero-slides/", {
    lang,
    params: rest,
  });
}

export async function getAuthorBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("hours");
  cacheTag("authors", `author-${slug}`);
  if (lang) cacheTag(`author-${slug}-${lang}`);
  try {
    return await apiFetch<Author>(`/authors/${encodeURIComponent(slug)}/`, { lang });
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getVideoByIdCached(
  id: string | number,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("videos", `video-${id}`);
  try {
    return await apiFetch<VideoItem>(`/videos/${encodeURIComponent(String(id))}/`, {
      lang,
    });
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getPhotoStoryByIdCached(
  id: string | number,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("photo-stories", `photo-story-${id}`);
  try {
    return await apiFetch<PhotoStory>(
      `/photo-stories/${encodeURIComponent(String(id))}/`,
      { lang },
    );
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getProductsCached(
  params?: Record<string, any>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");
  if (lang) cacheTag(`products-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/products/", {
    lang,
    params,
  });
}

export async function getProductBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`product-${slug}`);
  if (lang) cacheTag(`product-${slug}-${lang}`);
  try {
    return await apiFetch<any>(`/products/${encodeURIComponent(slug)}/`, { lang });
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function getProductCategoriesCached(lang?: ApiLang) {
  "use cache";
  cacheLife("hours");
  cacheTag("product-categories");
  if (lang) cacheTag(`product-categories-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/product-categories/", { lang });
}

export async function getTrendingTopicsCached(lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag("trending-topics");
  if (lang) cacheTag(`trending-topics-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/trending-topics/", { lang });
}

export async function getYatayatServicesCached(
  params?: Record<string, any>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("yatayat");
  if (lang) cacheTag(`yatayat-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/yatayat/", {
    lang,
    params,
  });
}

export async function getSitemapCached() {
  "use cache";
  cacheLife("hours");
  cacheTag("sitemap");
  return apiFetch<any[]>("/sitemap/").catch(() => []);
}


