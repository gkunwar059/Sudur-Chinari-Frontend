import type { Metadata } from "next";
import NewsClient from "./NewsClient";
import { newsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/news">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return buildMetadata({
    locale: lang as Locale,
    path: "/news",
    title: dict.meta.news.title,
    description: dict.meta.news.description,
  });
}

export default async function NewsPage({ params }: PageProps<"/[lang]/news">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const data = await newsApi.getArticlesServer({ lang });
  const initialArticles = data?.results || [];

  return (
    <>
      <NewsClient initialArticles={initialArticles} />
    </>
  );
}
