import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import CategoryPageView from "@/components/category/CategoryPageView";
import PageSkeleton from "@/components/common/PageSkeleton";
import {
  getCategoryPageData,
  getCategoryPageMetadata,
} from "@/lib/category-helpers";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  return getCategoryPageMetadata(
    slug,
    lang as Locale,
    `/tourism/category/${slug}`,
  );
}

export default function TourismCategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <TourismCategoryPageContent params={params} />
    </Suspense>
  );
}

async function TourismCategoryPageContent({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const data = await getCategoryPageData(slug, lang as Locale);
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
      slug={slug}
      basePath="/tourism/category"
      parentHref="/tourism"
    />
  );
}
