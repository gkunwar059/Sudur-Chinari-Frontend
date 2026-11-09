"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Megaphone, Plus } from "lucide-react";
import { newsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import AdUploadModal from "@/components/ads/AdUploadModal";
import AuthModal from "@/components/auth/AuthModal";
import { normalizeImageUrl } from "@/lib/utils";

export type AdPlacement =
  | "top-leaderboard"
  | "billboard-mid"
  | "sidebar"
  | "in-article"
  | "bottom-strip";

interface AdItem {
  id: string | number;
  image: string;
  alt: string;
  href: string;
  advertiser?: string;
  containerClass: string;
}

const PLACEMENT_CONFIG: Record<
  AdPlacement,
  {
    labelNe: string;
    labelEn: string;
    containerClass: string;
    dims: string;
  }
> = {
  "top-leaderboard": {
    labelNe: "शीर्ष ब्यानर (Top Leaderboard)",
    labelEn: "Top Leaderboard",
    containerClass: "h-20 sm:h-24 md:h-28 max-h-[118px]",
    dims: "970x90 / 728x90",
  },
  "billboard-mid": {
    labelNe: "मुख्य ब्यानर (Billboard Mid)",
    labelEn: "Billboard Mid",
    containerClass: "h-24 sm:h-28 md:h-32 max-h-[135px]",
    dims: "1200x120",
  },
  sidebar: {
    labelNe: "साइडबार ब्यानर (Sidebar Square)",
    labelEn: "Sidebar Banner",
    containerClass: "aspect-square max-w-[320px] mx-auto min-h-[250px]",
    dims: "300x250",
  },
  "in-article": {
    labelNe: "समाचार भित्रको ब्यानर (In-Article)",
    labelEn: "In-Article Banner",
    containerClass: "h-20 sm:h-24 md:h-28 max-h-[115px]",
    dims: "728x90",
  },
  "bottom-strip": {
    labelNe: "पुछारको ब्यानर (Bottom Strip)",
    labelEn: "Bottom Strip",
    containerClass: "h-20 sm:h-24 md:h-28 max-h-[115px]",
    dims: "1200x100",
  },
};

export interface AdBannerProps {
  placement?: AdPlacement;
  page?: string;
  className?: string;
  customHref?: string;
  customImage?: string;
  customAlt?: string;
  /**
   * If true, shows the empty slot prompt when no ad is active.
   * Defaults to true so authenticated users can click and request ads.
   */
  allowEmptyUpload?: boolean;
}

export function detectPageFromPath(pathname: string): string {
  if (!pathname) return "home";
  const clean = pathname.replace(/^\/(?:en|ne)(?=\/|$)/, "") || "/";
  if (clean === "/" || clean === "") return "home";
  if (clean.startsWith("/article")) return "article";
  if (clean.startsWith("/category")) return "category";
  if (clean.startsWith("/district")) return "district";
  if (clean.startsWith("/yatayat")) return "yatayat";
  if (clean.startsWith("/products")) return "products";
  if (clean.startsWith("/videos")) return "video";
  if (clean.startsWith("/photos")) return "photo";
  if (clean.startsWith("/sports")) return "sports";
  if (clean.startsWith("/politics")) return "politics";
  if (clean.startsWith("/tourism")) return "tourism";
  if (clean.startsWith("/stay")) return "stay";
  return "all";
}

export default function AdBanner({
  placement = "billboard-mid",
  page: propPage,
  className = "",
  customHref,
  customImage,
  customAlt,
  allowEmptyUpload = true,
}: AdBannerProps) {
  const pathname = usePathname();
  const detectedPage = propPage || detectPageFromPath(pathname);
  const { user } = useAuth();
  const { locale } = useLanguage();
  const isNe = locale === "ne";

  const config = PLACEMENT_CONFIG[placement] || PLACEMENT_CONFIG["billboard-mid"];

  const [activeAd, setActiveAd] = useState<AdItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const impressionRecorded = useRef(false);

  // Fetch active approved ad from backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    newsApi
      .getActiveBannerAdClient(placement, detectedPage)
      .then((res: any) => {
        if (!isMounted) return;
        if (res && res.active && res.data && (res.data.image || res.data.image_url)) {
          const item: AdItem = {
            id: res.data.id,
            image: normalizeImageUrl(res.data.image || res.data.image_url),
            alt: res.data.alt_text || res.data.title || "Advertisement",
            href: res.data.target_url || "#",
            advertiser: res.data.advertiser || "",
            containerClass: config.containerClass,
          };
          setActiveAd(item);

          // Record impression once
          if (!impressionRecorded.current && typeof item.id === "number") {
            impressionRecorded.current = true;
            newsApi.recordBannerImpressionClient(item.id).catch(() => {});
          }
        } else {
          setActiveAd(null);
        }
      })
      .catch(() => {
        if (isMounted) setActiveAd(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [placement, detectedPage, config.containerClass]);

  const handleEmptyClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleAdClick = () => {
    if (activeAd && typeof activeAd.id === "number") {
      newsApi.clickBannerAdClient(activeAd.id).catch(() => {});
    }
  };

  const href = customHref || (activeAd ? activeAd.href : "#");
  const image = customImage || (activeAd ? activeAd.image : "");
  const alt = customAlt || (activeAd ? activeAd.alt : "Advertisement");

  return (
    <>
      <div className={`w-full my-3 sm:my-4 ${className}`}>
        {/* ── Active Ad Present ── */}
        {image ? (
          <>
            {/* Subtle broadsheet ad label bar */}
            <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground tracking-normal px-1 mb-1">
              <span className="flex items-center gap-1">
                <Megaphone size={11} className="text-brand opacity-80" />
                <span>{isNe ? "विज्ञापन" : "Advertisement"}</span>
              </span>

              <button
                type="button"
                onClick={handleEmptyClick}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-brand font-medium transition-colors cursor-pointer group"
              >
                <Plus size={11} className="text-brand group-hover:scale-110 transition-transform" />
                <span>{isNe ? "यहाँ विज्ञापन राख्नुहोस्" : "Advertise Here"}</span>
              </button>
            </div>

            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              aria-label={alt}
              onClick={handleAdClick}
              className="block relative w-full overflow-hidden rounded-none border border-border shadow-2xs hover:shadow-xs transition-all duration-300 group"
            >
              <div
                className={`relative w-full ${config.containerClass} overflow-hidden bg-surface`}
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  className="object-cover object-center opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                />
              </div>
              {activeAd?.advertiser && (
                <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-mono tracking-wider opacity-0 group-hover:opacity-90 transition-opacity">
                  {activeAd.advertiser}
                </div>
              )}
            </a>
          </>
        ) : loading ? (
          /* ── Loading Skeleton ── */
          <div
            role="status"
            aria-live="polite"
            className={`skeleton-shimmer w-full ${config.containerClass} overflow-hidden rounded-none border border-border flex items-center justify-center`}
          >
            <div className="relative flex flex-col items-center gap-2 text-muted-foreground/50">
              <Megaphone size={16} />
              <div className="h-2 w-24 bg-foreground/10" />
            </div>
            <span className="sr-only">
              {isNe ? "विज्ञापन लोड हुँदैछ..." : "Loading advertisement..."}
            </span>
          </div>
        ) : (
          /* ── Empty Ad Slot: Button Only ── */
          allowEmptyUpload && (
            <div
              onClick={handleEmptyClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEmptyClick();
                }
              }}
              className={`relative w-full ${config.containerClass} overflow-hidden rounded-none border border-dashed border-border/80 hover:border-brand/70 bg-surface/40 hover:bg-surface/70 transition-all duration-200 cursor-pointer flex items-center justify-center p-3 sm:p-4 group`}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 group-hover:bg-brand/90 group-hover:scale-105 shadow-xs">
                <Plus size={14} strokeWidth={2.5} />
                <span>
                  {user
                    ? isNe
                      ? "विज्ञापन अनुरोध गर्नुहोस्"
                      : "Upload / Request Ad"
                    : isNe
                      ? "यहाँ विज्ञापन राख्नुहोस्"
                      : "Advertise Here"}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Ad Upload Modal */}
      <AdUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        initialPlacement={placement}
        initialPage={detectedPage}
        initialPath={pathname}
        slotName={config.labelNe}
        slotDims={config.dims}
        onSuccess={() => {
          // Re-fetch active ad after submission
          newsApi.getActiveBannerAdClient(placement, detectedPage).then((res: any) => {
            if (res?.active && res?.data) {
              setActiveAd({
                id: res.data.id,
                image: normalizeImageUrl(res.data.image || res.data.image_url),
                alt: res.data.alt_text || res.data.title,
                href: res.data.target_url || "#",
                advertiser: res.data.advertiser || "",
                containerClass: config.containerClass,
              });
            }
          });
        }}
      />

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
