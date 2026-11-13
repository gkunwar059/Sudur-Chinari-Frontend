"use client";

import { Sparkles, Compass } from "lucide-react";
import type { BilingualText } from "@/types";
import { t as translate } from "@/lib/utils";

export const DISTRICT_WEATHER: Record<
  string,
  { temp: string; weather: { ne: string; en: string } }
> = {
  kailali: { temp: "32°C", weather: { ne: "घमाइलो", en: "Sunny" } },
  kanchanpur: { temp: "31°C", weather: { ne: "सफा", en: "Clear" } },
  dadeldhura: { temp: "24°C", weather: { ne: "शीतल", en: "Pleasant" } },
  baitadi: { temp: "22°C", weather: { ne: "बादल", en: "Partly Cloudy" } },
  doti: { temp: "26°C", weather: { ne: "घमाइलो", en: "Sunny" } },
  achham: { temp: "25°C", weather: { ne: "सफा", en: "Clear" } },
  bajura: { temp: "19°C", weather: { ne: "चिसो", en: "Chilly" } },
  bajhang: { temp: "20°C", weather: { ne: "घमाइलो", en: "Sunny" } },
  darchula: { temp: "18°C", weather: { ne: "शीतल", en: "Alpine Crisp" } },
};

interface DistrictFactsheetProps {
  stats: any;
  districtSlug: string;
  districtName: BilingualText | string;
  theme: {
    primary: string;
    light?: string;
    border?: string;
  };
  locale: string;
  isDark?: boolean;
  variant?: "general" | "travel";
}

export default function DistrictFactsheet({
  stats,
  districtSlug,
  districtName,
  theme,
  locale,
  isDark = false,
  variant = "general",
}: DistrictFactsheetProps) {
  if (!stats) return null;

  const t = (val: any) => translate(val, locale as "ne" | "en");
  const isTravel = variant === "travel";

  return (
    <div
      className="p-5 sm:p-6 rounded-none border shadow-2xs transition-all"
      style={{
        backgroundColor: isDark ? "var(--surface)" : theme.light,
        borderColor: isDark ? "var(--border)" : theme.border,
      }}
    >
      <div className="flex items-center gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.06] mb-4">
        {isTravel ? (
          <Compass size={16} style={{ color: theme.primary }} />
        ) : (
          <Sparkles size={16} style={{ color: theme.primary }} />
        )}
        <h3 className="text-xs sm:text-sm font-bold font-sans text-foreground">
          {locale === "ne"
            ? isTravel
              ? `${t(districtName)} भौगोलिक तथा पर्यटकीय विवरण (Travel Factsheet)`
              : `${t(districtName)} जिल्ला संक्षिप्त विवरण (Factsheet)`
            : isTravel
              ? `${t(districtName)} Travel & Geographic Profile`
              : `${t(districtName)} District Profile`}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs font-sans">
        {/* Item 1 */}
        {isTravel ? (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              उचाइ (Elevation)
            </span>
            <strong className="text-foreground text-sm block mt-0.5">
              {stats.elevation || "१,००० - ३,५०० मि."}
            </strong>
          </div>
        ) : (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              क्षेत्रफल (Area)
            </span>
            <strong className="text-foreground text-sm block mt-0.5">
              {stats.area}
            </strong>
          </div>
        )}

        {/* Item 2 */}
        {isTravel ? (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              सदरमुकाम (HQ)
            </span>
            <strong className="text-foreground text-sm block mt-0.5 truncate">
              {t(stats.headquarters)}
            </strong>
          </div>
        ) : (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              जनसंख्या (Pop.)
            </span>
            <strong className="text-foreground text-sm block mt-0.5">
              {stats.population}
            </strong>
          </div>
        )}

        {/* Item 3 */}
        {isTravel ? (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              क्षेत्रफल (Area)
            </span>
            <strong className="text-foreground text-sm block mt-0.5">
              {stats.area}
            </strong>
          </div>
        ) : (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              सदरमुकाम (HQ)
            </span>
            <strong className="text-foreground text-xs sm:text-sm block mt-0.5 truncate">
              {t(stats.headquarters)}
            </strong>
          </div>
        )}

        {/* Item 4: Local Units */}
        <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
          <span className="text-muted-foreground block text-[10.5px] font-mono">
            स्थानीय तह (Units)
          </span>
          <strong className="text-foreground text-sm block mt-0.5">
            {stats.palikas?.total ?? ""} तह ({stats.palikas?.municipalities ?? 0}{" "}
            न.पा. / {stats.palikas?.ruralMunicipalities ?? 0} गाउँ)
          </strong>
        </div>

        {/* Item 5: Major Rivers */}
        <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
          <span className="text-muted-foreground block text-[10.5px] font-mono">
            प्रमुख नदी (Rivers)
          </span>
          <strong className="text-foreground text-xs block mt-0.5 truncate">
            {t(stats.majorRivers)}
          </strong>
        </div>

        {/* Item 6 */}
        {isTravel ? (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              मौसम स्थिति (Weather)
            </span>
            <strong className="text-foreground text-sm block mt-0.5">
              {DISTRICT_WEATHER[districtSlug]?.temp || "२४°C"} •{" "}
              {t(
                DISTRICT_WEATHER[districtSlug]?.weather || {
                  ne: "शीतल",
                  en: "Pleasant",
                },
              )}
            </strong>
          </div>
        ) : (
          <div className="bg-background/95 p-3.5 rounded-none border border-black/[0.06] dark:border-white/[0.06] shadow-2xs">
            <span className="text-muted-foreground block text-[10.5px] font-mono">
              साक्षरता (Literacy)
            </span>
            <strong className="text-foreground text-sm block mt-0.5">
              {stats.literacy}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
