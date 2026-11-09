import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import FTEmptyState from "@/components/common/FTEmptyState";
import { Play, Eye, Clock } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import { formatViews, t, normalizeImageUrl } from "@/lib/utils";
import { newsApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import VideoContributionModal from "@/components/video/VideoContributionModal";
import AdBanner from "@/components/common/AdBanner";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  const title = dict.meta.videos.title;
  const description = dict.meta.videos.description;

  return buildMetadata({
    locale: lang as Locale,
    path: "/videos",
    title,
    description,
  });
}

export default async function VideosPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const apiVideosRes = await newsApi.getVideosServer(undefined, lang as Locale).catch(() => null);
  const allVideos = apiVideosRes?.results || [];

  const shorts = allVideos.filter((v) => v.isShort);
  const regular = allVideos.filter((v) => !v.isShort);

  return (
    <>
      <main className="flex-1 mobile-safe-bottom">
        {/* ── Header Section (Matching Editorial Broadsheet Layout) ── */}
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
                  <Play size={13} fill="currentColor" className="text-brand" />
                  <span>{lang === "en" ? "Video Dispatches & Shorts" : "भिडियो समाचार तथा रिल्स"}</span>
                </span>

                <h1 className="font-serif-np text-4xl sm:text-5xl md:text-6xl text-foreground font-black leading-none mb-3 max-w-4xl">
                  {dict.nav.videos}
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground font-sans mb-6">
                  {lang === "en"
                    ? "Latest video stories, news reports, and shorts from Sudurpashchim."
                    : "सुदूरपश्चिम प्रदेशका ताजा भिडियो समाचार, अन्तर्वार्ता र छोटा रिल्सहरू।"}
                </p>

                <VideoContributionModal defaultDistrict="" />
              </div>

              {/* Sidebar Ad */}
              <div className="hidden lg:block lg:w-1/3">
                <AdBanner placement="sidebar" page="video" className="!my-0" />
              </div>
            </div>
          </div>
        </div>

        {allVideos.length === 0 ? (
          <div className="container-editorial py-12">
            <FTEmptyState
              variant="page"
              title={
                lang === "ne"
                  ? "हाल कुनै भिडियो सामाग्री उपलब्ध छैन"
                  : "No Video Reports Available"
              }
              description={
                lang === "ne"
                  ? "सुदूरपश्चिमका ताजा गतिविधिहरू, अन्तर्वार्ता र विशेष भिडियो रिपोर्टहरू चाँडै यहाँ प्रस्तुत गरिनेछ।"
                  : "Video reports, news bulletins, and short reels from Sudurpaschim will be uploaded here shortly."
              }
              kicker={lang === "ne" ? "भिडियो बुलेटिन" : "VIDEO DISPATCHES"}
              icon={<Play size={24} className="text-brand-secondary fill-brand-secondary" />}
              accentColor="var(--color-brand-secondary)"
              actionText={lang === "ne" ? "गृहपृष्ठमा फर्कनुहोस्" : "Return to Home"}
              actionHref="/"
            />
          </div>
        ) : (
          <>
            {/* Shorts */}
            {shorts.length > 0 && (
              <div suppressHydrationWarning className="container-editorial py-10 scroll-reveal">
                <FTSectionDivider
                  title="Shorts / Reels"
                  icon={
                    <span className="w-5 h-5 rounded-full bg-brand-secondary flex items-center justify-center inline-flex">
                      <Play size={10} fill="currentColor" className="text-white ml-0.5" />
                    </span>
                  }
                  as="h2"
                  className="!my-0 mb-6"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {shorts.map((video) => (
                    <Link
                      key={video.id}
                      href={`/videos/${video.id}`}
                      className="group"
                    >
                      <div className="relative rounded-none border border-border overflow-hidden aspect-[9/16] bg-surface">
                        <Image
                          src={normalizeImageUrl(video.thumbnail)}
                          alt={t(video.title, lang as Locale)}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 inset-x-2">
                          <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                            {t(video.title, lang as Locale)}
                          </p>
                          <span className="text-gray-400 text-[10px] mt-1 flex items-center gap-1">
                            <Eye size={10} />
                            {formatViews(video.views)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular videos */}
            <div suppressHydrationWarning className="container-editorial my-6 scroll-reveal scroll-delay-100">
              <AdBanner placement="billboard-mid" page="video" />
            </div>

            {regular.length > 0 && (
              <div suppressHydrationWarning className="container-editorial pb-14 scroll-reveal">
                <FTSectionDivider
                  title={lang === "en" ? "Full Video Reports" : "विस्तृत भिडियो रिपोर्टहरू"}
                  enTitle={lang === "en" ? undefined : "Full Video Reports"}
                  as="h2"
                  className="!my-0 mb-6"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((video) => (
                    <Link
                      key={video.id}
                      href={`/videos/${video.id}`}
                      className="group border border-border rounded-none overflow-hidden bg-surface hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={normalizeImageUrl(video.thumbnail)}
                          alt={t(video.title, lang as Locale)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-none flex items-center gap-1">
                          <Clock size={10} />
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2 text-base">
                          {t(video.title, lang as Locale)}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          {video.district && (
                            <>
                              <span className="capitalize">
                                {typeof video.district === "object" && video.district !== null
                                  ? t(video.district.name, lang as Locale)
                                  : video.district}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatViews(video.views)} {lang === "en" ? "views" : "पटक हेरिएको"}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
