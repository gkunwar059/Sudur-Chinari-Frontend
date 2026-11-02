"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, MessageCircle, X } from "lucide-react";
import type { Locale } from "@/types";
import FTSectionDivider from "../common/FTSectionDivider";
import RelativeTime from "@/components/common/RelativeTime";

interface CommunityStoryCardProps {
  story: any;
  themePrimary: string;
  locale: string;
  onSelect: (story: any) => void;
}

export function CommunityStoryCard({
  story,
  themePrimary,
  locale,
  onSelect,
}: CommunityStoryCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = Boolean(story.media_file && !imgFailed);

  return (
    <div
      onClick={() => onSelect(story)}
      className="bg-background rounded-none border border-border overflow-hidden shadow-2xs flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
      style={{ borderTop: `3px solid ${themePrimary}` }}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-hover border-b border-border/40 shrink-0">
        {hasImage ? (
          <img
            src={story.media_file}
            alt={story.title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface relative flex flex-col items-center justify-center p-6 select-none overflow-hidden">
            {/* Subtle broadsheet background watermark */}
            <div className="absolute -right-4 -bottom-4 text-7xl font-headline font-black opacity-[0.04] pointer-events-none select-none text-foreground uppercase tracking-tighter">
              {story.main_category || "STORY"}
            </div>

            {/* Refined editorial seal */}
            <div className="relative z-10 flex flex-col items-center text-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center bg-background border border-border shadow-2xs group-hover:scale-110 transition-transform duration-300"
                style={{ color: themePrimary }}
              >
                <BookOpen size={18} />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                {locale === "ne" ? "नागरिक अभिलेख" : "Citizen Archive"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none text-white font-mono"
              style={{ backgroundColor: themePrimary }}
            >
              {story.main_category}
            </span>
            {story.sub_topic && (
              <span className="text-xs text-muted-foreground font-mono truncate">
                #{story.sub_topic}
              </span>
            )}
          </div>
          <h4 className="text-base font-bold font-headline text-foreground leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">
            {story.title}
          </h4>
          <p className="text-xs sm:text-sm text-foreground/80 font-sans line-clamp-3 leading-relaxed mb-4">
            {story.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-sans">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <CheckCircle2 size={13} className="text-brand shrink-0" />
            <span className="truncate max-w-[140px]">{story.author_name}</span>
          </span>
          <RelativeTime date={story.created_at} locale={locale as Locale} />
        </div>
      </div>
    </div>
  );
}

interface DistrictCommunityStoriesProps {
  stories: any[];
  districtName: string;
  themePrimary: string;
  locale: string;
  onOpenContributionModal: () => void;
}

export default function DistrictCommunityStories({
  stories,
  districtName,
  themePrimary,
  locale,
  onOpenContributionModal,
}: DistrictCommunityStoriesProps) {
  const [selectedStory, setSelectedStory] = useState<any | null>(null);

  if (!stories || stories.length === 0) return null;

  return (
    <div className="mt-14">
      <FTSectionDivider
        title={
          locale === "ne"
            ? `${districtName}: समुदायका कथा तथा अभिलेख`
            : `${districtName}: Community Voices & Stories`
        }
        rightNode={
          <button
            type="button"
            onClick={onOpenContributionModal}
            className="text-xs font-bold font-sans px-3 py-1.5 text-white flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-2xs"
            style={{ backgroundColor: themePrimary }}
          >
            <MessageCircle size={13} />
            <span>{locale === "ne" ? "विचार राख्नुहोस्" : "Share Your Story"}</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story: any) => (
          <CommunityStoryCard
            key={story.id}
            story={story}
            themePrimary={themePrimary}
            locale={locale}
            onSelect={(s) => setSelectedStory(s)}
          />
        ))}
      </div>

      {/* Community Story Reader Modal */}
      {selectedStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-background border border-border max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
            style={{ borderTop: `4px solid ${themePrimary}` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between gap-4 bg-surface/50">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 text-white font-mono"
                  style={{ backgroundColor: themePrimary }}
                >
                  {selectedStory.main_category}
                </span>
                {selectedStory.sub_topic && (
                  <span className="text-xs text-muted-foreground font-mono">
                    #{selectedStory.sub_topic}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1">
              {selectedStory.media_file && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-hover mb-5 border border-border">
                  <img
                    src={selectedStory.media_file}
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-bold font-headline text-foreground leading-snug mb-4">
                {selectedStory.title}
              </h2>

              <div className="flex items-center justify-between text-xs text-muted-foreground font-sans pb-4 mb-5 border-b border-border">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <CheckCircle2 size={14} className="text-brand shrink-0" />
                  <span>{selectedStory.author_name}</span>
                </span>
                <RelativeTime date={selectedStory.created_at} locale={locale as Locale} />
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none font-sans text-foreground/90 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {selectedStory.description}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface/50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer font-sans"
              >
                {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
