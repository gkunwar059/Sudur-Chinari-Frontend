import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import JsonLd from "@/components/common/JsonLd";
import PageSkeleton from "@/components/common/PageSkeleton";
import DistrictStoriesFeed from "@/components/district/DistrictStoriesFeed";
import { getArticlesCached, getDistrictBySlugCached } from "@/lib/cached-data";
import { getDistrictBySlug, mergeDistrict } from "@/lib/districts";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import type { ApiLang } from "@/lib/api";
import type { District } from "@/types";
import { t, toNepaliDigits } from "@/lib/utils";

const PAGE_SIZE = 8;

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const district = getDistrictBySlug(slug);
  if (!district) return {};

  const name = t(district.name, lang as Locale);
  return buildMetadata({
    locale: lang as Locale,
    path: `/district/${slug}/stories`,
    title:
      lang === "en"
        ? `All Stories from ${name}`
        : `${name}का सबै समाचार तथा कथा`,
    description:
      lang === "en"
        ? `Browse every published story from ${name} district in Sudurpashchim Province.`
        : `सुदूरपश्चिम प्रदेशको ${name} जिल्लामा प्रकाशित सबै समाचार तथा कथाहरू पढ्नुहोस्।`,
    image: district.heroImage,
  });
}

export default function DistrictStoriesPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <DistrictStoriesContent params={params} />
    </Suspense>
  );
}

async function DistrictStoriesContent({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const fallbackDistrict = getDistrictBySlug(slug);
  if (!fallbackDistrict) notFound();

  const apiDistrict = await getDistrictBySlugCached(
    slug,
    lang as ApiLang,
  ).catch(() => null);
  const district = apiDistrict
    ? (mergeDistrict(apiDistrict, fallbackDistrict, {
        apiThemeWins: true,
      }) as District)
    : fallbackDistrict;

  const data = await getArticlesCached({
    lang: lang as ApiLang,
    district: slug,
    limit: PAGE_SIZE,
  }).catch(() => null);

  const articles = data?.results ?? [];
  const total = data?.count ?? articles.length;
  const isEn = lang === "en";
  const districtName = t(district.name, lang as Locale);
  const theme = district.theme || { primary: district.accentColor };
  const totalLabel = isEn ? String(total) : toNepaliDigits(total);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(lang as Locale, [
          { name: isEn ? "Home" : "गृहपृष्ठ", path: "/" },
          { name: isEn ? "Districts" : "जिल्लाहरू", path: "/district" },
          { name: districtName, path: `/district/${slug}` },
          {
            name: isEn ? "All Stories" : "सबै कथा",
            path: `/district/${slug}/stories`,
          },
        ])}
      />
      <main className="flex-1 mobile-safe-bottom">
        <FTBreadcrumb
          locale={lang as Locale}
          items={[
            { name: isEn ? "Districts" : "जिल्लाहरू", href: "/district" },
            { name: districtName, href: `/district/${slug}` },
            { name: isEn ? "All Stories" : "सबै कथा", color: theme.primary },
          ]}
        />

        <div className="container-editorial pb-14">
          <header
            className="mb-10 border border-border bg-background p-6 sm:p-8 shadow-2xs"
            style={{
              borderTop: `4px solid ${theme.primary}`,
              backgroundColor: district.theme?.light,
            }}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div
                  className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest font-mono"
                  style={{ color: theme.primary }}
                >
                  <Newspaper size={14} />
                  <span>{isEn ? "District Archive" : "जिल्ला अभिलेख"}</span>
                </div>
                <h1 className="text-3xl font-black font-headline tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {isEn
                    ? `All Stories from ${districtName}`
                    : `${districtName}का सबै कथा`}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground font-sans">
                  {isEn
                    ? `Every published report from ${districtName}, ordered newest first. Scroll to keep reading.`
                    : `${districtName} जिल्लामा प्रकाशित सबै रिपोर्टहरू, नयाँ पहिले। पढ्दै तल स्क्रोल गर्नुहोस्।`}
                </p>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <span className="block text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground">
                  {isEn ? "Total stories" : "कुल कथा"}
                </span>
                <strong className="mt-1 block text-3xl font-black font-headline text-foreground">
                  {totalLabel}
                </strong>
                <span className="mt-1 block text-xs font-sans text-muted-foreground">
                  {isEn ? "Newest first" : "नयाँ पहिले"}
                </span>
              </div>
            </div>
          </header>

          <DistrictStoriesFeed
            key={`${lang}-${slug}`}
            districtSlug={slug}
            locale={lang as Locale}
            initialArticles={articles}
            totalCount={total}
            accentColor={theme.primary}
          />
        </div>
      </main>
    </>
  );
}
