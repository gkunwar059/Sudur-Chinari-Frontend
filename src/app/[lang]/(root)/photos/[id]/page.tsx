import type { Metadata } from "next";
import Image from "next/image";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { Camera } from "lucide-react";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { t, normalizeImageUrl } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import PhotoLightboxGallery from "@/components/photos/PhotoLightboxGallery";
import AdBanner from "@/components/common/AdBanner";
import { getPhotoStoriesCached, getPhotoStoryByIdCached } from "@/lib/cached-data";
import { PHOTO_STORIES } from "@/data/articles";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  try {
    const res = await getPhotoStoriesCached().catch(() => null);
    const photos = res?.results && res.results.length > 0 ? res.results : PHOTO_STORIES;
    return photos.flatMap((s: any) => [
      { lang: "en", id: String(s.id) },
      { lang: "ne", id: String(s.id) },
    ]);
  } catch {
    return PHOTO_STORIES.flatMap((s) => [
      { lang: "en", id: String(s.id) },
      { lang: "ne", id: String(s.id) },
    ]);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;
  let story: any = await getPhotoStoryByIdCached(id, locale).catch(() => null);
  if (!story) {
    story = PHOTO_STORIES.find((s) => String(s.id) === String(id)) || null;
  }
  if (!story) return {};

  const title = `${t(story.title, locale)} | ${locale === "ne" ? "फोटो फिचर" : "Photo Feature"}`;
  const description = t(story.description, locale);

  return buildMetadata({
    locale,
    path: `/photos/${id}`,
    title,
    description,
    image: normalizeImageUrl(story.coverImage),
    type: "article",
  });
}

export default async function PhotoStoryDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const lang = isLocale(resolvedParams.lang)
    ? resolvedParams.lang
    : defaultLocale;
  const id = resolvedParams.id;

  let story: any = await getPhotoStoryByIdCached(id, lang as Locale).catch(() => null);
  if (!story) {
    story = PHOTO_STORIES.find((s) => String(s.id) === String(id)) || null;
  }

  if (!story) {
    notFound();
  }

  const count = Math.max(1, Math.min(story.imageCount || 1, 12));
  const galleryImages =
    story.images && story.images.length > 0
      ? story.images.map((img: any) => normalizeImageUrl(img.image))
      : [
          normalizeImageUrl(story.coverImage),
          ...Array.from({ length: Math.max(0, count - 1) }).map((_, i) => {
            return `https://picsum.photos/seed/${id}-${i}/800/${600 + (i % 3) * 100}`;
          }),
        ];

  return (
    <div className="min-h-screen bg-background selection:bg-brand/20">
      {/* Breadcrumb Navigation */}
      <FTBreadcrumb
        locale={lang as Locale}
        items={[
          { name: lang === "en" ? "Photos" : "फोटो फिचर", href: "/photos" },
          { name: t(story.title, lang as Locale) },
        ]}
      />

      {/* Hero Section */}
      <div className="container-editorial py-10 md:py-14 pt-4 md:pt-6">
        <div className="max-w-4xl mb-8">
          <span
            className="ft-kicker mb-3"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Camera size={14} />
            <span>{lang === "en" ? "Photo Story" : "फोटो कथा"}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-np font-black text-foreground leading-tight mb-4">
            {t(story.title, lang as Locale)}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed">
            {t(story.description, lang as Locale)}
          </p>
        </div>

        {/* Big Cover Image */}
        <div
          className="relative w-full aspect-[16/9] md:aspect-[21/9] mb-8 bg-surface border border-border"
          style={{ borderTop: "4px solid var(--color-brand)" }}
        >
          <Image
            src={normalizeImageUrl(story.coverImage)}
            alt={t(story.title, lang as Locale)}
            fill
            sizes="100vw"
            className="object-cover"
            preload
          />
        </div>

        {/* Photographer Info */}
        <div className="flex flex-col md:flex-row items-center justify-between border-y border-border py-4 mb-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
              <Camera size={18} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                {lang === "en" ? "Photographer" : "फोटोग्राफर"}
              </p>
              <p className="font-bold text-foreground font-sans text-sm">
                {story.photographer}
              </p>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
              {lang === "en" ? "Published" : "प्रकाशित"}
            </p>
            <p className="font-bold text-foreground font-sans text-sm">
              {new Date(story.publishedAt).toLocaleDateString(
                lang === "en" ? "en-US" : "ne-NP",
                { year: "numeric", month: "long", day: "numeric" },
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid with Lightbox */}
      <div className="container-editorial pb-20">
        <PhotoLightboxGallery
          images={galleryImages}
          lang={lang}
          title={t(story.title, lang as Locale)}
        />

        <AdBanner placement="billboard-mid" page="photo" className="mt-12" />
      </div>
    </div>
  );
}
