import { DISTRICTS } from "@/data/districts";
import { normalizeImageUrl } from "@/lib/utils";
import type { District, DistrictPlace } from "@/types";

export { DISTRICTS } from "@/data/districts";

export const DEFAULT_DISTRICT_IMAGE = "/images/himalaya_banner.jpg";

export function getDistrictBySlug(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}

function extractPlaceTitles(place: DistrictPlace): string[] {
  if (!place?.title) return [];
  if (typeof place.title === "string") return [place.title.trim()];
  return [place.title.en, place.title.ne]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

function matchFallbackPlace(
  apiPlace: DistrictPlace,
  fallbackPlaces: DistrictPlace[] | undefined,
  index: number,
): DistrictPlace | undefined {
  if (!fallbackPlaces || fallbackPlaces.length === 0) return undefined;
  const titles = extractPlaceTitles(apiPlace).map((t) => t.toLowerCase());
  const byTitle = fallbackPlaces.find((fb) =>
    extractPlaceTitles(fb).some((ft) => titles.includes(ft.toLowerCase())),
  );
  if (byTitle) return byTitle;
  return fallbackPlaces[index];
}

/**
 * Resolves the canonical URL slug for a district place from the backend `slug`
 * (or matched fallback `slug`), falling back to numeric `id` or index.
 */
export function getDistrictPlaceSlug(
  place: DistrictPlace,
  fallbackPlace?: DistrictPlace,
  index = 0,
): string {
  if (place.slug && place.slug.trim()) return place.slug.trim();
  if (fallbackPlace?.slug && fallbackPlace.slug.trim()) {
    return fallbackPlace.slug.trim();
  }
  if (place.id !== undefined && place.id !== null && String(place.id).trim()) {
    return String(place.id);
  }
  return `place-${index + 1}`;
}

export function getPlaceCategoryMeta(
  category: DistrictPlace["category"] | string,
): { ne: string; en: string; combined: string } {
  switch (category) {
    case "nature":
      return { ne: "प्राकृतिक", en: "Nature", combined: "प्राकृतिक • Nature" };
    case "spiritual":
      return { ne: "धार्मिक", en: "Shrine", combined: "धार्मिक • Shrine" };
    case "heritage":
      return { ne: "ऐतिहासिक", en: "Heritage", combined: "ऐतिहासिक • Heritage" };
    default:
      return { ne: "संस्कृति", en: "Culture", combined: "संस्कृति • Culture" };
  }
}

export function findDistrictPlace(
  places: DistrictPlace[] | undefined,
  placeSlug: string,
  fallbackPlaces?: DistrictPlace[],
): { place: DistrictPlace; index: number; slug: string } | null {
  if (!places || places.length === 0) return null;
  const normalized = decodeURIComponent(placeSlug).trim().toLowerCase();

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const matchedFb = matchFallbackPlace(place, fallbackPlaces, i);
    const computedSlug = getDistrictPlaceSlug(place, matchedFb, i).toLowerCase();
    const idStr = place.id !== undefined && place.id !== null ? String(place.id).toLowerCase() : null;

    if (
      place.slug?.toLowerCase() === normalized ||
      computedSlug === normalized ||
      (idStr !== null && idStr === normalized) ||
      `place-${i + 1}` === normalized
    ) {
      return { place, index: i, slug: getDistrictPlaceSlug(place, matchedFb, i) };
    }
  }
  return null;
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

  const rawPlaces: DistrictPlace[] =
    Array.isArray(apiD?.places) && apiD.places.length > 0
      ? apiD.places
      : fb?.places || [];

  const places = rawPlaces.map((place, idx) => {
    const matchedFb = matchFallbackPlace(place, fb?.places, idx);
    return {
      ...place,
      slug: getDistrictPlaceSlug(place, matchedFb, idx),
      image: place.image || matchedFb?.image,
    };
  });

  return {
    ...fb,
    ...apiD,
    theme,
    places,
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
