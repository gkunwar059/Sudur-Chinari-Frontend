
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { Compass } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import type { Locale } from "@/lib/i18n/config";
import { normalizeImageUrl, t } from "@/lib/utils";
import { DISTRICT_REAL_INDIVIDUAL_PATHS } from "@/data/districtMaps";
import { mergeDistrictList } from "@/lib/districts";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";

interface StayDirectoryViewProps {
  districts: any[];
  locale: Locale;
}

export default function StayDirectoryView({
  districts,
  locale,
}: StayDirectoryViewProps) {
  const districtsData = mergeDistrictList(districts);

  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
      {/* ── Broadsheet Breadcrumb ── */}
      <FTBreadcrumb
        locale={locale}
        items={[
          { name: locale === "ne" ? "होटल तथा बासस्थान" : "Hotels & Stay" },
        ]}
      />

      {/* ── Broadsheet Page Masthead Banner ── */}
      <div className="border-b border-border bg-background">
        <div className="container-editorial py-8 sm:py-10 pt-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Left Content */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-secondary mb-1.5">
                <Compass size={14} />
                <span>
                  {locale === "ne"
                    ? "सुदूरपश्चिम प्रदेश • डिजिटल होटल निर्देशिका"
                    : "Sudurpaschim Province • Digital Hotel Directory"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-foreground tracking-tight leading-tight">
                {locale === "ne" ? "होटल तथा बासस्थान" : "Hotels & Stay"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-sans mt-2 max-w-2xl leading-relaxed">
                {locale === "ne"
                  ? "सुदूरपश्चिम प्रदेशका उत्कृष्ट होटल, रिसोर्ट, लज र होमस्टेहरूको विस्तृत जानकारी। कुन जिल्लामा बस्न चाहनुहुन्छ, छान्नुहोस् र सुरक्षित बसाइको आनन्द लिनुहोस्।"
                  : "Discover the finest hotels, resorts, lodges, and homestays across Sudurpaschim Province. Choose a district below to find your perfect stay."}
              </p>

              {/* Province Geographic Meta Strip */}
              <div className="flex items-center gap-4 text-xs font-mono bg-surface border border-border p-3 mt-6 shrink-0 self-start md:self-auto select-none w-fit">
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    {locale === "ne" ? "कुल जिल्ला" : "Total Districts"}
                  </span>
                  <span className="font-bold text-brand text-sm">
                    {locale === "ne" ? "९ जिल्लाहरू" : "9 Districts"}
                  </span>
                </div>
                <div className="h-7 w-[1px] bg-surface-hover" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    {locale === "ne" ? "बसोबास" : "Accommodations"}
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {locale === "ne" ? "होटल र रिसोर्ट" : "Hotels & Resorts"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Ad Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-4 shrink-0 self-stretch md:self-auto">
              {/* Advertisement Placeholder */}
              <div className="hidden sm:flex items-center justify-center w-[250px] lg:w-[320px] min-h-[100px] h-full bg-surface border border-dashed border-border select-none">
                <span className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase">
                  {locale === "ne" ? "विज्ञापन" : "Advertisement"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Broadsheet Directory Sections Grouped by Geographical Belts ── */}
      {/* District Cards Grid - Modern Horizontal Banners */}
      <div className="container-editorial py-10 sm:py-12">
        <FTSectionDivider
          title={locale === "ne" ? "जिल्लागत होटल तथा बासस्थान" : "Hotels & Stay by District"}
          enTitle={locale === "ne" ? "Accommodations by District" : undefined}
          as="h2"
          className="!my-0 mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {districtsData.map((district: any) => {
            const silhouettePath =
              DISTRICT_REAL_INDIVIDUAL_PATHS[district.slug] ||
              DISTRICT_REAL_INDIVIDUAL_PATHS.kailali;

            // Handle localized or string description
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
                href={`/stay/district/${district.slug}`}
                className="group relative rounded-none overflow-hidden border border-border border-t-[3px] bg-card hover:bg-surface transition-all duration-300 shadow-xs hover:shadow-md min-h-[120px] sm:min-h-[140px] flex flex-col justify-between"
                style={{
                  borderTopColor: district.accentColor,
                }}
              >
                {/* Right-Aligned District Photo with Seamless Mask */}
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

                {/* Editorial Gradient Scrim for Small Screens */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-card via-card/95 via-45% to-card/25 sm:hidden pointer-events-none" />

                {/* Mini Vector Silhouette Badge Floating Top-Right */}
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

                {/* Content Area on the Left */}
                <div className="relative z-20 w-full sm:w-[62%] md:w-[58%] p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* District Title & English Name */}
                    <div className="flex items-baseline gap-2 mb-1 pr-12 sm:pr-0">
                      <h3
                        className="text-2xl sm:text-[26px] font-bold font-headline leading-tight"
                        style={{ color: district.accentColor }}
                      >
                        {districtDisplayName}
                      </h3>
                      {typeof district.name === "object" && (
                        <span className="text-xs font-mono text-muted-foreground font-semibold">
                          {locale === "ne"
                            ? district.name.en
                            : district.name.ne}
                        </span>
                      )}
                    </div>
                    {/* District Description */}
                    {descText && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed pr-2">
                        {descText}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
