"use client";

import type { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLang } from "@/components/i18n/DictionaryProvider";
import { localizedPath } from "@/lib/i18n/paths";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import EditorialCard from "@/components/common/EditorialCard";

interface FTArchivesAndVoicesProps {
  stories: Article[];
}

const ARCHIVE_CATEGORIES = [
  { slug: "history", label: { ne: "इतिहास", en: "History" } },
  { slug: "art", label: { ne: "कला", en: "Art" } },
  { slug: "culture", label: { ne: "संस्कृति", en: "Culture" } },
  { slug: "tradition", label: { ne: "परम्परा", en: "Tradition" } },
  { slug: "local-life", label: { ne: "स्थानीय जीवन", en: "Local Life" } },
  { slug: "language", label: { ne: "भाषा", en: "Language" } },
  { slug: "heritage", label: { ne: "सम्पदा", en: "Heritage" } },
] as const;

export default function FTArchivesAndVoices({
  stories,
}: FTArchivesAndVoicesProps) {
  const { locale } = useLanguage();
  const lang = useLang();
  const isEn = locale === "en";

  const tabTypography = isEn
    ? "uppercase tracking-[0.12em]"
    : "tracking-wide";
  const tabBase = `py-2.5 whitespace-nowrap shrink-0 border-b-[3px] transition-colors font-sans text-[11px] sm:text-xs font-bold ${tabTypography}`;

  return (
    <section className="mb-8 w-full max-w-full overflow-hidden min-w-0">
      {/* ── Title Header ── */}
      <FTSectionDivider
        sectionIndex="०५"
        title={isEn ? "Archives & Voices" : "अभिलेख र आवाजहरू"}
        enTitle="Chronicles"
        viewAllHref={localizedPath(lang, "/news")}
        viewAllText={isEn ? "View All" : "सबै कथाहरू"}
        className="!mb-4"
      />

      {/* ── Category Rail ── */}
      <nav
        aria-label={
          isEn ? "Archives & Voices categories" : "अभिलेख र आवाजहरू श्रेणीहरू"
        }
        className="mb-5 border-b border-border"
      >
        <div className="flex min-w-0 items-center overflow-x-auto no-scrollbar -mb-px">
          <span
            aria-current="true"
            className={`${tabBase} pl-0 pr-3 sm:pr-4 border-brand text-brand`}
          >
            {isEn ? "Top Stories" : "मुख्य समाचार"}
          </span>
          {ARCHIVE_CATEGORIES.map(({ slug, label }) => (
            <LocalizedLink
              key={slug}
              href={`/category/${slug}`}
              className={`${tabBase} px-3 sm:px-4 border-transparent text-muted-foreground hover:border-border hover:text-foreground focus-visible:border-border focus-visible:text-foreground`}
            >
              {isEn ? label.en : label.ne}
            </LocalizedLink>
          ))}
        </div>
      </nav>

      {/* ── 4-Column Grid for Articles ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-full overflow-hidden min-w-0">
        {stories.slice(0, 4).map((story) => {
          if (!story) return null;
          return (
            <EditorialCard
              key={story.id}
              article={story}
              locale={locale}
              chrome="bare"
              titleClamp={3}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          );
        })}
      </div>
    </section>
  );
}
