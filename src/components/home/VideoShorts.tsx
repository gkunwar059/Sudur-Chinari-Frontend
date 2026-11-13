"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
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
import FTEmptyState from "@/components/common/FTEmptyState";
import type { VideoItem } from "@/types";
import { formatViews, normalizeImageUrl, cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { newsApi } from "@/lib/api";
import AuthModal from "@/components/auth/AuthModal";
import RelativeTime from "@/components/common/RelativeTime";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import { useBodyScrollLock } from "@/lib/scroll-lock";

interface VideoShortsProps {
  filterDistrict?: string;
  title?: { ne: string; en: string };
  hideDivider?: boolean;
  videos?: VideoItem[];
}

function getYouTubeId(video: VideoItem): string {
  if (video.youtube_id) return video.youtube_id;
  const url = video.video_url;
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1] || "";
}

export default function VideoShorts({
  filterDistrict,
  title,
  hideDivider,
  videos,
}: VideoShortsProps = {}) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
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
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(
    {},
  );
  const [likingMap, setLikingMap] = useState<Record<string, boolean>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  const { data: fetchedVideosRes } = useQuery({
    queryKey: ["videos", locale, filterDistrict || "all"],
    queryFn: () =>
      newsApi.getVideosClient({
        limit: 24,
        ...(filterDistrict ? { district__slug: filterDistrict } : {}),
      }),
    enabled: videos === undefined,
  });

  const allVideos = videos ?? fetchedVideosRes?.results ?? [];
  const filteredVideos = filterDistrict
    ? allVideos.filter((v) => {
        const dSlug =
          typeof v.district === "object" && v.district !== null
            ? v.district.slug
            : v.district;
        return dSlug === filterDistrict;
      })
    : allVideos;
  const displayVideos = filteredVideos;
  const activeYouTubeId = activeModalVideo
    ? getYouTubeId(activeModalVideo)
    : "";

  const getDistrictName = (v: VideoItem) => {
    if (!v.district) return locale === "ne" ? "सुदूरपश्चिम" : "Sudurpashchim";
    if (typeof v.district === "object" && v.district !== null) {
      return t(v.district.name);
    }
    const slug = String(v.district).toLowerCase();
    if (districtLabels[slug]) {
      return locale === "ne" ? districtLabels[slug].ne : districtLabels[slug].en;
    }
    return String(v.district);
  };

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
    const currentIndex = displayVideos.findIndex(
      (v) => String(v.id) === String(activeModalVideo.id)
    );
    if (currentIndex === -1) return;

    if (direction === "next") {
      const nextIndex = (currentIndex + 1) % displayVideos.length;
      setActiveModalVideo(displayVideos[nextIndex]);
    } else {
      const prevIndex =
        (currentIndex - 1 + displayVideos.length) % displayVideos.length;
      setActiveModalVideo(displayVideos[prevIndex]);
    }
    setIsPlaying(true);
  };

  // Sync active video view & like status from backend
  useEffect(() => {
    if (!activeModalVideo?.id) return;
    const key = String(activeModalVideo.id);
    newsApi.viewVideoClient(activeModalVideo.id).catch(() => {});
    newsApi
      .getVideoLikeStatusClient(activeModalVideo.id)
      .then((res) => {
        if (res && typeof res.has_liked === "boolean") {
          setLikedMap((prev) => ({ ...prev, [key]: res.has_liked }));
        }
        if (res && typeof res.likes === "number") {
          setLikesCountMap((prev) => ({ ...prev, [key]: res.likes }));
        }
      })
      .catch(() => {});
  }, [activeModalVideo?.id, user]);

  // Handle Like
  const toggleLike = async (id: string | number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const key = String(id);
    if (likingMap[key]) return;

    const wasLiked = !!likedMap[key];
    const baseLikes =
      likesCountMap[key] ??
      displayVideos.find((v) => String(v.id) === key)?.likes ??
      0;

    setLikingMap((prev) => ({ ...prev, [key]: true }));
    setLikedMap((prev) => ({ ...prev, [key]: !wasLiked }));
    setLikesCountMap((prev) => ({
      ...prev,
      [key]: wasLiked ? Math.max(0, baseLikes - 1) : baseLikes + 1,
    }));

    try {
      const res = await newsApi.likeVideoClient(id);
      if (res && typeof res.has_liked === "boolean") {
        setLikedMap((prev) => ({ ...prev, [key]: res.has_liked }));
      }
      if (res && typeof res.likes === "number") {
        setLikesCountMap((prev) => ({ ...prev, [key]: res.likes }));
      }
    } catch {
      setLikedMap((prev) => ({ ...prev, [key]: wasLiked }));
      setLikesCountMap((prev) => ({ ...prev, [key]: baseLikes }));
    } finally {
      setLikingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Handle Share
  const handleShare = async (id: string | number) => {
    if (typeof window === "undefined") return;
    try {
      const url = `${window.location.origin}/videos/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Safely lock background scroll with global reference-counted lock
  useBodyScrollLock(!!activeModalVideo);

  // Handle ESC key and arrow keys for modal
  useEffect(() => {
    if (!activeModalVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") navigateModal("next");
      if (e.key === "ArrowLeft") navigateModal("prev");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
      {displayVideos.length === 0 ? (
        <FTEmptyState
          title={
            locale === "ne"
              ? "हाल कुनै भिडियो सामग्री उपलब्ध छैन"
              : "No Video Dispatches Available"
          }
          description={
            locale === "ne"
              ? "सुदूरपश्चिम डिजिटलको स्थलगत भिडियो रिपोर्टहरू चाँडै यस खण्डमा उपलब्ध हुनेछन्।"
              : "Visual journalism and on-the-ground dispatches will be published here soon."
          }
          kicker={locale === "ne" ? "भिडियो आर्काइभ" : "VIDEO ARCHIVE"}
          icon={<Play size={22} className="text-brand-secondary ml-0.5" />}
          accentColor="var(--color-brand-secondary)"
          actionText={locale === "ne" ? "भिडियो खण्ड हेर्नुहोस्" : "Go to Videos"}
          actionHref="/videos"
        />
      ) : (
        <div className="relative">
        {/* Video Reel Cards Slider */}
        <div className="w-full max-w-full overflow-hidden min-w-0">
          <div
            ref={scrollRef}
            onScroll={updateScrollProgress}
            className="flex gap-3.5 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
          >
            {displayVideos.map((video) => {
              let districtName = "";
              if (video.district) {
                if (typeof video.district === "object" && video.district !== null) {
                  districtName = t(video.district.name);
                } else if (typeof video.district === "string") {
                  const districtObj = districtLabels[video.district];
                  districtName = districtObj
                    ? locale === "ne"
                      ? districtObj.ne
                      : districtObj.en
                    : video.district;
                }
              }
              const kicker = videoKickers[String(video.id)]
                ? locale === "ne"
                  ? videoKickers[String(video.id)].ne
                  : videoKickers[String(video.id)].en
                : "स्थलगत • रिपोर्ट";

              return (
                <div
                  key={video.id}
                  onClick={() => openModal(video)}
                  className="group scroll-reveal-card shrink-0 w-[175px] sm:w-[205px] md:w-[225px] snap-start cursor-pointer select-none"
                >
                  {/* Card Container with Broadsheet Frame */}
                  <div className="relative aspect-[9/15] bg-surface border border-border border-t-[3px] border-t-brand-secondary group-hover:border-brand-secondary transition-all duration-300 overflow-hidden rounded-none shadow-xs group-hover:shadow-md">
                    {/* Background Poster Image */}
                    <Image
                      src={normalizeImageUrl(video.thumbnail) || "/images/places/api_himal.jpg"}
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
      )}

      {/* ── Interactive Instant Video Modal / Lightbox ── */}
      {activeModalVideo &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center md:p-6 animate-fadeIn">
          {/* Modal Container */}
          <div className="relative w-full h-full md:h-[560px] md:max-h-[92vh] md:max-w-4xl bg-black md:bg-surface border-0 md:border md:border-border text-white md:text-foreground shadow-2xl flex flex-col md:flex-row overflow-hidden rounded-none">
            {/* Close Button Top Right (Desktop) */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close modal"
              className="hidden md:flex absolute top-3 right-3 z-40 w-8 h-8 rounded-none bg-black/70 hover:bg-brand-secondary text-white border border-white/20 items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* ── 1. Video Player Area (Full screen on mobile, 340px column on desktop) ── */}
            <div className="relative w-full h-full md:w-[340px] lg:w-[360px] md:h-full bg-black shrink-0 overflow-hidden flex items-center justify-center">
              {!activeModalVideo.isShort && (
                <Image
                  src={
                    normalizeImageUrl(activeModalVideo.thumbnail) ||
                    "/images/places/api_himal.jpg"
                  }
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-cover scale-110 blur-2xl opacity-40 md:hidden"
                />
              )}
              <div
                className={cn(
                  "relative flex items-center justify-center",
                  activeModalVideo.isShort
                    ? "w-full h-full"
                    : "w-full aspect-video md:w-full md:h-full md:aspect-auto",
                )}
              >
              {/* Actual Video Player or Thumbnail */}
              {isPlaying && activeYouTubeId ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeYouTubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                    title={t(activeModalVideo.title)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover border-0"
                  />
                </div>
              ) : isPlaying && activeModalVideo.video_url ? (
                <video
                  src={normalizeImageUrl(activeModalVideo.video_url)}
                  autoPlay
                  controls
                  playsInline
                  className={cn(
                    "w-full h-full",
                    activeModalVideo.isShort ? "object-cover" : "object-contain",
                  )}
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={
                      normalizeImageUrl(activeModalVideo.thumbnail) ||
                      "/images/places/api_himal.jpg"
                    }
                    alt={t(activeModalVideo.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover brightness-85"
                    preload
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                      <Play
                        size={22}
                        fill="white"
                        className="text-white ml-0.5"
                      />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {locale === "ne" ? "भिडियो उपलब्ध छैन" : "Video unavailable"}
                    </p>
                    <Link
                      href={`/videos/${activeModalVideo.id}`}
                      className="text-xs text-white/80 underline underline-offset-2"
                    >
                      {locale === "ne"
                        ? "पुरा पृष्ठमा हेर्नुहोस्"
                        : "Open full page"}
                    </Link>
                  </div>
                </div>
              )}
              </div>

              {/* ── Top Badges & Mobile Close Button (Overlaid on top of video) ── */}
              <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 bg-brand-secondary text-white rounded-none shadow-xs">
                    {locale === "ne" ? "फिल्ड रिपोर्ट" : "FIELD DISPATCH"}
                  </span>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 bg-black/75 text-white/90 border border-white/20 rounded-none shadow-xs">
                    {activeModalVideo.duration}
                  </span>
                </div>

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="md:hidden pointer-events-auto w-9 h-9 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/30 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ── Mobile Reel Action Rail ── */}
              <div className="md:hidden absolute right-3 bottom-44 z-30 flex flex-col items-center gap-4 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => toggleLike(activeModalVideo.id)}
                  aria-label="Like video"
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-lg active:scale-90",
                      likedMap[activeModalVideo.id]
                        ? "bg-red-600/90 border-red-500 text-white"
                        : "bg-black/60 border-white/25 text-white hover:bg-black/80",
                    )}
                  >
                    <Heart
                      size={20}
                      className={
                        likedMap[activeModalVideo.id] ? "fill-white" : ""
                      }
                    />
                  </div>
                  <span className="text-[10px] font-sans text-white/90 font-bold mt-1 drop-shadow">
                    {formatViews(
                      likesCountMap[String(activeModalVideo.id)] ??
                        activeModalVideo.likes ??
                        0,
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(activeModalVideo.id)}
                  aria-label="Share video"
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-black/80 active:scale-90 transition-all shadow-lg">
                    {copied ? (
                      <Check size={20} className="text-emerald-400" />
                    ) : (
                      <Share2 size={19} />
                    )}
                  </div>
                  <span className="text-[10px] font-sans text-white/90 font-bold mt-1 drop-shadow">
                    {copied
                      ? locale === "ne"
                        ? "कपी"
                        : "Copied"
                      : locale === "ne"
                        ? "सेयर"
                        : "Share"}
                  </span>
                </button>

                <Link
                  href={`/videos/${activeModalVideo.id}`}
                  aria-label="Open full page"
                  className="flex flex-col items-center group"
                >
                  <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-brand-secondary active:scale-90 transition-all shadow-lg">
                    <ExternalLink size={18} />
                  </div>
                  <span className="text-[10px] font-sans text-white/90 font-bold mt-1 drop-shadow">
                    {locale === "ne" ? "पुरा" : "Full"}
                  </span>
                </Link>
              </div>

              {/* ── Mobile Reel Caption ── */}
              <div className="md:hidden absolute bottom-20 left-0 right-16 z-20 p-4 pointer-events-none bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <div className="flex items-center gap-2 mb-1.5 text-xs">
                  <span className="font-bold text-brand-secondary">
                    {getDistrictName(activeModalVideo)}
                  </span>
                  <span className="text-white/50">•</span>
                  <span className="text-white/80">
                    <RelativeTime
                      date={activeModalVideo.publishedAt}
                      locale={locale}
                    />
                  </span>
                </div>
                <h3 className="text-sm font-bold font-headline text-white leading-snug drop-shadow-md line-clamp-2">
                  {t(activeModalVideo.title)}
                </h3>
              </div>

              {/* ── Mobile Reel Pager ── */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 z-30 px-4 py-2.5 bg-black/90 border-t border-white/10 flex items-center justify-between text-xs text-white pb-[max(0.625rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => navigateModal("prev")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-none bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer font-sans font-semibold"
                >
                  <ChevronLeft size={16} />
                  <span>{locale === "ne" ? "अघिल्लो" : "Prev"}</span>
                </button>

                <span className="text-white/70 font-mono text-xs">
                  {displayVideos.findIndex(
                    (v) => String(v.id) === String(activeModalVideo.id),
                  ) + 1}{" "}
                  / {displayVideos.length}
                </span>

                <button
                  type="button"
                  onClick={() => navigateModal("next")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-none bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer font-sans font-semibold"
                >
                  <span>{locale === "ne" ? "अर्को" : "Next"}</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Desktop Bottom Status Bar (Left Column Only) */}
              <div className="hidden md:flex absolute bottom-3 left-3 right-3 items-center justify-between text-xs text-white/80 font-sans z-20 pointer-events-none">
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

            {/* ── 2. Editorial Details & Actions ── */}
            <div className="hidden md:flex flex-1 flex-col justify-between overflow-y-auto bg-surface p-6 text-foreground lg:p-8">
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-sans font-bold text-brand-secondary">
                    {getDistrictName(activeModalVideo)}
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
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-bold border transition-colors cursor-pointer rounded-none",
                      likedMap[activeModalVideo.id]
                        ? "bg-brand-secondary border-brand-secondary text-white"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-brand-secondary",
                    )}
                  >
                    <Heart
                      size={14}
                      className={
                        likedMap[activeModalVideo.id] ? "fill-white text-white" : ""
                      }
                    />
                    <span>
                      {likedMap[activeModalVideo.id]
                        ? (locale === "ne" ? "मन पर्यो (Liked)" : "Liked")
                        : (locale === "ne" ? "मन पराउनुहोस्" : "Like")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(activeModalVideo.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-bold border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer rounded-none"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-500" />
                        <span className="text-emerald-500">
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

              {/* Bottom Next/Prev Reel Carousel Controls (Desktop) */}
              <div className="pt-5 mt-4 flex items-center justify-between border-t border-border/60">
                <button
                  type="button"
                  onClick={() => navigateModal("prev")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
                >
                  <ChevronLeft size={14} />
                  <span>{locale === "ne" ? "अघिल्लो" : "Prev"}</span>
                </button>

                <span className="text-xs font-sans text-muted-foreground font-mono">
                  {displayVideos.findIndex((v) => String(v.id) === String(activeModalVideo.id)) + 1} /{" "}
                  {displayVideos.length}
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
          </div>,
          document.body,
        )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </section>
  );
}
