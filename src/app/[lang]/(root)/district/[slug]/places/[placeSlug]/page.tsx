import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bus,
  Calendar,
  Compass,
  ExternalLink,
  MapPin,
  Mountain,
  Newspaper,
  Package,
  Sparkles,
} from "lucide-react";
import AdBanner from "@/components/common/AdBanner";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import JsonLd from "@/components/common/JsonLd";
import PageSkeleton from "@/components/common/PageSkeleton";
import RelativeTime from "@/components/common/RelativeTime";
import { DISTRICT_WEATHER } from "@/components/district/DistrictFactsheet";
import DistrictQuickSwitcher from "@/components/district/DistrictQuickSwitcher";
import PlaceShareBar from "@/components/district/PlaceShareBar";
import {
  DISTRICTS,
  findDistrictPlace,
  getDistrictBySlug,
  getDistrictPlaceSlug,
  getPlaceCategoryMeta,
  mergeDistrict,
} from "@/lib/districts";
import {
  getArticlesCached,
  getDistrictBySlugCached,
  getHotelsCached,
} from "@/lib/cached-data";
import type { ApiLang } from "@/lib/api";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import { SITE_URL, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getArticleSlug, normalizeImageUrl, t } from "@/lib/utils";
import type { Article, District, Hotel } from "@/types";

interface Props {
  params: Promise<{ lang: string; slug: string; placeSlug: string }>;
}

async function resolveDistrictAndPlace(
  slug: string,
  placeSlug: string,
  locale: Locale,
) {
  const fallbackDistrict = getDistrictBySlug(slug);
  const apiDistrict = await getDistrictBySlugCached(
    slug,
    locale as ApiLang,
  ).catch(() => null);

  if (!fallbackDistrict && (!apiDistrict || !apiDistrict.slug)) {
    return null;
  }

  const district: District =
    apiDistrict && apiDistrict.slug
      ? (mergeDistrict(apiDistrict, fallbackDistrict ?? null, {
          apiThemeWins: true,
        }) as District)
      : (mergeDistrict(null, fallbackDistrict) as District);

  const match = findDistrictPlace(
    district.places,
    placeSlug,
    fallbackDistrict?.places,
  );

  if (!match) return null;

  return { district, place: match.place, placeIndex: match.index, resolvedSlug: match.slug };
}

export async function generateStaticParams() {
  return DISTRICTS.flatMap((d) =>
    (d.places || []).flatMap((place, idx) => {
      const placeSlug = getDistrictPlaceSlug(place, undefined, idx);
      return [
        { lang: "en", slug: d.slug, placeSlug },
        { lang: "ne", slug: d.slug, placeSlug },
      ];
    }),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug, placeSlug } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;
  const resolved = await resolveDistrictAndPlace(slug, placeSlug, locale);
  if (!resolved) return {};

  const { district, place, resolvedSlug } = resolved;
  const districtName = t(district.name, locale);
  const placeTitle = t(place.title, locale);
  const placeDesc = t(place.description, locale);
  const categoryMeta = getPlaceCategoryMeta(place.category);
  const categoryLabel = locale === "ne" ? categoryMeta.ne : categoryMeta.en;

  return buildMetadata({
    locale,
    path: `/district/${slug}/places/${resolvedSlug}`,
    title: `${placeTitle} — ${districtName} (${categoryLabel})`,
    description: placeDesc.slice(0, 160),
    image: normalizeImageUrl(place.image || district.heroImage),
    type: "article",
  });
}

export default function DistrictPlaceDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="detail" />}>
      <DistrictPlaceDetailsContent params={params} />
    </Suspense>
  );
}

async function DistrictPlaceDetailsContent({ params }: Props) {
  const { lang, slug, placeSlug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const isNe = locale === "ne";

  const resolved = await resolveDistrictAndPlace(slug, placeSlug, locale);
  if (!resolved) notFound();

  const { district, place, placeIndex, resolvedSlug } = resolved;

  const [hotelsRes, articlesRes] = await Promise.all([
    getHotelsCached({ district__slug: slug, limit: 3 }, locale as ApiLang).catch(
      () => null,
    ),
    getArticlesCached({
      lang: locale as ApiLang,
      district: slug,
      limit: 4,
    }).catch(() => null),
  ]);

  const hotels: Hotel[] = hotelsRes?.results || [];
  const articles: Article[] = articlesRes?.results || [];

  const theme = district.theme || {
    primary: district.accentColor || "var(--brand)",
    dark: "var(--foreground)",
    light: "var(--surface)",
    border: "var(--border)",
    badgeBg: "var(--surface)",
    badgeText: district.accentColor || "var(--brand)",
    gradient: "from-gray-900 to-black",
  };

  const districtName = t(district.name, locale);
  const placeTitle = t(place.title, locale);
  const placeDescription = t(place.description, locale);
  const placeHighlight = place.highlight ? t(place.highlight, locale) : "";
  const placeOverview = place.overview ? t(place.overview, locale) : "";
  const placeHistory = place.history ? t(place.history, locale) : "";
  const placeLocation = place.location ? t(place.location, locale) : "";
  const placeElevation = place.elevation ? t(place.elevation, locale) : "";
  const placeAreaOrSize = place.area_or_size
    ? t(place.area_or_size, locale)
    : "";
  const placeBestTime = place.best_time_to_visit
    ? t(place.best_time_to_visit, locale)
    : "";
  const placeOpeningHours = place.opening_hours
    ? t(place.opening_hours, locale)
    : "";
  const placeEntryFee = place.entry_fee ? t(place.entry_fee, locale) : "";
  const placeWeather = place.weather_summary
    ? t(place.weather_summary, locale)
    : "";
  const placeHowToReach = place.how_to_reach
    ? t(place.how_to_reach, locale)
    : "";
  const placeAdvisory = place.travel_advisory
    ? t(place.travel_advisory, locale)
    : "";

  const categoryMeta = getPlaceCategoryMeta(place.category);
  const heroImageUrl = normalizeImageUrl(place.image || district.heroImage);
  const fallbackWeather = DISTRICT_WEATHER[district.slug];
  const weatherDisplay =
    placeWeather ||
    (fallbackWeather
      ? `${fallbackWeather.temp} • ${t(fallbackWeather.weather, locale)}`
      : "");
  const effectiveElevation = placeElevation || district.stats?.elevation || "";
  const hasCoordinates =
    typeof place.latitude === "number" &&
    typeof place.longitude === "number" &&
    !Number.isNaN(place.latitude) &&
    !Number.isNaN(place.longitude);

  const placeFactItems = [
    placeLocation && {
      label: isNe ? "स्थान (Location)" : "Location",
      value: placeLocation,
    },
    placeElevation && {
      label: isNe ? "उचाइ (Elevation)" : "Elevation",
      value: placeElevation,
    },
    placeAreaOrSize && {
      label: isNe ? "क्षेत्रफल / आकार" : "Area / Scale",
      value: placeAreaOrSize,
    },
    placeBestTime && {
      label: isNe ? "उपयुक्त समय" : "Best Season",
      value: placeBestTime,
    },
    placeOpeningHours && {
      label: isNe ? "खुल्ने समय" : "Visiting Hours",
      value: placeOpeningHours,
    },
    placeEntryFee && {
      label: isNe ? "प्रवेश शुल्क" : "Entry Fee",
      value: placeEntryFee,
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  const cultureCards = [
    {
      label: isNe ? "चाडपर्व र मेला" : "Festivals & Fairs",
      value:
        (place.festivals && t(place.festivals, locale)) ||
        (district.culture?.festivals
          ? t(district.culture.festivals, locale)
          : ""),
    },
    {
      label: isNe ? "स्थानीय परिकार" : "Local Cuisine",
      value:
        (place.local_cuisine && t(place.local_cuisine, locale)) ||
        (district.culture?.cuisine ? t(district.culture.cuisine, locale) : ""),
    },
    {
      label: isNe ? "परम्परा र लोक कला" : "Traditions & Folk Arts",
      value:
        (place.traditions && t(place.traditions, locale)) ||
        (district.culture?.folkDance
          ? t(district.culture.folkDance, locale)
          : ""),
    },
    {
      label: isNe ? "भाषिक विविधता" : "Languages & Dialects",
      value:
        (place.languages && t(place.languages, locale)) ||
        (district.culture?.dialects
          ? t(district.culture.dialects, locale)
          : ""),
    },
  ].filter((item) => Boolean(item.value));

  const otherPlaces = (district.places || [])
    .map((p, idx) => ({
      place: p,
      slug: getDistrictPlaceSlug(p, undefined, idx),
      idx,
    }))
    .filter((entry) => entry.idx !== placeIndex);

  const attractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: placeTitle,
    description: placeDescription,
    image: heroImageUrl.startsWith("http")
      ? heroImageUrl
      : `${SITE_URL}${heroImageUrl}`,
    url: `${SITE_URL}${localizedPath(locale, `/district/${slug}/places/${resolvedSlug}`)}`,
    isAccessibleForFree: true,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: `${districtName}, Sudurpashchim Province, Nepal`,
    },
  };

  return (
    <>
      <JsonLd data={attractionJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: isNe ? "गृहपृष्ठ" : "Home", path: "/" },
          { name: isNe ? "जिल्लाहरू" : "Districts", path: "/district" },
          { name: districtName, path: `/district/${slug}` },
          {
            name: isNe ? "पर्यटन र गन्तव्य" : "Places & Nature",
            path: `/district/${slug}?tab=destinations`,
          },
          {
            name: placeTitle,
            path: `/district/${slug}/places/${resolvedSlug}`,
          },
        ])}
      />

      <main className="flex-1 bg-background min-h-screen mobile-safe-bottom">
        {/* Breadcrumb */}
        <FTBreadcrumb
          locale={locale}
          items={[
            {
              name: isNe ? "जिल्लाहरू" : "Districts",
              href: "/district",
            },
            {
              name: districtName,
              href: `/district/${slug}`,
            },
            {
              name: isNe ? "पर्यटन र गन्तव्य" : "Places & Nature",
              href: `/district/${slug}?tab=destinations`,
            },
            {
              name: placeTitle,
              color: theme.primary,
            },
          ]}
        />

        <div className="container-editorial pb-14 space-y-10">
          {/* Editorial Feature Header */}
          <article
            className="border border-border bg-background overflow-hidden"
            style={{ borderTop: `4px solid ${theme.primary}` }}
          >
            <div className="p-5 sm:p-8 lg:p-10 border-b border-border bg-surface/60">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="text-xs font-bold font-sans px-3 py-1 text-white rounded-none"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {categoryMeta.combined}
                  </span>
                  {placeHighlight && (
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 border rounded-none"
                      style={{
                        backgroundColor: theme.light,
                        borderColor: theme.border,
                        color: theme.primary,
                      }}
                    >
                      {placeHighlight}
                    </span>
                  )}
                </div>

                <Link
                  href={`/district/${slug}?tab=destinations`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold font-sans text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>
                    {isNe
                      ? `${districtName}का सबै गन्तव्य`
                      : `All ${districtName} Destinations`}
                  </span>
                </Link>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline font-serif-np text-foreground tracking-tight mb-4">
                {placeTitle}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed max-w-3xl mb-6">
                {placeDescription}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <MapPin size={14} style={{ color: theme.primary }} />
                    <span>
                      {placeLocation ||
                        (isNe
                          ? `${districtName} जिल्ला, सुदूरपश्चिम प्रदेश`
                          : `${districtName} District, Sudurpashchim Province`)}
                    </span>
                  </span>
                  {effectiveElevation && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mountain size={14} style={{ color: theme.primary }} />
                      <span>{effectiveElevation}</span>
                    </span>
                  )}
                  {weatherDisplay && (
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles size={14} style={{ color: theme.primary }} />
                      <span>{weatherDisplay}</span>
                    </span>
                  )}
                </div>

                <PlaceShareBar
                  title={placeTitle}
                  locale={locale}
                  accentColor={theme.primary}
                />
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-surface-hover">
              <Image
                src={heroImageUrl}
                alt={placeTitle}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                preload
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-2 text-white">
                <p className="text-xs sm:text-sm font-sans font-medium drop-shadow">
                  {placeTitle} — {districtName}
                </p>
                {placeHighlight && (
                  <span className="text-[11px] font-mono bg-black/50 backdrop-blur-xs px-2.5 py-1">
                    {placeHighlight}
                  </span>
                )}
              </div>
            </div>
          </article>

          {/* Main 8/4 Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Destination Context & Overview */}
              <section
                className="border border-border bg-background p-6 sm:p-8"
                style={{ borderTop: `3px solid ${theme.primary}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="ft-kicker" style={{ color: theme.primary }}>
                    {isNe ? "गन्तव्य परिचय" : "Destination Overview"}
                  </span>
                </div>
                <h2 className="text-2xl font-bold font-headline font-serif-np text-foreground mb-4">
                  {isNe
                    ? `${placeTitle} — प्राकृतिक र साँस्कृतिक महत्त्व`
                    : `About ${placeTitle}`}
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-foreground font-sans leading-relaxed">
                  <p>{placeDescription}</p>
                  {(placeOverview || district.description) && (
                    <p className="text-muted-foreground">
                      {placeOverview || t(district.description, locale)}
                    </p>
                  )}
                  {(placeHistory || district.history) && (
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-bold font-sans text-foreground mb-1.5">
                        {placeHistory
                          ? isNe
                            ? `${placeTitle}को ऐतिहासिक तथा साँस्कृतिक पृष्ठभूमि`
                            : `Historical & Cultural Background`
                          : isNe
                            ? `${districtName}को ऐतिहासिक पृष्ठभूमि`
                            : `Historical Context of ${districtName}`}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {placeHistory || t(district.history, locale)}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Place Travel & Geographic Facts (falls back to District Stats only when unset) */}
              {(placeFactItems.length > 0 || placeHowToReach || hasCoordinates || district.stats) && (
                <section
                  className="border border-border bg-surface p-6 sm:p-7"
                  style={{ borderTop: `3px solid ${theme.primary}` }}
                >
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Compass size={16} className="shrink-0" style={{ color: theme.primary }} />
                      <h2 className="text-xs sm:text-sm font-extrabold font-sans tracking-wide text-foreground leading-snug">
                        {placeFactItems.length > 0 || placeHowToReach
                          ? isNe
                            ? `${placeTitle} — भौगोलिक तथा यात्रा तथ्य`
                            : `${placeTitle} Travel & Geographic Facts`
                          : isNe
                            ? `${districtName} भौगोलिक तथा यात्रा जानकारी`
                            : `${districtName} Travel & Geographic Facts`}
                      </h2>
                    </div>
                    {hasCoordinates && (
                      <a
                        href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold font-sans hover:underline shrink-0"
                        style={{ color: theme.primary }}
                      >
                        <span>{isNe ? "नक्सामा हेर्नुहोस्" : "View Map"}</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {placeFactItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-sans">
                      {placeFactItems.map((fact) => (
                        <div key={fact.label} className="bg-background p-3.5 border border-border">
                          <span className="text-muted-foreground block text-[10.5px] font-mono">
                            {fact.label}
                          </span>
                          <strong className="text-foreground text-sm block mt-1">
                            {fact.value}
                          </strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    district.stats && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs font-sans">
                        <div className="bg-background p-3.5 border border-border">
                          <span className="text-muted-foreground block text-[10.5px] font-mono">
                            {isNe ? "उचाइ (Elevation)" : "Elevation"}
                          </span>
                          <strong className="text-foreground text-sm block mt-1">
                            {district.stats.elevation}
                          </strong>
                        </div>
                        <div className="bg-background p-3.5 border border-border">
                          <span className="text-muted-foreground block text-[10.5px] font-mono">
                            {isNe ? "सदरमुकाम (HQ)" : "Headquarters"}
                          </span>
                          <strong className="text-foreground text-sm block mt-1">
                            {t(district.stats.headquarters, locale)}
                          </strong>
                        </div>
                        <div className="bg-background p-3.5 border border-border">
                          <span className="text-muted-foreground block text-[10.5px] font-mono">
                            {isNe ? "क्षेत्रफल (Area)" : "Area"}
                          </span>
                          <strong className="text-foreground text-sm block mt-1">
                            {district.stats.area}
                          </strong>
                        </div>
                        <div className="bg-background p-3.5 border border-border">
                          <span className="text-muted-foreground block text-[10.5px] font-mono">
                            {isNe ? "स्थानीय तह (Units)" : "Local Units"}
                          </span>
                          <strong className="text-foreground text-sm block mt-1">
                            {district.stats.palikas?.total ?? 0}{" "}
                            {isNe ? "तह" : "Units"} (
                            {district.stats.palikas?.municipalities ?? 0}{" "}
                            {isNe ? "न.पा." : "Mun."} /{" "}
                            {district.stats.palikas?.ruralMunicipalities ?? 0}{" "}
                            {isNe ? "गाउँ" : "R.M."})
                          </strong>
                        </div>
                        <div className="bg-background p-3.5 border border-border sm:col-span-2">
                          <span className="text-muted-foreground block text-[10.5px] font-mono">
                            {isNe ? "प्रमुख नदी (Major Rivers)" : "Major Rivers"}
                          </span>
                          <strong className="text-foreground text-sm block mt-1">
                            {t(district.stats.majorRivers, locale)}
                          </strong>
                        </div>
                      </div>
                    )
                  )}

                  {placeHowToReach && (
                    <div className="mt-4 bg-background p-4 border border-border">
                      <span className="text-muted-foreground block text-[10.5px] font-mono uppercase tracking-wider mb-1">
                        {isNe ? "पुग्ने मार्ग र यातायात (How to Reach)" : "How to Reach & Access"}
                      </span>
                      <p className="text-xs sm:text-sm text-foreground font-sans leading-relaxed">
                        {placeHowToReach}
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* Cultural Highlights */}
              {cultureCards.length > 0 && (
                <section
                  className="border border-border bg-background p-6 sm:p-7"
                  style={{ borderTop: `3px solid ${theme.primary}` }}
                >
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border">
                    <Sparkles size={16} className="shrink-0" style={{ color: theme.primary }} />
                    <h2 className="text-xs sm:text-sm font-extrabold font-sans tracking-wide text-foreground leading-snug">
                      {isNe
                        ? "स्थानीय संस्कृति, खानपान र परम्परा"
                        : "Local Culture, Cuisine & Traditions"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
                    {cultureCards.map((card) => (
                      <div key={card.label} className="p-4 bg-surface border border-border">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                          {card.label}
                        </span>
                        <p className="text-foreground font-medium">
                          {card.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Travel Advisory */}
              {(placeAdvisory || placeBestTime) && (
                <section
                  className="p-6 border"
                  style={{
                    backgroundColor: theme.light,
                    borderColor: theme.border,
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3
                      className="text-sm font-bold font-sans flex items-center gap-2"
                      style={{ color: theme.primary }}
                    >
                      <Calendar size={16} />
                      <span>
                        {isNe
                          ? "यात्रा सल्लाह तथा उपयुक्त मौसम (Travel Advisory)"
                          : "Travel Advisory & Best Time to Visit"}
                      </span>
                    </h3>
                    {placeBestTime && (
                      <span
                        className="text-[11px] font-mono font-bold px-2.5 py-0.5 bg-background border"
                        style={{ borderColor: theme.border, color: theme.primary }}
                      >
                        {placeBestTime}
                      </span>
                    )}
                  </div>
                  {placeAdvisory && (
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">
                      {placeAdvisory}
                    </p>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Plan Your Visit Card */}
              <div
                className="border border-border bg-surface p-5 space-y-3"
                style={{ borderTop: `3px solid ${theme.primary}` }}
              >
                <div className="flex items-center pb-3 border-b border-border">
                  <h2 className="text-xs sm:text-sm font-extrabold font-sans tracking-wide text-foreground leading-snug">
                    {isNe ? "यात्रा योजना र सेवा" : "Plan Your Visit"}
                  </h2>
                </div>
                <div className="space-y-2 text-sm font-sans">
                  <Link
                    href={`/stay/district/${slug}`}
                    className="flex items-center justify-between p-3 bg-background border border-border hover:border-brand transition-colors group"
                  >
                    <span className="flex items-center gap-2.5 font-semibold text-foreground">
                      <BedDouble size={16} style={{ color: theme.primary }} />
                      <span>
                        {isNe
                          ? `${districtName}मा बास र होटल`
                          : `Stays & Hotels in ${districtName}`}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>

                  <Link
                    href={`/yatayat?district=${slug}`}
                    className="flex items-center justify-between p-3 bg-background border border-border hover:border-brand transition-colors group"
                  >
                    <span className="flex items-center gap-2.5 font-semibold text-foreground">
                      <Bus size={16} style={{ color: theme.primary }} />
                      <span>
                        {isNe
                          ? "यातायात र बस तालिका"
                          : "Transport & Yatayat Routes"}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>

                  <Link
                    href={`/products/district/${slug}`}
                    className="flex items-center justify-between p-3 bg-background border border-border hover:border-brand transition-colors group"
                  >
                    <span className="flex items-center gap-2.5 font-semibold text-foreground">
                      <Package size={16} style={{ color: theme.primary }} />
                      <span>
                        {isNe
                          ? `${districtName}का स्थानीय उत्पादन`
                          : `Local Products of ${districtName}`}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>

                  <Link
                    href={`/district/${slug}/stories`}
                    className="flex items-center justify-between p-3 bg-background border border-border hover:border-brand transition-colors group"
                  >
                    <span className="flex items-center gap-2.5 font-semibold text-foreground">
                      <Newspaper size={16} style={{ color: theme.primary }} />
                      <span>
                        {isNe
                          ? `${districtName}का सबै समाचार`
                          : `All Stories from ${districtName}`}
                      </span>
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>

              {/* Nearby Hotels */}
              {hotels.length > 0 && (
                <div
                  className="border border-border bg-background p-5 space-y-4"
                  style={{ borderTop: `3px solid ${theme.primary}` }}
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
                    <h2 className="text-xs sm:text-sm font-extrabold font-sans tracking-wide text-foreground leading-snug">
                      {isNe ? "नजिकका बास तथा होटल" : "Nearby Stays"}
                    </h2>
                    <Link
                      href={`/stay/district/${slug}`}
                      className="text-xs font-bold hover:underline shrink-0"
                      style={{ color: theme.primary }}
                    >
                      {isNe ? "सबै हेर्नुहोस्" : "View all"}
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {hotels.map((hotel) => (
                      <Link
                        key={hotel.id ?? hotel.slug}
                        href={`/stay/${hotel.slug}`}
                        className="flex items-center gap-3 p-2 border border-border hover:bg-surface transition-colors group"
                      >
                        <div className="relative w-16 h-14 shrink-0 bg-surface-hover overflow-hidden">
                          <Image
                            src={normalizeImageUrl(hotel.hero_image)}
                            alt={t(hotel.name, locale)}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold font-headline text-foreground group-hover:text-brand transition-colors truncate">
                            {t(hotel.name, locale)}
                          </h3>
                          {(hotel.municipality || hotel.address) && (
                            <p className="text-xs text-muted-foreground truncate">
                              {t(hotel.municipality || hotel.address, locale)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Stories from this District */}
              {articles.length > 0 && (
                <div
                  className="border border-border bg-background p-5 space-y-4"
                  style={{ borderTop: `3px solid ${theme.primary}` }}
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
                    <h2 className="text-xs sm:text-sm font-extrabold font-sans tracking-wide text-foreground leading-snug">
                      {isNe
                        ? `${districtName} समाचार`
                        : `${districtName} Stories`}
                    </h2>
                    <Link
                      href={`/district/${slug}/stories`}
                      className="text-xs font-bold hover:underline shrink-0"
                      style={{ color: theme.primary }}
                    >
                      {isNe ? "सबै" : "All"}
                    </Link>
                  </div>
                  <div className="divide-y divide-border">
                    {articles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/article/${getArticleSlug(art)}`}
                        className="block py-3 first:pt-0 last:pb-0 group"
                      >
                        <h3 className="text-sm font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors line-clamp-2">
                          {t(art.title, locale)}
                        </h3>
                        {art.publishedAt && (
                          <div className="mt-1 text-[11px] text-muted-foreground font-sans">
                            <RelativeTime
                              date={art.publishedAt}
                              locale={locale}
                            />
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <AdBanner placement="sidebar" page="district" />
            </aside>
          </div>

          {/* Other Places & Nature in the District */}
          {otherPlaces.length > 0 && (
            <section className="pt-4">
              <div className="section-divider mb-6" />
              <div className="flex items-center justify-between pb-4">
                <div>
                  <span className="ft-kicker" style={{ color: theme.primary }}>
                    {isNe ? "थप गन्तव्यहरू" : "Explore More"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-headline text-foreground mt-1">
                    {isNe
                      ? `${districtName}का अन्य प्रमुख स्थलहरू`
                      : `More Places & Nature in ${districtName}`}
                  </h2>
                </div>
                <Link
                  href={`/district/${slug}?tab=destinations`}
                  className="text-xs font-bold font-sans hover:underline flex items-center gap-1"
                  style={{ color: theme.primary }}
                >
                  <span>{isNe ? "सबै गन्तव्य" : "All Places"}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherPlaces.map(({ place: other, slug: otherSlug }) => {
                  const otherCat = getPlaceCategoryMeta(other.category);
                  return (
                    <Link
                      key={other.id ?? otherSlug}
                      href={`/district/${slug}/places/${otherSlug}`}
                      className="editorial-card scroll-reveal-card border border-border bg-background flex flex-col overflow-hidden group"
                      style={{ borderTop: `3px solid ${theme.primary}` }}
                    >
                      <div className="relative aspect-[16/10] bg-surface-hover overflow-hidden">
                        <Image
                          src={normalizeImageUrl(
                            other.image || district.heroImage,
                          )}
                          alt={t(other.title, locale)}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-[11px] font-bold font-sans px-2.5 py-1 text-white"
                            style={{ backgroundColor: theme.primary }}
                          >
                            {isNe ? otherCat.ne : otherCat.en}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors mb-2">
                            {t(other.title, locale)}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 font-sans mb-3">
                            {t(other.description, locale)}
                          </p>
                        </div>
                        <span
                          className="text-xs font-bold flex items-center gap-1"
                          style={{ color: theme.primary }}
                        >
                          <span>
                            {isNe ? "विस्तृत विवरण" : "Read More"}
                          </span>
                          <ArrowRight
                            size={13}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <AdBanner placement="billboard-mid" page="district" />
        </div>

        <DistrictQuickSwitcher
          currentDistrictSlug={district.slug}
          locale={locale}
        />
      </main>
    </>
  );
}
