"use client";

import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import type { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import FTCategoryBadge from "@/components/common/FTCategoryBadge";
import { getArticleSlug } from "@/lib/utils";

interface FTNewsMostReadProps {
  newsStories: Article[];
  mostReadStories: Article[];
}

export default function FTNewsMostRead({
  newsStories,
  mostReadStories,
}: FTNewsMostReadProps) {
  const { t, locale, formatTimeAgo } = useLanguage();

  return (
    <section>
      {/* ── Signature Architectural Broadsheet Divider ── */}
      <FTSectionDivider
        title={locale === "ne" ? "ताजा समाचार" : "News & Updates"}
        enTitle={locale === "ne" ? "News & Updates" : "Dispatches"}
        viewAllHref="/news"
        viewAllText={locale === "ne" ? "सबै समाचार" : "All News"}
      />

      {/* ── 4-Column Grid: 3 News Columns + 1 Most Read Column ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 pb-6 w-full max-w-full overflow-hidden min-w-0">
        {/* ── 3 NEWS COLUMNS (9 cols total: 3 cols each) ── */}
        {newsStories.slice(0, 3).map((story, idx) => {
          if (!story) return null;
          return (
            <div
              key={story.id}
              className="lg:col-span-3 min-w-0 flex flex-col bg-surface border border-border p-4 group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all h-full rounded-sm"
            >
              <article className="group/article flex flex-col h-full min-w-0">
                {/* 16:10 Feature Photo */}
                <Link
                  href={`/article/${getArticleSlug(story)}`}
                  className="block relative aspect-[16/10] bg-surface border border-border overflow-hidden mb-3.5 rounded-sm"
                >
                  <Image
                    src={story.featuredImage}
                    alt={t(story.title)}
                    fill
                    className="object-cover group-hover/article:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </Link>

                {/* Uniform Royal Claret Category Pill */}
                <div className="mb-2.5">
                  <FTCategoryBadge category={story.category} asLink={false} />
                </div>

                {/* Headline */}
                <Link
                  href={`/article/${getArticleSlug(story)}`}
                  className="block flex-1"
                >
                  <h3 className="text-[16px] sm:text-[17px] font-bold font-headline text-foreground group-hover/article:text-brand-secondary transition-colors leading-[1.3] tracking-tight mb-2.5 break-words">
                    {t(story.title)}
                  </h3>
                </Link>

                {/* Timestamp Indicator */}
                <div className="text-[11px] text-muted-foreground font-sans font-medium mt-auto pt-3 border-t border-border/60">
                  {formatTimeAgo(story.publishedAt)}
                </div>
              </article>
            </div>
          );
        })}

        {/* ── 4TH COLUMN: MOST READ 1-5 (3 cols) ── */}
        <aside className="lg:col-span-3 min-w-0 flex flex-col h-full pt-2 sm:pt-0">
          <div className="flex items-center gap-1.5 mb-4 px-2">
            <span className="text-brand-secondary text-[9px]">◆</span>
            <h3 className="text-[13px] font-bold text-foreground font-sans tracking-wide">
              {locale === "ne" ? "धेरै पढिएका समाचार" : "Most Read"}
            </h3>
          </div>

          <div className="divide-y divide-border/60 flex-1 flex flex-col">
            {mostReadStories.slice(0, 5).map((article, i) => {
              if (!article) return null;
              return (
                <article
                  key={article.id}
                  className="py-2.5 first:pt-0 group min-w-0"
                >
                  <Link
                    href={`/article/${getArticleSlug(article)}`}
                    className="flex items-start gap-3 min-w-0 px-2"
                  >
                    {/* Broadsheet Numerals */}
                    <span className="font-headline text-[22px] font-black text-brand-secondary/80 group-hover:text-brand-secondary transition-colors w-5 shrink-0 leading-none mt-0.5 select-none">
                      {locale === "ne" ? ["१", "२", "३", "४", "५"][i] : i + 1}
                    </span>

                    {/* Headline */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13.5px] font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-[1.4] line-clamp-3 break-words">
                        {t(article.title)}
                      </h4>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
