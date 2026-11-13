import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Phone,
  MapPin,
} from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import {
  getDistrictsCached,
  getProductBySlugCached,
} from "@/lib/cached-data";
import { getDistrictBySlug, mergeDistrict } from "@/lib/districts";
import { t } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import PageSkeleton from "@/components/common/PageSkeleton";
import AdBanner from "@/components/common/AdBanner";

interface Props {
  params: Promise<{ lang: string; slug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug, productSlug } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const [apiDistrict, apiProduct] = await Promise.all([
    getDistrictsCached(locale)
      .then((res) => res?.results?.find((d: any) => d.slug === slug))
      .catch(() => null),
    getProductBySlugCached(productSlug, locale).catch(() => null),
  ]);
  const district: any = mergeDistrict(
    apiDistrict ?? null,
    getDistrictBySlug(slug),
  ) || { name: { ne: slug, en: slug }, slug };
  const districtName = t(district.name, locale);
  const productName = apiProduct
    ? typeof apiProduct.name === "object" ? t(apiProduct.name, locale) : apiProduct.name
    : productSlug === "ghee"
      ? (locale === "ne" ? "घ्यू" : "Ghee")
      : productSlug;

  const title =
    locale === "ne"
      ? `${districtName}को ${productName} — स्थानीय उत्पादन`
      : `${productName} from ${districtName} — Local Produce`;
  const description = apiProduct?.description
    ? (typeof apiProduct.description === "object" ? t(apiProduct.description, locale) : apiProduct.description)
    : locale === "ne"
      ? `${districtName} जिल्लाको अर्गानिक ${productName} उत्पादन, स्थानीय किसानहरू र सम्पर्क विवरण।`
      : `Organic ${productName} produce from ${districtName} district, local farmers, and contact details.`;

  return buildMetadata({
    locale,
    path: `/products/district/${slug}/${productSlug}`,
    title,
    description,
  });
}

export default function ProductDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="detail" />}>
      <ProductDetailsPageContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsPageContent({ params }: Props) {
  const { lang, slug, productSlug } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const [apiDistrict, apiProduct] = await Promise.all([
    getDistrictsCached(locale)
      .then((res) => res?.results?.find((d: any) => d.slug === slug))
      .catch(() => null),
    getProductBySlugCached(productSlug, locale).catch(() => null),
  ]);

  const district: any = mergeDistrict(
    apiDistrict ?? null,
    getDistrictBySlug(slug),
  ) || { name: { ne: slug, en: slug }, slug };
  const districtName = t(district.name, locale);

  const productName = apiProduct
    ? typeof apiProduct.name === "object" ? t(apiProduct.name, locale) : apiProduct.name
    : productSlug === "ghee"
      ? locale === "ne"
        ? "घ्यू"
        : "Ghee"
      : locale === "ne"
        ? "उत्पादन"
        : "Product";

  const productDescription = apiProduct?.description
    ? (typeof apiProduct.description === "object" ? t(apiProduct.description, locale) : apiProduct.description)
    : locale === "ne"
      ? "स्थानीय गाई/भैंसीको परम्परागत तरिकाले उत्पादन गरिएको शुद्ध र स्वादिष्ट घ्यू।"
      : "Pure and delicious product traditionally produced by local farmers.";

  const dynamicFarmers = (apiProduct?.producers && apiProduct.producers.length > 0)
    ? apiProduct.producers.map((p: any) => ({
        id: `producer-${p.id}`,
        name: typeof p.name === "object" ? p.name : { ne: p.name, en: p.name_en || p.name },
        address: typeof p.municipality_address === "object"
          ? p.municipality_address
          : { ne: p.municipality_address || `${districtName}`, en: p.municipality_address || `${districtName}` },
        phone: p.phone || "सम्पर्क उपलब्ध छैन",
        experience: p.experience_years
          ? { ne: `${p.experience_years} वर्ष`, en: `${p.experience_years} Years` }
          : { ne: "अनुभवी", en: "Experienced" },
        price: apiProduct.estimated_price_range
          ? { ne: apiProduct.estimated_price_range, en: apiProduct.estimated_price_range }
          : { ne: "बजार भाउ अनुसार", en: "Market rate" },
        image: p.avatar || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300&auto=format&fit=crop",
      }))
    : [];

  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
      {/* Breadcrumb */}
      <FTBreadcrumb
        locale={locale}
        items={[
          {
            name: locale === "ne" ? "सुदूर उत्पादन" : "Local Products",
            href: "/products",
          },
          { name: districtName, href: `/products/district/${slug}` },
          { name: productName },
        ]}
      />

      <div className="container-editorial py-8 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-headline text-brand mb-2">
              {productName}
            </h1>
            <p className="text-base text-muted-foreground mb-4 sm:md-6">
              {productDescription}
            </p>

            <FTSectionDivider
              title={
                locale === "ne"
                  ? "उपलब्ध किसान तथा उत्पादक"
                  : "Available Farmers & Producers"
              }
              className="!my-6"
            />

            {dynamicFarmers.length === 0 ? (
              <div className="border border-dashed border-border bg-surface/60 p-8 text-center text-sm text-muted-foreground">
                {locale === "ne"
                  ? "यस उत्पादनका लागि हाल कुनै किसान वा उत्पादक सूचीकृत छैनन्।"
                  : "No registered farmers or producers found for this product yet."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {dynamicFarmers.map((farmer: any) => (
                  <div
                    key={farmer.id}
                    className="editorial-card-bordered scroll-reveal-card border border-border border-t-4 border-t-brand-secondary bg-surface p-5 flex flex-col"
                  >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                      <Image
                        src={farmer.image}
                        alt={t(farmer.name, locale)}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-foreground leading-tight">
                      {t(farmer.name, locale)}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                        <Phone size={14} />
                      </div>
                      {farmer.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                        <MapPin size={14} />
                      </div>
                      {t(farmer.address, locale)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-auto border-t border-border pt-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        {locale === "ne" ? "मूल्य" : "Price"}
                      </span>
                      <span className="text-brand font-bold text-sm">
                        {t(farmer.price, locale)}
                      </span>
                    </div>
                    <button className="px-5 py-2.5 bg-brand text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors shrink-0">
                      <Phone size={16} />
                      {locale === "ne" ? "फोन गर्नुहोस्" : "Call Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>

        <AdBanner placement="billboard-mid" page="products" className="mt-10" />
      </div>
    </main>
  );
}
