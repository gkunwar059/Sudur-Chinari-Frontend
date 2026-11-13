"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
    containerClass:
      "w-full aspect-[320/55] sm:aspect-[728/90] lg:aspect-[970/90] min-h-[60px] max-h-[120px]",
    dims: "970×90 / 728×90 (Mobile: 320×50)",
  },
  "billboard-mid": {
    labelNe: "मुख्य ब्यानर (Billboard Mid)",
    labelEn: "Billboard Mid",
    containerClass:
      "w-full aspect-[320/100] sm:aspect-[970/250] min-h-[100px] max-h-[250px]",
    dims: "970×250 (Mobile: 320×100)",
  },
  sidebar: {
    labelNe: "साइडबार ब्यानर (Sidebar MREC)",
    labelEn: "Sidebar MREC",
    containerClass: "w-full aspect-[6/5] max-w-[336px] mx-auto min-h-[220px]",
    dims: "300×250 / 336×280",
  },
  "in-article": {
    labelNe: "समाचार भित्रको ब्यानर (In-Article)",
    labelEn: "In-Article Banner",
    containerClass:
      "w-full aspect-[320/100] sm:aspect-[728/90] min-h-[90px] max-h-[120px]",
    dims: "728×90 / 300×250",
  },
  "bottom-strip": {
    labelNe: "पुछारको ब्यानर (Bottom Strip)",
    labelEn: "Bottom Strip",
    containerClass:
      "w-full aspect-[320/55] sm:aspect-[728/90] lg:aspect-[970/90] min-h-[60px] max-h-[115px]",
    dims: "970×90 / 728×90 (Mobile: 320×50)",
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

function AdBannerContent({
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

  const queryClient = useQueryClient();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const impressionRecorded = useRef<number | string | null>(null);

  const { data: activeAd = null, isLoading: loading } = useQuery<AdItem | null>({
    queryKey: ["active-banner-ad", placement, detectedPage, locale],
    queryFn: async () => {
      const res: any = await newsApi.getActiveBannerAdClient(
        placement,
        detectedPage,
        locale as any,
      );
      if (
        res &&
        res.active &&
        res.data &&
        (res.data.image || res.data.image_url)
      ) {
        return {
          id: res.data.id,
          image: normalizeImageUrl(res.data.image || res.data.image_url),
          alt: res.data.alt_text || res.data.title || "Advertisement",
          href: res.data.target_url || "#",
          advertiser: res.data.advertiser || "",
          containerClass: config.containerClass,
        };
      }
      return null;
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (
      activeAd &&
      typeof activeAd.id === "number" &&
      impressionRecorded.current !== activeAd.id
    ) {
      impressionRecorded.current = activeAd.id;
      newsApi.recordBannerImpressionClient(activeAd.id).catch(() => {});
    }
  }, [activeAd]);

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
              className={`relative w-full ${config.containerClass} overflow-hidden rounded-none border border-dashed border-border/80 hover:border-brand/70 bg-surface/40 hover:bg-surface/70 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 group`}
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
              <span className="text-[10.5px] font-mono text-muted-foreground text-center">
                {config.dims} px
              </span>
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
          queryClient.invalidateQueries({ queryKey: ["active-banner-ad"] });
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

export default function AdBanner(props: AdBannerProps) {
  const placement = props.placement || "billboard-mid";
  const config =
    PLACEMENT_CONFIG[placement] || PLACEMENT_CONFIG["billboard-mid"];
  return (
    <Suspense
      fallback={
        <div className={`w-full my-3 sm:my-4 ${props.className || ""}`}>
          <div
            role="status"
            aria-live="polite"
            className={`skeleton-shimmer w-full ${config.containerClass} overflow-hidden rounded-none border border-border flex items-center justify-center`}
          />
        </div>
      }
    >
      <AdBannerContent {...props} />
    </Suspense>
  );
}
