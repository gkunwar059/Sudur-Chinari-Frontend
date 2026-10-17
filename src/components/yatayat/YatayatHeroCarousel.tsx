"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export interface YatayatHeroSlide {
  src: string;
  alt: string;
  caption: string;
}

interface YatayatHeroCarouselProps {
  slides: YatayatHeroSlide[];
  locale: Locale;
}

export default function YatayatHeroCarousel({ slides, locale }: YatayatHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isNe = locale === "ne";

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <div
      aria-roledescription="carousel"
      aria-label={isNe ? "यातायात तस्बिरहरू" : "Transport highlights"}
      className="relative w-full min-h-[280px] lg:min-h-[340px] h-full rounded-none overflow-hidden border border-border border-t-[3px] border-t-brand shadow-xs group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.src}
          aria-hidden={slideIndex !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            preload={slideIndex === 0}
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label={isNe ? "अघिल्लो तस्बिर" : "Previous slide"}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/45 hover:bg-black/70 text-white transition-colors cursor-pointer"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label={isNe ? "अर्को तस्बिर" : "Next slide"}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black/45 hover:bg-black/70 text-white transition-colors cursor-pointer"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>

      <div className="absolute bottom-4 left-3 z-10 flex items-center gap-1.5">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(slideIndex)}
            aria-label={isNe ? `तस्बिर ${slideIndex + 1}` : `Slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={`w-2.5 h-2.5 rounded-none transition-colors cursor-pointer border border-white/60 ${
              slideIndex === index ? "bg-white" : "bg-white/35 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-3 right-3 z-10 text-right pointer-events-none">
        <span className="inline-block px-3.5 py-2 rounded-none bg-black/75 border border-white/20 text-white font-headline font-bold text-sm sm:text-base shadow-md">
          {slides[index].caption}
        </span>
      </div>
    </div>
  );
}
