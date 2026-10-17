"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import type { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import FTCategoryBadge from "@/components/common/FTCategoryBadge";
import { getArticleSlug, cn } from "@/lib/utils";
import UserContributionModal from "@/components/district/UserContributionModal";

interface FTLeadHeroProps {
  leadStory: Article;
  exclusiveStory: Article;
  quickStory: Article;
  photoStory: Article;
  editorPick: Article;
  bigReadStory: Article;
}

export default function FTLeadHero({
  leadStory,
  exclusiveStory,
  quickStory,
  photoStory,
  editorPick,
  bigReadStory,
}: FTLeadHeroProps) {
  const { t, locale } = useLanguage();
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  const provinceFeatures = [
    {
      id: "province-1",
      title:
        locale === "ne"
          ? "हाम्रो कथा,\nहाम्रो पहिचान।"
          : "Our Story,\nOur Identity.",
      excerpt:
        locale === "ne"
          ? "अछामका इतिहास, कला, संस्कृति र लोकजीवनका कथा, सम्झना र सीपहरूलाई एउटै खुला संग्रहमा जोड्दैछौं। तपाईको कथा पनि यहाँ जोड्नुहोस्।"
          : "We are connecting the history, art, culture, and folk stories of Achham into a single open collection. Add your story here too.",
      featuredImage: leadStory.featuredImage,
      link: "/district",
      category: {
        id: 1,
        name: locale === "ne" ? "परिचय" : "Intro",
        slug: "intro",
        color: "var(--brand)",
      },
      buttons: [
        {
          label: locale === "ne" ? "कथा खोज्नुहोस्" : "Find Stories",
          href: "/district",
          primary: true,
          icon: true,
        },
        {
          label: locale === "ne" ? "आफ्नो कथा राख्नुहोस्" : "Share Your Story",
          onClick: () => setIsContributionModalOpen(true),
          primary: false,
        },
      ],
      stats: [
        {
          value: locale === "ne" ? "१०" : "10",
          label: locale === "ne" ? "मुख्य विधा" : "Main Categories",
        },
        {
          value: locale === "ne" ? "४५+" : "45+",
          label: locale === "ne" ? "साझा कथा" : "Shared Stories",
        },
        { value: "∞", label: locale === "ne" ? "सम्झनाहरू" : "Memories" },
      ],
    },
    {
      id: "province-2",
      title:
        locale === "ne"
          ? "बडिमालिकाको आध्यात्मिक यात्रा"
          : "Spiritual Journey to Badimalika",
      excerpt:
        locale === "ne"
          ? "अद्भुत हिमाली फाँटहरूका बीच अवस्थित सबैभन्दा पूज्य हिन्दू मन्दिरहरूको पवित्र तीर्थयात्रा गर्नुहोस्।"
          : "Embark on a sacred pilgrimage to one of the most revered Hindu temples set amidst breathtaking alpine meadows.",
      featuredImage: photoStory?.featuredImage || leadStory.featuredImage,
      link: "/district",
      category: {
        id: 2,
        name: locale === "ne" ? "तीर्थयात्रा" : "Pilgrimage",
        slug: "pilgrimage",
        color: "var(--brand-secondary)",
      },
      buttons: [
        {
          label: locale === "ne" ? "कथा खोज्नुहोस्" : "Find Stories",
          href: "/district",
          primary: true,
          icon: true,
        },
        {
          label: locale === "ne" ? "आफ्नो कथा राख्नुहोस्" : "Share Your Story",
          onClick: () => setIsContributionModalOpen(true),
          primary: false,
        },
      ],
    },
    {
      id: "province-3",
      title:
        locale === "ne"
          ? "शुक्लाफाँटा राष्ट्रिय निकुञ्ज"
          : "Untamed Shuklaphanta",
      excerpt:
        locale === "ne"
          ? "वन्यजन्तु सफारीको रोमाञ्चकता अनुभव गर्नुहोस् र एसियाकै सबैभन्दा ठूलो बाह्रसिंगेको बथान हेर्नुहोस्।"
          : "Experience the thrill of wildlife safaris and spot the largest herd of swamp deer in Asia.",
      featuredImage: bigReadStory?.featuredImage || leadStory.featuredImage,
      link: "/district",
      category: {
        id: 3,
        name: locale === "ne" ? "वन्यजन्तु" : "Wildlife",
        slug: "wildlife",
        color: "var(--accent)",
      },
      buttons: [
        {
          label: locale === "ne" ? "कथा खोज्नुहोस्" : "Find Stories",
          href: "/district",
          primary: true,
          icon: true,
        },
        {
          label: locale === "ne" ? "आफ्नो कथा राख्नुहोस्" : "Share Your Story",
          onClick: () => setIsContributionModalOpen(true),
          primary: false,
        },
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || provinceFeatures.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % provinceFeatures.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, provinceFeatures.length]);

  const handlePrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + provinceFeatures.length) % provinceFeatures.length,
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % provinceFeatures.length);
  };

  // Combine stories for the marquee
  const marqueeStories = [quickStory, exclusiveStory, bigReadStory];
  // Duplicate for smooth infinite scroll
  const scrollItems = [
    ...marqueeStories,
    ...marqueeStories,
    ...marqueeStories,
    ...marqueeStories,
  ];

  return (
    <section className="pt-2 pb-6">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scroll 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── 3-Column Asymmetrical Broadsheet Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-8">
        {/* ── 1. LEFT & MIDDLE: Hero Banner (9 cols) ── */}
        <div
          className="lg:col-span-9 min-w-0 flex flex-col h-[450px] sm:h-[500px] lg:h-[550px] relative group overflow-hidden border border-border shadow-sm bg-black"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {provinceFeatures.map((feature, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={`${feature.id}-${index}`}
                className={cn(
                  "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
                  isActive
                    ? "opacity-100 scale-100 z-10 pointer-events-auto"
                    : "opacity-0 scale-105 z-0 pointer-events-none",
                )}
              >
                <Link href={feature.link} className="absolute inset-0 z-0">
                  <Image
                    src={feature.featuredImage}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    quality={70}
                    preload={index === 0}
                  />
                  {/* Gradient Overlay for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/65 via-brand/40 dark:from-background/95 dark:via-background/70 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand/60 via-transparent dark:from-background/70 to-transparent pointer-events-none sm:block hidden" />
                </Link>

                <div className="relative z-10 p-5 sm:p-6 lg:p-8 flex flex-col justify-end h-full w-full sm:w-[90%] lg:w-[80%] pointer-events-none">
                  <div className="mb-2 sm:mb-3 pointer-events-auto">
                    <FTCategoryBadge
                      category={feature.category as any}
                      size="sm"
                      className="!bg-white/20 !border-white/30 !text-white hover:!bg-white hover:!text-brand"
                    />
                  </div>

                  <Link
                    href={feature.link}
                    className="block pointer-events-auto"
                  >
                    {index === 0 ? (
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-white hover:text-gray-200 transition-colors leading-[1.15] mb-2 sm:mb-3 drop-shadow-md break-words whitespace-pre-line">
                        {feature.title}
                      </h1>
                    ) : (
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline text-white hover:text-gray-200 transition-colors leading-[1.15] mb-2 sm:mb-3 drop-shadow-md break-words whitespace-pre-line">
                        {feature.title}
                      </h2>
                    )}
                    <p className="text-[13px] sm:text-sm text-white/90 leading-snug font-sans line-clamp-3 sm:line-clamp-4 mb-1.5 drop-shadow break-words max-w-2xl">
                      {feature.excerpt}
                    </p>
                  </Link>

                  {/* Optional Buttons */}
                  {(feature as any).buttons && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pointer-events-auto">
                      {(feature as any).buttons.map((btn: any, i: number) => {
                        const btnClass = cn(
                          "inline-flex items-center justify-center rounded-none px-4 py-1.5 sm:px-5 sm:py-2 font-sans font-semibold text-[13px] sm:text-[14px] transition-all group",
                          btn.primary
                            ? "bg-surface text-foreground hover:bg-card shadow-md"
                            : "bg-transparent border border-white/40 text-white hover:bg-white/10 cursor-pointer",
                        );

                        if (btn.onClick) {
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={btn.onClick}
                              className={btnClass}
                            >
                              {btn.label}
                              {btn.icon && (
                                <ArrowRight size={14} className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                              )}
                            </button>
                          );
                        }

                        return (
                          <Link key={i} href={btn.href} className={btnClass}>
                            {btn.label}
                            {btn.icon && (
                              <ArrowRight size={14} className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Optional Stats */}
                  {(feature as any).stats && (
                    <div className="mt-4 sm:mt-5 pt-4 border-t border-white/20 flex items-center gap-6 sm:gap-10 pointer-events-auto w-full max-w-2xl">
                      {(feature as any).stats.map((stat: any, i: number) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-xl sm:text-2xl font-bold font-headline text-white leading-none mb-1">
                            {stat.value}
                          </span>
                          <span className="text-[11px] sm:text-xs font-sans text-white/70 font-semibold tracking-wide">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Slider Controls */}
          {provinceFeatures.length > 1 && (
            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 px-2 py-1 rounded-none text-white pointer-events-auto shadow-xl">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label={locale === "ne" ? "अघिल्लो" : "Previous"}
                className="p-1 rounded-none hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-1.5 px-1">
                {provinceFeatures.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={cn(
                      "h-1.5 rounded-none transition-all duration-300",
                      idx === currentSlide
                        ? "w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        : "w-1.5 bg-white/40 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label={locale === "ne" ? "पछिल्लो" : "Next"}
                className="p-1 rounded-none hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* ── 2. RIGHT COLUMN: Advertisement (3 cols) ── */}
        <aside className="lg:col-span-3 min-w-0 flex flex-col h-full">
          <div className="w-full h-[300px] lg:h-full bg-surface/40 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground p-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-2">
              Advertisement
            </span>
            <span className="text-sm font-sans text-center">
              Ad Space
              <br />
              (e.g., 300x600)
            </span>
          </div>
        </aside>
      </div>
      {/* ── Bottom Auto-Scrolling Horizontal Articles ── */}
      <div className="border-y border-border bg-surface py-3 overflow-hidden relative flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center">
          {scrollItems.map((story, index) => (
            <div
              key={`${getArticleSlug(story)}-${index}`}
              className="flex items-center px-6 border-r border-border/60 last:border-none shrink-0 group"
            >
              <Link
                href={`/article/${getArticleSlug(story)}`}
                className="flex items-center"
              >
                <div className="relative w-12 h-12 shrink-0 mr-4 overflow-hidden border border-border">
                  <Image
                    src={story.featuredImage}
                    alt={t(story.title)}
                    fill
                    sizes="48px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-[15px] font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-[1.4] whitespace-nowrap">
                  {t(story.title)}
                </h4>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <UserContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        districtName={{ ne: "सुदूरपश्चिम", en: "Sudurpashchim" } as any}
        themePrimary="var(--brand)"
        showDistrictSelect={true}
      />
    </section>
  );
}
