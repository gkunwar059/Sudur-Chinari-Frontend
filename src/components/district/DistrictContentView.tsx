"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import UserContributionModal from "@/components/district/UserContributionModal";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Camera,
  Compass,
  Sparkles,
  BookOpen,
  Navigation,
  MessageCircle,
  BookMarked,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from "lucide-react";
import type { District, Article, BilingualText } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { DISTRICT_REAL_INDIVIDUAL_PATHS } from "@/data/districtMaps";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { DISTRICTS } from "@/data/districts";
import { useTheme } from "next-themes";
import { cn, getArticleSlug, normalizeImageUrl, t as translate } from "@/lib/utils";
import RelativeTime from "@/components/common/RelativeTime";
import VideoShorts from "@/components/home/VideoShorts";
import DistrictArchives, { getArchiveCategories } from "./DistrictArchives";
import AdBanner from "../common/AdBanner";
import FTSectionDivider from "../common/FTSectionDivider";
import EditorialCard from "@/components/common/EditorialCard";

interface DistrictContentViewProps {
  district: District;
  articles: Article[];
  nearbyDistricts: District[];
  initialTab?: string;
  lang: string;
}

const DISTRICT_WEATHER: Record<
  string,
  { temp: string; weather: { ne: string; en: string } }
> = {
  kailali: { temp: "32°C", weather: { ne: "घमाइलो", en: "Sunny" } },
  kanchanpur: { temp: "31°C", weather: { ne: "सफा", en: "Clear" } },
  dadeldhura: { temp: "24°C", weather: { ne: "शीतल", en: "Pleasant" } },
  baitadi: { temp: "22°C", weather: { ne: "बादल", en: "Partly Cloudy" } },
  doti: { temp: "26°C", weather: { ne: "घमाइलो", en: "Sunny" } },
  achham: { temp: "25°C", weather: { ne: "सफा", en: "Clear" } },
  bajura: { temp: "19°C", weather: { ne: "चिसो", en: "Chilly" } },
  bajhang: { temp: "20°C", weather: { ne: "घमाइलो", en: "Sunny" } },
  darchula: { temp: "18°C", weather: { ne: "शीतल", en: "Alpine Crisp" } },
};

const TABS = [
  {
    id: "all",
    ne: "मुख्य समाचार",
    en: "Top Stories",
    icon: <Navigation size={14} />,
  },
  {
    id: "destinations",
    ne: "पर्यटन र प्रमुख गन्तव्य",
    en: "Places & Nature",
    icon: <MapPin size={14} />,
  },
  {
    id: "culture",
    ne: "संस्कृति र जनजीवन",
    en: "Culture & Life",
    icon: <Compass size={14} />,
  },
  {
    id: "photos",
    ne: "फोटो फिचर",
    en: "Photo Feature",
    icon: <Camera size={14} />,
  },
  {
    id: "archives",
    ne: "अभिलेख र आवाजहरू",
    en: "Archives & Voices",
    icon: <BookOpen size={14} />,
  },
];

export default function DistrictContentView({
  district,
  articles,
  initialTab = "all",
  lang,
}: DistrictContentViewProps) {
  const locale = lang;
  const isEn = locale === "en";

  const t = (obj?: BilingualText | null | string, fallback = ""): string =>
    translate(obj, lang as "en" | "ne") || fallback;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  const archiveCategories = getArchiveCategories(isEn);
  const isArchiveTab =
    archiveCategories.some((c) => c.id === activeTab) ||
    activeTab === "archives";

  const COMBINED_TABS = [
    {
      id: "all",
      label: isEn ? "All Stories" : "सबै कथा",
      icon: <BookMarked size={14} />,
    },
    {
      id: "destinations",
      label: isEn ? "Places & Nature" : "पर्यटन र प्रमुख गन्तव्य",
      icon: <MapPin size={14} />,
    },

    ...archiveCategories,
    {
      id: "photos",
      label: isEn ? "Multimedia" : "मल्टिमिडिया",
      icon: <Camera size={14} />,
    },
  ];

  // Hero Slider Images
  const sliderImages =
    district.slider_images && district.slider_images.length > 0
      ? district.slider_images
      : district.heroImage
        ? [{ id: 0, image: district.heroImage, caption: "" }]
        : [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
  }, [district.slug]);

  useEffect(() => {
    if (sliderImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length, isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  const getSlideCaption = (slide?: { caption?: string | BilingualText }) =>
    t(slide?.caption);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        ["all", "destinations", "culture", "photos"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const theme = district.theme || {
    primary: district.accentColor,
    dark: "var(--foreground)",
    light: "var(--surface)",
    border: "var(--border)",
    badgeBg: "var(--surface-tint)",
    badgeText: district.accentColor,
    gradient: "from-gray-900 to-black",
  };

  const stats = district.stats;
  const places = district.places || [];
  const photoFeatures = articles.slice(0, 3);
  const otherDistricts = DISTRICTS.filter((d) => d.slug !== district.slug);

  return (
    <div className="bg-background min-h-screen w-full max-w-full overflow-x-hidden">
      {/* ── Broadsheet Breadcrumb ── */}
      <FTBreadcrumb
        locale={locale as Locale}
        navClassName="flex items-center gap-2 text-xs text-muted-foreground font-medium font-sans overflow-x-auto no-scrollbar whitespace-nowrap min-w-0"
        items={[
          {
            name:
              locale === "ne"
                ? "सुदूरपश्चिमका ९ जिल्लाहरू"
                : "9 Districts of Far-West",
            href: "/district",
          },
          {
            name:
              typeof district.name === "object" &&
              district.name?.ne &&
              district.name?.en
                ? `${district.name.ne} (${district.name.en})`
                : t(district.name),
            color: theme.primary,
          },
        ]}
      />

      {/* ── Modern Right-Aligned District Masthead Banner ── */}
      <div className="container-editorial pt-2 pb-4">
        <div
          className="relative rounded-none overflow-hidden border shadow-xs min-h-[320px] sm:min-h-[360px] flex items-center transition-all group/hero"
          style={{
            backgroundColor: isDark ? "var(--surface)" : theme.light,
            borderColor: isDark ? "var(--border)" : theme.border,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Right-Aligned District Slider Images with Smooth Seamless Mask */}
          <div className="absolute inset-0 w-full h-full seamless-mask-banner pointer-events-none select-none">
            {sliderImages.map((slide, index) => {
              const isActive = index === currentSlide;
              const captionText = getSlideCaption(slide);
              return (
                <div
                  key={slide.id ?? index}
                  className={cn(
                    "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
                    isActive
                      ? "opacity-100 scale-100 z-1"
                      : "opacity-0 scale-105 z-0 pointer-events-none",
                  )}
                >
                  <Image
                    src={normalizeImageUrl(slide.image)}
                    alt={captionText || t(district.name)}
                    fill
                    className="object-cover object-right"
                    preload={index === 0}
                    sizes="(max-width: 768px) 100vw, 70vw"
                  />
                </div>
              );
            })}
          </div>

          {/* Slider Controls & Caption Overlay (interactive, bottom-right) */}
          {sliderImages.length > 1 && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 flex items-center gap-2 select-none pointer-events-auto">
              {/* Optional Caption Pill */}
              {getSlideCaption(sliderImages[currentSlide]) && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-sans rounded-full shadow-md max-w-[280px]">
                  <Camera size={13} className="text-white/80 shrink-0" />
                  <span className="truncate">
                    {getSlideCaption(sliderImages[currentSlide])}
                  </span>
                </div>
              )}

              {/* Prev / Next & Indicators Pill */}
              <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 shadow-md text-white">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label={
                    locale === "ne" ? "अघिल्लो फोटो" : "Previous photo"
                  }
                  className="p-1 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white"
                >
                  <ChevronLeft size={15} />
                </button>

                <div className="flex items-center gap-1 px-1.5">
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`${locale === "ne" ? "फोटो" : "Photo"} ${idx + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        idx === currentSlide
                          ? "w-4 bg-white"
                          : "w-1.5 bg-white/40 hover:bg-white/70",
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label={locale === "ne" ? "पछिल्लो फोटो" : "Next photo"}
                  className="p-1 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Reading Contrast Shield (Smooth blend to 100% theme.light behind text) */}
          <div
            className="sm:hidden absolute inset-0 z-10 pointer-events-none"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, transparent 0%, rgba(31,41,55,0.7) 28%, var(--surface) 60%)"
                : `linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, ${theme.light}b3 28%, ${theme.light} 60%)`,
            }}
          />

          {/* District Content Area on the Left */}
          <div className="relative z-20 w-full sm:w-[75%] md:w-[65%] lg:w-[60%] p-6 sm:p-8 md:p-10 flex flex-col h-full justify-center">
            {/* Meta Strip (Region) */}
            <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
              <span
                className="inline-flex items-center font-mono font-bold text-white text-[10px] tracking-widest px-2.5 py-1 uppercase"
                style={{ backgroundColor: theme.primary }}
              >
                {locale === "ne" ? "सुदूरपश्चिम प्रदेश" : "FAR-WEST PROVINCE"}
              </span>
            </div>

            {/* Grand District Headline */}
            <div className="mb-2.5 sm:mb-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-headline text-foreground leading-[1.08] tracking-tight">
                {t(district.name)} {locale === "ne" ? "चिनारी" : "Chinari"}
              </h1>
              {typeof district.name === "object" && district.name?.en && (
                <span className="text-base sm:text-lg font-serif italic text-muted-foreground mt-0.5 block">
                  {district.name.en} District
                </span>
              )}
            </div>

            {/* District Description */}
            <p className="text-sm sm:text-[15px] text-foreground font-sans leading-relaxed mb-3.5 sm:mb-4 max-w-xl opacity-90">
              {t(district.description)}
            </p>

            {/* Stats Counter Section (१० मुख्य विधा • ४५+ साझा कथा • ∞ सम्झनाहरू) */}
            <div className="border-t border-black/10 dark:border-white/10 pt-3.5 mb-5 max-w-md select-none">
              <div className="flex items-center gap-7 sm:gap-10">
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-none">
                    {locale === "ne" ? "१०" : "10"}
                  </span>
                  <span className="text-xs sm:text-[13px] text-muted-foreground font-sans font-medium mt-1 leading-none">
                    {locale === "ne" ? "मुख्य विधा" : "Main Categories"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-none">
                    {locale === "ne" ? "४५+" : "45+"}
                  </span>
                  <span className="text-xs sm:text-[13px] text-muted-foreground font-sans font-medium mt-1 leading-none">
                    {locale === "ne" ? "साझा कथा" : "Shared Stories"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-none">
                    ∞
                  </span>
                  <span className="text-xs sm:text-[13px] text-muted-foreground font-sans font-medium mt-1 leading-none">
                    {locale === "ne" ? "सम्झनाहरू" : "Memories"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sleek Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("destinations");
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.set("tab", "destinations");
                    window.history.replaceState(null, "", url.toString());
                  }
                }}
                style={{ backgroundColor: theme.primary }}
                className="group flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 min-w-[170px] text-white text-xs font-bold font-mono tracking-wide hover:opacity-90 transition-opacity"
              >
                <span>
                  {locale === "ne" ? "गन्तव्यहरू खोज्नुहोस्" : "EXPLORE PLACES"}
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setIsContributionModalOpen(true)}
                style={{ color: theme.primary }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 min-w-[150px] border border-black/10 hover:bg-surface transition-colors text-xs font-bold font-mono tracking-wide bg-background/50 backdrop-blur-xs"
              >
                <MessageCircle size={14} className="opacity-90" />
                <span>
                  {locale === "ne" ? "विचार राख्नुहोस्" : "SHARE THOUGHTS"}
                </span>
              </button>
            </div>
          </div>

          {/* Silhouette Map Floating Badge */}
          <div
            className="hidden lg:flex absolute top-6 right-6 z-20 flex-col items-center justify-center p-3.5 rounded-none bg-background/90 backdrop-blur-md border shadow-sm select-none"
            style={{ borderColor: theme.border }}
          >
            <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-xs">
              <path
                d={
                  DISTRICT_REAL_INDIVIDUAL_PATHS[district.slug] ||
                  DISTRICT_REAL_INDIVIDUAL_PATHS.kailali
                }
                fill={theme.primary}
                opacity="0.95"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-[10px] font-mono font-bold text-foreground mt-1">
              {t(district.name)}को नक्सा
            </span>
          </div>
        </div>
      </div>

      {/* ── Broadsheet Navigation Solid Tabs (Themed by District Color) ── */}
      <div className="border-y border-border bg-surface mb-8">
        <div className="container-editorial">
          <nav className="flex items-center gap-1 sm:gap-1 overflow-x-auto no-scrollbar py-1">
            {COMBINED_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (typeof window !== "undefined") {
                      const url = new URL(window.location.href);
                      if (tab.id === "all") {
                        url.searchParams.delete("tab");
                      } else {
                        url.searchParams.set("tab", tab.id);
                      }
                      window.history.replaceState(null, "", url.toString());
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3.5 whitespace-nowrap text-sm font-bold font-sans transition-colors rounded-none my-2",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  )}
                  style={{
                    backgroundColor: isActive ? theme.primary : "transparent",
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── TAB 1: ALL / STORIES VIEW ── */}
      {activeTab === "all" && (
        <div className="container-editorial pb-14">
          {/* ── Key Facts & Cultural Identity Strip (Themed) ── */}
          {stats && (
            <div
              className="mb-8 p-5 sm:p-6 rounded-none border shadow-2xs transition-all"
              style={{
                backgroundColor: isDark ? "var(--surface)" : theme.light,
                borderColor: isDark ? "var(--border)" : theme.border,
              }}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-black/[0.06] mb-4">
                <Sparkles size={16} style={{ color: theme.primary }} />
                <h3 className="text-xs sm:text-sm font-bold font-sans text-foreground">
                  {locale === "ne"
                    ? `${t(district.name)} जिल्ला संक्षिप्त विवरण (Factsheet)`
                    : `${t(district.name)} District Profile`}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs font-sans">
                {/* 1. Area */}
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    क्षेत्रफल (Area)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.area}
                  </strong>
                </div>

                {/* 2. Population */}
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    जनसंख्या (Pop.)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.population}
                  </strong>
                </div>

                {/* 3. Headquarters */}
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    सदरमुकाम (HQ)
                  </span>
                  <strong className="text-foreground text-xs sm:text-sm block mt-0.5 truncate">
                    {t(stats.headquarters)}
                  </strong>
                </div>

                {/* 4. Local Units */}
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    स्थानीय तह (Units)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.palikas.total} तह ({stats.palikas.municipalities}{" "}
                    न.पा. / {stats.palikas.ruralMunicipalities} गाउँ)
                  </strong>
                </div>

                {/* 5. Major Rivers */}
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    प्रमुख नदी (Rivers)
                  </span>
                  <strong className="text-foreground text-xs block mt-0.5 truncate">
                    {t(stats.majorRivers)}
                  </strong>
                </div>

                {/* 6. Literacy */}
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    साक्षरता (Literacy)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.literacy}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <EditorialCard
                key={art.id}
                article={art}
                locale={locale as Locale}
                chrome="accent"
                accentColor={theme.primary}
                aspect="video"
                showBadge={false}
                showExcerpt
                monoTime
                metaBorder={false}
              />
            ))}
          </div>

          <div className="mt-8 lg:mt-14">
            <AdBanner placement="billboard-mid" />
          </div>
          {/* ── REELS / SHORT VIDEOS SECTION ── */}
          <div className="mt-14">
            <FTSectionDivider
              title={locale === "ne" ? "सर्ट भिडिओ / Reels" : "Shorts & Reels"}
              viewAllHref="/shorts"
              viewAllText={
                locale === "ne" ? "सबै भिडिओ हेर्नुहोस्" : "View All Shorts"
              }
            />
            <VideoShorts filterDistrict={district.slug} hideDivider={true} />
          </div>

          {/* ── Photo Feature Grid ("फोटो फिचर") ── */}
          <div className="mt-14">
            <FTSectionDivider
              title={
                locale === "ne"
                  ? `${t(district.name)} मल्टिमिडिया`
                  : `${t(district.name)} Multimedia`
              }
              viewAllHref="/photos"
              viewAllText={
                locale === "ne" ? "सबै फोटोहरू हेर्नुहोस्" : "View All Photos"
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {photoFeatures.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/article/${getArticleSlug(art)}`}
                  className="group block rounded-none overflow-hidden border border-black/[0.08] hover:shadow-md transition-all shadow-2xs"
                  style={{ borderTop: `3px solid ${theme.primary}` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-hover">
                    <Image
                      src={art.featuredImage}
                      alt={t(art.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4 bg-background">
                    <h4 className="text-sm font-bold font-headline text-foreground line-clamp-1 group-hover:text-brand-secondary transition-colors break-words">
                      {idx === 0
                        ? locale === "ne"
                          ? `${t(district.name)} बजार र जनजीवनको एक दृश्य`
                          : `A view of ${t(district.name)} local life`
                        : idx === 1
                          ? locale === "ne"
                            ? `${t(district.name)}को प्राकृतिक सौन्दर्य`
                            : `Natural beauty of ${t(district.name)}`
                          : locale === "ne"
                            ? "स्थानीय कला, संस्कृति र परम्परा"
                            : "Local arts, culture and traditions"}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-sans">
                      <RelativeTime date={art.publishedAt} locale={locale as Locale} />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: DESTINATIONS & NATURE SHOWCASE ── */}
      {activeTab === "destinations" && (
        <div className="container-editorial pb-14 space-y-8">
          {/* Factsheet bar */}
          {stats && (
            <div
              className="p-5 sm:p-6 rounded-none border shadow-2xs transition-all"
              style={{
                backgroundColor: isDark ? "var(--surface)" : theme.light,
                borderColor: isDark ? "var(--border)" : theme.border,
              }}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-black/[0.06] mb-4">
                <Compass size={16} style={{ color: theme.primary }} />
                <h3 className="text-xs sm:text-sm font-bold font-sans text-foreground">
                  {locale === "ne"
                    ? `${t(district.name)} भौगोलिक तथा पर्यटकीय विवरण (Travel Factsheet)`
                    : `${t(district.name)} Travel & Geographic Profile`}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs font-sans">
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    उचाइ (Elevation)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.elevation}
                  </strong>
                </div>
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    सदरमुकाम (HQ)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {t(stats.headquarters)}
                  </strong>
                </div>
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    क्षेत्रफल (Area)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.area}
                  </strong>
                </div>
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    स्थानीय तह (Units)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {stats.palikas.total} तह ({stats.palikas.municipalities}{" "}
                    न.पा. / {stats.palikas.ruralMunicipalities} गाउँ)
                  </strong>
                </div>
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    प्रमुख नदी (Rivers)
                  </span>
                  <strong className="text-foreground text-xs block mt-0.5 truncate">
                    {t(stats.majorRivers)}
                  </strong>
                </div>
                <div className="bg-background/90 backdrop-blur-xs p-3.5 rounded-none border border-black/[0.06] shadow-2xs">
                  <span className="text-muted-foreground block text-[10.5px] font-mono">
                    मौसम स्थिति (Weather)
                  </span>
                  <strong className="text-foreground text-sm block mt-0.5">
                    {DISTRICT_WEATHER[district.slug]?.temp || "२४°C"} •{" "}
                    {t(
                      DISTRICT_WEATHER[district.slug]?.weather || {
                        ne: "शीतल",
                        en: "Pleasant",
                      },
                    )}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Destinations Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[11px] font-bold font-mono"
                  style={{ color: theme.primary }}
                >
                  गन्तव्य सूची
                </span>
                <span className="text-rule">•</span>
                <h2 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
                  {locale === "ne"
                    ? `${t(district.name)}का प्रमुख पर्यटकीय, प्राकृतिक र साँस्कृतिक स्थलहरू`
                    : `Key Attractions & Destinations in ${t(district.name)}`}
                </h2>
              </div>
              <span
                className="text-xs font-mono font-bold px-2.5 py-1 rounded-none"
                style={{ backgroundColor: theme.light, color: theme.primary }}
              >
                {places.length} मुख्य गन्तव्यहरू
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {places.map((place, idx) => (
                <div
                  key={idx}
                  className="bg-background rounded-none border border-black/[0.08] hover:shadow-lg transition-all flex flex-col group overflow-hidden shadow-2xs"
                  style={{ borderTop: `3px solid ${theme.primary}` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-hover">
                    <Image
                      src={
                        normalizeImageUrl(place.image) ||
                        normalizeImageUrl(district.heroImage)
                      }
                      alt={t(place.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs font-bold font-sans px-3 py-1 text-white rounded-none shadow-2xs"
                        style={{ backgroundColor: theme.primary }}
                      >
                        {place.category === "nature"
                          ? "प्राकृतिक • Nature"
                          : place.category === "spiritual"
                            ? "धार्मिक • Shrine"
                            : place.category === "heritage"
                              ? "ऐतिहासिक • Heritage"
                              : "संस्कृति • Culture"}
                      </span>
                    </div>
                    {place.highlight && (
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-mono font-semibold">
                        {place.highlight}
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors mb-2.5">
                        {t(place.title)}
                      </h3>
                      <p className="text-sm text-foreground leading-relaxed font-sans mb-4">
                        {t(place.description)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-sans">
                        <MapPin size={13} style={{ color: theme.primary }} />
                        <span>{t(district.name)} जिल्ला</span>
                      </span>
                      <span
                        className="font-bold flex items-center gap-1"
                        style={{ color: theme.primary }}
                      >
                        <span>
                          {locale === "ne" ? "विस्तृत विवरण" : "Read More"}
                        </span>
                        <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Travel Advisory / Tip box */}
            <div
              className="p-5 sm:p-6 rounded-none border shadow-2xs"
              style={{
                backgroundColor: theme.light,
                borderColor: theme.border,
              }}
            >
              <h4
                className="text-sm font-bold font-sans mb-2 flex items-center gap-2"
                style={{ color: theme.primary }}
              >
                <Compass size={16} />
                <span>
                  {locale === "ne"
                    ? "यात्रा सल्लाह तथा उपयुक्त मौसम (Travel Advisory)"
                    : "Travel Advisory & Best Time"}
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">
                {locale === "ne"
                  ? `${t(district.name)} भ्रमणका लागि शरद ऋतु (असोज-मंसिर) र वसन्त ऋतु (फागुन-वैशाख) सबैभन्दा उपयुक्त मानिन्छ। स्थानीय परिकार, सांस्कृतिक मेला र जैविक विविधताको प्रत्यक्ष अनुभव लिन स्थानीय गाइड तथा पर्यटन सूचना केन्द्रको सहयोग लिनुहोस्।`
                  : `The best time to visit ${t(district.name)} is during autumn (September–November) and spring (February–April). For trekking, alpine sanctuary visits, or cultural fairs, local homestays and community guides offer an authentic regional experience.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: PHOTO FEATURE TAB VIEW ── */}
      {activeTab === "photos" && (
        <div className="container-editorial pb-14">
          <FTSectionDivider
            title={locale === "ne" ? "फोटो फिचर" : "Photo Features"}
            className="!mt-0 mb-6"
            rightNode={
              <Link
                href="/photos"
                className="bg-brand text-white text-[11px] font-bold px-3 py-1.5 hover:bg-brand-dark transition-colors flex items-center gap-1.5 group"
              >
                <span>{locale === "ne" ? "सबै हेर्नुहोस्" : "View All"}</span>
                <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photoFeatures.map((art) => (
              <div
                key={art.id}
                className="bg-background rounded-none border border-border overflow-hidden shadow-2xs h-full flex flex-col"
                style={{ borderTop: `3px solid ${theme.primary}` }}
              >
                <div className="relative aspect-[16/10] shrink-0">
                  <Image
                    src={art.featuredImage}
                    alt={t(art.title)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold font-headline text-foreground text-base mb-2">
                    {t(art.title)}
                  </h4>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {locale === "ne" ? "प्रस्तुति:" : "By"}{" "}
                        <span className="text-foreground">
                          {t(art.author.name)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer">
                        <ThumbsUp
                          size={14}
                          className="group-hover:text-brand transition-colors"
                        />
                        <span>{art.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer">
                        <ThumbsDown
                          size={14}
                          className="group-hover:text-brand-secondary transition-colors"
                        />
                        <span>0</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <VideoShorts
              filterDistrict={district.slug}
              hideDivider={false}
              title={{ ne: "सर्ट भिडिओ / Reels", en: "Shorts & Reels" }}
            />
          </div>
        </div>
      )}

      {/* ── TAB 5: ARCHIVES & VOICES ── */}
      {isArchiveTab && (
        <DistrictArchives
          district={district}
          activeCategory={activeTab === "archives" ? "archives-all" : activeTab}
        />
      )}

      {/* ── Broadsheet Quick Switcher: Explore Other Districts ── */}
      <div className="border-t border-border bg-surface py-10">
        <div className="container-editorial">
          <FTSectionDivider
            title={
              locale === "ne"
                ? "सुदूरपश्चिमका अन्य ८ जिल्लाहरू"
                : "Other 8 Districts of Far-West"
            }
            viewAllHref="/district"
            viewAllText={locale === "ne" ? "सबै ९ जिल्लाहरू" : "All Districts"}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {otherDistricts.map((od) => {
              const odTheme = od.theme || { primary: od.accentColor };
              return (
                <Link
                  key={od.slug}
                  href={`/district/${od.slug}`}
                  className="group bg-background hover:bg-surface border border-border rounded-none p-3 text-center transition-all flex flex-col items-center justify-between shadow-2xs"
                  style={{ borderTop: `3px solid ${odTheme.primary}` }}
                >
                  <span className="text-sm font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors truncate w-full">
                    {t(od.name)}
                  </span>
                  {typeof od.name === "object" && od.name?.en && (
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate w-full">
                      {od.name.en}
                    </span>
                  )}
                  <span
                    className="text-[9.5px] font-bold px-2 py-0.5 mt-1.5 rounded-none bg-surface border border-border inline-flex items-center gap-1"
                    style={{
                      color: odTheme.primary,
                    }}
                  >
                    <span>विवरण</span>
                    <ArrowRight size={10} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── User Contribution Modal ── */}
      <UserContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        districtName={district.name}
        themePrimary={theme.primary}
      />
    </div>
  );
}
