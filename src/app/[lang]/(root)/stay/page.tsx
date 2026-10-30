import type { Metadata } from "next";
import StayDirectoryView from "./StayDirectoryView";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { newsApi } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const title = locale === "ne"
      ? "होटल तथा बासस्थान — सुदूरपश्चिम प्रदेश"
      : "Hotels & Stay — Sudurpaschim Province";
  const description = locale === "ne"
      ? "सुदूरपश्चिम प्रदेशका उत्कृष्ट होटल, रिसोर्ट र होमस्टेहरूको विस्तृत सूची र जानकारी।"
      : "A comprehensive directory of the best hotels, resorts, and homestays in Sudurpaschim Province.";

  return buildMetadata({
    locale,
    path: "/stay",
    title,
    description,
  });
}

export default async function HotelsAndStayPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  // Fetch districts for the Stay directory layout
  let districtsData: any[] = [];
  const apiDistricts = await newsApi.getDistrictsServer(locale).catch(() => null);
  if (apiDistricts && Array.isArray(apiDistricts.results) && apiDistricts.results.length > 0) {
    districtsData = apiDistricts.results;
  }

  return (
    <StayDirectoryView 
      districts={districtsData} 
      locale={locale} 
    />
  );
}
