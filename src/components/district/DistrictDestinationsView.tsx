"use client";

import Image from "next/image";
import { Compass, MapPin, ArrowRight } from "lucide-react";
import type { District } from "@/types";
import { normalizeImageUrl, t as translate } from "@/lib/utils";
import DistrictFactsheet from "./DistrictFactsheet";

interface DistrictDestinationsViewProps {
  district: District;
  theme: {
    primary: string;
    light: string;
    border: string;
  };
  locale: string;
  isDark: boolean;
}

export default function DistrictDestinationsView({
  district,
  theme,
  locale,
  isDark,
}: DistrictDestinationsViewProps) {
  const t = (val: any) => translate(val, locale as "ne" | "en");
  const stats = district.stats;
  const places = district.places || [];

  return (
    <div className="container-editorial pb-14 space-y-8">
      {/* Travel Factsheet Bar */}
      {stats && (
        <DistrictFactsheet
          stats={stats}
          districtSlug={district.slug}
          districtName={district.name}
          theme={theme}
          locale={locale}
          isDark={isDark}
          variant="travel"
        />
      )}

      {/* Destinations Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-baseline gap-2">
            <span
              className="text-[11px] font-bold font-mono"
              style={{ color: theme.primary }}
            >
              गन्तव्य सूची
            </span>
            <span className="text-rule">•</span>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
              {locale === "ne"
                ? `${t(district.name)}का प्रमुख पर्यटकीय, प्राकृतिक र साँस्कृतिक स्थलहरू`
                : `Key Attractions & Destinations in ${t(district.name)}`}
            </h2>
          </div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-none"
            style={{ backgroundColor: theme.light, color: theme.primary }}
          >
            {places.length} मुख्य गन्तव्यहरू
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {places.map((place, idx) => (
            <div
              key={idx}
              className="bg-background rounded-none border border-black/[0.08] dark:border-white/[0.08] hover:shadow-lg transition-all flex flex-col group overflow-hidden shadow-2xs"
              style={{ borderTop: `3px solid ${theme.primary}` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-hover">
                <Image
                  src={
                    normalizeImageUrl(place.image) ||
                    normalizeImageUrl(district.heroImage)
                  }
                  alt={t(place.title)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3">
                  <span
                    className="text-xs font-bold font-sans px-3 py-1 text-white rounded-none shadow-2xs"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {place.category === "nature"
                      ? "प्राकृतिक • Nature"
                      : place.category === "spiritual"
                        ? "धार्मिक • Shrine"
                        : place.category === "heritage"
                          ? "ऐतिहासिक • Heritage"
                          : "संस्कृति • Culture"}
                  </span>
                </div>
                {place.highlight && (
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-mono font-semibold">
                    {place.highlight}
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors mb-2.5">
                    {t(place.title)}
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed font-sans mb-4">
                    {t(place.description)}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-sans">
                    <MapPin size={13} style={{ color: theme.primary }} />
                    <span>{t(district.name)} जिल्ला</span>
                  </span>
                  <span
                    className="font-bold flex items-center gap-1"
                    style={{ color: theme.primary }}
                  >
                    <span>
                      {locale === "ne" ? "विस्तृत विवरण" : "Read More"}
                    </span>
                    <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Travel Advisory / Tip box */}
        <div
          className="p-5 sm:p-6 rounded-none border shadow-2xs"
          style={{
            backgroundColor: theme.light,
            borderColor: theme.border,
          }}
        >
          <h4
            className="text-sm font-bold font-sans mb-2 flex items-center gap-2"
            style={{ color: theme.primary }}
          >
            <Compass size={16} />
            <span>
              {locale === "ne"
                ? "यात्रा सल्लाह तथा उपयुक्त मौसम (Travel Advisory)"
                : "Travel Advisory & Best Time"}
            </span>
          </h4>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed font-sans">
            {locale === "ne"
              ? `${t(district.name)} भ्रमणका लागि शरद ऋतु (असोज-मंसिर) र वसन्त ऋतु (फागुन-वैशाख) सबैभन्दा उपयुक्त मानिन्छ। स्थानीय परिकार, सांस्कृतिक मेला र जैविक विविधताको प्रत्यक्ष अनुभव लिन स्थानीय गाइड तथा पर्यटन सूचना केन्द्रको सहयोग लिनुहोस्।`
              : `The best time to visit ${t(district.name)} is during autumn (September–November) and spring (February–April). For trekking, alpine sanctuary visits, or cultural fairs, local homestays and community guides offer an authentic regional experience.`}
          </p>
        </div>
      </div>
    </div>
  );
}
