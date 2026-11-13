import { Suspense } from "react";
import SearchClient from "./SearchClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import {
  getArticlesCached,
  getCategoriesCached,
  getDistrictsCached,
  getTrendingTopicsCached,
} from "@/lib/cached-data";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/search">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return buildMetadata({
    locale: lang as Locale,
    path: "/search",
    title: dict.meta.search.title,
    description: dict.meta.search.description,
    noIndex: true,
  });
}

export default async function SearchPage({
  params,
}: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // Fetch initial data on the server
  const [articlesData, districtsData, categoriesData, trendingData] = await Promise.all([
    getArticlesCached({ lang: lang as Locale, limit: 100 }).catch(() => null),
    getDistrictsCached(lang as Locale).catch(() => null),
    getCategoriesCached(lang as Locale).catch(() => null),
    getTrendingTopicsCached(lang as Locale).catch(() => null),
  ]);

  const initialArticles = articlesData?.results || [];
  const districts = districtsData?.results || [];
  const categories = categoriesData?.results || [];
  const trendingTopics = (trendingData?.results && trendingData.results.length > 0)
    ? trendingData.results.map((item: any) => typeof item.name === "object" ? (item.name[lang] || item.name.ne || item.name.en) : item.name)
    : undefined;

  return (
    <Suspense>
      <SearchClient
        initialArticles={initialArticles}
        districts={districts}
        categories={categories}
        trendingTopics={trendingTopics}
      />
    </Suspense>
  );
}
