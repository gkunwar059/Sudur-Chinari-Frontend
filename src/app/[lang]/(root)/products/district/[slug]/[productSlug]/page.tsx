import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Phone,
  MapPin,
} from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getDistrictsCached } from "@/lib/cached-data";
import { t } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import PageSkeleton from "@/components/common/PageSkeleton";

interface Props {
  params: Promise<{ lang: string; slug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug, productSlug } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  let district: any = { name: { ne: "अछाम", en: "Achham" }, slug };
  try {
    const apiDistricts = await getDistrictsCached(locale);
    const found = apiDistricts?.results?.find((d: any) => d.slug === slug);
    if (found) district = found;
  } catch (error) {}

  const districtName = t(district.name, locale);
  const productName =
    productSlug === "ghee" ? (locale === "ne" ? "घ्यू" : "Ghee") : productSlug;

  const title =
    locale === "ne"
      ? `${districtName}को ${productName} — स्थानीय उत्पादन`
      : `${productName} from ${districtName} — Local Produce`;
  const description =
    locale === "ne"
      ? `${districtName} जिल्लाको अर्गानिक ${productName} उत्पादन, स्थानीय किसानहरू र सम्पर्क विवरण।`
      : `Organic ${productName} produce from ${districtName} district, local farmers, and contact details.`;

  return buildMetadata({
    locale,
    path: `/products/district/${slug}/${productSlug}`,
    title,
    description,
  });
}

const FARMERS = [
  {
    id: "f1",
    name: { ne: "धन बहादुर कुँवर", en: "Dhan Bahadur Kunwar" },
    address: { ne: "साँफेबगर - ३, अछाम", en: "Sanfebagar - 3, Achham" },
    phone: "९८४xxx xxxx",
    experience: { ne: "१२ वर्ष", en: "12 Years" },
    price: { ne: "रू. ८०० / के.जी.", en: "Rs. 800 / kg" },
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "f2",
    name: { ne: "कमला देवी खड्का", en: "Kamala Devi Khadka" },
    address: { ne: "चौरपाटी - ६, अछाम", en: "Chaurpati - 6, Achham" },
    phone: "९८६xxx xxxx",
    experience: { ne: "८ वर्ष", en: "8 Years" },
    price: { ne: "रू. ८५० / के.जी.", en: "Rs. 850 / kg" },
    image:
      "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=300&auto=format&fit=crop",
  },
];

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

  let district: any = { name: { ne: "अछाम", en: "Achham" }, slug: slug };
  try {
    const apiDistricts = await getDistrictsCached(locale);
    const found = apiDistricts?.results?.find((d: any) => d.slug === slug);
    if (found) district = found;
  } catch (error) {}

  const districtName = t(district.name, locale);
  const productName =
    productSlug === "ghee"
      ? locale === "ne"
        ? "घ्यू"
        : "Ghee"
      : locale === "ne"
        ? "उत्पादन"
        : "Product";

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
              {locale === "ne"
                ? "स्थानीय गाई/भैंसीको परम्परागत तरिकाले उत्पादन गरिएको शुद्ध र स्वादिष्ट घ्यू।"
                : "Pure and delicious product traditionally produced by local farmers."}
            </p>

            <FTSectionDivider
              title={
                locale === "ne"
                  ? "उपलब्ध किसान तथा उत्पादक"
                  : "Available Farmers & Producers"
              }
              className="!my-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {FARMERS.map((farmer) => (
                <div
                  key={farmer.id}
                  className="editorial-card-bordered border border-border border-t-4 border-t-brand-secondary bg-surface p-5 flex flex-col"
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
          </div>
        </div>
      </div>
    </main>
  );
}
