import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import CategoryPageView from "@/components/category/CategoryPageView";
import {
  getCategoryPageData,
  getCategoryPageMetadata,
} from "@/lib/category-helpers";

interface Props {
  params: Promise<{ lang: string }>;
}

const SLUG = "sports";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return getCategoryPageMetadata(SLUG, lang as Locale, `/${SLUG}`);
}

export default async function SportsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const data = await getCategoryPageData(SLUG, lang as Locale);
  if (!data) notFound();

  return (
    <CategoryPageView
      category={data.category}
      parentCategory={data.parentCategory}
      subCategories={data.subCategories}
      articles={data.articles}
      popularArticles={data.popularArticles}
      otherCategories={data.otherCategories}
      lang={lang as Locale}
      slug={SLUG}
      basePath="/sports/category"
      pagePath="/sports"
    />
  );
}
