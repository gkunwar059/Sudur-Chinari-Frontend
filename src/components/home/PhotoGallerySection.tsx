"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, ChevronRight, ChevronLeft, MapPin, ArrowRight } from "lucide-react";
import FTEmptyState from "@/components/common/FTEmptyState";
import { useLanguage } from "@/context/LanguageContext";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import { normalizeImageUrl } from "@/lib/utils";

import { useScrollRail } from "@/hooks/useScrollRail";

import type { PhotoStory } from "@/types";

interface PhotoGallerySectionProps {
  photoStories?: PhotoStory[];
}

export default function PhotoGallerySection({ photoStories }: PhotoGallerySectionProps = {}) {
  const { locale, t } = useLanguage();
  const { ref: scrollRef, scroll } = useScrollRail(380);
  const stories = photoStories || [];

  return (
    <section className="mb-12">
      {/* ── Signature FT Section Divider ── */}
      <FTSectionDivider
        title={
          locale === "ne"
            ? "फोटो फिचर तथा दृश्यहरू"
            : "In Pictures & Photo Essays"
        }
        enTitle="Visual Stories & Essays"
        rightNode={
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/photos"
              className="text-[11px] font-sans font-bold text-brand-secondary hover:underline transition-colors mr-1 sm:mr-2 flex items-center gap-1 shrink-0 group"
            >
              <span>
                {locale === "ne" ? "सबै फोटोहरू" : "View All Galleries"}
              </span>
              <ArrowRight size={12} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous photos"
              className="w-8 h-8 min-w-[32px] min-h-[32px] border border-border bg-background flex items-center justify-center hover:bg-surface hover:border-brand-secondary transition-colors text-foreground cursor-pointer rounded-none shadow-2xs shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next photos"
              className="w-8 h-8 min-w-[32px] min-h-[32px] border border-border bg-background flex items-center justify-center hover:bg-surface hover:border-brand-secondary transition-colors text-foreground cursor-pointer rounded-none shadow-2xs shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        }
      />

      {/* Horizontal Slider Track */}
      {stories.length === 0 ? (
        <FTEmptyState
          title={
            locale === "ne"
              ? "हाल कुनै फोटो फिचर उपलब्ध छैन"
              : "No Photo Essays Available"
          }
          description={
            locale === "ne"
              ? "सुदूरपश्चिमका प्राकृतिक तथा सांस्कृतिक सौन्दर्य समेटिएका नयाँ फोटो कथाहरू चाँडै यहाँ प्रस्तुत गरिनेछ।"
              : "Scenic visual stories and photo dispatches from Sudurpaschim will be published here soon."
          }
          kicker={locale === "ne" ? "फोटो ग्यालरी" : "PHOTO ESSAYS"}
          icon={<Camera size={22} className="text-brand-secondary" />}
          accentColor="var(--color-brand-secondary)"
          actionText={locale === "ne" ? "सबै फोटोहरू हेर्नुहोस्" : "Browse All Galleries"}
          actionHref="/photos"
        />
      ) : (
        <div className="relative w-full max-w-full overflow-hidden min-w-0">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x snap-mandatory"
          >
          {stories.map((story) => (
            <Link
              key={story.id}
              href="/photos"
              className="group scroll-reveal-card shrink-0 w-[260px] sm:w-[320px] md:w-[350px] snap-start block"
            >
              {/* 16:10 Photo Frame with Broadsheet Borders */}
              <div className="relative aspect-[16/10] bg-surface border border-border overflow-hidden mb-3">
                <Image
                  src={normalizeImageUrl(story.coverImage)}
                  alt={t(story.title)}
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-500"
                  sizes="(max-width: 640px) 280px, 350px"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />

                {/* District Tag */}
                {story.district && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-surface/90 text-white text-[10.5px] font-medium px-2 py-0.5 font-mono">
                    <MapPin size={10} className="text-brand-secondary" />
                    <span>
                      {typeof story.district === "object" && story.district !== null
                        ? t(story.district.name)
                        : story.district}
                    </span>
                  </div>
                )}

                {/* Photo Count Tag */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-brand-secondary text-white text-[10px] font-bold px-2 py-0.5 font-mono">
                  <Camera size={11} />
                  <span>
                    {story.imageCount}{" "}
                    {locale === "ne" ? "तस्बिरहरू" : "photos"}
                  </span>
                </div>
              </div>

              {/* Title & Description in FT Newspaper Typography */}
              <h3 className="text-base sm:text-[17px] font-black font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-snug line-clamp-2 mb-1.5">
                {t(story.title)}
              </h3>

              <p className="text-xs sm:text-[12.5px] text-muted-foreground line-clamp-2 leading-relaxed font-sans mb-1.5">
                {t(story.description)}
              </p>

              <div className="text-[10.5px] text-muted-foreground font-mono">
                तस्बिर संकलन • सुदूर चिनारी स्टुडियो
              </div>
            </Link>
          ))}
        </div>
      </div>
      )}
    </section>
  );
}
