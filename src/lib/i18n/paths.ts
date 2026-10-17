import type { Locale } from './config';
import { defaultLocale } from './config';

/**
 * Returns the URL for a given locale and unprefixed path.
 * - English (default): no prefix  → /path  (or / for root)
 * - Nepali:            /ne prefix → /ne/path (or /ne for root)
 *
 * Use this for ALL internal links, canonicals, hreflang alternates,
 * sitemap entries, and JSON-LD URLs. Never hardcode '/en'.
 */
export function localizedPath(lang: Locale, path: string): string {
  // Normalize: ensure path starts with /
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (lang === defaultLocale) {
    return normalized; // English: no prefix
  }

  // Other locales: add prefix
  if (normalized === '/') {
    return `/${lang}`;
  }
  return `/${lang}${normalized}`;
}

/**
 * Strips the locale prefix from a path, returning the canonical unprefixed path.
 * /ne/article/xyz → /article/xyz
 * /article/xyz   → /article/xyz
 */
export function stripLocalePrefix(path: string): string {
  // Match /ne or /en, with optional trailing path
  const match = path.match(/^\/(?:ne|en)(\/.*)?$/);
  if (match) {
    return match[1] || '/';
  }
  return path;
}
