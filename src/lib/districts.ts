import { DISTRICTS } from "@/data/districts";
import { normalizeImageUrl } from "@/lib/utils";
import type { District } from "@/types";

export { DISTRICTS } from "@/data/districts";

export const DEFAULT_DISTRICT_IMAGE = "/images/himalaya_banner.jpg";

export function getDistrictBySlug(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}

/**
 * Merge an API district record over the local fallback (curated theme,
 * images, stats). API values win for content; fallback supplies theme
 * and image when the API omits them.
 */
export function mergeDistrict(
  apiD: any,
  fallback?: District | null,
  opts: { apiThemeWins?: boolean } = {},
): any {
  const fb = fallback ?? (apiD?.slug ? getDistrictBySlug(apiD.slug) : undefined);
  if (!fb && !apiD) return null;

  const theme = opts.apiThemeWins
    ? apiD?.theme ?? fb?.theme
    : fb?.theme ?? apiD?.theme;

  return {
    ...fb,
    ...apiD,
    theme,
    accentColor: apiD?.accentColor || fb?.accentColor || "var(--brand)",
    heroImage:
      normalizeImageUrl(apiD?.heroImage) ||
      fb?.heroImage ||
      DEFAULT_DISTRICT_IMAGE,
  };
}

/**
 * Merge a directory listing; falls back to the curated local list when the
 * API returns nothing.
 */
export function mergeDistrictList(apiDistricts: any[] | null | undefined): any[] {
  if (!apiDistricts || apiDistricts.length === 0) return DISTRICTS;
  return apiDistricts.map((d) => mergeDistrict(d));
}
