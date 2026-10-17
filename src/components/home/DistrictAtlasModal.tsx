"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ArrowRight, Search, MapPin } from "lucide-react";
import { DISTRICTS } from "@/data/districts";
import {
  DISTRICT_REAL_INDIVIDUAL_PATHS,
  DISTRICT_GEO_DETAILS,
} from "@/data/districtMaps";
import { useLanguage } from "@/context/LanguageContext";
import { getCurrentNepaliDateString, t } from "@/lib/utils";
import { District } from "@/types";

interface DistrictAtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDistrictSlug?: string;
  districts?: District[];
}

// Sudurpashchim geographic classification (9 districts)
const REGION_DISTRICTS: Record<"terai" | "pahad" | "himal", string[]> = {
  terai: ["kailali", "kanchanpur"],
  pahad: ["dadeldhura", "baitadi", "doti", "achham"],
  himal: ["darchula", "bajhang", "bajura"],
};

export default function DistrictAtlasModal({
  isOpen,
  onClose,
  defaultDistrictSlug = "kailali",
  districts = DISTRICTS,
}: DistrictAtlasModalProps) {
  const router = useRouter();
  const { locale, tr } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<
    "all" | "terai" | "pahad" | "himal"
  >("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      // Focus search input on desktop
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        setTimeout(() => searchInputRef.current?.focus(), 120);
      }
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset filters when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedRegion("all");
    }
  }, [isOpen]);

  const navigateToDistrict = (slug: string) => {
    onClose();
    router.push(`/district/${slug}`);
  };

  // Filtered districts based on region and search query
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      // Region filter
      if (selectedRegion !== "all") {
        if (!REGION_DISTRICTS[selectedRegion].includes(d.slug)) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const geo =
          DISTRICT_GEO_DETAILS[d.slug] || DISTRICT_GEO_DETAILS.kailali;
        const nameNe = typeof d.name === "string" ? d.name : d.name?.ne || "";
        const nameEn = typeof d.name === "string" ? d.name : d.name?.en || "";
        const matchesNameNe = nameNe.toLowerCase().includes(q);
        const matchesNameEn = nameEn.toLowerCase().includes(q);
        const matchesHqNe = (geo.headquarters?.ne || "")
          .toLowerCase()
          .includes(q);
        const matchesHqEn = (geo.headquarters?.en || "")
          .toLowerCase()
          .includes(q);
        return matchesNameNe || matchesNameEn || matchesHqNe || matchesHqEn;
      }
      return true;
    });
  }, [districts, searchQuery, selectedRegion]);

  // Handle enter key in search to jump to first match
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredDistricts.length > 0) {
      navigateToDistrict(filteredDistricts[0].slug);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="district-atlas-title"
      className="fixed inset-0 z-[999] flex items-center justify-center p-2.5 sm:p-5 md:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Main Modal Container: Authentic Broadsheet Newspaper Aesthetic ── */}
      <div className="relative w-full max-w-4xl bg-background border border-rule shadow-2xl rounded-none overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] animate-in zoom-in-95 duration-150">
        <div className="h-[3px] w-full bg-brand" />

        {/* ── Header: Matching news.sthajeevan.com.np Masthead ── */}
        <div className="bg-background border-b border-border px-3.5 sm:px-7 pt-3.5 sm:pt-4 pb-2.5 sm:pb-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2.5 sm:gap-3 select-none min-w-0">
              <div className="relative shrink-0">
                <Image
                  src="/images/sudur-logo.png"
                  alt="सुदूर चिनारी — हाम्रो इतिहास • हाम्रो पहिचान"
                  width={200}
                  height={50}
                  preload
                  className="object-contain h-8 sm:h-[42px] w-auto"
                />
              </div>
            </div>

            {/* Right: Date & Clean Broadsheet Close Button */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span
                suppressHydrationWarning
                className="text-xs text-muted-foreground font-medium hidden md:inline-block"
              >
                {locale === "ne"
                  ? getCurrentNepaliDateString()
                  : new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-none border border-border hover:border-gray-400 hover:bg-surface text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Headline & Real-time Search Row ── */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0">
              <h3
                id="district-atlas-title"
                className="text-lg sm:text-2xl font-black font-headline text-foreground leading-tight break-words"
              >
                {locale === "ne"
                  ? "सुदूरपश्चिमका जिल्लाहरू अन्वेषण गर्नुहोस्"
                  : "Explore the Districts of Sudurpashchim"}
              </h3>
              <p className="text-xs sm:text-[13px] text-muted-foreground font-sans mt-0.5 sm:mt-1 break-words">
                {locale === "ne"
                  ? "स्थानीय समाचार र अपडेटहरू पढ्न तलको कुनै पनि जिल्ला छनोट गर्नुहोस्।"
                  : "Choose a district below to read local news and updates from your area."}
              </p>
            </div>

            {/* Real-time Search Input matching the project's broadsheet aesthetic */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={
                  locale === "ne"
                    ? "जिल्ला वा सदरमुकाम खोज्नुहोस्..."
                    : "Search district or headquarters..."
                }
                className="w-full pl-9 pr-7 py-1.5 bg-background border border-border focus:border-brand focus:outline-none rounded-none text-xs text-foreground placeholder:text-gray-400 font-sans transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-muted-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* ── Belt Tabs: Authentic Underline Style with horizontal scroll on mobile ── */}
          <div className="flex items-center gap-3.5 sm:gap-6 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border text-xs font-semibold font-sans overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              type="button"
              onClick={() => setSelectedRegion("all")}
              className={`pb-1.5 -mb-2.5 transition-colors cursor-pointer border-b-2 ${
                selectedRegion === "all"
                  ? "border-brand text-brand font-black"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              सबै जिल्ला (९)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion("terai")}
              className={`pb-1.5 -mb-2.5 transition-colors cursor-pointer border-b-2 ${
                selectedRegion === "terai"
                  ? "border-brand text-brand font-black"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              तराई (२)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion("pahad")}
              className={`pb-1.5 -mb-2.5 transition-colors cursor-pointer border-b-2 ${
                selectedRegion === "pahad"
                  ? "border-brand text-brand font-black"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              पहाड (४)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRegion("himal")}
              className={`pb-1.5 -mb-2.5 transition-colors cursor-pointer border-b-2 ${
                selectedRegion === "himal"
                  ? "border-brand text-brand font-black"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              हिमाल (३)
            </button>
          </div>
        </div>

        {/* ── Main Body: 9 Authentic Broadsheet District Cards ── */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-surface">
          {filteredDistricts.length === 0 ? (
            <div className="py-12 text-center bg-background border border-border p-6">
              <p className="text-sm font-semibold text-muted-foreground">
                "{searchQuery}" सँग मिल्दो कुनै जिल्ला भेटिएन।
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("all");
                }}
                className="mt-3 px-3 py-1.5 text-xs text-brand font-bold hover:underline cursor-pointer"
              >
                खोजी रिसेट गर्नुहोस्
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[460px]:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {filteredDistricts.map((d) => {
                const geo =
                  DISTRICT_GEO_DETAILS[d.slug] || DISTRICT_GEO_DETAILS.kailali;
                const silhouettePath =
                  DISTRICT_REAL_INDIVIDUAL_PATHS[d.slug] ||
                  DISTRICT_REAL_INDIVIDUAL_PATHS.kailali;

                const regionName = REGION_DISTRICTS.terai.includes(d.slug)
                  ? "तराई"
                  : REGION_DISTRICTS.pahad.includes(d.slug)
                    ? "पहाड"
                    : "हिमाल";

                return (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => navigateToDistrict(d.slug)}
                    className="group relative bg-background hover:bg-surface border border-border border-t-[3px] hover:border-brand p-3 sm:p-4 rounded-none transition-all duration-150 flex flex-col justify-between text-left cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md overflow-hidden min-w-0"
                    style={{ borderTopColor: d.accentColor }}
                  >
                    <div className="min-w-0 w-full">
                      {/* Top Row: Region Category Badge + English Name */}
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border min-w-0">
                        <span className="inline-flex items-center rounded-[3px] font-sans font-semibold tracking-normal bg-brand-secondary/8 border border-brand-secondary/25 text-brand-secondary text-[10px] px-1.5 py-0.5 select-none shrink-0">
                          {regionName}
                        </span>
                        <span className="text-[10.5px] sm:text-[11px] font-mono text-muted-foreground font-medium truncate ml-2 max-w-[60%] text-right">
                          {typeof d.name === "object" ? d.name?.en : ""}
                        </span>
                      </div>

                      {/* Middle Row: Map Silhouette + District Title + Headquarters */}
                      <div className="flex items-center gap-2.5 sm:gap-3 my-1 min-w-0">
                        {/* Mini Vector Silhouette */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-surface border border-border flex items-center justify-center p-1 shrink-0 group-hover:scale-105 transition-transform">
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full select-none"
                          >
                            <path
                              d={silhouettePath}
                              fill={d.accentColor}
                              opacity="0.92"
                              stroke="#FFFFFF"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>

                        {/* District Name and Headquarters */}
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <h4 className="text-[15px] sm:text-lg lg:text-[19px] font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-tight truncate sm:break-words">
                            {t(d.name, locale)}
                          </h4>
                          <div className="text-[11px] sm:text-[11.5px] text-muted-foreground font-sans mt-0.5 flex items-center gap-1 min-w-0">
                            <MapPin
                              size={11}
                              style={{ color: d.accentColor }}
                              className="shrink-0"
                            />
                            <span className="text-muted-foreground hidden sm:inline shrink-0">
                              सदरमुकाम:
                            </span>
                            <span className="text-foreground font-medium truncate">
                              {geo.headquarters.ne}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer Bar: Broadsheet Action / Dismiss ── */}
        <div className="px-3.5 sm:px-7 py-3 sm:py-3.5 bg-background border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-sans text-[11px] sm:text-[11.5px] text-center sm:text-left">
            <span className="text-brand font-bold shrink-0">सुदूर चिनारी</span>
            <span className="text-gray-300">•</span>
            <span className="truncate sm:whitespace-normal">
              ९ वटै जिल्लाको निष्पक्ष, प्रामाणिक र डिजिटल खोज पत्रकारिता
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-none text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs group shrink-0"
          >
            <span>
              मुख्यपृष्ठको सम्पूर्ण समाचार पढ्नुहोस् (Continue to Main Page)
            </span>
            <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
