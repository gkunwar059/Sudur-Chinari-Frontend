import React from "react";
import Link from "@/components/i18n/LocalizedLink";
import { Newspaper } from "lucide-react";

interface FTEmptyStateProps {
  title: string;
  description?: string;
  kicker?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  accentColor?: string;
  className?: string;
  variant?: "card" | "page" | "inline";
}

export default function FTEmptyState({
  title,
  description,
  kicker,
  icon,
  actionText,
  actionHref,
  actionOnClick,
  accentColor = "var(--color-brand)",
  className = "",
  variant = "card",
}: FTEmptyStateProps) {
  const isPage = variant === "page";
  const isInline = variant === "inline";

  const content = (
    <div
      className={`relative w-full overflow-hidden transition-all duration-200 animate-fadeIn ${
        isInline
          ? "py-8 px-4 text-center"
          : isPage
            ? "max-w-2xl mx-auto my-12 p-8 sm:p-14 text-center bg-surface border border-border shadow-xs"
            : "p-8 sm:p-12 text-center bg-surface border border-border shadow-2xs"
      } ${className}`}
      style={{
        borderTop: isInline ? undefined : `3px solid ${accentColor}`,
      }}
    >
      {/* Editorial Watermark / Icon */}
      <div className="flex justify-center mb-4">
        {icon ? (
          <div
            className="w-12 h-12 rounded-none border border-border bg-background flex items-center justify-center text-muted-foreground shadow-2xs"
            style={{ color: accentColor }}
          >
            {icon}
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-none border border-border bg-background flex items-center justify-center text-muted-foreground shadow-2xs"
            style={{ color: accentColor }}
          >
            <Newspaper size={24} />
          </div>
        )}
      </div>

      {/* Broadsheet Kicker */}
      {kicker && (
        <span
          className="text-[10.5px] font-mono font-bold tracking-widest uppercase block mb-2"
          style={{ color: accentColor }}
        >
          {kicker}
        </span>
      )}

      {/* Main Headline */}
      <h3
        className={`font-serif-np font-headline font-bold text-foreground leading-tight ${
          isPage ? "text-2xl sm:text-3xl mb-3" : "text-lg sm:text-xl mb-2"
        }`}
      >
        {title}
      </h3>

      {/* Editorial Subtitle / Explanatory Text */}
      {description && (
        <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Optional Action Button */}
      {actionText && (
        <div className="mt-4 flex justify-center">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-border bg-background hover:bg-surface text-foreground transition-all duration-200 hover:border-foreground/30 shadow-2xs"
            >
              <span>{actionText}</span>
            </Link>
          ) : actionOnClick ? (
            <button
              type="button"
              onClick={actionOnClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-border bg-background hover:bg-surface text-foreground transition-all duration-200 hover:border-foreground/30 cursor-pointer shadow-2xs"
            >
              <span>{actionText}</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );

  return content;
}
