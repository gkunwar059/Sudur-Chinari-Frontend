import Link from "@/components/i18n/LocalizedLink";
import { ChevronRight, Leaf } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/utils";
import { DISTRICT_REAL_INDIVIDUAL_PATHS } from "@/data/districtMaps";
import { mergeDistrictList } from "@/lib/districts";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import ProductContributionModal from "@/components/products/ProductContributionModal";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface ProductsDirectoryViewProps {
  districts: any[];
  locale: Locale;
}

export default function ProductsDirectoryView({
  districts,
  locale,
}: ProductsDirectoryViewProps) {
  const districtsData = mergeDistrictList(districts);

  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
      <FTBreadcrumb
        locale={locale}
        items={[
          { name: locale === "ne" ? "सुदूर उत्पादन" : "Local Products" },
        ]}
      />

      <div className="border-b border-border bg-background">
        <div className="container-editorial py-8 sm:py-10 pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-secondary mb-1.5">
                <Leaf size={14} />
                <span>
                  {locale === "ne"
                    ? "सुदूरपश्चिम प्रदेश • डिजिटल उत्पादन चिनारी"
                    : "Sudurpaschim Province • Local Products Directory"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-foreground tracking-tight leading-tight">
                {locale === "ne" ? "सुदूर उत्पादन" : "Local Products"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-sans mt-2 max-w-2xl leading-relaxed mb-6">
                {locale === "ne"
                  ? "सुदूरका किसान र उत्पादकलाई उपभोक्तासँग जोड्ने डिजिटल चिनारी। आफ्नो जिल्ला छान्नुहोस्।"
                  : "Connecting local farmers and producers with consumers. Choose a district below to explore."}
              </p>

              <ProductContributionModal />
            </div>

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

      <div className="container-editorial py-10 sm:py-12">
        <FTSectionDivider
          title={locale === "ne" ? "जिल्लागत स्थानीय उत्पादनहरू" : "District Local Products"}
          enTitle={locale === "ne" ? "Local Products by District" : undefined}
          as="h2"
          className="!my-0 mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {districtsData.map((district: any) => {
            const silhouettePath =
              DISTRICT_REAL_INDIVIDUAL_PATHS[district.slug] ||
              DISTRICT_REAL_INDIVIDUAL_PATHS.kailali;

            const districtDisplayName = t(district.name, locale);

            return (
              <Link
                key={district.slug}
                href={`/products/district/${district.slug}`}
                className="group editorial-card-bordered relative bg-card flex flex-col h-full justify-between hover:bg-surface border-t-4 border-x border-b border-border transition-all duration-300"
                style={{ borderTopColor: district.accentColor }}
              >
                <div className="p-5 sm:p-6 pb-4 sm:pb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
                        {locale === "ne" ? "कृषि चिनारी" : "Agri-Identity"}
                      </span>
                      <h3
                        className="text-2xl sm:text-3xl font-bold font-headline leading-tight"
                        style={{ color: district.accentColor }}
                      >
                        {districtDisplayName}
                      </h3>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 opacity-20 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d={silhouettePath} fill={district.accentColor} />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-5 sm:px-6 py-4 border-t border-border flex items-center justify-between text-xs font-bold bg-surface/50 group-hover:bg-surface transition-colors">
                  <div className="flex gap-5 sm:gap-6">
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm sm:text-base font-black">
                        {district.slug.length * 15 + 120}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {locale === "ne" ? "किसान" : "Farmers"}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm sm:text-base font-black">
                        {district.slug.length * 3 + 15}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {locale === "ne" ? "उत्पादन" : "Products"}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all">
                    <ChevronRight size={14} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
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
