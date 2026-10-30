import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Compass, MapPin } from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { newsApi } from "@/lib/api";
import { normalizeImageUrl, t } from "@/lib/utils";
import { DISTRICTS as FALLBACK_DISTRICTS } from "@/data/districts";
import { getDistrictBySlug, mergeDistrict } from "@/lib/districts";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { DISTRICT_GEO_DETAILS } from "@/data/districtMaps";
import HotelSearch from "./HotelSearch";
import HotelCard from "@/components/common/HotelCard";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  return FALLBACK_DISTRICTS.flatMap((d) => [
    { lang: "en", slug: d.slug },
    { lang: "ne", slug: d.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const apiDistrict =
    (await newsApi
      .getDistrictsServer(locale)
      .then((res) => res?.results?.find((d: any) => d.slug === slug))
      .catch(() => null)) ?? null;
  const district = mergeDistrict(apiDistrict, getDistrictBySlug(slug));

  if (!district) return {};

  const districtName = t(district.name, locale);
  const title =
    locale === "ne"
      ? `${districtName}का होटल तथा बासस्थान`
      : `Hotels & Stays in ${districtName}`;
  const description =
    locale === "ne"
      ? `${districtName} जिल्लाका उत्कृष्ट होटल, रिसोर्ट र होमस्टेहरूको सूची।`
      : `Discover the finest hotels, resorts, and homestays in ${districtName}.`;

  return buildMetadata({
    locale,
    path: `/stay/district/${slug}`,
    title,
    description,
    image: normalizeImageUrl(district.heroImage),
  });
}

export default async function StayDistrictPage({
  params,
  searchParams,
}: Props) {
  const { lang, slug } = await params;
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const apiDistrict =
    (await newsApi
      .getDistrictsServer(locale)
      .then((res) => res?.results?.find((d: any) => d.slug === slug))
      .catch(() => null)) ?? null;
  const district = mergeDistrict(apiDistrict, getDistrictBySlug(slug));

  if (!district) notFound();

  const districtName = t(district.name, locale);
  const districtThemeColor = district.accentColor || "var(--brand)";
  const geo =
    DISTRICT_GEO_DETAILS[district.slug as keyof typeof DISTRICT_GEO_DETAILS] ||
    DISTRICT_GEO_DETAILS.kailali;

  const res = await newsApi.getHotelsServer(
    { district__slug: slug, ...(q ? { search: q } : {}) },
    locale
  ).catch(() => null);
  const hotels = res?.results || [];

  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
      {/* ── Broadsheet Breadcrumb ── */}
      <FTBreadcrumb
        locale={locale}
        items={[
          {
            name: locale === "ne" ? "होटल तथा बासस्थान" : "Hotels & Stay",
            href: "/stay",
          },
          { name: districtName },
        ]}
      />

      {/* ── District Hero Masthead ── */}
      <div className="border-b border-border bg-background">
        <div className="container-editorial py-8 sm:py-10 pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div
                className="flex items-center gap-2 text-xs font-mono font-bold mb-1.5"
                style={{ color: districtThemeColor }}
              >
                <Compass size={14} />
                <span>
                  {locale === "ne"
                    ? `${districtName} • होटल निर्देशिका`
                    : `${districtName} • Hotel Directory`}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-foreground tracking-tight leading-tight">
                {locale === "ne"
                  ? `${districtName}का होटलहरू`
                  : `Stays in ${districtName}`}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <MapPin size={14} />
                <span>
                  {locale === "ne" ? "सदरमुकाम:" : "Headquarters:"}{" "}
                  <strong className="text-foreground">
                    {locale === "ne"
                      ? geo?.headquarters?.ne
                      : geo?.headquarters?.en}
                  </strong>
                </span>
                <span className="mx-2 text-border">•</span>
                <span>
                  {locale === "ne" ? geo?.landmark?.ne : geo?.landmark?.en}
                </span>
              </div>

              <div className="mt-6 w-full max-w-sm">
                <HotelSearch
                  locale={locale}
                  districtThemeColor={districtThemeColor}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono bg-surface border border-border p-3 shrink-0 self-start md:self-auto select-none">
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  {locale === "ne" ? "कुल होटलहरू" : "Total Stays"}
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: districtThemeColor }}
                >
                  {hotels.length} {locale === "ne" ? "वटा" : "Places"}
                </span>
              </div>
              <div className="h-7 w-[1px] bg-surface-hover" />
              <div>
                <span className="text-muted-foreground block text-[10px]">
                  {locale === "ne" ? "सुविधा सम्पन्न" : "Premium"}
                </span>
                <span className="font-bold text-foreground text-sm">
                  {hotels.filter((h: any) => h.rating && h.rating >= 4).length}+{" "}
                  {locale === "ne" ? "विकल्प" : "Options"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hotels Grid ── */}
      <div className="container-editorial py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel: any) => {
            return (
              <HotelCard
                key={hotel.slug}
                hotel={hotel}
                variant="vertical"
                accentColor={districtThemeColor}
                locale={locale}
              />
            );
          })}

          {hotels.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground font-mono text-sm border border-dashed border-border bg-surface/50">
              <Compass size={32} className="mx-auto mb-3 opacity-20" />
              {locale === "ne"
                ? `${districtName} जिल्लामा हाल कुनै होटलहरू उपलब्ध छैनन्।`
                : `No hotels available in ${districtName} at the moment.`}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
