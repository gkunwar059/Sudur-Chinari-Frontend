"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useRoadblockAd } from "@/hooks/useRoadblockAd";

function RoadblockAdModalContent() {
  const { locale } = useLanguage();

  const {
    adData,
    isOpen,
    isClosing,
    countdown,
    progressPercent,
    setIsHovered,
    handleClose,
  } = useRoadblockAd();

  if (!isOpen || !adData || !adData.image) {
    return null;
  }

  const isEn = locale === "en";
  const title = adData.title || (isEn ? "Advertisement" : "विज्ञापन");
  const targetUrl = adData.target_url || "#";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Main Advertisement"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs transition-opacity duration-200 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100 animate-fadeIn"
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl bg-background rounded-none border border-border shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transition-all duration-200 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100 animate-scaleUp"
        }`}
      >
        <header className="relative flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-background select-none">
          <button
            onClick={handleClose}
            type="button"
            aria-label={isEn ? "Close advertisement" : "विज्ञापन बन्द गर्नुहोस्"}
            className="p-1.5 -ml-1 text-muted-foreground hover:text-foreground transition-colors rounded-none hover:bg-surface cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Image
                src="/images/sudur-logo.png"
                alt="सुदूर चिनारी"
                width={36}
                height={36}
                className="object-contain w-7 h-7 sm:w-9 sm:h-9"
                preload
              />
              <span className="font-headline font-bold text-sm sm:text-xl text-brand tracking-tight">
                सुदूर चिनारी
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-widest uppercase text-muted-foreground mt-0.5">
              {isEn ? "ADVERTISEMENT" : "विज्ञापन"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              type="button"
              className="group inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E02424] hover:bg-[#C81E1E] text-white text-xs sm:text-[13px] font-bold shadow-xs hover:shadow-sm transition-all duration-200 uppercase tracking-wide cursor-pointer active:scale-95"
            >
              <span>{isEn ? "SKIP THIS" : "विज्ञापन बन्द"}</span>
              {countdown > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-mono font-bold bg-white/20 rounded-full">
                  {countdown}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="w-full h-[2px] bg-border overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <main
          className="relative w-full aspect-[16/9] bg-surface overflow-hidden group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <a
            href={targetUrl}
            target={targetUrl.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            onClick={handleClose}
            className="block relative w-full h-full"
            title={title}
          >
            <Image
              src={adData.image}
              alt={title}
              fill
              preload
              className="object-contain sm:object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 100vw, 950px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
          </a>
        </main>

        <footer className="flex items-center justify-between px-4 sm:px-6 py-2 bg-surface border-t border-border text-[11px] font-sans text-muted-foreground select-none">
          <div className="flex items-center gap-1.5 min-w-0">
            {adData.advertiser && (
              <span className="font-semibold text-foreground truncate">
                {adData.advertiser}
              </span>
            )}
            {adData.advertiser && (
              <span className="hidden sm:inline text-muted-foreground/50">•</span>
            )}
            <span className="hidden sm:inline truncate">
              {isEn
                ? "Click ad to visit official campaign"
                : "योजनाको विस्तृत जानकारीका लागि विज्ञापनमा क्लिक गर्नुहोस्"}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <LocalizedLink
              href="/contact"
              onClick={handleClose}
              className="hover:text-brand transition-colors font-medium text-[11px]"
            >
              {isEn ? "Advertise With Us" : "विज्ञापनका लागि सम्पर्क"}
            </LocalizedLink>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function RoadblockAdModal() {
  return (
    <Suspense fallback={null}>
      <RoadblockAdModalContent />
    </Suspense>
  );
}
