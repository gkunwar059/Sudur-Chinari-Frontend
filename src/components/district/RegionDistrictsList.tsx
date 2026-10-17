import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { MapPin, ArrowRight } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import type { Locale } from "@/lib/i18n/config";
import { t, normalizeImageUrl } from "@/lib/utils";
import {
  DISTRICT_REAL_INDIVIDUAL_PATHS,
  DISTRICT_GEO_DETAILS,
} from "@/data/districtMaps";

// Geographic classification
export const REGIONS = [
  {
    id: "terai",
    name: "तराई भेग",
    enName: "Terai Plains",
    count: 2,
    slugs: ["kailali", "kanchanpur"],
    description:
      "समथर भूभाग, प्रमुख व्यापारिक तथा आर्थिक केन्द्र एवं प्रदेश राजधानी",
    enDescription:
      "Flatlands, major commercial/economic centers and province capital",
  },
  {
    id: "pahad",
    name: "पहाडी भेग",
    enName: "Mid-Hills",
    count: 4,
    slugs: ["dadeldhura", "baitadi", "doti", "achham"],
    description:
      "ऐतिहासिक गढी, कोट, प्राचीन मन्दिर, नदी उपत्यका तथा साँस्कृतिक धरोहर",
    enDescription:
      "Historic forts, ancient temples, river valleys, and cultural heritage",
  },
  {
    id: "himal",
    name: "हिमाली भेग",
    enName: "High Himalayas",
    count: 3,
    slugs: ["darchula", "bajhang", "bajura"],
    description:
      "अपि र साइपाल हिमाल, ताल-सरोवर, उच्च हिमाली भेग र त्रिदेशीय सीमा",
    enDescription:
      "Api and Saipal mountains, alpine lakes, high Himalayas and tri-border",
  },
];

interface RegionDistrictsListProps {
  districtsData: any[];
  locale: Locale;
}

export default function RegionDistrictsList({
  districtsData,
  locale,
}: RegionDistrictsListProps) {
  return (
    <div className="container-editorial py-10 sm:py-12 space-y-12">
      {REGIONS.map((region, rIdx) => {
        const regionDistricts = districtsData.filter((d: any) =>
          region.slugs.includes(d.slug),
        );

        if (regionDistricts.length === 0) return null;

        return (
          <section key={region.id}>
            {/* Signature FT Section Divider */}
            <FTSectionDivider
              sectionIndex={locale === "ne" ? `०${rIdx + 1}` : `0${rIdx + 1}`}
              title={locale === "ne" ? region.name : region.enName}
              enTitle={`${locale === "ne" ? region.enName : region.name} (${region.count} ${locale === "ne" ? "जिल्ला" : "Districts"})`}
              rightNode={
                <span className="text-xs text-muted-foreground font-sans hidden md:inline">
                  {locale === "ne" ? region.description : region.enDescription}
                </span>
              }
              className="!my-0 mb-6"
            />

            {/* District Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {regionDistricts.map((district: any) => {
                const geo =
                  DISTRICT_GEO_DETAILS[
                    district.slug as keyof typeof DISTRICT_GEO_DETAILS
                  ] || DISTRICT_GEO_DETAILS.kailali;
                const silhouettePath =
                  DISTRICT_REAL_INDIVIDUAL_PATHS[district.slug] ||
                  DISTRICT_REAL_INDIVIDUAL_PATHS.kailali;

                const rawDesc =
                  typeof district.description === "string"
                    ? district.description
                    : locale === "ne"
                      ? district.description?.ne
                      : district.description?.en;
                const descText = rawDesc || "";

                const districtDisplayName = t(district.name, locale);

                return (
                  <Link
                    key={district.slug}
                    href={`/district/${district.slug}`}
                    className="group relative rounded-none overflow-hidden border border-border border-t-[3px] bg-card hover:bg-surface transition-all duration-300 shadow-xs hover:shadow-md min-h-[250px] flex flex-col justify-between"
                    style={{
                      borderTopColor: district.accentColor,
                    }}
                  >
                    {/* District Photo with Seamless Mask */}
                    <div className="absolute inset-0 w-full h-full seamless-mask-card pointer-events-none select-none">
                      <Image
                        src={
                          normalizeImageUrl(district.heroImage) ||
                          '/images/himalaya_banner.jpg'
                        }
                        alt={districtDisplayName}
                        fill
                        className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
                      />
                    </div>

                    {/* Editorial Gradient Scrim for Small Screens (seamless contrast without blocking right-aligned photo) */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-card via-card/95 via-45% to-card/25 sm:hidden pointer-events-none" />

                    {/* Vector Silhouette Badge */}
                    <div className="absolute top-3.5 right-3.5 z-20 w-9 h-9 bg-background/90 backdrop-blur-xs border border-border rounded-none p-1 flex items-center justify-center shadow-2xs">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full select-none"
                      >
                        <path
                          d={silhouettePath}
                          fill={district.accentColor}
                          opacity="0.95"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    {/* Content Area */}
                    <div className="relative z-20 w-full sm:w-[62%] md:w-[58%] p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-baseline gap-2 mb-1 pr-12 sm:pr-0">
                          <h3
                            className="text-2xl sm:text-[26px] font-bold font-headline leading-tight"
                            style={{ color: district.accentColor }}
                          >
                            {districtDisplayName}
                          </h3>
                          {typeof district.name === "object" && (
                            <span className="text-xs font-mono text-muted-foreground font-semibold">
                              {locale === "ne" ? district.name.en : district.name.ne}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-foreground font-sans mb-2.5 pr-8 sm:pr-0">
                          <div className="flex items-center gap-1 font-medium">
                            <MapPin
                              size={12}
                              style={{ color: district.accentColor }}
                              className="shrink-0"
                            />
                            <span>
                              {locale === "ne" ? "सदरमुकाम:" : "Headquarters:"}{" "}
                              <strong className="font-semibold text-foreground">
                                {locale === "ne"
                                  ? geo?.headquarters?.ne
                                  : geo?.headquarters?.en}
                              </strong>
                            </span>
                          </div>
                          <span className="text-muted-foreground/40">•</span>
                          <div className="text-[11.5px] font-medium text-foreground/80 dark:text-muted-foreground">
                            {locale === "ne" ? geo?.landmark?.ne : geo?.landmark?.en}
                          </div>
                        </div>

                        <p className="text-xs sm:text-[13px] text-foreground/75 dark:text-muted-foreground font-sans line-clamp-2 leading-relaxed mb-4 max-w-[88%] sm:max-w-none">
                          {descText}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none text-white text-xs font-bold shadow-xs group-hover:opacity-90 group-hover:shadow-sm transition-all"
                          style={{ backgroundColor: district.accentColor }}
                        >
                          <span>
                            {locale === "ne" ? "जिल्ला समाचार" : "District News"}
                          </span>
                          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
                        </span>

                        <span className="text-xs font-mono font-bold text-foreground/70 dark:text-muted-foreground">
                          {district.storyCount}+{" "}
                          {locale === "ne" ? "सामग्री" : "Stories"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
