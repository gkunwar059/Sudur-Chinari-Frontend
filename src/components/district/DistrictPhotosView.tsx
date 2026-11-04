"use client";

import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Article, Locale } from "@/types";
import { t as translate } from "@/lib/utils";
import FTSectionDivider from "../common/FTSectionDivider";
import VideoShorts from "@/components/home/VideoShorts";

interface DistrictPhotosViewProps {
  districtSlug: string;
  articles: Article[];
  themePrimary: string;
  locale: string;
}

export default function DistrictPhotosView({
  districtSlug,
  articles,
  themePrimary,
  locale,
}: DistrictPhotosViewProps) {
  const t = (val: any) => translate(val, locale as "ne" | "en");
  const photoFeatures = articles.slice(0, 6);

  return (
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
            style={{ borderTop: `3px solid ${themePrimary}` }}
          >
            <div className="relative aspect-[16/10] shrink-0 bg-surface-hover">
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
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {locale === "ne" ? "प्रस्तुति:" : "By"}{" "}
                    <span className="text-foreground">
                      {art.author?.name ? t(art.author.name) : ""}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                  >
                    <ThumbsUp
                      size={14}
                      className="group-hover:text-brand transition-colors"
                    />
                    <span>{art.likes || 0}</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
                  >
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
          filterDistrict={districtSlug}
          hideDivider={false}
          title={{ ne: "सर्ट भिडिओ / Reels", en: "Shorts & Reels" }}
        />
      </div>
    </div>
  );
}
