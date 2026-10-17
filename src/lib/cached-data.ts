import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api";
import type { ApiLang, PaginatedResponse } from "@/lib/api";
import type { Category } from "@/types";

export async function getArticlesCached(params?: {
  lang?: ApiLang;
  [key: string]: any;
}) {
  "use cache";
  cacheLife("minutes");
  const { lang, ...rest } = params || {};
  cacheTag("articles");
  if (lang) cacheTag(`articles-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/articles/", { lang, params: rest });
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
  return apiFetch<PaginatedResponse<any>>("/districts/", { lang });
}

export async function getCategoriesCached(lang?: ApiLang) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  if (lang) cacheTag(`categories-${lang}`);
  return apiFetch<PaginatedResponse<Category>>("/categories/", { lang });
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

export async function getHotelsCached(
  params?: Record<string, string | number>,
  lang?: ApiLang,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("hotels");
  if (lang) cacheTag(`hotels-${lang}`);
  return apiFetch<PaginatedResponse<any>>("/hotels/", { lang, params });
}

export async function getHotelBySlugCached(slug: string, lang?: ApiLang) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`hotel-${slug}`);
  if (lang) cacheTag(`hotel-${slug}-${lang}`);
  return apiFetch<any>(`/hotels/${encodeURIComponent(slug)}/`, { lang });
}
