import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import FTEmptyState from "@/components/common/FTEmptyState";
import { Camera, Images } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import PhotoContributionModal from "@/components/district/PhotoContributionModal";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { t, normalizeImageUrl } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { getPhotoStoriesCached } from "@/lib/cached-data";
import AdBanner from "@/components/common/AdBanner";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  const title = dict.meta.photos.title;
  const description = dict.meta.photos.description;

  return buildMetadata({
    locale: lang as Locale,
    path: "/photos",
    title,
    description,
  });
}

export default async function PhotosPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const apiPhotosRes = await getPhotoStoriesCached(undefined, lang as Locale).catch(() => null);
  const allPhotos = apiPhotosRes?.results || [];

  const [featured, ...rest] = allPhotos;

  return (
    <>
      <main className="flex-1 bg-background pb-20">
        {/* ── Header Section (Matching "Local Products" Layout) ── */}
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-10 sm:py-14">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
              <div className="lg:w-2/3">
                <span
                  className="ft-kicker mb-1"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Camera size={14} />
                  <span>{lang === "en" ? "Photo Stories" : "फोटो फिचर"}</span>
                </span>

                <h1 className="font-serif-np text-4xl sm:text-5xl md:text-6xl text-foreground font-black leading-none mb-3 max-w-4xl">
                  {dict.nav.photos}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground font-sans mb-6">
                  {lang === "en"
                    ? "Beautiful moments and scenic landscapes of Sudurpashchim in photographs."
                    : "सुदूरपश्चिम प्रदेशका सुन्दर क्षणहरू र परिदृश्यहरू — फोटोमा।"}
                </p>

                <PhotoContributionModal defaultDistrict="" />
              </div>

              {/* Sidebar Ad */}
              <div className="hidden lg:block lg:w-1/3">
                <AdBanner placement="sidebar" page="photo" className="!my-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="container-editorial py-10 md:py-14">
          {allPhotos.length === 0 ? (
            <FTEmptyState
              variant="page"
              title={
                lang === "ne"
                  ? "हाल कुनै फोटो फिचर उपलब्ध छैन"
                  : "No Photo Stories Available"
              }
              description={
                lang === "ne"
                  ? "सुदूरपश्चिमका प्राकृतिक तथा सांस्कृतिक सौन्दर्य समेटिएका नयाँ तस्बिर कथाहरू चाँडै यहाँ प्रस्तुत गरिनेछ।"
                  : "Scenic visual stories and photo dispatches from Sudurpaschim will be published here soon."
              }
              kicker={lang === "ne" ? "फोटो ग्यालरी" : "PHOTO ESSAYS"}
              icon={<Camera size={26} className="text-brand-secondary" />}
              accentColor="var(--color-brand-secondary)"
              actionText={lang === "ne" ? "गृहपृष्ठमा फर्कनुहोस्" : "Return to Home"}
              actionHref="/"
            />
          ) : (
            <>
              {/* Featured large */}
              {featured && (
                <Link href={`/photos/${featured.id}`} className="group block mb-14 scroll-reveal">
                  <div
                    className="bg-background rounded-none border border-border overflow-hidden shadow-2xs"
                    style={{ borderTop: "3px solid var(--color-brand)" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden shrink-0">
                        <Image
                          src={normalizeImageUrl(featured.coverImage)}
                          alt={t(featured.title, lang as Locale)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          preload
                        />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-brand tracking-widest uppercase mb-3 block">
                          {dict.nav.photos}
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black font-headline text-foreground group-hover:text-brand transition-colors mb-4 leading-tight">
                          {t(featured.title, lang as Locale)}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans mb-6">
                          {t(featured.description, lang as Locale)}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium text-foreground">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Images size={14} />
                            {featured.imageCount}{" "}
                            {lang === "en" ? "photos" : "तस्बिरहरू"}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-muted-foreground">
                            {lang === "ne" ? "प्रस्तुति:" : "By"}{" "}
                            <span className="text-foreground">
                              {featured.photographer}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Photos Page Billboard Banner */}
              <div className="my-8 scroll-reveal scroll-delay-100">
                <AdBanner placement="billboard-mid" page="photo" />
              </div>

              {/* Grid */}
              {rest.length > 0 && (
                <div className="scroll-reveal">
                  <FTSectionDivider
                    title={lang === "en" ? "Recent Photo Stories" : "ताजा तस्बिर कथाहरू"}
                    enTitle={lang === "en" ? undefined : "Recent Photo Stories"}
                    as="h2"
                    className="!my-0 mb-8"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((story) => (
                      <Link
                        key={story.id}
                        href={`/photos/${story.id}`}
                        className="bg-background rounded-none border border-border overflow-hidden shadow-2xs h-full flex flex-col group cursor-pointer"
                        style={{ borderTop: `3px solid var(--color-brand)` }}
                      >
                        <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                          <Image
                            src={normalizeImageUrl(story.coverImage)}
                            alt={t(story.title, lang as Locale)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded-sm">
                            <Images size={12} />
                            {story.imageCount}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          {story.district && (
                            <span className="text-[10px] font-bold text-brand uppercase tracking-wider mb-2 block">
                              {typeof story.district === "object" && story.district !== null
                                ? t(story.district.name, lang as Locale)
                                : story.district}
                            </span>
                          )}
                          <h4 className="font-bold font-headline text-foreground text-base mb-2 group-hover:text-brand transition-colors">
                            {t(story.title, lang as Locale)}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                            {t(story.description, lang as Locale)}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                            <span className="text-xs font-medium text-muted-foreground">
                              {lang === "ne" ? "प्रस्तुति:" : "By"}{" "}
                              <span className="text-foreground">
                                {story.photographer}
                              </span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
