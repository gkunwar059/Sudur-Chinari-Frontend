import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getCategoryBySlugCached, getHotelsCached } from "@/lib/cached-data";
import { t } from "@/lib/utils";
import HotelCard from "@/components/common/HotelCard";
import PageSkeleton from "@/components/common/PageSkeleton";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

async function loadCategory(slug: string, lang: any): Promise<any> {
  return await getCategoryBySlugCached(slug, lang);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const cat = await loadCategory(slug, lang as Locale);
  if (!cat) return {};

  const name = t(cat.name, lang as Locale);
  const description =
    lang === "en"
      ? `Hotels, resorts and homestays listed under ${name} in Sudurpashchim Province.`
      : `सुदूरपश्चिम प्रदेशमा ${name} अन्तर्गतका होटल, रिसोर्ट र होमस्टेहरू।`;

  return buildMetadata({
    locale: lang as Locale,
    path: `/stay/category/${slug}`,
    title: name,
    description,
    image: cat.image,
  });
}

export default function StayOrHotelPage({ params }: Props) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <StayOrHotelPageContent params={params} />
    </Suspense>
  );
}

async function StayOrHotelPageContent({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  
  const isEn = lang === "en";

  const res = await getHotelsCached({ category__slug: slug }, lang as Locale);
  const hotels: any[] = res?.results || [];
  
  return (
    <>
      {/* Section Title matching "Major Places in Kailali" */}
      <div className="container-editorial pt-12 pb-6 border-b border-border/60 mb-8 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-brand uppercase tracking-wider hidden sm:block">Section 01 <span className="text-muted-foreground mx-1">•</span></span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-headline text-foreground">
            {isEn ? "Featured Stays & Hotels" : "प्रमुख होटलहरू"}
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
          {hotels.length} {isEn ? "Listed" : "सूचीबद्ध"}
        </span>
      </div>

      {/* Hotels Grid */}
      <div className="container-editorial pb-12 sm:pb-20">
        {hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} locale={lang as Locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface/50 border border-border rounded-xl">
            <p className="text-muted-foreground text-lg">
              {isEn ? "No properties found in this category." : "यस श्रेणीमा कुनै पनि होटल फेला परेन।"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
