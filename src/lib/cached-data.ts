import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api";
import type { ApiDistrictRecord, ApiLang, PaginatedResponse, PartnerRecord } from "@/lib/api";
import type { Article, Category, Hotel } from "@/types";

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
  return apiFetch(`/articles/${encodeURIComponent(lowerSlug)}/`, { lang });
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
  return apiFetch<Category[]>("/categories/menu/", { lang });
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
  });
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
  });
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
  return apiFetch<any>(`/hotels/${encodeURIComponent(slug)}/`, { lang });
}
