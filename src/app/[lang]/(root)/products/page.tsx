import type { Metadata } from "next";
import ProductsDirectoryView from "./ProductsDirectoryView";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { newsApi } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const title = locale === "ne"
      ? "सुदूर उत्पादन — सुदूरपश्चिम प्रदेश"
      : "Local Products — Sudurpaschim Province";
  const description = locale === "ne"
      ? "सुदूरपश्चिम प्रदेशका स्थानीय कृषि तथा अन्य उत्पादनहरूको सूची र जानकारी।"
      : "A comprehensive directory of local agricultural and cultural products in Sudurpaschim Province.";

  return buildMetadata({
    locale,
    path: "/products",
    title,
    description,
  });
}

export default async function LocalProductsPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  let districtsData: any[] = [];
  const districtCounts: Record<string, { farmers: number; products: number }> = {};

  try {
    const [apiDistricts, apiProducts] = await Promise.all([
      newsApi.getDistrictsServer(locale).catch(() => null),
      newsApi.getProductsServer({ limit: 500 }, locale).catch(() => null),
    ]);

    if (apiDistricts && Array.isArray(apiDistricts.results) && apiDistricts.results.length > 0) {
      districtsData = apiDistricts.results;
    }

    if (apiProducts?.results && Array.isArray(apiProducts.results)) {
      apiProducts.results.forEach((p: any) => {
        const dSlug =
          p.district_slug ||
          (typeof p.district === "object" ? p.district?.slug : p.district);
        if (dSlug) {
          if (!districtCounts[dSlug]) {
            districtCounts[dSlug] = { farmers: 0, products: 0 };
          }
          districtCounts[dSlug].products += 1;
          const farmerCount =
            p.producers?.length || (p.farmer_name ? 1 : 0);
          districtCounts[dSlug].farmers += farmerCount;
        }
      });
    }
  } catch (error) {
    console.error("Failed to fetch districts/products:", error);
  }

  return (
    <ProductsDirectoryView 
      districts={districtsData} 
      districtCounts={districtCounts}
      locale={locale} 
    />
  );
}
