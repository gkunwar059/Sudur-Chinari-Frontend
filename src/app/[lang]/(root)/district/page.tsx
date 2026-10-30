import type { Metadata } from "next";
import { newsApi } from "@/lib/api";
import PartnersSection from "@/components/home/PartnersSection";
import { DISTRICTS as FALLBACK_DISTRICTS } from "@/data/districts";
import { Compass } from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { normalizeImageUrl } from "@/lib/utils";
import RegionDistrictsList from "@/components/district/RegionDistrictsList";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const title =
    locale === "ne"
      ? "सुदूरपश्चिमका ९ जिल्लाहरू — डिजिटल जिल्ला निर्देशिका"
      : "9 Districts of Sudurpaschim — Digital District Directory";
  const description =
    locale === "ne"
      ? "तराईका समथर फाँटदेखि अपि र साइपाल हिमालसम्म फैलिएका सुदूरपश्चिम प्रदेशका ९ वटै जिल्लाका ताजा समाचार, स्थानीय शासन, विकास, समाज र खोज पत्रकारिता।"
      : "Latest news, local governance, development, society, and investigative journalism from all 9 districts of Sudurpaschim Province.";

  return buildMetadata({
    locale,
    path: "/district",
    title,
    description,
    image: "/images/ghodaghodi_lake.jpg",
  });
}

export default async function DistrictDirectoryPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  // Fetch districts from backend API with fallback to hardcoded comprehensive dataset
  let districtsData: any[] = [];
  const apiDistricts = await newsApi.getDistrictsServer(locale).catch(() => null);
  if (apiDistricts && Array.isArray(apiDistricts.results) && apiDistricts.results.length > 0) {
    districtsData = apiDistricts.results.map((apiD: any) => {
      const fallback = FALLBACK_DISTRICTS.find((f) => f.slug === apiD.slug);
      return {
        ...fallback,
        ...apiD,
        theme: fallback?.theme || {
          light: "var(--surface)",
          border: "var(--border)",
          badgeBg: "var(--surface-tint)",
          badgeText: apiD.accentColor || "var(--brand)",
        },
        heroImage:
          normalizeImageUrl(apiD.heroImage) ||
          fallback?.heroImage ||
          '/images/himalaya_banner.jpg',
        accentColor: apiD.accentColor || fallback?.accentColor || "var(--brand)",
        storyCount: fallback?.storyCount || 20,
      };
    });
  }

  if (districtsData.length === 0) {
    districtsData = FALLBACK_DISTRICTS;
  }

  const allPartners = await newsApi.getPartnersServer(undefined, locale).catch(() => null);
  const districtPartners = (allPartners?.results || []).filter(
    (p: any) => p.district || p.district_slug,
  );

  return (
    <>
      <main className="flex-1 mobile-safe-bottom bg-background">
        {/* ── Broadsheet Breadcrumb ── */}
        <FTBreadcrumb
          locale={locale}
          items={[
            {
              name:
                locale === "ne"
                  ? "सुदूरपश्चिमका ९ जिल्लाहरू"
                  : "9 Districts of Sudurpaschim",
            },
          ]}
        />

        {/* ── Broadsheet Page Masthead Banner ── */}
        <div className="border-b border-border bg-background">
          <div className="container-editorial py-8 sm:py-10 pt-4 sm:pt-6">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              {/* Left Content */}
              <div className="lg:w-2/3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-secondary mb-1.5">
                  <Compass size={14} />
                  <span>
                    {locale === "ne"
                      ? "सुदूरपश्चिम प्रदेश • डिजिटल जिल्ला निर्देशिका"
                      : "Sudurpaschim Province • Digital District Directory"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-foreground tracking-tight leading-tight">
                  {locale === "ne"
                    ? "सुदूरपश्चिमका ९ जिल्लाहरू"
                    : "9 Districts of Sudurpaschim"}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-sans mt-2 max-w-2xl leading-relaxed">
                  {locale === "ne"
                    ? "तराईका समथर फाँटदेखि अपि र साइपाल हिमालसम्म फैलिएका सुदूरपश्चिम प्रदेशका ९ वटै जिल्लाका ताजा समाचार, स्थानीय शासन, विकास, समाज र खोज पत्रकारिता।"
                    : "Latest news, local governance, development, society, and investigative journalism from all 9 districts of Sudurpaschim Province, stretching from the flat plains of Terai to the Api and Saipal mountains."}
                </p>

                {/* Province Geographic Meta Strip */}
                <div className="flex items-center gap-4 text-xs font-mono bg-surface border border-border p-3 mt-6 shrink-0 self-start md:self-auto select-none w-fit">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      {locale === "ne" ? "कुल जिल्ला" : "Total Districts"}
                    </span>
                    <span className="font-bold text-brand text-sm">
                      {locale === "ne" ? "९ जिल्लाहरू" : "9 Districts"}
                    </span>
                  </div>
                  <div className="h-7 w-[1px] bg-surface-hover" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      {locale === "ne" ? "कुल क्षेत्रफल" : "Total Area"}
                    </span>
                    <span className="font-bold text-foreground text-sm">
                      {locale === "ne" ? "१९,५३९" : "19,539"} km²
                    </span>
                  </div>
                  <div className="h-7 w-[1px] bg-surface-hover" />
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      {locale === "ne" ? "भौगोलिक क्षेत्र" : "Geo Regions"}
                    </span>
                    <span className="font-bold text-brand-secondary text-sm">
                      {locale === "ne" ? "३ भेगहरू" : "3 Belts"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Ad Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-4 shrink-0 self-stretch md:self-auto">
                {/* Advertisement Placeholder */}
                <div className="hidden sm:flex items-center justify-center w-[250px] lg:w-[320px] min-h-[100px] h-full bg-surface border border-dashed border-border select-none">
                  <span className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase">
                    {locale === "ne" ? "विज्ञापन" : "Advertisement"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Broadsheet Directory Sections Grouped by Geographical Belts ── */}
        <RegionDistrictsList districtsData={districtsData} locale={locale} />

        {/* ── District Partners Network ── */}
        {districtPartners && districtPartners.length > 0 && (
          <div className="container-editorial py-8">
            <PartnersSection
              partners={districtPartners}
              locale={locale}
              sectionIndex="१०"
              title={
                locale === "ne"
                  ? "सुदूरपश्चिमका ९ जिल्लाका संस्थागत साझेदारहरू"
                  : "Institutional Partners of 9 Districts"
              }
              enTitle="District Affiliates Network"
            />
          </div>
        )}
      </main>
    </>
  );
}
