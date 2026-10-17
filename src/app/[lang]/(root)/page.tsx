import type { Metadata } from "next";
import FTLeadHero from "@/components/home/FTLeadHero";
import FTArchivesAndVoices from "@/components/home/FTArchivesAndVoices";
import FTOpinionSection from "@/components/home/FTOpinionSection";
import DistrictMapCards from "@/components/home/DistrictMapCards";
import VideoShorts from "@/components/home/VideoShorts";
import PhotoGallerySection from "@/components/home/PhotoGallerySection";
import AdBanner from "@/components/common/AdBanner";
import PartnersSection, {
  type PartnerItem,
} from "@/components/home/PartnersSection";
import type { Article } from "@/types";
import { newsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { isLocale, ogLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    alternates: {
      canonical: `${SITE_URL}${localizedPath(lang as Locale, "/")}`,
      languages: {
        en: `${SITE_URL}/`,
        ne: `${SITE_URL}/ne`,
        "x-default": `${SITE_URL}/`,
      },
    },
    openGraph: {
      locale: ogLocale[lang as Locale],
      url: `${SITE_URL}${localizedPath(lang as Locale, "/")}`,
      title: dict.meta.home.title,
      description: dict.meta.home.description,
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const [apiArticles, apiPartners, apiDistricts]: [
    Article[],
    PartnerItem[],
    any[],
  ] = await Promise.all([
    newsApi
      .getArticlesServer({ lang })
      .then((res) => res?.results || [])
      .catch(() => []),
    newsApi
      .getPartnersServer({ district: "main" }, lang)
      .then((res) => res?.results || [])
      .catch(() => []),
    newsApi
      .getDistrictsServer(lang)
      .then((res) => res?.results || [])
      .catch(() => []),
  ]);

  const ARTICLES: Article[] = apiArticles || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}${localizedPath(lang as Locale, "/")}`,
        name: dict.brand.name,
        description: dict.meta.home.description,
        inLanguage: lang,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}${localizedPath(lang as Locale, "/search")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: dict.brand.name,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/images/sudur-logo.png`,
      },
    ],
  };

  if (!ARTICLES || ARTICLES.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground w-full">
        <main className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">No Content Available</h2>
            <p className="text-muted-foreground">
              Please add articles from the backend admin panel.
            </p>
          </div>
        </main>
      </div>
    );
  }
  // ── 1. Hero Stories ──
  const leadStory = ARTICLES[0];
  const quickStory = ARTICLES[4] || ARTICLES[1] || ARTICLES[0];
  const exclusiveStory = ARTICLES[5] || ARTICLES[2] || ARTICLES[0];
  const photoStory = ARTICLES[1] || ARTICLES[0];
  const editorPick = ARTICLES[2] || ARTICLES[0];
  const bigReadStory = ARTICLES[3] || ARTICLES[0];

  // ── 2. Top Stories Row (4 Columns) ──
  const topStories = [
    ARTICLES[6] || ARTICLES[0],
    ARTICLES[7] || ARTICLES[1] || ARTICLES[0],
    ARTICLES[8] || ARTICLES[2] || ARTICLES[0],
    ARTICLES[9] || ARTICLES[3] || ARTICLES[0],
  ];

  // ── 3. Spotlight (Left + Center Widescreen + Right) ──
  const spotlightCenter =
    ARTICLES.find((a) => a.id === "art_darchula_utsav") ||
    ARTICLES[8] ||
    ARTICLES[0];
  const spotlightLeft =
    ARTICLES.find((a) => a.id === "art_kanchanpur_shukla") ||
    ARTICLES[7] ||
    ARTICLES[1] ||
    ARTICLES[0];
  const spotlightRight =
    ARTICLES.find((a) => a.id === "art_bajhang_khaptad") ||
    ARTICLES[6] ||
    ARTICLES[2] ||
    ARTICLES[0];

  // ── 4. News & Most Read (3 News + Most Read 1-5) ──
  const newsStories = [
    ARTICLES[1] || ARTICLES[0],
    ARTICLES[4] || ARTICLES[0],
    ARTICLES[5] || ARTICLES[0],
  ];
  const mostReadStories = [
    ARTICLES[0],
    ARTICLES[1] || ARTICLES[0],
    ARTICLES[2] || ARTICLES[0],
    ARTICLES[3] || ARTICLES[0],
    ARTICLES[4] || ARTICLES[0],
  ];

  // ── 5. Opinion Stories (Warm Tinted Block + Sub Columns) ──
  const opinionArticles = ARTICLES.filter(
    (a) => a.category.slug === "opinion" || a.author.role.includes("स्तम्भकार"),
  );
  const opinionList =
    opinionArticles.length >= 5
      ? opinionArticles
      : [
          ARTICLES[2] || ARTICLES[0],
          ARTICLES[3] || ARTICLES[0],
          ARTICLES[0],
          ARTICLES[1] || ARTICLES[0],
          ARTICLES[4] || ARTICLES[0],
        ];

  // ── 6. Life & Arts (2 Top Features + 3 Bottom Features) ──
  const cultureStories = ARTICLES.filter(
    (a) => a.category.slug === "culture" || a.category.slug === "tourism",
  );
  const lifeAndArts = {
    top1: cultureStories[0] || ARTICLES[1] || ARTICLES[0],
    top2: cultureStories[1] || ARTICLES[2] || ARTICLES[0],
    bottom1: cultureStories[2] || ARTICLES[3] || ARTICLES[0],
    bottom2: cultureStories[3] || ARTICLES[0] || ARTICLES[0],
    bottom3: cultureStories[4] || ARTICLES[4] || ARTICLES[0],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 w-full max-w-full overflow-x-hidden">
        <main className="w-full max-w-full overflow-x-hidden min-w-0 flex-1 mobile-safe-bottom container-editorial py-4 sm:py-6">
          {/* ── 1. Hero Lead Section ── */}
          <FTLeadHero
            leadStory={leadStory}
            exclusiveStory={exclusiveStory}
            quickStory={quickStory}
            photoStory={photoStory}
            editorPick={editorPick}
            bigReadStory={bigReadStory}
          />

          {/* ── 2. 9 Districts Explorer (खण्ड ०१) ── */}
          <DistrictMapCards initialDistricts={apiDistricts} />
          <AdBanner placement="billboard-mid" />

          {/* ── 2.5 Archives & Voices ── */}
          <FTArchivesAndVoices stories={topStories} />
          <AdBanner placement="bottom-strip" />

          {/* ── 5. News & Most Read 1-5 (खण्ड ०४) ── */}
          {/* <FTNewsMostRead
            newsStories={newsStories}
            mostReadStories={mostReadStories}
          /> */}

          {/* ── 6. Opinion Section (खण्ड ०५) ── */}
          <FTOpinionSection opinions={opinionList} locale={lang as Locale} />
          <AdBanner placement="billboard-mid" />

          {/* ── 8. Recent Video Reports (खण्ड ०७) & Photo Stories (खण्ड ०८) ── */}
          <VideoShorts />

          <PhotoGallerySection />
          <AdBanner placement="bottom-strip" />

          {/* ── 9. Institutional Affiliations Network (खण्ड ०९) ── */}
          <PartnersSection partners={apiPartners} locale={lang} />
        </main>
      </div>
    </>
  );
}
