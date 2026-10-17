import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageSkeleton from "@/components/common/PageSkeleton";
import { getHotelBySlugCached } from "@/lib/cached-data";
import { isLocale, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import SingleHotelLayout from "./SingleHotelLayout";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const hotel = await getHotelBySlugCached(slug, lang as Locale).catch(() => null);
  
  if (!hotel) return {};

  const title = typeof hotel.name === 'string' ? hotel.name : (lang === "en" ? hotel.name?.en : hotel.name?.ne);
  const desc = typeof hotel.about === 'string' ? hotel.about : (lang === "en" ? hotel.about?.en : hotel.about?.ne);

  return buildMetadata({
    locale: lang as Locale,
    path: `/stay/${slug}`,
    title: `${title} | ${lang === "en" ? "Hotels & Stay" : "होटल तथा बासस्थान"}`,
    description: desc,
    image: hotel.hero_image,
  });
}

export default function HotelPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="detail" />}>
      <HotelPageContent params={params} />
    </Suspense>
  );
}

async function HotelPageContent({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const hotel = await getHotelBySlugCached(slug, lang as Locale).catch(() => null);

  if (!hotel) {
    notFound();
  }

  return <SingleHotelLayout hotel={hotel} />;
}
