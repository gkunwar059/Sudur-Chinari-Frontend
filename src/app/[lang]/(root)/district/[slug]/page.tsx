import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DistrictContentView from "@/components/district/DistrictContentView";
import { DISTRICTS, getDistrictBySlug, mergeDistrict } from "@/lib/districts";
import { getArticlesByDistrict } from "@/data/articles";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import { SITE_URL, buildMetadata } from "@/lib/seo";
import { newsApi } from "@/lib/api";
import type { ApiLang } from "@/lib/api";
import type { District } from "@/types";
import PartnersSection from "@/components/home/PartnersSection";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
  searchParams?: Promise<{ tab?: string }>;
}

export async function generateStaticParams() {
  return DISTRICTS.flatMap((d) => [
    { lang: "en", slug: d.slug },
    { lang: "ne", slug: d.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const district = getDistrictBySlug(slug);
  if (!district) return {};

  const name =
    typeof district.name === "string"
      ? district.name
      : lang === "en"
        ? district.name.en
        : district.name.ne;
  const rawDesc =
    typeof district.description === "string"
      ? district.description
      : lang === "en"
        ? district.description.en
        : district.description.ne;
  const description = (rawDesc || "").slice(0, 160);
  const apiDistrict = await newsApi
    .getDistrictBySlugServer(slug, lang as Locale)
    .catch(() => null);

  return buildMetadata({
    locale: lang as Locale,
    path: `/district/${slug}`,
    title: `${name} — ${lang === "en" ? "District Profile & News" : "जिल्ला समाचार"}`,
    description,
    image: apiDistrict?.heroImage || district.heroImage,
  });
}

export default async function DistrictPage({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const sp = searchParams ? await searchParams : {};
  const initialTab = typeof sp.tab === "string" ? sp.tab : "all";
  const fallbackDistrict = getDistrictBySlug(slug);
  if (!fallbackDistrict) notFound();

  let district: District = fallbackDistrict;
  const apiDistrict = await newsApi
    .getDistrictBySlugServer(slug, lang as ApiLang)
    .catch(() => null);
  if (apiDistrict && apiDistrict.slug) {
    district = mergeDistrict(apiDistrict, fallbackDistrict, {
      apiThemeWins: true,
    }) as District;
    district.slider_images =
      apiDistrict.slider_images && apiDistrict.slider_images.length > 0
        ? apiDistrict.slider_images
        : fallbackDistrict.slider_images || [];
  }

  const articles = getArticlesByDistrict(slug, 9);
  const nearbyDistricts = DISTRICTS.filter((d) => d.slug !== slug).slice(0, 4);

  // Fetch partners specific to this district
  const pRes = await newsApi.getPartnersServer({ district: slug }, lang as ApiLang);
  const districtPartners = pRes?.results || [];

  const districtDisplayName =
    typeof district.name === "string"
      ? district.name
      : lang === "en"
        ? district.name.en
        : district.name.ne;

  const districtJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AdministrativeArea",
        name: districtDisplayName,
        description:
          typeof district.description === "string"
            ? district.description
            : lang === "en"
              ? district.description?.en
              : district.description?.ne,
        url: `${SITE_URL}${localizedPath(lang as Locale, `/district/${slug}`)}`,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "सुदूरपश्चिम प्रदेश (Sudurpashchim Province)",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "ne" ? "गृहपृष्ठ" : "Home",
            item: `${SITE_URL}${localizedPath(lang as Locale, "/")}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: lang === "ne" ? "जिल्लाहरू" : "Districts",
            item: `${SITE_URL}${localizedPath(lang as Locale, "/district")}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: districtDisplayName,
            item: `${SITE_URL}${localizedPath(lang as Locale, `/district/${slug}`)}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtJsonLd) }}
      />
      <main className="flex-1 mobile-safe-bottom">
        <DistrictContentView
          district={district}
          articles={articles}
          nearbyDistricts={nearbyDistricts}
          initialTab={initialTab}
          lang={lang}
        />

        {districtPartners && districtPartners.length > 0 && (
          <div className="container-editorial pb-10">
            <PartnersSection
              partners={districtPartners}
              locale={lang}
              title={
                lang === "ne"
                  ? `${districtDisplayName} — संस्थागत सहकार्य तथा साझेदारहरू`
                  : `${districtDisplayName} — District Partners & Affiliates`
              }
              enTitle={`${districtDisplayName} Affiliates`}
            />
          </div>
        )}
      </main>
    </>
  );
}
