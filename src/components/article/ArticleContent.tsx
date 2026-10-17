"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Eye,
  Share2,
  MapPin,
  Check,
} from "lucide-react";
import type { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { formatViews, cn, getArticleSlug } from "@/lib/utils";
import FTCategoryBadge from "@/components/common/FTCategoryBadge";
import RelativeTime from "@/components/common/RelativeTime";
import ArticleReactions from "./ArticleReactions";
import ArticleComments from "./ArticleComments";
import AdBanner from "@/components/common/AdBanner";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface ArticleContentProps {
  article: Article;
  related: Article[];
  popular: Article[];
}

export default function ArticleContent({
  article,
  related,
  popular,
}: ArticleContentProps) {
  const { locale, t, tr, formatLocaleDate } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);

  const fontClasses = [
    "text-base sm:text-lg leading-[1.65]", // 0 (Small)
    "text-lg sm:text-[19px] leading-[1.6]", // 1 (Default)
    "text-[19px] sm:text-[21px] leading-[1.55]", // 2 (Large)
    "text-[21px] sm:text-[24px] leading-[1.5]", // 3 (Extra Large)
  ];

  const handleDecreaseFont = () =>
    setFontSizeIndex((prev) => Math.max(0, prev - 1));
  const handleIncreaseFont = () =>
    setFontSizeIndex((prev) => Math.min(fontClasses.length - 1, prev + 1));
  const handleResetFont = () => setFontSizeIndex(1);

  const currentContent =
    typeof article.content === "string"
      ? article.content
      : (article.content as any)?.[locale] ||
        (article.content as any)?.ne ||
        "";
  const paragraphs = currentContent.split("\n\n").filter(Boolean);

  const currentSlug = getArticleSlug(article);
  const articleUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://chinari.sthajeevan.com.np/article/${currentSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
      {/* ── Main Article Column (8 cols) ── */}
      <article className="lg:col-span-8 min-w-0">
        {/* ── Broadsheet Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4 flex-wrap font-sans">
          <Link href="/" className="hover:text-brand transition-colors">
            {tr("home")}
          </Link>
          <ChevronRight size={11} className="text-gray-300" />
          <Link
            href={`/category/${article.category.slug}`}
            className="hover:text-brand transition-colors font-medium"
          >
            {t(article.category.name)}
          </Link>
          {article.district && (
            <>
              <ChevronRight size={11} className="text-gray-300" />
              <Link
                href={`/district/${article.district.slug}`}
                className="hover:text-brand transition-colors font-medium flex items-center gap-1"
                style={{ color: article.district.accentColor }}
              >
                <MapPin size={11} />
                <span>{t(article.district.name)}</span>
              </Link>
            </>
          )}
        </nav>

        {/* ── Category & District Kickers (Authentic FTCategoryBadge Style) ── */}
        <div className="flex items-center gap-2 mb-3">
          <FTCategoryBadge category={article.category} size="sm" />

          {article.district && (
            <Link
              href={`/district/${article.district.slug}`}
              className="inline-flex items-center gap-1 rounded-[3px] font-sans font-semibold tracking-normal bg-brand/8 border border-brand/25 text-brand hover:bg-brand hover:text-white transition-all text-[11px] px-2.5 py-0.5"
            >
              <MapPin size={11} />
              <span>{t(article.district.name)}</span>
            </Link>
          )}

          {article.breaking && (
            <span className="inline-flex items-center rounded-[3px] font-sans font-bold tracking-normal bg-red-600 text-white text-[10px] px-2 py-0.5 animate-pulse">
              {tr("breaking")}
            </span>
          )}
        </div>

        {/* ── Grand Headline in Broadsheet Devanagari Serif ── */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline text-foreground leading-[1.25] mb-4">
          {t(article.title)}
        </h1>

        {/* ── Standfirst / Editorial Deck (No Heavy Colored Left Bars) ── */}
        <p className="text-lg sm:text-xl font-headline text-foreground leading-relaxed mb-6 font-normal">
          {t(article.excerpt)}
        </p>

        {/* ── Byline & Metadata Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-border mb-6 text-xs sm:text-sm font-sans text-muted-foreground">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <Link
              href={`/authors/${article.author.slug}`}
              className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0"
            >
              <Image
                src={article.author.avatar}
                alt={t(article.author.name)}
                fill
                className="object-cover"
                sizes="36px"
              />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs">लेखक:</span>
                <Link
                  href={`/authors/${article.author.slug}`}
                  className="font-bold text-foreground hover:text-brand transition-colors"
                >
                  {t(article.author.name)}
                </Link>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{article.author.role}</span>
                <span>•</span>
                <span>{formatLocaleDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>

          {/* Views, Read Time & Social Share */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0 flex-wrap">
            {article.views && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <Eye size={13} />
                <span>
                  {formatViews(article.views)}{" "}
                  {locale === "ne" ? "पढाइ" : "reads"}
                </span>
              </div>
            )}

            {article.readTime && (
              <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                {article.readTime} {tr("readTime")}
              </span>
            )}

            <div className="h-4 w-[1px] bg-surface-hover hidden sm:block" />

            {/* Broadsheet Clean Share Buttons (No Bubbly Pills) */}
            <div className="flex items-center gap-1.5">
              <a
                href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 min-h-[36px] inline-flex items-center text-xs font-semibold bg-background border border-border hover:border-gray-400 text-foreground hover:text-foreground hover:text-brand-secondary transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://x.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(t(article.title))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 min-h-[36px] inline-flex items-center text-xs font-semibold bg-background border border-border hover:border-gray-400 text-foreground hover:text-black transition-colors"
              >
                X
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 min-h-[36px] text-xs font-semibold bg-background border border-border hover:border-gray-400 text-foreground transition-colors inline-flex items-center gap-1 cursor-pointer"
                title="Copy link"
              >
                {copied ? (
                  <Check size={12} className="text-brand" />
                ) : (
                  <Share2 size={12} />
                )}
                <span className="hidden sm:inline">
                  {copied ? "कपी भयो" : "लिंक"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Featured Image (Sharp Editorial Corners) ── */}
        <div className="relative aspect-[16/10] rounded-none overflow-hidden mb-2 border border-border bg-gray-900 shadow-xs">
          <Image
            src={article.featuredImage}
            alt={t(article.title)}
            fill
            className="object-cover"
            preload
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>

        {/* Caption */}
        {article.imageCaption && (
          <p className="text-xs text-muted-foreground font-sans pb-3 mb-4 border-b border-border italic">
            तस्बिर: {t(article.imageCaption)}
          </p>
        )}

        {/* ── Typography Controls ── */}
        <div
          className={cn(
            "flex items-center justify-end gap-2 mb-6 border-b border-border pb-4",
            !article.imageCaption && "mt-6",
          )}
        >
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mr-2">
            {locale === "ne" ? "अक्षर" : "Font"}
          </span>
          <div className="flex items-center bg-surface border border-border">
            <button
              onClick={handleDecreaseFont}
              disabled={fontSizeIndex === 0}
              className="w-9 h-9 sm:w-8 sm:h-8 min-h-[36px] flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-30 transition-colors font-serif border-r border-border text-sm"
              title={locale === "ne" ? "सानो अक्षर" : "Decrease Font Size"}
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={handleResetFont}
              disabled={fontSizeIndex === 1}
              className="w-9 h-9 sm:w-8 sm:h-8 min-h-[36px] flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-30 transition-colors font-serif text-sm font-medium border-r border-border"
              title={locale === "ne" ? "सामान्य अक्षर" : "Reset Font Size"}
              aria-label="Reset font size"
            >
              A
            </button>
            <button
              onClick={handleIncreaseFont}
              disabled={fontSizeIndex === fontClasses.length - 1}
              className="w-9 h-9 sm:w-8 sm:h-8 min-h-[36px] flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-30 transition-colors font-serif text-base font-bold"
              title={locale === "ne" ? "ठूलो अक्षर" : "Increase Font Size"}
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
        </div>

        {/* ── Article Body Paragraphs (Rich Broadsheet Typography) ── */}
        <div
          className={cn(
            "article-body space-y-6 text-foreground font-sans transition-all duration-300",
            fontClasses[fontSizeIndex],
          )}
        >
          {paragraphs.map((paragraph: string, i: number) => (
            <div key={i} className="space-y-6">
              <p>{paragraph}</p>
              {/* Native In-Article Sponsored Placement */}
              {i === 1 && (
                <div className="my-8">
                  <AdBanner placement="in-article" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Editorial Tags ── */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground font-mono">
              ट्यागहरू:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2 py-0.5 rounded-[3px] bg-surface border border-border text-brand hover:border-brand transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Interactive Like / Comment Bar (Broadsheet Styled) ── */}
        <ArticleReactions
          articleId={article.id}
          articleTitle={t(article.title)}
          initialLikes={article.likes || 142}
          commentsCount={article.commentsCount || 3}
        />

        {/* ── Author Bio Box (Sharp Broadsheet Layout) ── */}
        <div className="mt-8 p-6 rounded-none border border-border bg-surface relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand" />
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border">
              <Image
                src={article.author.avatar}
                alt={t(article.author.name)}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-mono font-bold text-brand-secondary block mb-0.5">
                {tr("aboutAuthor")}
              </span>
              <Link
                href={`/authors/${article.author.slug}`}
                className="text-base font-bold font-headline text-foreground hover:text-brand transition-colors"
              >
                {t(article.author.name)}
              </Link>
              <p className="text-xs text-brand font-semibold mb-1">
                {article.author.role}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                {t(article.author.bio)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Comments Section ── */}
        <ArticleComments articleId={article.id} />

        {/* ── Related Articles Section ── */}
        {/* {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] font-bold text-brand-secondary font-mono">
                Section
              </span>
              <span className="text-muted-foreground">•</span>
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight font-sans">
                {tr("relatedArticles")}
              </h3>
              <div className="flex-1 ft-dotted-rule min-w-[16px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/article/${getArticleSlug(a)}`}
                  className="group flex gap-3.5 p-3.5 border border-border hover:border-brand bg-background rounded-none transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md"
                >
                  <div className="relative w-24 h-20 rounded-none overflow-hidden shrink-0 bg-surface-hover border border-border">
                    <Image
                      src={a.featuredImage}
                      alt={t(a.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-brand block mb-0.5">
                        {t(a.category.name)}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold font-headline text-foreground leading-snug line-clamp-2 group-hover:text-brand-secondary transition-colors">
                        {t(a.title)}
                      </h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 font-sans">
                      <Clock size={11} />
                      <span>
                        <RelativeTime date={a.publishedAt} locale={locale} />
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </article>

      {/* ── Sidebar Column (4 cols) ── */}
      <aside className="lg:col-span-4 space-y-6">
        {/* Popular News Card (Authentic Broadsheet Styling) */}
        <div className="sticky top-20 bg-background p-5 sm:p-6 border border-border shadow-xs rounded-none relative">
          {/* Top Hairline in Brand Green */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand" />

          {/* Header Row with FTSectionDivider */}
          <FTSectionDivider
            title={tr("popularNews")}
            as="h3"
            className="!my-0 mb-4"
          />

          <div className="flex flex-col divide-y divide-gray-100">
            {popular.map((a, i) => (
              <Link
                key={a.id}
                href={`/article/${getArticleSlug(a)}`}
                className="group flex gap-3 py-3 transition-colors"
              >
                <span className="text-3xl sm:text-4xl font-black text-muted group-hover:text-brand transition-colors leading-none w-8 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono font-bold text-brand block mb-1">
                    {t(a.category.name)}
                  </span>
                  <h4 className="text-sm sm:text-[15px] font-bold font-headline text-foreground leading-snug line-clamp-2 group-hover:text-brand-secondary transition-colors">
                    {t(a.title)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1 font-sans">
                    <Clock size={12} />
                    <span>
                      <RelativeTime date={a.publishedAt} locale={locale} />
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Advertisement */}
        <div className="rounded-none border border-border overflow-hidden">
          <AdBanner placement="sidebar" />
        </div>
      </aside>
    </div>
  );
}
