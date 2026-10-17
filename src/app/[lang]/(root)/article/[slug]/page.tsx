import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleContent from "@/components/article/ArticleContent";
import ReadingProgress from "@/components/article/ReadingProgress";
import PageSkeleton from "@/components/common/PageSkeleton";
import { getArticleBySlugCached, getArticlesCached } from "@/lib/cached-data";
import { isLocale, ogLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import type { ApiLang } from "@/lib/api";
import { localizedPath } from "@/lib/i18n/paths";
import { getArticleSlug, t } from "@/lib/utils";
import { ARTICLES } from "@/data/articles";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  let article = await getArticleBySlugCached(slug, lang as ApiLang).catch(
    () => null,
  );

  if (!article) {
    article = ARTICLES.find((a) => {
      const s = a.slug;
      if (typeof s === "string") return s.toLowerCase() === slug.toLowerCase();
      if (typeof s === "object")
        return (
          s.en?.toLowerCase() === slug.toLowerCase() ||
          s.ne?.toLowerCase() === slug.toLowerCase()
        );
      return false;
    });
  }

  if (!article) return {};

  const title =
    article.meta_title ||
    (typeof article.title === "string"
      ? article.title
      : t(article.title, lang as Locale)) ||
    "";
  const description =
    article.meta_description ||
    (typeof article.excerpt === "string"
      ? article.excerpt
      : t(article.excerpt, lang as Locale)) ||
    "";
  const authorName =
    typeof article.author?.name === "string"
      ? article.author.name
      : t(article.author?.name, lang as Locale) || "";
  const ogImage =
    article.og_image ||
    article.featuredImage ||
    `${SITE_URL}/images/sudur-logo.png`;

  return {
    title,
    description: description.slice(0, 160),
    robots:
      lang === "ne" && article.translation_missing
        ? { index: false, follow: true }
        : undefined,
    alternates: {
      canonical: `${SITE_URL}${localizedPath(lang as Locale, `/article/${slug}`)}`,
      languages: {
        en: `${SITE_URL}${localizedPath("en", `/article/${slug}`)}`,
        ne: `${SITE_URL}${localizedPath("ne", `/article/${slug}`)}`,
        "x-default": `${SITE_URL}${localizedPath(defaultLocale, `/article/${slug}`)}`,
      },
    },
    openGraph: {
      type: "article",
      locale: ogLocale[lang as Locale],
      alternateLocale: lang === "en" ? ogLocale.ne : ogLocale.en,
      url: `${SITE_URL}${localizedPath(lang as Locale, `/article/${slug}`)}`,
      title,
      description,
      images: [ogImage],
      publishedTime: article.publishedAt,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: [ogImage],
    },
  };
}

export default function ArticlePage({ params }: PageProps) {
  return (
    <Suspense fallback={<PageSkeleton variant="article" />}>
      <ArticlePageContent params={params} />
    </Suspense>
  );
}

async function ArticlePageContent({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const [articleData, listData] = await Promise.all([
    getArticleBySlugCached(slug, lang as ApiLang).catch(() => null),
    getArticlesCached({ lang: lang as ApiLang }).catch(() => null),
  ]);
  let article = articleData;
  if (!article) {
    article = ARTICLES.find((a) => {
      const s = a.slug;
      if (typeof s === "string") return s.toLowerCase() === slug.toLowerCase();
      if (typeof s === "object")
        return (
          s.en?.toLowerCase() === slug.toLowerCase() ||
          s.ne?.toLowerCase() === slug.toLowerCase()
        );
      return false;
    });
  }
  let articles = listData?.results || [];

  if (!article) notFound();

  const title =
    typeof article.title === "string"
      ? article.title
      : t(article.title, lang as Locale);
  const description =
    typeof article.excerpt === "string"
      ? article.excerpt
      : t(article.excerpt, lang as Locale);
  const authorName =
    typeof article.author?.name === "string"
      ? article.author.name
      : t(article.author?.name, lang as Locale);

  // JSON-LD NewsArticle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    image:
      article.og_image || article.featuredImage
        ? [article.og_image || article.featuredImage]
        : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: lang,
    mainEntityOfPage: `${SITE_URL}${localizedPath(lang as Locale, `/article/${slug}`)}`,
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
        }
      : undefined,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "सुदूर चिनारी",
      url: SITE_URL,
      logo: `${SITE_URL}/images/sudur-logo.png`,
    },
  };

  const currentArticleSlug = getArticleSlug(article);
  const popular = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const related = articles
    .filter(
      (a: any) =>
        getArticleSlug(a) !== currentArticleSlug &&
        (a.category?.slug === article.category?.slug ||
          a.district?.slug === article.district?.slug),
    )
    .slice(0, 4);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "ne" ? "गृहपृष्ठ" : "Home",
        item: `${SITE_URL}${localizedPath(lang as Locale, "/")}`,
      },
      article.category?.slug
        ? {
            "@type": "ListItem",
            position: 2,
            name: t(article.category?.name, lang as Locale),
            item: `${SITE_URL}${localizedPath(lang as Locale, `/category/${article.category.slug}`)}`,
          }
        : null,
      {
        "@type": "ListItem",
        position: article.category?.slug ? 3 : 2,
        name: title,
        item: `${SITE_URL}${localizedPath(lang as Locale, `/article/${slug}`)}`,
      },
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ReadingProgress />
      <main className="flex-1 mobile-safe-bottom">
        <div className="container-editorial py-6 md:py-10">
          <ArticleContent
            article={article}
            related={related}
            popular={popular}
          />
        </div>
      </main>
    </>
  );
}
