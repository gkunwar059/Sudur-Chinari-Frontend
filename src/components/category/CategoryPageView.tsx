import Link from "@/components/i18n/LocalizedLink";
import { ChevronRight, MapPin, Newspaper, TrendingUp, Layers } from "lucide-react";
import AdBanner from "@/components/common/AdBanner";
import EditorialCard from "@/components/common/EditorialCard";
import { t, getArticleSlug } from "@/lib/utils";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import CategoryThumb from "@/components/common/CategoryThumb";
import JsonLd from "@/components/common/JsonLd";
import { DISTRICTS } from "@/data/districts";
import { CATEGORY_DESCRIPTIONS } from "@/data/categories";
import { localizedPath } from "@/lib/i18n/paths";
import type { Category } from "@/types";
import type { Locale } from "@/lib/i18n/config";

/** Top-level categories that have dedicated section routes instead of /category/[slug] */
const SECTION_PATHS: Record<string, string> = {
  sports: "/sports",
  politics: "/politics",
  tourism: "/tourism",
};

export interface CategoryPageViewProps {
  category: any;
  parentCategory: Category | null;
  subCategories: Category[];
  articles: any[];
  popularArticles: any[];
  otherCategories: any[];
  lang: Locale;
  slug: string;
  /** Where sibling/sub-category pages live, e.g. "/category" or "/sports/category" */
  basePath?: string;
  /** Canonical path of the parent section page; defaults to `basePath/parent.slug` */
  parentHref?: string;
  /** Canonical path of this page (used for JSON-LD/breadcrumbs) */
  pagePath?: string;
}

export default function CategoryPageView({
  category,
  parentCategory,
  subCategories,
  articles,
  popularArticles,
  otherCategories,
  lang,
  slug,
  basePath = "/category",
  parentHref,
  pagePath,
}: CategoryPageViewProps) {
  const isEn = lang === "en";
  const leadArticle = articles[0];
  const gridArticles = articles.slice(1);

  const defaultDesc = CATEGORY_DESCRIPTIONS[slug] || {
    ne: `सुदूरपश्चिम प्रदेशको ${t(category.name, "ne")} सम्बन्धी आधिकारिक तथा भरपर्दो समाचार।`,
    en: `Official and reliable coverage of ${t(category.name, "en")} in Sudurpashchim Province.`,
  };

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";
  const currentPath = pagePath ?? `${basePath}/${slug}`;
  const parentPath =
    parentHref ?? (parentCategory ? `${basePath}/${parentCategory.slug}` : null);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: t(category.name, lang),
        description: t(defaultDesc, lang),
        url: `${siteUrl}${localizedPath(lang, currentPath)}`,
        inLanguage: lang,
        isPartOf: {
          "@type": "WebSite",
          name: "सुदूर चिनारी",
          url: siteUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEn ? "Home" : "गृह",
            item: `${siteUrl}${localizedPath(lang, "/")}`,
          },
          parentCategory && parentPath
            ? {
                "@type": "ListItem",
                position: 2,
                name: t(parentCategory.name, lang),
                item: `${siteUrl}${localizedPath(lang, parentPath)}`,
              }
            : null,
          {
            "@type": "ListItem",
            position: parentCategory ? 3 : 2,
            name: t(category.name, lang),
            item: `${siteUrl}${localizedPath(lang, currentPath)}`,
          },
        ].filter(Boolean),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={jsonLd} />
      <main className="flex-1 mobile-safe-bottom">
        {/* ── Category Banner Header (Clean Editorial Style) ── */}
        <section className="bg-background border-b border-border py-8 sm:py-10">
          <div className="container-editorial">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium mb-3">
              <Link href="/" className="hover:text-brand transition-colors">
                {isEn ? "Home" : "गृह"}
              </Link>
              <ChevronRight size={13} className="text-gray-400" />
              {parentCategory && parentPath && (
                <>
                  <Link
                    href={parentPath}
                    className="hover:text-brand transition-colors"
                  >
                    {t(parentCategory.name, lang)}
                  </Link>
                  <ChevronRight size={13} className="text-gray-400" />
                </>
              )}
              <span className="text-brand font-semibold">{t(category.name, lang)}</span>
            </div>

            {/* Title & Description */}
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {category.image && (
                  <CategoryThumb
                    image={category.image}
                    label={t(category.name, lang)}
                    size={44}
                  />
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                  {t(category.name, lang)}
                </h1>
                {!isEn && typeof category.name === "object" && category.name?.en && (
                  <span className="text-sm sm:text-base font-bold text-muted-foreground tracking-normal self-baseline">
                    {category.name.en}
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium mb-3">
                {t(defaultDesc, lang)}
              </p>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 text-brand font-semibold">
                  <Newspaper size={14} />
                  {articles.length} {isEn ? "stories published" : "समाचार प्रकाशित"}
                </span>
                <span>•</span>
                <span>{isEn ? "Sudur Chinari Bureau" : "सुदूर चिनारी ब्यूरो"}</span>
              </div>
            </div>

            {/* Sub-categories chips */}
            {subCategories.length > 0 && (
              <nav
                aria-label={isEn ? "Sub-categories" : "उप-श्रेणीहरू"}
                className="mt-6 -mx-1 flex gap-2.5 overflow-x-auto no-scrollbar pb-1"
              >
                {parentCategory && parentPath && (
                  <Link
                    href={parentPath}
                    className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border border-border bg-surface/60 hover:border-brand hover:text-brand text-sm font-semibold text-foreground whitespace-nowrap shrink-0 transition-colors"
                  >
                    <CategoryThumb
                      image={parentCategory.image}
                      label={t(parentCategory.name, lang)}
                      size={32}
                    />
                    {isEn ? "All" : "सबै"}
                  </Link>
                )}
                {subCategories.map((sub) => {
                  const active = sub.slug === slug;
                  const label = t(sub.name, lang);
                  return (
                    <Link
                      key={sub.slug}
                      href={`${basePath}/${sub.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={
                        "group flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full border text-sm font-semibold whitespace-nowrap shrink-0 transition-colors " +
                        (active
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-border bg-surface/60 text-foreground hover:border-brand hover:text-brand")
                      }
                    >
                      <CategoryThumb
                        image={sub.image}
                        label={label}
                        size={32}
                        className="transition-transform group-hover:scale-105"
                      />
                      {label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </section>

        {/* ── Main Editorial Content Grid ── */}
        <div className="container-editorial py-6 sm:py-10">
          {/* Top Leaderboard Ad */}
          <AdBanner placement="top-leaderboard" className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ── Left Articles Column (8 cols) ── */}
            <div className="lg:col-span-8 min-w-0 space-y-8">
              {articles.length > 0 ? (
                <>
                  {/* 1. Large Lead Feature Story */}
                  {leadArticle && (
                    <EditorialCard
                      article={leadArticle}
                      locale={lang}
                      variant="feature"
                      aspect="16/9"
                      badgeSize="md"
                      showExcerpt
                      showAuthor
                      showCta
                      preload
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  )}

                  {/* 2. Grid of Secondary Stories */}
                  {gridArticles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {gridArticles.map((article: any) => (
                        <EditorialCard
                          key={article.id}
                          article={article}
                          locale={lang}
                          badgeSize="xs"
                          showExcerpt
                          showAuthor
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-background border border-border p-8 sm:p-12 text-center">
                  <p className="text-muted-foreground text-base">
                    {isEn ? "No news found in this category." : "यस श्रेणीको कुनै समाचार फेला परेन।"}
                  </p>
                </div>
              )}
            </div>

            {/* ── Right Editorial Sidebar (4 cols) ── */}
            <aside className="lg:col-span-4 min-w-0 space-y-6 sm:space-y-8">
              {/* 1. Popular / Trending Stories */}
              <div className="bg-background border border-border p-4 sm:p-6 shadow-xs">
                <FTSectionDivider
                  title={isEn ? "Popular Stories" : "लोकप्रिय समाचार"}
                  icon={<TrendingUp size={18} className="text-brand" />}
                  as="h3"
                  className="!my-0 mb-4"
                />

                <div className="divide-y divide-border/60">
                  {popularArticles.map((art: any, idx: number) => (
                    <Link
                      key={art.id}
                      href={`/article/${getArticleSlug(art)}`}
                      className="group flex items-start gap-3.5 py-3 hover:bg-surface/80 -mx-1 px-1 transition-colors"
                    >
                      <span className="text-xl sm:text-2xl font-black text-muted-foreground/60 group-hover:text-brand transition-colors w-5 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-brand tracking-normal">
                          {t(art.category?.name, lang)}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold font-headline text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors mt-0.5">
                          {t(art.title, lang)}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar MREC Ad Slot */}
              <AdBanner placement="sidebar" />

              {/* 2. Other Categories */}
              <div className="bg-background border border-border p-4 sm:p-6 shadow-xs">
                <FTSectionDivider
                  title={isEn ? "Other Topics" : "अन्य विषयहरू"}
                  icon={<Layers size={18} className="text-brand" />}
                  as="h3"
                  className="!my-0 mb-4"
                />

                <div className="divide-y divide-border/60">
                  {otherCategories.map((cat: any) => (
                    <Link
                      key={cat.slug}
                      href={SECTION_PATHS[cat.slug] ?? `/category/${cat.slug}`}
                      className="group flex items-center justify-between py-2.5 hover:text-brand transition-colors min-h-[40px]"
                    >
                      <div>
                        <span className="text-sm sm:text-base font-bold text-foreground group-hover:text-brand transition-colors">
                          {t(cat.name, lang)}
                        </span>
                        {!isEn && typeof cat.name === "object" && cat.name?.en && (
                          <span className="text-xs text-muted-foreground block font-medium">
                            {cat.name.en}
                          </span>
                        )}
                      </div>
                      <ChevronRight
                        size={15}
                        className="text-muted-foreground/50 group-hover:text-brand group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3. District News Quick Links */}
              <div className="bg-background border border-border p-4 sm:p-6 shadow-xs">
                <FTSectionDivider
                  title={isEn ? "News by District" : "जिल्ला अनुसार समाचार"}
                  icon={<MapPin size={18} className="text-brand" />}
                  as="h3"
                  className="!my-0 mb-4"
                />

                <div className="flex flex-wrap gap-2">
                  {DISTRICTS.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/district/${d.slug}`}
                      className="px-3 py-1.5 border border-border bg-surface/80 hover:bg-brand hover:text-white text-xs sm:text-sm font-bold text-foreground transition-all min-h-[38px] flex items-center"
                    >
                      {t(d.name, lang)}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
