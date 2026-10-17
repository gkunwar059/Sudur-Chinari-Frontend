"use client";

import Link from "@/components/i18n/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";
import type { Category } from "@/types";

interface FTCategoryBadgeProps {
  category?: Category | { id?: string; slug: string; name: { ne: string; en: string }; icon?: string };
  categoryName?: string; // Fallback plain string if full object not available
  categorySlug?: string;
  size?: "xs" | "sm" | "md";
  asLink?: boolean;
  className?: string;
}

export default function FTCategoryBadge({
  category,
  categoryName,
  categorySlug,
  size = "sm",
  asLink = true,
  className = "",
}: FTCategoryBadgeProps) {
  const { t } = useLanguage();

  const displayName = category
    ? t(category.name)
    : categoryName || "";

  const slug = category?.slug || categorySlug || "";

  // Size variations
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
    md: "px-3 py-1 text-[11.5px] gap-1.5",
  }[size];

  const badgeContent = (
    <>
      <span className="truncate">{displayName}</span>
    </>
  );

  const baseClasses = `inline-flex items-center rounded-[3px] font-sans font-semibold tracking-normal bg-brand-secondary/8 border border-brand-secondary/25 text-brand-secondary hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all duration-200 shadow-2xs group/badge select-none ${sizeClasses} ${className}`;

  if (asLink && slug) {
    return (
      <Link
        href={`/category/${slug}`}
        onClick={(e) => e.stopPropagation()}
        className={baseClasses}
        title={displayName}
      >
        {badgeContent}
      </Link>
    );
  }

  return (
    <span className={baseClasses}>
      {badgeContent}
    </span>
  );
}
