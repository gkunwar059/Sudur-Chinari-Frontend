"use client";

import React, { useState } from "react";
import { DISTRICT_PROVINCE_PATHS } from "@/data/districtMaps";
import { SUDURPASHCHIM_DISTRICTS_LIST } from "@/data/yatayatData";
import { MapPin, Compass } from "lucide-react";

interface SudurMapWidgetProps {
  selectedDistrict?: string | null;
  onSelectDistrict?: (districtSlug: string | null) => void;
  locale?: string;
}

const DISTRICT_COLORS: Record<string, { fill: string; hover: string; text: string }> = {
  dadeldhura: { fill: "#FCA5A5", hover: "#EF4444", text: "text-red-700 dark:text-red-300" },
  kanchanpur: { fill: "#93C5FD", hover: "#3B82F6", text: "text-blue-700 dark:text-blue-300" },
  doti: { fill: "#FDE047", hover: "#EAB308", text: "text-amber-700 dark:text-amber-300" },
  bajhang: { fill: "#86EFAC", hover: "#22C55E", text: "text-emerald-700 dark:text-emerald-300" },
  bajura: { fill: "#D8B4FE", hover: "#A855F7", text: "text-purple-700 dark:text-purple-300" },
  achham: { fill: "#F9A8D4", hover: "#EC4899", text: "text-pink-700 dark:text-pink-300" },
  kailali: { fill: "#6EE7B7", hover: "#10B981", text: "text-teal-700 dark:text-teal-300" },
  baitadi: { fill: "#7DD3FC", hover: "#0284C7", text: "text-sky-700 dark:text-sky-300" },
  darchula: { fill: "#FDBA74", hover: "#F97316", text: "text-orange-700 dark:text-orange-300" },
};

export default function SudurMapWidget({
  selectedDistrict,
  onSelectDistrict,
  locale = "ne",
}: SudurMapWidgetProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeSlug = hoveredSlug || selectedDistrict;

  return (
    <div className="bg-background border border-border border-t-[3px] border-t-brand-secondary rounded-none p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <MapPin size={16} className="text-brand-secondary shrink-0" />
        <h3 className="text-sm font-bold text-foreground font-sans">
          {locale === "ne"
            ? "सुदूरपश्चिमको नक्सा र मुख्य रूटहरू"
            : "Sudurpashchim Map & Key Routes"}
        </h3>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center">
        {/* SVG Map (7 cols) */}
        <div className="col-span-7 relative flex items-center justify-center bg-surface/50 rounded-none p-2 border border-border">
          <svg
            viewBox="20 0 560 650"
            className="w-full h-auto max-h-[220px]"
          >
            <g>
              {Object.entries(DISTRICT_PROVINCE_PATHS).map(([slug, pathD]) => {
                const colorInfo = DISTRICT_COLORS[slug] || {
                  fill: "#CBD5E1",
                  hover: "#64748B",
                };
                const isSelected = activeSlug === slug;

                return (
                  <path
                    key={slug}
                    d={pathD}
                    fill={isSelected ? colorInfo.hover : colorInfo.fill}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="transition-colors duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSlug(slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    onClick={() =>
                      onSelectDistrict?.(
                        selectedDistrict === slug ? null : slug
                      )
                    }
                  >
                    <title>{slug}</title>
                  </path>
                );
              })}
            </g>
          </svg>

          {/* Compass Rose icon at bottom left corner like screenshot */}
          <div className="absolute bottom-1 left-1 opacity-70 flex flex-col items-center select-none pointer-events-none">
            <Compass size={20} className="text-muted-foreground" />
            <span className="text-[8px] font-mono font-bold text-muted-foreground">N</span>
          </div>
        </div>

        {/* District list with small colored dots / tags (5 cols) */}
        <div className="col-span-5 flex flex-col gap-1 py-1">
          {SUDURPASHCHIM_DISTRICTS_LIST.map((district) => {
            const isHovered = activeSlug === district.slug;
            const color = DISTRICT_COLORS[district.slug]?.hover || "#05965B";

            return (
              <button
                key={district.slug}
                type="button"
                onMouseEnter={() => setHoveredSlug(district.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onClick={() =>
                  onSelectDistrict?.(
                    selectedDistrict === district.slug ? null : district.slug
                  )
                }
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-none text-left text-xs font-medium transition-all ${
                  isHovered
                    ? "bg-brand/10 font-bold text-brand translate-x-0.5"
                    : "text-foreground hover:bg-surface"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-none shrink-0 border border-white dark:border-gray-900 shadow-2xs"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">
                  {locale === "ne" ? district.name : district.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
