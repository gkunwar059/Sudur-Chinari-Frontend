"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from "lucide-react";
import type { District, BilingualText } from "@/types";
import { DISTRICT_REAL_INDIVIDUAL_PATHS } from "@/data/districtMaps";
import { cn, normalizeImageUrl, t as translate } from "@/lib/utils";

interface DistrictHeroBannerProps {
  district: District;
  theme: {
    primary: string;
    light: string;
    border: string;
  };
  locale: string;
  isDark: boolean;
  onExploreDestinations: () => void;
  onOpenContributionModal: () => void;
}

export default function DistrictHeroBanner({
  district,
  theme,
  locale,
  isDark,
  onExploreDestinations,
  onOpenContributionModal,
}: DistrictHeroBannerProps) {
  const t = (val: any) => translate(val, locale as "ne" | "en");

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

  return (
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
                className="p-1 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white cursor-pointer"
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
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
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
                className="p-1 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white/90 hover:text-white cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Reading Contrast Shield */}
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

          {/* Stats Counter Section */}
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreDestinations}
              style={{ backgroundColor: theme.primary }}
              className="group flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 min-w-[170px] text-white text-xs font-bold font-mono tracking-wide hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>
                {locale === "ne" ? "गन्तव्यहरू खोज्नुहोस्" : "EXPLORE PLACES"}
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onOpenContributionModal}
              style={{ color: theme.primary }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 min-w-[150px] border border-black/10 dark:border-white/10 hover:bg-surface transition-colors text-xs font-bold font-mono tracking-wide bg-background/50 backdrop-blur-xs cursor-pointer"
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
  );
}
