import type { Metadata } from "next";
import YatayatDirectoryView from "./YatayatDirectoryView";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  const title =
    locale === "ne"
      ? "सुदूर यातायात — बस, हाइस र जीप सेवाहरूको डिजिटल निर्देशिका"
      : "Sudur Yatayat — Digital Transport Directory (Bus, Hiace & Jeep)";
  const description =
    locale === "ne"
      ? "सुदूरपश्चिम प्रदेशका बस, हाइस तथा जीप सेवाहरूको रूट, प्रस्थान समय, सम्पर्क नम्बर, भाडादर र यातायातसम्बन्धी आवश्यक जानकारी एउटै स्थानमा खोज्नुहोस्।"
      : "Find routes, departure timings, contact numbers, fares, and transit information for buses, hiace vans, and jeeps across Sudurpashchim Province.";

  return buildMetadata({
    locale,
    path: "/yatayat",
    title,
    description,
    image: "/images/yatayat/hero_bus.jpg",
  });
}

export default async function YatayatPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;

  return <YatayatDirectoryView locale={locale} searchParams={searchParams} />;
}
