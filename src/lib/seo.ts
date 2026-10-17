import type { Metadata } from "next";
import { defaultLocale, ogLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";

export const SITE_NAME = "सुदूर चिनारी";

export const DEFAULT_OG_IMAGE = "/images/sudur-logo.png";

export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    en: absoluteUrl("en", path),
    ne: absoluteUrl("ne", path),
    "x-default": absoluteUrl(defaultLocale, path),
  };
}

function toAbsoluteImage(image?: string | null): string {
  if (!image) return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  if (/^https?:\/\//.test(image)) return image;
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

export interface BuildMetadataOptions {
  locale: Locale;
  /** Unprefixed path, e.g. `/stay/category/hotel` */
  path: string;
  title?: string;
  description?: string;
  /** Relative or absolute URL; falls back to the site logo */
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Single source of truth for page metadata: canonical URL, hreflang
 * alternates, OpenGraph and Twitter cards. The `[lang]` layout already
 * applies the `%s | brand` title template, so titles must not repeat it.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
  noIndex,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(locale, path);
  const ogImage = toAbsoluteImage(image);

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      alternateLocale: locale === "en" ? ogLocale.ne : ogLocale.en,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Unprefixed path, e.g. `/district/kailali` */
  path: string;
}

export function buildBreadcrumbJsonLd(locale: Locale, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}
