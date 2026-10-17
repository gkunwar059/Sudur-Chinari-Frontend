import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VIDEOS } from "@/data/articles";
import VideoPlayerView from "@/components/video/VideoPlayerView";
import { isLocale, ogLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";
import { t } from "@/lib/utils";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";

export async function generateStaticParams() {
  return VIDEOS.flatMap((v) => [
    { lang: "en", id: v.id },
    { lang: "ne", id: v.id },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const video = VIDEOS.find((v) => v.id === id);
  if (!video) return {};

  const title = lang === "en" ? `${t(video.title, 'en')} — Video` : `${t(video.title, 'ne')} — भिडियो`;
  const description = lang === "en" ? `Sudurpashchim video: ${t(video.title, 'en')}` : `सुदूरपश्चिम भिडियो: ${t(video.title, 'ne')}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${localizedPath(lang as Locale, `/videos/${id}`)}`,
      languages: {
        en: `${SITE_URL}${localizedPath("en", `/videos/${id}`)}`,
        ne: `${SITE_URL}${localizedPath("ne", `/videos/${id}`)}`,
        "x-default": `${SITE_URL}${localizedPath(defaultLocale, `/videos/${id}`)}`,
      },
    },
    openGraph: {
      type: "video.other",
      locale: ogLocale[lang as Locale],
      alternateLocale: lang === "en" ? ogLocale.ne : ogLocale.en,
      url: `${SITE_URL}${localizedPath(lang as Locale, `/videos/${id}`)}`,
      title,
      description,
      images: [video.thumbnail],
    },
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();

  const video = VIDEOS.find((v) => v.id === id);
  if (!video) notFound();

  const otherVideos = VIDEOS.filter((v) => v.id !== id);

  return (
    <>
            <main className="flex-1 mobile-safe-bottom bg-surface/50 py-8">
        <div className="container-editorial">
          <VideoPlayerView video={video} otherVideos={otherVideos} />
        </div>
      </main>
                </>
  );
}
