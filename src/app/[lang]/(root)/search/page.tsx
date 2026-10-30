import { Suspense } from "react";
import { newsApi } from "@/lib/api";
import SearchClient from "./SearchClient";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/search">): Promise<Metadata> {
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

export default async function SearchPage({ params }: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // Fetch initial data on the server
  const [articlesData, districtsData, categoriesData] = await Promise.all([
    newsApi.getArticlesServer({ lang: lang as Locale }).catch(() => ({ results: [] })),
    newsApi.getDistrictsServer(lang as Locale).catch(() => ({ results: [] })),
    newsApi.getCategoriesServer(lang as Locale).catch(() => ({ results: [] })),
  ]);

  const initialArticles = articlesData?.results || [];
  const districts = districtsData?.results || districtsData || [];
  const categories = categoriesData?.results || categoriesData || [];

  return (
    <Suspense>
      <SearchClient 
        initialArticles={initialArticles} 
        districts={districts} 
        categories={categories} 
      />
    </Suspense>
  );
}
