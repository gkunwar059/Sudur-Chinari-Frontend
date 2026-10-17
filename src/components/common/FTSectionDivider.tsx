import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface FTSectionDividerProps {
  title: string;
  enTitle?: string;
  sectionIndex?: string;
  sublinks?: { label: string; href: string }[];
  viewAllHref?: string;
  viewAllText?: string;
  rightNode?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "centered";
  as?: "h1" | "h2" | "h3" | "h4" | "div";
  className?: string;
}

export default function FTSectionDivider({
  title,
  enTitle,
  sectionIndex,
  rightNode,
  icon,
  sublinks,
  viewAllHref,
  viewAllText,
  variant = "default",
  as = "h2",
  className = "",
}: FTSectionDividerProps) {
  const isCentered = variant === "centered";
  const HeadingTag = as;

  return (
    <div className={`my-8 sm:my-10 ${className}`}>
      {/* ── Signature FT Section Divider Header Row ── */}
      {isCentered ? (
        <div className="flex items-center gap-3">
          <div className="flex-1 ft-dotted-rule min-w-[20px]" />
          <div className="flex items-baseline flex-wrap gap-2 shrink-0 justify-center">
            {sectionIndex && (
              <span className="text-[12px] sm:text-[13px] font-bold text-brand tracking-wide font-sans">
                Section {sectionIndex}
              </span>
            )}
            {sectionIndex && (
              <span className="text-rule hidden sm:inline self-center mb-0.5">
                •
              </span>
            )}
            <HeadingTag className="text-[16px] sm:text-[18px] font-bold tracking-tight text-foreground font-sans inline-flex items-center gap-1.5">
              {icon && <span className="shrink-0">{icon}</span>}
              <span>{title}</span>
            </HeadingTag>
            {enTitle && (
              <span className="text-[12px] font-medium text-muted-foreground tracking-normal hidden md:inline">
                / {enTitle}
              </span>
            )}
          </div>
          <div className="flex-1 ft-dotted-rule min-w-[20px]" />
        </div>
      ) : (
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          {/* Left: Section Index & Title */}
          <div className="flex items-baseline flex-wrap gap-1.5 sm:gap-2 min-w-0">
            {sectionIndex && (
              <span className="text-[12px] sm:text-[13px] font-bold text-brand tracking-wide font-sans shrink-0">
                Section {sectionIndex}
              </span>
            )}
            {sectionIndex && (
              <span className="text-rule hidden sm:inline self-center mb-0.5">
                •
              </span>
            )}
            <HeadingTag className="text-[16px] sm:text-[18px] font-bold tracking-tight text-foreground font-sans truncate sm:overflow-visible inline-flex items-center gap-1.5">
              {icon && <span className="shrink-0">{icon}</span>}
              <span>{title}</span>
            </HeadingTag>
            {enTitle && (
              <span className="text-[12px] font-medium text-muted-foreground tracking-normal hidden md:inline">
                / {enTitle}
              </span>
            )}
          </div>

          {/* Middle: Signature FT Double Dotted Stippled Rule */}
          <div className="hidden sm:block flex-1 ft-dotted-rule min-w-[16px]" />

          {/* Right: View all link or custom node if provided */}
          {rightNode ? (
            <div className="shrink-0 flex items-center gap-4 ml-auto sm:ml-0">
              {rightNode}
              {viewAllHref && (
                <Link
                  href={viewAllHref}
                  className="text-[12px] sm:text-[13px] font-bold text-brand hover:text-accent transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap group"
                >
                  <span>{viewAllText || "सबै हेर्नुहोस्"}</span>
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                </Link>
              )}
            </div>
          ) : viewAllHref ? (
            <Link
              href={viewAllHref}
              className="text-[12px] sm:text-[13px] font-bold text-brand hover:text-accent transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap ml-auto sm:ml-0 group"
            >
              <span>{viewAllText || "सबै हेर्नुहोस्"}</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
            </Link>
          ) : null}
        </div>
      )}

      {/* Optional Sublinks centered below (like in FT Life & Arts) */}
      {sublinks && sublinks.length > 0 && (
        <div
          className={`w-full min-w-0 flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[12px] font-semibold tracking-normal text-muted-foreground ${
            isCentered ? "justify-center" : ""
          }`}
        >
          {sublinks.map((link, idx) => (
            <Link
              key={`${link.label}-${link.href}-${idx}`}
              href={link.href}
              className="hover:text-brand-secondary transition-colors hover:underline"
            >
              {link.label}
            </Link>
          ))}
          {viewAllHref && isCentered && (
            <Link
              href={viewAllHref}
              className="text-brand-secondary hover:underline flex items-center gap-1 ml-1 group"
            >
              <span>{viewAllText || "सबै"}</span>
              <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
