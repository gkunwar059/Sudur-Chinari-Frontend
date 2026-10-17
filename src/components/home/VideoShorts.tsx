"use client";

import { useState, useEffect } from "react";
import { useScrollRail } from "@/hooks/useScrollRail";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Heart,
  Check,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { VIDEOS } from "@/data/articles";
import type { VideoItem } from "@/types";
import { formatViews } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import RelativeTime from "@/components/common/RelativeTime";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface VideoShortsProps {
  filterDistrict?: string;
  title?: { ne: string; en: string };
  hideDivider?: boolean;
}

export default function VideoShorts({
  filterDistrict,
  title,
  hideDivider,
}: VideoShortsProps = {}) {
  const { t, locale } = useLanguage();
  const {
    ref: scrollRef,
    scroll,
    progress: scrollProgress,
    onScroll: updateScrollProgress,
  } = useScrollRail(280);
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Broadsheet local district dictionary
  const districtLabels: Record<string, { ne: string; en: string }> = {
    darchula: { ne: "दार्चुला", en: "Darchula" },
    achham: { ne: "अछाम", en: "Achham" },
    dadeldhura: { ne: "डडेल्धुरा", en: "Dadeldhura" },
    kailali: { ne: "कैलाली", en: "Kailali" },
    bajura: { ne: "बाजुरा", en: "Bajura" },
    doti: { ne: "डोटी", en: "Doti" },
    kanchanpur: { ne: "कञ्चनपुर", en: "Kanchanpur" },
    baitadi: { ne: "बैतडी", en: "Baitadi" },
    bajhang: { ne: "बझाङ", en: "Bajhang" },
  };

  // Video-specific kickers
  const videoKickers: Record<string, { ne: string; en: string }> = {
    v1: { ne: "अपि हिमाल • स्थलगत रिपोर्ट", en: "API HIMAL • FIELD DISPATCH" },
    v2: { ne: "सांस्कृतिक सम्पदा • बैजनाथ", en: "HERITAGE • BAIDYANATH" },
    v3: { ne: "उग्रतारा मन्दिर • इतिहास", en: "UGRATARA • SACRED SITES" },
    v4: { ne: "कर्णाली पुल • पूर्वाधार", en: "INFRASTRUCTURE • KARNALI" },
    v5: { ne: "बाजुरा • हिमाली सूर्यास्त", en: "PANORAMA • BAJURA SUNSET" },
    v6: { ne: "खप्तड पाटन • जैविक विविधता", en: "SANCTUARY • KHAPTAD" },
    v7: { ne: "दोधारा चाँदनी • सिमाना", en: "BORDERLANDS • DODHARA" },
    v8: { ne: "घोडाघोडी ताल • रामसार", en: "RAMSAR • WETLAND ECOLOGY" },
  };

  const filteredVideos = filterDistrict
    ? VIDEOS.filter((v) => v.district === filterDistrict)
    : VIDEOS;
  const displayVideos = filteredVideos.length > 0 ? filteredVideos : VIDEOS;

  // Modal navigation
  const openModal = (video: VideoItem) => {
    setActiveModalVideo(video);
    setIsPlaying(true);
  };

  const closeModal = () => {
    setActiveModalVideo(null);
  };

  const navigateModal = (direction: "next" | "prev") => {
    if (!activeModalVideo) return;
    const currentIndex = VIDEOS.findIndex((v) => v.id === activeModalVideo.id);
    if (currentIndex === -1) return;

    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % VIDEOS.length;
      setActiveModalVideo(VIDEOS[nextIndex]);
    } else {
      const prevIndex = (currentIndex - 1 + VIDEOS.length) % VIDEOS.length;
      setActiveModalVideo(VIDEOS[prevIndex]);
    }
    setIsPlaying(true);
  };

  // Handle Like
  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle Share
  const handleShare = async (id: string) => {
    if (typeof window === "undefined") return;
    try {
      const url = `${window.location.origin}/videos/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") navigateModal("next");
      if (e.key === "ArrowLeft") navigateModal("prev");
    };
    if (activeModalVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeModalVideo]);

  return (
    <section className="mb-14">
      {!hideDivider && (
        <FTSectionDivider
          title={
            title
              ? locale === "ne"
                ? title.ne
                : title.en
              : locale === "ne"
                ? "दृष्य संवाद तथा भिडियो"
                : "Video & Visual Dispatches"
          }
          enTitle={title ? undefined : "Visual Journalism & Reels"}
          rightNode={
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/videos"
                className="text-[11px] font-sans font-bold text-brand-secondary hover:underline transition-colors mr-1 sm:mr-2 flex items-center gap-1 shrink-0 group"
              >
                <span>
                  {locale === "ne" ? "सबै भिडियोहरू" : "Watch All Dispatches"}
                </span>
                <ArrowRight size={12} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous videos"
                className="w-8 h-8 min-w-[32px] min-h-[32px] border border-border bg-background hover:bg-surface hover:border-brand-secondary text-foreground flex items-center justify-center transition-colors cursor-pointer rounded-none shadow-2xs shrink-0"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next videos"
                className="w-8 h-8 min-w-[32px] min-h-[32px] border border-border bg-background hover:bg-surface hover:border-brand-secondary text-foreground flex items-center justify-center transition-colors cursor-pointer rounded-none shadow-2xs shrink-0"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          }
        />
      )}

      {/* ── Financial Times Seamless Video Reel Track ── */}
      <div className="relative">
        {/* Video Reel Cards Slider */}
        <div className="w-full max-w-full overflow-hidden min-w-0">
          <div
            ref={scrollRef}
            onScroll={updateScrollProgress}
            className="flex gap-3.5 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
          >
            {displayVideos.map((video) => {
              const districtObj = video.district
                ? districtLabels[video.district]
                : undefined;
              const districtName = districtObj
                ? locale === "ne"
                  ? districtObj.ne
                  : districtObj.en
                : "";
              const kicker = videoKickers[video.id]
                ? locale === "ne"
                  ? videoKickers[video.id].ne
                  : videoKickers[video.id].en
                : "स्थलगत • रिपोर्ट";

              return (
                <div
                  key={video.id}
                  onClick={() => openModal(video)}
                  className="group shrink-0 w-[175px] sm:w-[205px] md:w-[225px] snap-start cursor-pointer select-none"
                >
                  {/* Card Container with Broadsheet Frame */}
                  <div className="relative aspect-[9/15] bg-surface border border-border border-t-[3px] border-t-brand-secondary group-hover:border-brand-secondary transition-all duration-300 overflow-hidden rounded-none shadow-xs group-hover:shadow-md">
                    {/* Background Poster Image */}
                    <Image
                      src={video.thumbnail || "/images/places/api_himal.jpg"}
                      alt={t(video.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 175px, 225px"
                    />

                    {/* Bottom-Only Editorial Gradient (Leaves top 40% bright & natural) */}
                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                    {/* Top Badges: Brand District Badge & Duration */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
                      {districtName ? (
                        <span className="text-[10px] font-sans font-bold text-white bg-brand/90 backdrop-blur-xs px-2 py-0.5 border border-white/20 rounded-none tracking-wider uppercase">
                          {districtName}
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-mono font-medium text-white/90 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 border border-white/10 rounded-none">
                          HD • Reel
                        </span>
                      )}

                      <span className="text-[10px] font-mono font-semibold text-white bg-black/60 backdrop-blur-xs px-1.5 py-0.5 border border-white/20 rounded-none">
                        {video.duration}
                      </span>
                    </div>

                    {/* Center Brand Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-11 h-11 rounded-full bg-brand-secondary/90 text-white backdrop-blur-xs border border-white/40 flex items-center justify-center group-hover:scale-115 group-hover:bg-brand transition-all duration-300 shadow-lg">
                        <Play
                          size={15}
                          fill="white"
                          className="text-white ml-0.5"
                        />
                      </div>
                    </div>

                    {/* Bottom Embedded Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 z-10 flex flex-col justify-end pointer-events-none">
                      {/* Brand Kicker */}
                      <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider mb-1 line-clamp-1 uppercase">
                        {kicker}
                      </span>

                      {/* Title */}
                      <h3 className="text-xs sm:text-[13.5px] font-bold font-headline text-white group-hover:text-emerald-300 line-clamp-2 leading-snug transition-colors drop-shadow-xs mb-2">
                        {t(video.title)}
                      </h3>

                      {/* Views & Quick Watch Indicator */}
                      <div className="flex items-center justify-between text-[10.5px] text-white/80 font-sans pt-1.5 border-t border-white/20">
                        <span className="flex items-center gap-1">
                          <Eye size={11} className="text-white/70" />
                          <span>{formatViews(video.views)}</span>
                        </span>
                        <span className="text-white group-hover:text-emerald-300 text-[10px] font-sans font-semibold inline-flex items-center gap-1 transition-colors">
                          <span>{locale === "ne" ? "हेर्नुहोस्" : "Watch"}</span>
                          <ArrowRight size={10} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Subtle Scrollbar / Progress Bar (Replaces ugly native white bar) */}
        <div className="mt-4 pt-2.5 border-t border-border flex items-center justify-between gap-4">
          <span className="text-[11px] font-sans text-muted-foreground">
            {locale === "ne"
              ? "स्क्रोल गरेर सबै हेर्नुहोस्"
              : "Scroll to explore all"}
          </span>

          {/* 2px Slim Progress Track */}
          <div className="flex-1 max-w-[200px] h-[2px] bg-border rounded-none overflow-hidden">
            <div
              className="h-full bg-brand-secondary transition-all duration-150 rounded-none"
              style={{ width: `${Math.max(12, scrollProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Interactive Instant Video Modal / Lightbox ── */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-surface border border-border text-white shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-none max-h-[92vh]">
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-none bg-black/70 hover:bg-brand-secondary text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Left: 9:16 Video Player Column */}
            <div className="relative md:w-[320px] aspect-[9/15] md:aspect-auto md:h-[520px] bg-black shrink-0 overflow-hidden">
              <Image
                src={activeModalVideo.thumbnail}
                alt={t(activeModalVideo.title)}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className={`object-cover transition-all duration-700 ${isPlaying ? "scale-102 brightness-95" : "brightness-75"}`}
                preload
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

              {/* Play/Pause Overlay */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm border border-white/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-secondary transition-all">
                  {isPlaying ? (
                    <Pause size={22} className="text-white" />
                  ) : (
                    <Play
                      size={22}
                      fill="white"
                      className="text-white ml-0.5"
                    />
                  )}
                </div>
              </div>

              {/* Player Top Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 bg-brand-secondary text-white rounded-none">
                  {locale === "ne" ? "फिल्ड रिपोर्ट" : "FIELD DISPATCH"}
                </span>
                <span className="text-[10px] font-sans font-semibold px-2 py-0.5 bg-black/70 text-muted-foreground border border-white/20 rounded-none">
                  {activeModalVideo.duration}
                </span>
              </div>

              {/* Player Bottom Status */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/80 font-sans">
                <span>
                  {isPlaying
                    ? locale === "ne"
                      ? "▶ प्ले भइरहेको छ"
                      : "▶ Playing"
                    : locale === "ne"
                      ? "⏸ रोकिएको छ"
                      : "⏸ Paused"}
                </span>
                <span>
                  {formatViews(activeModalVideo.views)}{" "}
                  {locale === "ne" ? "हेराइ" : "views"}
                </span>
              </div>
            </div>

            {/* Right: Info, Actions & Navigation */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-sans font-bold text-brand-secondary">
                    {activeModalVideo.district &&
                    districtLabels[activeModalVideo.district]
                      ? locale === "ne"
                        ? districtLabels[activeModalVideo.district].ne
                        : districtLabels[activeModalVideo.district].en
                      : "सुदूरपश्चिम"}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs font-sans text-muted-foreground">
                    <RelativeTime
                      date={activeModalVideo.publishedAt}
                      locale={locale}
                    />
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold font-headline text-foreground leading-snug mb-3">
                  {t(activeModalVideo.title)}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed mb-6">
                  {locale === "ne"
                    ? "सुदूरपश्चिम डिजिटल स्टुडियोको विशेष स्थलगत रिपोर्ट। स्थानीय परिवेश, संस्कृति र जनजीवनको प्रत्यक्ष भिडियो दस्तावेज।"
                    : "Exclusive on-the-ground visual dispatch from Far West Digital Studio capturing regional culture, nature, and community life."}
                </p>

                {/* Like & Share Action Buttons */}
                <div className="flex items-center gap-2.5 pb-6 border-b border-border">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeModalVideo.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-bold border transition-colors cursor-pointer rounded-none ${
                      likedMap[activeModalVideo.id]
                        ? "bg-brand-secondary border-brand-secondary text-white"
                        : "bg-surface border-border text-muted-foreground hover:text-white hover:border-brand-secondary"
                    }`}
                  >
                    <Heart
                      size={14}
                      className={
                        likedMap[activeModalVideo.id] ? "fill-white" : ""
                      }
                    />
                    <span>
                      {likedMap[activeModalVideo.id]
                        ? "मन पर्यो (Liked)"
                        : "Like"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(activeModalVideo.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-bold border border-border bg-surface text-muted-foreground hover:text-white hover:border-foreground transition-colors cursor-pointer rounded-none"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">
                          {locale === "ne" ? "लिङ्क कपी भयो" : "Copied"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        <span>
                          {locale === "ne" ? "सेयर गर्नुहोस्" : "Share"}
                        </span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/videos/${activeModalVideo.id}`}
                    className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-brand-secondary hover:underline ml-auto"
                  >
                    <span>{locale === "ne" ? "पुरा पृष्ठ" : "Full Page"}</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              {/* Bottom Next/Prev Reel Carousel Controls */}
              <div className="pt-5 mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigateModal("prev")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
                >
                  <ChevronLeft size={14} />
                  <span>{locale === "ne" ? "अघिल्लो" : "Prev"}</span>
                </button>

                <span className="text-xs font-sans text-muted-foreground">
                  {VIDEOS.findIndex((v) => v.id === activeModalVideo.id) + 1} /{" "}
                  {VIDEOS.length}
                </span>

                <button
                  type="button"
                  onClick={() => navigateModal("next")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
                >
                  <span>{locale === "ne" ? "अर्को भिडियो" : "Next"}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
