"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Article } from "@/types";
import { t as translate, getArticleSlug, cn } from "@/lib/utils";
import { newsApi } from "@/lib/api";
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

  const [reactions, setReactions] = useState<
    Record<string, "like" | "dislike" | null>
  >({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [dislikesCount, setDislikesCount] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const initialReactions: Record<string, "like" | "dislike" | null> = {};
    const initialLikes: Record<string, number> = {};
    photoFeatures.forEach((art) => {
      const key = String(art.id);
      initialLikes[key] = art.likes || 0;
      try {
        const saved = localStorage.getItem(`sudur_reaction_${art.id}`);
        if (saved === "like" || saved === "dislike") {
          initialReactions[key] = saved;
        }
      } catch {
        // ignore storage errors
      }
    });
    setReactions(initialReactions);
    setLikesCount((prev) => ({ ...initialLikes, ...prev }));
  }, [articles]);

  const handleLike = async (art: Article) => {
    const key = String(art.id);
    const current = reactions[key] || null;
    const currentLikes = likesCount[key] ?? (art.likes || 0);

    if (current === "like") {
      setReactions((prev) => ({ ...prev, [key]: null }));
      setLikesCount((prev) => ({
        ...prev,
        [key]: Math.max(0, currentLikes - 1),
      }));
      try {
        localStorage.removeItem(`sudur_reaction_${art.id}`);
      } catch {}
    } else {
      if (current === "dislike") {
        setDislikesCount((prev) => ({
          ...prev,
          [key]: Math.max(0, (prev[key] || 0) - 1),
        }));
      }
      setReactions((prev) => ({ ...prev, [key]: "like" }));
      setLikesCount((prev) => ({ ...prev, [key]: currentLikes + 1 }));
      try {
        localStorage.setItem(`sudur_reaction_${art.id}`, "like");
      } catch {}
      try {
        const target = getArticleSlug(art) || art.id;
        const res = await newsApi.likeArticleClient(target);
        if (res && typeof res.likes === "number") {
          setLikesCount((prev) => ({ ...prev, [key]: res.likes }));
        }
      } catch {}
    }
  };

  const handleDislike = (art: Article) => {
    const key = String(art.id);
    const current = reactions[key] || null;
    const currentLikes = likesCount[key] ?? (art.likes || 0);
    const currentDislikes = dislikesCount[key] || 0;

    if (current === "dislike") {
      setReactions((prev) => ({ ...prev, [key]: null }));
      setDislikesCount((prev) => ({
        ...prev,
        [key]: Math.max(0, currentDislikes - 1),
      }));
      try {
        localStorage.removeItem(`sudur_reaction_${art.id}`);
      } catch {}
    } else {
      if (current === "like") {
        setLikesCount((prev) => ({
          ...prev,
          [key]: Math.max(0, currentLikes - 1),
        }));
      }
      setReactions((prev) => ({ ...prev, [key]: "dislike" }));
      setDislikesCount((prev) => ({ ...prev, [key]: currentDislikes + 1 }));
      try {
        localStorage.setItem(`sudur_reaction_${art.id}`, "dislike");
      } catch {}
    }
  };

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
            className="scroll-reveal-card bg-background rounded-none border border-border overflow-hidden shadow-2xs h-full flex flex-col"
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
                    onClick={() => handleLike(art)}
                    className={cn(
                      "flex items-center gap-1 text-xs transition-colors group cursor-pointer",
                      reactions[String(art.id)] === "like"
                        ? "text-brand font-bold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <ThumbsUp
                      size={14}
                      className={cn(
                        "transition-colors",
                        reactions[String(art.id)] === "like"
                          ? "text-brand fill-brand/20"
                          : "group-hover:text-brand",
                      )}
                    />
                    <span>{likesCount[String(art.id)] ?? (art.likes || 0)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDislike(art)}
                    className={cn(
                      "flex items-center gap-1 text-xs transition-colors group cursor-pointer",
                      reactions[String(art.id)] === "dislike"
                        ? "text-brand-secondary font-bold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <ThumbsDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        reactions[String(art.id)] === "dislike"
                          ? "text-brand-secondary fill-brand-secondary/20"
                          : "group-hover:text-brand-secondary",
                      )}
                    />
                    <span>{dislikesCount[String(art.id)] || 0}</span>
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
