"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart, Share2, Eye, Clock, Check, ChevronLeft } from "lucide-react";
import type { VideoItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { formatViews } from "@/lib/utils";
import ArticleComments from "@/components/article/ArticleComments";
import RelativeTime from "@/components/common/RelativeTime";
import { cn } from "@/lib/utils";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface VideoPlayerViewProps {
  video: VideoItem;
  otherVideos: VideoItem[];
}

export default function VideoPlayerView({ video, otherVideos }: VideoPlayerViewProps) {
  const { t, locale } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`video_like_${video.id}`);
      if (saved === "true") setHasLiked(true);
    } catch {}
  }, [video.id]);

  const toggleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      try {
        localStorage.removeItem(`video_like_${video.id}`);
      } catch {}
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      try {
        localStorage.setItem(`video_like_${video.id}`, "true");
      } catch {}
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ── Left: Video Player & Details (8 cols) ── */}
      <div className="lg:col-span-8">
        <Link
          href="/videos"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-brand mb-4 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>{locale === "ne" ? "सबै भिडियोहरू" : "Back to Videos"}</span>
        </Link>

        {/* Video Player Display */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative aspect-video sm:aspect-[16/9] rounded-2xl overflow-hidden bg-black shadow-md cursor-pointer group mb-5"
        >
          <Image
            src={video.thumbnail}
            alt={t(video.title)}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isPlaying ? "brightness-95 scale-102" : "brightness-80"
            )}
            preload
            sizes="(max-width: 1024px) 100vw, 66vw"
          />

          {/* Controls overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-16 h-16 rounded-full bg-background/90 backdrop-blur-xs flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause size={28} className="text-brand" />
              ) : (
                <Play size={28} fill="currentColor" className="text-brand ml-1" />
              )}
            </div>
          </div>

          {/* Bottom Video Progress & Badges */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs">
            <span className="font-semibold bg-black/60 px-2 py-0.5 rounded-md">
              {video.duration}
            </span>
            <span className="font-medium">
              {isPlaying
                ? locale === "ne" ? "प्ले भइरहेको छ..." : "Playing..."
                : locale === "ne" ? "क्लिक गरेर हेर्नुहोस्" : "Click to Play"}
            </span>
          </div>
        </div>

        {/* Video Metadata & Title */}
        <div className="bg-background rounded-2xl border border-border p-5 sm:p-6 mb-6 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-3">
            {t(video.title)}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground font-medium">
                <Eye size={15} />
                {formatViews(video.views)} {locale === "ne" ? "हेराइ" : "views"}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground font-medium">
                <Clock size={15} />
                <RelativeTime date={video.publishedAt} locale={locale} />
              </span>
            </div>

            {/* Like & Share Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLike}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-2xs",
                  hasLiked
                    ? "bg-rose-50 text-brand-secondary border-rose-200"
                    : "bg-background text-foreground border-border hover:border-rose-200 hover:text-brand-secondary"
                )}
              >
                <Heart
                  size={16}
                  className={hasLiked ? "fill-destructive text-destructive" : ""}
                />
                <span>{likes}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-background text-foreground border border-border hover:border-brand hover:text-brand transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-brand" />
                    <span>{locale === "ne" ? "कपी भयो" : "Copied"}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={16} />
                    <span>{locale === "ne" ? "सेयर" : "Share"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section for Video */}
        <div className="bg-background rounded-2xl border border-border p-5 sm:p-6 shadow-xs">
          <ArticleComments articleId={video.id} />
        </div>
      </div>

      {/* ── Right: Recommended Videos (4 cols) ── */}
      <div className="lg:col-span-4 bg-background rounded-2xl border border-border p-5 shadow-xs">
        <FTSectionDivider
          title={locale === "ne" ? "अन्य भिडियोहरू" : "More Videos"}
          as="h3"
          className="!my-0 mb-4"
        />
        <div className="space-y-3.5">
          {otherVideos.map((item) => (
            <Link
              key={item.id}
              href={`/videos/${item.id}`}
              className="group flex gap-3 p-2 rounded-xl hover:bg-surface transition-colors"
            >
              <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-900 shadow-2xs">
                <Image
                  src={item.thumbnail}
                  alt={t(item.title)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="96px"
                />
                <span className="absolute bottom-1 right-1 text-[9px] font-bold text-white bg-black/80 px-1 py-0.2 rounded">
                  {item.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                  {t(item.title)}
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-medium">
                  <Eye size={10} />
                  {formatViews(item.views)} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
