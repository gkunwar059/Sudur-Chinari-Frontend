"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import { DISTRICTS } from "@/data/districts";
import {
  DISTRICT_REAL_INDIVIDUAL_PATHS,
  DISTRICT_PROVINCE_PATHS,
  DISTRICT_CENTROIDS,
  DISTRICT_GEO_DETAILS,
} from "@/data/districtMaps";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/utils";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import DistrictAtlasModal from "./DistrictAtlasModal";

interface DistrictMapCardsProps {
  initialDistricts?: any[];
}

export default function DistrictMapCards({ initialDistricts }: DistrictMapCardsProps = {}) {
  const router = useRouter();
  const { locale } = useLanguage();
  const [activeDistrictSlug, setActiveDistrictSlug] =
    useState<string>("kailali");
  const [viewMode, setViewMode] = useState<"cards" | "map">("map");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Automatically show modal on page reload / entry
    setIsModalOpen(true);
  }, []);

  const { data: apiDistricts } = useQuery({
    queryKey: ["districts", locale],
    queryFn: async () => {
      const res = await newsApi.getDistrictsClient(locale);
      return res?.results || [];
    },
    initialData: initialDistricts,
    staleTime: 60 * 1000,
  });

  const districts = useMemo(() => {
    return DISTRICTS.map((fallback) => {
      const apiD = Array.isArray(apiDistricts)
        ? apiDistricts.find((item: any) => item.slug === fallback.slug)
        : undefined;
      if (!apiD) return fallback;

      const dynamicAccent =
        apiD.accentColor ||
        apiD.accent_color ||
        fallback.accentColor;

      return {
        ...fallback,
        ...apiD,
        name:
          typeof apiD.name === "string"
            ? typeof fallback.name === "object" && fallback.name !== null
              ? { ...fallback.name, [locale]: apiD.name }
              : apiD.name
            : apiD.name || fallback.name,
        description:
          typeof apiD.description === "string"
            ? typeof fallback.description === "object" && fallback.description !== null
              ? { ...fallback.description, [locale]: apiD.description }
              : apiD.description
            : apiD.description || fallback.description,
        accentColor: dynamicAccent,
        heroImage: apiD.heroImage || fallback.heroImage,
      };
    });
  }, [apiDistricts, locale]);

  const activeDistrict =
    districts.find((d) => d.slug === activeDistrictSlug) || districts[0];
  const activeGeo =
    DISTRICT_GEO_DETAILS[activeDistrict.slug] || DISTRICT_GEO_DETAILS.kailali;

  return (
    <section className="mb-10">
      {/* ── Signature FT Section Divider ── */}
      <FTSectionDivider
        title={
          locale === "ne"
            ? "सुदूरपश्चिमका ९ जिल्लाहरू"
            : "9 Districts of Sudurpashchim"
        }
        enTitle="District Directory & Atlas"
        rightNode={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-1 py-1.5 text-xs font-bold text-brand-secondary bg-brand-secondary/8 hover:bg-brand-secondary hover:text-white border border-brand-secondary/25 rounded-none transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
          >
            <MapPin size={13} />
            <span>
              {locale === "ne" ? "नक्सा पपअप खोल्नुहोस्" : "Open Atlas Modal"}
            </span>
          </button>
        }
      />

      {/* ── MODE 1: Clean Minimal District Cards (Prominent Map + Large Fonts, Zero Clutter) ── */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 w-full max-w-full overflow-hidden min-w-0">
          {districts.map((d) => {
            const realPath =
              DISTRICT_REAL_INDIVIDUAL_PATHS[d.slug] ||
              DISTRICT_REAL_INDIVIDUAL_PATHS.kailali;
            const geoInfo =
              DISTRICT_GEO_DETAILS[d.slug] || DISTRICT_GEO_DETAILS.kailali;

            return (
              <Link
                key={d.slug}
                href={`/district/${d.slug}`}
                className="group bg-background hover:bg-surface border border-border hover:border-brand-secondary p-3.5 sm:p-4 transition-all duration-200 flex flex-col justify-between relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md min-w-0"
              >
                {/* District Accent Color Top Hairline */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-90 group-hover:opacity-100"
                  style={{ backgroundColor: d.accentColor }}
                />

                {/* ── Large Clean Map Silhouette (Prominent, High-Resolution, No Watermarks) ── */}
                <div className="relative h-28 sm:h-32 w-full flex items-center justify-center my-2.5">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full max-h-28 sm:max-h-32 p-1 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm select-none"
                  >
                    {/* Subtle Drop Shadow */}
                    <path
                      d={realPath}
                      fill="currentColor"
                      opacity="0.08"
                      transform="translate(1.2, 1.8)"
                    />
                    {/* Vibrant Silhouette in District's Signature Palette */}
                    <path
                      d={realPath}
                      fill={d.accentColor}
                      opacity="0.95"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </svg>
                </div>

                {/* ── Minimal Editorial Typography (Large Fonts, Only Essentials) ── */}
                <div className="pt-2.5 border-t border-border flex items-end justify-between gap-1 min-w-0">
                  <div className="min-w-0 flex-1">
                    {/* Large District Name */}
                    <h3 className="text-xl sm:text-[22px] font-black font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-tight truncate">
                      {t(d.name, locale)}
                    </h3>

                    {/* Clean English Subtitle */}
                    {typeof d.name === "object" && d.name?.en && (
                      <div className="text-[11px] font-mono font-medium tracking-normal text-muted-foreground mt-0.5 truncate">
                        {d.name.en}
                      </div>
                    )}

                    {/* Single Minimal Headquarters Tag */}
                    <div className="text-xs text-muted-foreground font-semibold mt-1.5 flex items-center gap-1 font-sans">
                      <MapPin
                        size={12}
                        style={{ color: d.accentColor }}
                        className="shrink-0"
                      />
                      <span className="truncate">
                        {geoInfo.headquarters.ne}
                      </span>
                    </div>
                  </div>

                  {/* Clean Subtle Chevron */}
                  <div className="text-muted-foreground group-hover:text-brand-secondary group-hover:translate-x-0.5 transition-all shrink-0 pb-0.5">
                    <ChevronRight size={17} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── MODE 2: Interactive Real Geographic Province Map ── */}
      {viewMode === "map" && (
        <div className="bg-surface border border-border p-3.5 sm:p-7 max-w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full max-w-full min-w-0 overflow-hidden">
            {/* Left: Master Interactive SVG Map of Sudurpashchim (8 cols) */}
            <div className="lg:col-span-8 relative min-w-0 w-full overflow-hidden">
              {/* Cartographic Compass & Province Meta */}
              <div className="absolute top-2 left-2 z-10 bg-background/95 border border-border p-2.5 text-xs text-muted-foreground shadow-2xs flex flex-col gap-0.5 pointer-events-none">
                <span className="text-[10px] text-brand-secondary font-mono tracking-normal block font-bold">
                  Survey Map
                </span>
                <span className="text-base font-bold font-headline text-foreground">
                  {locale === "ne"
                    ? "सुदूरपश्चिम प्रदेश"
                    : "Sudurpashchim Province"}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {locale === "ne" ? "१९,५३९ वर्ग कि.मी." : "19,539 sq. km"}
                </span>
              </div>

              {/* Geographic Border Annotations */}
              <div className="absolute top-2 right-4 z-10 text-right pointer-events-none hidden sm:block">
                <span className="text-[11px] font-medium text-muted-foreground tracking-normal font-sans">
                  {locale === "ne"
                    ? "उत्तर: तिब्बत (चीन) सीमा"
                    : "North: Tibet (China) Border"}
                </span>
              </div>
              <div className="absolute bottom-2 left-4 z-10 pointer-events-none hidden sm:block">
                <span className="text-[11px] font-medium text-muted-foreground tracking-normal font-sans">
                  {locale === "ne"
                    ? "पश्चिम: महाकाली नदी / भारत"
                    : "West: Mahakali River / India"}
                </span>
              </div>
              <div className="absolute bottom-2 right-4 z-10 text-right pointer-events-none hidden sm:block">
                <span className="text-[11px] font-medium text-muted-foreground tracking-normal font-sans">
                  {locale === "ne"
                    ? "पूर्व: कर्णाली नदी र प्रदेश"
                    : "East: Karnali River & Province"}
                </span>
              </div>

              {/* SVG Map of Sudurpashchim Province with real borders and district color palette */}
              <div className="w-full max-w-full aspect-[600/680] max-h-[580px] mx-auto relative flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 -30 600 680"
                  className="w-full h-full max-w-full select-none"
                  style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.08))" }}
                >
                  <g className="transition-all duration-300">
                    {districts.map((d) => {
                      const path = DISTRICT_PROVINCE_PATHS[d.slug];
                      if (!path) return null;
                      const isActive = activeDistrictSlug === d.slug;

                      return (
                        <g
                          key={d.slug}
                          className="cursor-pointer group"
                          onClick={() => router.push(`/district/${d.slug}`)}
                          onMouseEnter={() => setActiveDistrictSlug(d.slug)}
                        >
                          <path
                            d={path}
                            fill={d.accentColor}
                            opacity={isActive ? 1 : 0.88}
                            stroke="#FFFFFF"
                            strokeWidth={isActive ? "2" : "1.6"}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            className="transition-all duration-200 hover:opacity-100"
                            style={{
                              transform: isActive ? "scale(1.004)" : "scale(1)",
                              transformOrigin: "center center",
                            }}
                          />
                        </g>
                      );
                    })}

                    {/* Crisp Flowing White Border Highlight for Active / Hovered District */}
                    {activeDistrictSlug && DISTRICT_PROVINCE_PATHS[activeDistrictSlug] && (
                      <path
                        d={DISTRICT_PROVINCE_PATHS[activeDistrictSlug]}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeDasharray="10 8"
                        className="pointer-events-none animate-flowing-border"
                      />
                    )}

                    {/* Centroid Labels & Headquarters Pins */}
                    {districts.map((d) => {
                      const centroid = DISTRICT_CENTROIDS[d.slug];
                      if (!centroid) return null;
                      const isActive = activeDistrictSlug === d.slug;
                      const [cx, cy] = centroid;

                      return (
                        <g
                          key={`label-${d.slug}`}
                          className="pointer-events-none transition-all duration-200"
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isActive ? 5 : 3.5}
                            fill={isActive ? "#FFFFFF" : d.accentColor}
                            stroke="#FFFFFF"
                            strokeWidth={isActive ? 2 : 1.5}
                          />

                          {d.slug === "kailali" && (
                            <text
                              x={cx + 7}
                              y={cy - 2}
                              fontSize="13"
                              fontWeight="900"
                              fill={isActive ? "#FFFFFF" : d.accentColor}
                              stroke="#FFFFFF"
                              strokeWidth="0.5"
                            >
                              ★
                            </text>
                          )}

                          <text
                            x={cx}
                            y={cy + 16}
                            textAnchor="middle"
                            fontSize={isActive ? "14" : "12"}
                            fontWeight="800"
                            fill={isActive ? "#FFFFFF" : "var(--foreground)"}
                            stroke={isActive ? "rgba(0,0,0,0.5)" : "var(--background)"}
                            strokeWidth={isActive ? "2" : "3"}
                            paintOrder="stroke"
                            className="font-sans"
                          >
                            {t(d.name, locale)}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </div>

            {/* Right: Selected District Live Insight Panel (4 cols) */}
            <div className="lg:col-span-4 min-w-0">
              <div
                className="bg-background p-5 sm:p-6 border border-border flex flex-col justify-between h-full shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                style={{ borderTop: `3px solid ${activeDistrict.accentColor}` }}
              >
                <div>
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                    <span
                      className="text-[11px] font-bold tracking-normal font-mono"
                      style={{ color: activeDistrict.accentColor }}
                    >
                      District Profile • विवरण
                    </span>
                  </div>

                  {/* District Titles */}
                  <h3 className="text-2xl sm:text-3xl font-black font-headline text-foreground leading-tight mb-1">
                    {t(activeDistrict.name, locale)}
                  </h3>
                  <div className="text-[11px] font-medium text-muted-foreground tracking-normal mb-4 font-sans">
                    {locale === "ne"
                      ? `${typeof activeDistrict.name === "object" && activeDistrict.name?.en ? activeDistrict.name.en : t(activeDistrict.name, "en")} District`
                      : `${t(activeDistrict.name, "ne")} जिल्ला`}
                  </div>

                  {/* Real mini silhouette preview in district accent color */}
                  <div className="h-24 w-full bg-surface border border-border flex items-center justify-center p-3 mb-5">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <path
                        d={
                          DISTRICT_REAL_INDIVIDUAL_PATHS[activeDistrict.slug] ||
                          DISTRICT_REAL_INDIVIDUAL_PATHS.kailali
                        }
                        fill={activeDistrict.accentColor}
                        opacity="0.95"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </div>

                  {/* Key Geographic Details */}
                  <div className="space-y-3 text-xs sm:text-[13px] text-foreground font-sans">
                    <div className="flex items-start gap-2.5 pb-2.5 border-b border-border">
                      <MapPin
                        size={14}
                        style={{ color: activeDistrict.accentColor }}
                        className="shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="text-muted-foreground block text-[11px] tracking-normal font-medium">
                          {locale === "ne" ? "सदरमुकाम:" : "Headquarters:"}
                        </span>
                        <strong className="text-foreground">
                          {locale === "ne"
                            ? activeGeo.headquarters.ne
                            : activeGeo.headquarters.en}
                        </strong>
                        {locale === "ne" && ` (${activeGeo.headquarters.en})`}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pb-2.5 border-b border-border">
                      <MapPin
                        size={14}
                        style={{ color: activeDistrict.accentColor }}
                        className="shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="text-muted-foreground block text-[11px] tracking-normal font-medium">
                          {locale === "ne" ? "मुख्य स्थल:" : "Major Landmark:"}
                        </span>
                        <strong className="text-foreground">
                          {locale === "ne"
                            ? activeGeo.landmark.ne
                            : activeGeo.landmark.en}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link in District Accent Color */}
                <div className="pt-5 mt-5 border-t border-border">
                  <Link
                    href={`/district/${activeDistrict.slug}`}
                    style={{ backgroundColor: activeDistrict.accentColor }}
                    className="w-full py-2.5 px-4 text-white font-bold text-xs tracking-normal font-sans flex items-center justify-center gap-2 transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                  >
                    <span>
                      {locale === "ne"
                        ? `${t(activeDistrict.name, "ne")}का समाचार पढ्नुहोस्`
                        : `Read ${t(activeDistrict.name, "en")} News`}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── Interactive Province Atlas Modal Popup ── */}
      <DistrictAtlasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDistrictSlug={activeDistrictSlug}
        districts={districts}
      />
    </section>
  );
}
