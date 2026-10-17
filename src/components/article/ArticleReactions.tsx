"use client";

import { useState, useEffect } from "react";
import { Heart, MessageSquare, Bookmark, Share2, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface ArticleReactionsProps {
  articleId: string;
  articleTitle: string;
  initialLikes?: number;
  commentsCount?: number;
}

export default function ArticleReactions({
  articleId,
  articleTitle,
  initialLikes = 142,
  commentsCount = 3,
}: ArticleReactionsProps) {
  const { locale } = useLanguage();
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  useEffect(() => {
    try {
      const savedLike = localStorage.getItem(`article_like_${articleId}`);
      if (savedLike === "true") {
        setHasLiked(true);
      }
      const savedBookmark = localStorage.getItem(`article_bookmark_${articleId}`);
      if (savedBookmark === "true") {
        setHasBookmarked(true);
      }
    } catch {
      // localStorage may fail
    }
  }, [articleId]);

  const toggleLike = () => {
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);

    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      try {
        localStorage.removeItem(`article_like_${articleId}`);
      } catch {}
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      try {
        localStorage.setItem(`article_like_${articleId}`, "true");
      } catch {}
    }
  };

  const toggleBookmark = () => {
    const nextState = !hasBookmarked;
    setHasBookmarked(nextState);
    try {
      if (nextState) {
        localStorage.setItem(`article_bookmark_${articleId}`, "true");
      } else {
        localStorage.removeItem(`article_bookmark_${articleId}`);
      }
    } catch {}
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="my-8 p-3.5 sm:p-4 rounded-none bg-surface border border-border flex flex-wrap items-center justify-between gap-3">
      {/* Left buttons: Like & Comment */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Heart / Like Button */}
        <button
          type="button"
          onClick={toggleLike}
          aria-label="Like article"
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-none text-xs sm:text-[13px] font-bold transition-all duration-150 cursor-pointer border",
            hasLiked
              ? "bg-destructive/10 text-destructive border-destructive/30"
              : "bg-background text-foreground border-border hover:border-destructive/30 hover:text-destructive hover:bg-destructive/10"
          )}
        >
          <Heart
            size={15}
            className={cn(
              "transition-transform duration-200",
              hasLiked ? "fill-destructive text-destructive" : "text-muted-foreground",
              likeAnimating && "scale-125"
            )}
          />
          <span>
            {likes.toLocaleString()}{" "}
            <span className="hidden sm:inline">
              {locale === "ne" ? "मन पर्यो" : "Likes"}
            </span>
          </span>
        </button>

        {/* Comment jump button */}
        <button
          type="button"
          onClick={scrollToComments}
          aria-label="View comments"
          className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-none text-xs sm:text-[13px] font-semibold bg-background text-foreground border border-border hover:border-brand hover:text-brand transition-colors cursor-pointer"
        >
          <MessageSquare size={15} className="text-muted-foreground" />
          <span>
            {commentsCount}{" "}
            <span className="hidden sm:inline">
              {locale === "ne" ? "प्रतिक्रिया" : "Comments"}
            </span>
          </span>
        </button>
      </div>

      {/* Right buttons: Bookmark & Share */}
      <div className="flex items-center gap-2">
        {/* Bookmark */}
        <button
          type="button"
          onClick={toggleBookmark}
          aria-label="Bookmark article"
          className={cn(
            "px-2.5 py-1.5 min-h-[38px] rounded-none text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border",
            hasBookmarked
              ? "bg-amber-50 text-amber-700 border-amber-300"
              : "bg-background text-foreground border-border hover:border-amber-300 hover:text-amber-700"
          )}
        >
          <Bookmark
            size={14}
            className={hasBookmarked ? "fill-warning text-warning" : ""}
          />
          <span className="hidden md:inline">
            {hasBookmarked
              ? locale === "ne" ? "बचत गरियो" : "Saved"
              : locale === "ne" ? "बचत" : "Save"}
          </span>
        </button>

        {/* Share / Copy link */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share article link"
          className={cn(
            "px-3 py-1.5 min-h-[38px] rounded-none text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border",
            copied
              ? "bg-emerald-50 text-brand border-emerald-300"
              : "bg-background text-foreground border-border hover:border-brand hover:text-brand"
          )}
        >
          {copied ? (
            <>
              <Check size={14} className="text-brand" />
              <span>{locale === "ne" ? "लिंक कपी भयो!" : "Copied!"}</span>
            </>
          ) : (
            <>
              <Share2 size={14} />
              <span>{locale === "ne" ? "सेयर गर्नुहोस्" : "Share"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
