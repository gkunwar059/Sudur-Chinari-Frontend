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
import type { Article, VideoItem, PhotoStory, HeroSlide } from "@/types";
import FTEmptyState from "@/components/common/FTEmptyState";
import { Newspaper } from "lucide-react";
import { newsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { isLocale, ogLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";
import { getPartnersCached } from "@/lib/cached-data";

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

  const [apiArticles, apiPartners, apiDistricts, apiVideos, apiPhotos, apiHeroSlides]: [
    Article[],
    PartnerItem[],
    any[],
    VideoItem[],
    PhotoStory[],
    HeroSlide[],
  ] = await Promise.all([
    newsApi
      .getArticlesServer({ lang })
      .then((res) => res?.results || [])
      .catch(() => []),
    getPartnersCached(undefined, lang)
      .then((res) =>
        (res?.results || [])
          .filter((p) => !p.district)
          .map((p) => ({ ...p, url: p.url ?? undefined })),
      )
      .catch(() => []),
    newsApi
      .getDistrictsServer(lang)
      .then((res) => res?.results || [])
      .catch(() => []),
    newsApi
      .getVideosServer(undefined, lang)
      .then((res) => res?.results || [])
      .catch(() => []),
    newsApi
      .getPhotoStoriesServer(undefined, lang)
      .then((res) => res?.results || [])
      .catch(() => []),
    newsApi
      .getHeroSlidesServer({ lang })
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
        <main className="flex-1 flex items-center justify-center min-h-[60vh] container-editorial py-12">
          <FTEmptyState
            variant="page"
            title={
              lang === "ne"
                ? "हाल कुनै समाचार वा लेखहरू प्रकाशित भएका छैनन्"
                : "No Published Articles Available"
            }
            description={
              lang === "ne"
                ? "हाम्रो सम्पादकीय टोलीले सुदूरपश्चिम तथा राष्ट्रिय राजनीतिका ताजा समाचारहरू तयार गर्दैछ। कृपया केही समयपछि पुन: हेर्नुहोस्।"
                : "Our editorial desk is curating the latest news and broadsheet dispatches. Please check back shortly."
            }
            kicker={lang === "ne" ? "डिजिटल संस्करण" : "DIGITAL EDITION"}
            icon={<Newspaper size={28} className="text-brand" />}
            accentColor="var(--color-brand)"
            actionText={lang === "ne" ? "गृहपृष्ठ ताजा गर्नुहोस्" : "Refresh Editions"}
            actionHref={`/${lang}`}
          />
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
  const districtArticles = ARTICLES.filter((a) => Boolean(a.district));
  const spotlightCenter = districtArticles[0] || ARTICLES[8] || ARTICLES[0];
  const spotlightLeft = districtArticles[1] || ARTICLES[7] || ARTICLES[1] || ARTICLES[0];
  const spotlightRight = districtArticles[2] || ARTICLES[6] || ARTICLES[2] || ARTICLES[0];

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
    (a) =>
      a.category?.slug === "opinion" ||
      (typeof a.author?.role === "string" && a.author.role.includes("स्तम्भकार")),
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
            heroSlides={apiHeroSlides}
            leadStory={leadStory}
            exclusiveStory={exclusiveStory}
            quickStory={quickStory}
            photoStory={photoStory}
            editorPick={editorPick}
            bigReadStory={bigReadStory}
          />

          {/* ── 2. 9 Districts Explorer (खण्ड ०१) ── */}
          <div suppressHydrationWarning className="scroll-reveal">
            <DistrictMapCards initialDistricts={apiDistricts} />
          </div>
          <div suppressHydrationWarning className="scroll-reveal scroll-delay-100">
            <AdBanner placement="billboard-mid" page="home" />
          </div>

          {/* ── 2.5 Archives & Voices ── */}
          <div suppressHydrationWarning className="scroll-reveal">
            <FTArchivesAndVoices stories={topStories} />
          </div>
          <div suppressHydrationWarning className="scroll-reveal scroll-delay-100">
            <AdBanner placement="bottom-strip" page="home" />
          </div>

          {/* ── 5. News & Most Read 1-5 (खण्ड ०४) ── */}
          {/* <FTNewsMostRead
            newsStories={newsStories}
            mostReadStories={mostReadStories}
          /> */}

          {/* ── 6. Opinion Section (खण्ड ०५) ── */}
          <div suppressHydrationWarning className="scroll-reveal">
            <FTOpinionSection opinions={opinionList} locale={lang as Locale} />
          </div>
          <div suppressHydrationWarning className="scroll-reveal scroll-delay-100">
            <AdBanner placement="billboard-mid" page="home" />
          </div>

          {/* ── 8. Recent Video Reports (खण्ड ०७) & Photo Stories (खण्ड ०८) ── */}
          <div suppressHydrationWarning className="scroll-reveal">
            <VideoShorts videos={apiVideos} />
          </div>

          <div suppressHydrationWarning className="scroll-reveal">
            <PhotoGallerySection photoStories={apiPhotos} />
          </div>
          <div suppressHydrationWarning className="scroll-reveal scroll-delay-100">
            <AdBanner placement="bottom-strip" page="home" />
          </div>

          {/* ── 9. Institutional Affiliations Network (खण्ड ०९) ── */}
          <div suppressHydrationWarning className="scroll-reveal">
            <PartnersSection partners={apiPartners} locale={lang} />
          </div>
        </main>
      </div>
    </>
  );
}
