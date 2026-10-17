import type { MetadataRoute } from "next";
import { localizedPath } from "@/lib/i18n/paths";
import { locales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { newsApi } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";
import { DISTRICTS } from "@/data/districts";

const staticPages = [
  "/",
  "/news",
  "/district",
  "/photos",
  "/videos",
  "/stay",
  "/products",
  "/yatayat",
  "/tourism",
];

function languageAlternates(path: string) {
  const en = `${SITE_URL}${localizedPath("en", path)}`;
  const ne = `${SITE_URL}${localizedPath("ne", path)}`;
  return { en, ne, "x-default": en };
}

function localizedEntries(
  path: string,
  lastModified: Date,
  bothLocales = true
): MetadataRoute.Sitemap {
  if (!bothLocales) {
    const en = `${SITE_URL}${localizedPath("en", path)}`;
    return [
      {
        url: en,
        lastModified,
        alternates: { languages: { en, "x-default": en } },
      },
    ];
  }
  return locales.map((lang) => ({
    url: `${SITE_URL}${localizedPath(lang as Locale, path)}`,
    lastModified,
    alternates: { languages: languageAlternates(path) },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = staticPages.flatMap((page) =>
    localizedEntries(page, now)
  );

  // Every district has a profile, stays and products directory page
  const districtEntries = DISTRICTS.flatMap((d) =>
    [
      `/district/${d.slug}`,
      `/stay/district/${d.slug}`,
      `/products/district/${d.slug}`,
    ].flatMap((path) => localizedEntries(path, now))
  );

  const articleEntries: MetadataRoute.Sitemap = [];
  const hotelEntries: MetadataRoute.Sitemap = [];
  try {
    const items = await newsApi.getSitemapServer();

    for (const item of items) {
      if (!item.slug) continue;
      if (item.type === "district") continue; // covered by districtEntries
      if (item.type !== "article" && item.type !== "category") continue;

      const pathPrefix =
        item.type === "article"
          ? `/article/${item.slug}`
          : `/category/${item.slug}`;

      const lastModified = item.updated_at ? new Date(item.updated_at) : now;
      articleEntries.push(
        ...localizedEntries(pathPrefix, lastModified, Boolean(item.has_ne))
      );
    }

    const hotelsRes = await newsApi.getHotelsServer({ limit: 200 });
    for (const hotel of hotelsRes?.results || []) {
      if (!hotel.slug) continue;
      hotelEntries.push(...localizedEntries(`/stay/${hotel.slug}`, now));
    }
  } catch (err) {
    console.error("Failed to fetch dynamic sitemap:", err);
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return [
    ...staticEntries,
    ...districtEntries,
    ...articleEntries,
    ...hotelEntries,
  ].filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}
