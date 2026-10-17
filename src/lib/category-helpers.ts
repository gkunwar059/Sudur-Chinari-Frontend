import type { Metadata } from "next";
import {
  getArticlesCached,
  getCategoryBySlugCached,
  getMenuCached,
} from "@/lib/cached-data";
import { CATEGORY_DESCRIPTIONS } from "@/data/categories";
import { t } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import type { Category } from "@/types";

export async function getCategoryPageData(slug: string, lang: Locale) {
  const category = await getCategoryBySlugCached(slug, lang).catch(() => null);
  if (!category) return null;

  const menuRes = (await getMenuCached(lang).catch(() => null)) as any;
  const menu = menuRes?.results || [];

  let subCategories: Category[] = [];
  let parentCategory: Category | null = (category.parent as Category) || null;

  const topLevelMatch = menu.find((c: any) => c.slug === slug);
  if (topLevelMatch) {
    subCategories = topLevelMatch.children ?? category.children ?? [];
  } else {
    const parentMatch = menu.find((p: any) =>
      p.children?.some((c: any) => c.slug === slug),
    );
    if (parentMatch) {
      parentCategory = parentMatch;
      subCategories = parentMatch.children ?? [];
    } else if (parentCategory) {
      const parentMenuMatch = menu.find(
        (p: any) => p.slug === parentCategory?.slug,
      );
      subCategories = parentMenuMatch?.children ?? category.children ?? [];
    }
  }

  const articlesRes = await getArticlesCached({ lang, category: slug }).catch(
    () => null,
  );
  const articles = articlesRes?.results || [];

  const popRes = await getArticlesCached({
    lang,
    ordering: "-views",
    limit: 4,
  }).catch(() => null);
  const popularArticles = popRes?.results || [];

  const sectionSlug = parentCategory?.slug ?? slug;
  const otherCategories = menu.filter((c: any) => c.slug !== sectionSlug);

  return {
    category,
    parentCategory,
    subCategories,
    articles,
    popularArticles,
    otherCategories,
  };
}

export async function getCategoryPageMetadata(
  slug: string,
  lang: Locale,
  routePath: string,
): Promise<Metadata> {
  const cat = await getCategoryBySlugCached(slug, lang).catch(() => null);
  if (!cat) return {};

  const name = t(cat.name, lang);
  const descObj = CATEGORY_DESCRIPTIONS[slug] || {
    ne: `सुदूरपश्चिम प्रदेशका ${t(cat.name, "ne")} विषयका ताजा समाचार र विश्लेषण।`,
    en: `Latest news and analysis on ${t(cat.name, "en")} in Sudurpashchim Province.`,
  };
  const description = t(descObj, lang);

  return buildMetadata({
    locale: lang,
    path: routePath,
    title: name,
    description,
    image: cat.image,
  });
}
