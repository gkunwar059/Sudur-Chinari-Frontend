import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { ChevronRight, Clock } from "lucide-react";
import FTCategoryBadge from "@/components/common/FTCategoryBadge";
import RelativeTime from "@/components/common/RelativeTime";
import { cn, getArticleSlug, normalizeImageUrl, t } from "@/lib/utils";
import type { Article, Locale } from "@/types";

interface EditorialCardProps {
  article: Article;
  locale: Locale;
  /** "feature" = large lead card, "standard" = grid card */
  variant?: "feature" | "standard";
  /** Container treatment: surface (shadow card), bordered (accent top border), bare (no chrome), accent (colored top bar) */
  chrome?: "surface" | "bordered" | "bare" | "accent";
  /** Top bar color for chrome="accent" (defaults to var(--destructive)) */
  accentColor?: string;
  /** Category chip overlaid on the image; replaces the badge below the image */
  overlayCategory?: string;
  /** Show the category badge below the image (ignored when overlayCategory is set) */
  showBadge?: boolean;
  aspect?: "video" | "16/10" | "16/9";
  badgeSize?: "xs" | "sm" | "md";
  titleClamp?: 2 | 3;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCta?: boolean;
  /** Divider line above the meta row */
  metaBorder?: boolean;
  /** Render the timestamp in mono style without a clock icon */
  monoTime?: boolean;
  preload?: boolean;
  sizes?: string;
  className?: string;
}

export default function EditorialCard({
  article,
  locale,
  variant = "standard",
  chrome = "surface",
  accentColor,
  overlayCategory,
  showBadge = true,
  aspect,
  badgeSize,
  titleClamp = 2,
  showExcerpt = false,
  showAuthor = false,
  showCta = false,
  metaBorder = true,
  monoTime = false,
  preload = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
}: EditorialCardProps) {
  const isFeature = variant === "feature";
  const isBare = chrome === "bare";
  const isAccent = chrome === "accent";

  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "16/9"
        ? "aspect-[16/9]"
        : "aspect-[16/10]";

  const chromeClass = {
    surface:
      "bg-background border border-border overflow-hidden shadow-xs hover:shadow-md transition-shadow",
    bordered:
      "border border-border border-t-4 border-t-brand-secondary rounded-none overflow-hidden editorial-card-bordered bg-background",
    bare: "",
    accent:
      "bg-background border border-border overflow-hidden hover:shadow-md transition-all duration-300",
  }[chrome];

  return (
    <Link
      href={`/article/${getArticleSlug(article)}`}
      className={cn(
        "group flex flex-col justify-between min-w-0 h-full",
        chromeClass,
        className,
      )}
      style={
        isAccent
          ? { borderTop: `3px solid ${accentColor || "var(--destructive)"}` }
          : undefined
      }
    >
      <div
        className={cn(
          "relative overflow-hidden",
          aspectClass,
          isBare
            ? "bg-surface border border-border mb-3.5"
            : isFeature
              ? "bg-gray-900"
              : "bg-surface-hover",
        )}
      >
        <Image
          src={normalizeImageUrl(article.featuredImage)}
          alt={t(article.title, locale)}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {overlayCategory && (
          <div
            className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: accentColor || "var(--destructive)" }}
          >
            {overlayCategory}
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col flex-1 min-w-0",
          !isBare &&
            (isFeature ? "p-4 sm:p-6 lg:p-8" : "p-4 sm:p-5"),
        )}
      >
        {showBadge && !overlayCategory && (
          <div className={isFeature ? "mb-3" : "mb-2"}>
            <FTCategoryBadge
              category={article.category}
              size={badgeSize ?? (isFeature ? "md" : "sm")}
              asLink={false}
            />
          </div>
        )}

        <h3
          className={cn(
            "font-bold font-headline text-foreground leading-snug transition-colors",
            isFeature
              ? "text-xl sm:text-2xl lg:text-3xl mb-3"
              : "text-base sm:text-lg mb-2",
            !isFeature && (titleClamp === 2 ? "line-clamp-2" : "line-clamp-3"),
            isAccent
              ? "group-hover:text-primary"
              : "group-hover:text-brand-secondary",
          )}
        >
          {t(article.title, locale)}
        </h3>

        {showExcerpt && (
          <p
            className={cn(
              "text-muted-foreground leading-relaxed",
              isFeature
                ? "text-xs sm:text-sm line-clamp-3 mb-5"
                : "text-xs sm:text-sm line-clamp-2 mb-4 flex-1",
            )}
          >
            {t(article.excerpt, locale)}
          </p>
        )}

        <div
          className={cn(
            "flex items-center justify-between gap-3 text-xs text-muted-foreground",
            metaBorder && "pt-3 border-t border-border/50",
            isFeature && "text-xs sm:text-sm border-border",
            monoTime
              ? "text-muted-foreground/70 font-mono"
              : "font-medium",
            isBare && "mt-auto pt-3 border-t border-border/60 text-[11px] font-sans",
          )}
        >
          <span className="flex items-center gap-1.5 min-w-0">
            {!monoTime && <Clock size={isFeature ? 14 : 12} />}
            <span className="whitespace-nowrap">
              <RelativeTime date={article.publishedAt} locale={locale} />
            </span>
            {showAuthor && showCta && article.author && (
              <>
                <span className="mx-1">·</span>
                <span className="truncate">{t(article.author.name, locale)}</span>
              </>
            )}
          </span>
          {showCta ? (
            <span className="text-brand font-semibold flex items-center gap-0.5 whitespace-nowrap group-hover:translate-x-1 transition-transform">
              {locale === "en" ? "Read full story" : "पूरा पढ्नुहोस्"}{" "}
              <ChevronRight size={15} />
            </span>
          ) : showAuthor && article.author ? (
            <span className="truncate">{t(article.author.name, locale)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
