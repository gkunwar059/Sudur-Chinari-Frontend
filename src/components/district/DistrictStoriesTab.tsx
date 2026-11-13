"use client";

import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { ArrowRight } from "lucide-react";
import type { District, Article, Locale } from "@/types";
import { getArticleSlug, t as translate } from "@/lib/utils";
import EditorialCard from "@/components/common/EditorialCard";
import FTEmptyState from "@/components/common/FTEmptyState";
import FTSectionDivider from "../common/FTSectionDivider";
import RelativeTime from "@/components/common/RelativeTime";
import VideoShorts from "@/components/home/VideoShorts";
import AdBanner from "../common/AdBanner";
import DistrictFactsheet from "./DistrictFactsheet";
import DistrictCommunityStories from "./DistrictCommunityStories";

interface DistrictStoriesTabProps {
  district: District;
  articles: Article[];
  communityStories: any[];
  totalStories: number;
  storiesHref?: string;
  theme: {
    primary: string;
    light: string;
    border: string;
  };
  locale: string;
  isEn: boolean;
  isDark: boolean;
  onOpenContributionModal: () => void;
}

export default function DistrictStoriesTab({
  district,
  articles,
  communityStories,
  totalStories,
  storiesHref,
  theme,
  locale,
  isEn,
  isDark,
  onOpenContributionModal,
}: DistrictStoriesTabProps) {
  const t = (val: any) => translate(val, locale as "ne" | "en");
  const stats = district.stats;
  const photoFeatures = articles.slice(0, 3);

  return (
    <div className="container-editorial pb-14">
      {/* Key Facts & Cultural Identity Strip */}
      {stats && (
        <div className="mb-8">
          <DistrictFactsheet
            stats={stats}
            districtSlug={district.slug}
            districtName={district.name}
            theme={theme}
            locale={locale}
            isDark={isDark}
            variant="general"
          />
        </div>
      )}

      {/* Stories Section Header */}
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            className="mb-1 block text-[11px] font-bold font-mono uppercase tracking-wider"
            style={{ color: theme.primary }}
          >
            {isEn ? "Latest Reports" : "ताजा रिपोर्ट"}
          </span>
          <h2 className="text-xl font-bold font-headline text-foreground sm:text-2xl">
            {isEn
              ? `Stories from ${t(district.name)}`
              : `${t(district.name)}का कथा`}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {isEn
              ? `${totalStories} stories`
              : `${totalStories} कथा`}
          </span>
          {storiesHref && (
            <Link
              href={storiesHref}
              className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-[11px] font-bold text-foreground transition-colors hover:border-foreground/30 hover:bg-surface"
            >
              <span>
                {isEn ? "View all stories" : "सबै कथा हेर्नुहोस्"}
              </span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Articles Grid or Empty State */}
      {articles.length === 0 ? (
        <FTEmptyState
          title={
            locale === "ne"
              ? `${t(district.name)} सम्बन्धी कुनै समाचार फेला परेन`
              : `No News Stories Available for ${t(district.name)}`
          }
          description={
            locale === "ne"
              ? "यस जिल्लाका लागि हाल कुनै समाचार वा रिपोर्टहरू प्रकाशित भएका छैनन्। हाम्रो डेस्कले चाँडै नयाँ विवरणहरू अद्यावधिक गर्नेछ।"
              : `No dispatches or news reports have been published for ${t(district.name)} yet. Check back soon for local dispatches.`
          }
          kicker={locale === "ne" ? `${t(district.name)} कभरेज` : `${t(district.name)} COVERAGE`}
          accentColor={theme.primary}
        />
      ) : (
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
              className="scroll-reveal-card"
            />
          ))}
        </div>
      )}

      {/* Community Verified Stories & Regional Lore */}
      <DistrictCommunityStories
        stories={communityStories}
        districtName={t(district.name)}
        themePrimary={theme.primary}
        locale={locale}
        onOpenContributionModal={onOpenContributionModal}
      />

      {/* Billboard Mid Ad */}
      <div className="mt-8 lg:mt-14">
        <AdBanner placement="billboard-mid" page="district" />
      </div>

      {/* Reels / Short Videos */}
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

      {/* Photo Feature Teaser Grid */}
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
              className="group scroll-reveal-card block rounded-none overflow-hidden border border-black/[0.08] dark:border-white/[0.08] hover:shadow-md transition-all shadow-2xs"
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
                <p className="text-xs text-muted-foreground mt-1 font-sans">
                  <RelativeTime date={art.publishedAt} locale={locale as Locale} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
