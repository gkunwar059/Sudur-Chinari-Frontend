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
  try {
    const apiDistricts = await newsApi.getDistrictsServer(locale);
    if (apiDistricts?.results?.length > 0) {
      districtsData = apiDistricts.results;
    }
  } catch (error) {
    console.error("Failed to fetch districts:", error);
  }

  return (
    <ProductsDirectoryView 
      districts={districtsData} 
      locale={locale} 
    />
  );
}
