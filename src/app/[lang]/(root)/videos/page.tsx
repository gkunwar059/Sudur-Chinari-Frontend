import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { VIDEOS } from "@/data/articles";
import { Play, Eye, Clock } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import { formatViews, t } from "@/lib/utils";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";


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

  const shorts = VIDEOS.filter((v) => v.isShort);
  const regular = VIDEOS.filter((v) => !v.isShort);

  return (
    <>
            <main className="flex-1 mobile-safe-bottom">
        <div className="bg-[var(--color-text-primary)]">
          <div className="container-editorial py-8 md:py-12">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand-green)] flex items-center justify-center">
                <Play size={14} fill="white" className="text-white ml-0.5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {dict.nav.videos}
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              {lang === "en"
                ? "Latest video stories, news reports, and shorts from Sudurpashchim"
                : "सुदूरपश्चिमको ताजा भिडियो समाचार र छोटा रिल्सहरू"}
            </p>
          </div>
        </div>

        {/* Shorts */}
        <div className="container-editorial py-10">
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
                    src={video.thumbnail}
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

        {/* Regular videos */}
        <div className="container-editorial pb-14">
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
                    src={video.thumbnail}
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
                    <span className="capitalize">{video.district}</span>
                    <span>•</span>
                    <span>{formatViews(video.views)} {lang === "en" ? "views" : "पटक हेरिएको"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
                </>
  );
}
