"use client";

import { useState, useEffect } from "react";
import EditorialCard from "@/components/common/EditorialCard";
import AdBanner from "@/components/common/AdBanner";
import { useLanguage } from "@/context/LanguageContext";
import {
  BookOpen,
  Sparkles,
  Compass,
  Home,
  MessageCircle,
  Video,
  Search,
  Loader2,
} from "lucide-react";
import type { District, Article } from "@/types";

import { newsApi } from "@/lib/api";

const PAGE_SIZE = 12;

const fetchArchives = async (
  districtSlug: string,
  category: string,
  locale: string,
  search: string,
  page: number,
) => {
  try {
    const params: Record<string, string> = {
      district: districtSlug,
      lang: locale,
      limit: String(PAGE_SIZE),
      page: String(page),
    };
    if (category !== "all") {
      params.category = category;
    }
    if (search.trim() !== "") {
      params.search = search.trim();
    }
    const res = await newsApi.getArticlesClient(params);
    return { articles: res.results || [], count: res.count ?? 0 };
  } catch (error) {
    console.error("Failed to fetch archives", error);
    return { articles: [], count: 0 };
  }
};

interface DistrictArchivesProps {
  district: District;
  activeCategory: string;
}

export const getArchiveCategories = (isEn: boolean) => [
  {
    id: "history",
    label: isEn ? "History" : "इतिहास",
    icon: <BookOpen size={14} />,
  },
  { id: "art", label: isEn ? "Art" : "कला", icon: <Sparkles size={14} /> },
  {
    id: "culture",
    label: isEn ? "Culture" : "संस्कृति",
    icon: <Compass size={14} />,
  },
  {
    id: "local-life",
    label: isEn ? "Local Life" : "लोकजीवन",
    icon: <Home size={14} />,
  },
  {
    id: "language",
    label: isEn ? "Language" : "भाषा",
    icon: <MessageCircle size={14} />,
  },
  {
    id: "multimedia",
    label: isEn ? "Multimedia" : "श्रव्य-दृश्य अभिलेख",
    icon: <Video size={14} />,
  },
];

export default function DistrictArchives({
  district,
  activeCategory,
}: DistrictArchivesProps) {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  // Search and Sub-filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [result, setResult] = useState<{
    key: string;
    articles: Article[];
    count: number;
    page: number;
  } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchKey = `${district.slug}|${activeCategory}|${locale}|${debouncedSearch}`;
  const categoryForApi =
    activeCategory === "archives-all" ? "all" : activeCategory;

  // Fetch data when category or search changes
  useEffect(() => {
    let isMounted = true;
    fetchArchives(
      district.slug,
      categoryForApi,
      locale,
      debouncedSearch,
      1,
    ).then((data) => {
      if (isMounted) {
        setResult({
          key: fetchKey,
          articles: data.articles,
          count: data.count,
          page: 1,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [district.slug, categoryForApi, locale, debouncedSearch, fetchKey]);

  const articles = result?.articles ?? [];
  const count = result?.count ?? 0;
  const loading = result?.key !== fetchKey;
  const hasMore = articles.length < count;

  const handleLoadMore = async () => {
    if (loading || loadingMore || !hasMore) return;

    const currentPage = result?.key === fetchKey ? result.page : 1;
    const nextPage = currentPage + 1;
    const requestKey = fetchKey;
    setLoadingMore(true);

    const data = await fetchArchives(
      district.slug,
      categoryForApi,
      locale,
      debouncedSearch,
      nextPage,
    );

    setResult((prev) => {
      if (!prev || prev.key !== requestKey) return prev;
      const existingIds = new Set(prev.articles.map((article) => article.id));
      return {
        ...prev,
        articles: [
          ...prev.articles,
          ...data.articles.filter((article) => !existingIds.has(article.id)),
        ],
        count: data.count,
        page: nextPage,
      };
    });
    setLoadingMore(false);
  };

  const districtName =
    typeof district.name === "string" ? district.name : t(district.name);

  const categories = getArchiveCategories(isEn);

  return (
    <div className="bg-background w-full min-h-[600px] text-foreground">
      {/* ── Header Section (Title + Search) ── */}
      <div className="container-editorial pt-0 pb-10 md:pb-14">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 md:mb-14">
          <div>
            <span className="text-muted-foreground font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 block font-mono">
              {isEn ? "New in Collection" : "संग्रहमा नयाँ"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline tracking-tight mb-4">
              {isEn ? `Voices of ${districtName}` : `${districtName}का आवाजहरू`}
            </h2>
            <p className="text-muted-foreground text-sm font-sans max-w-lg">
              {isEn
                ? "Choose a category or search in your own words."
                : "विधा छान्नुहोस् वा आफ्नै शब्दमा खोज्नुहोस्।"}
            </p>
          </div>

          <div className="w-full lg:w-96 shrink-0 flex flex-col">
            <AdBanner placement="sidebar" page="district" className="!mb-4" />
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? "Search story, word or place..."
                    : "कथा, शब्द वा ठाउँ खोज्नुहोस्..."
                }
                className="w-full bg-surface border border-border rounded-none py-3.5 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all font-sans"
              />
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface border border-border h-80"
              ></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <EditorialCard
                key={art.id}
                article={art}
                locale={locale}
                chrome="accent"
                accentColor={district.accentColor || "var(--brand)"}
                overlayCategory={
                  categories.find((c) => c.id === activeCategory)?.label
                }
                aspect="video"
                showExcerpt
                monoTime
                metaBorder={false}
                className="scroll-reveal-card"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border bg-surface/50">
            <p className="text-muted-foreground font-sans">
              {isEn ? "No records found." : "कुनै अभिलेख फेला परेन।"}
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && hasMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-foreground/30 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                borderTop: `3px solid ${district.accentColor || "var(--brand)"}`,
              }}
            >
              {loadingMore && <Loader2 size={15} className="animate-spin" />}
              <span>
                {loadingMore
                  ? isEn
                    ? "Loading..."
                    : "लोड हुँदैछ..."
                  : isEn
                    ? "Load more stories"
                    : "थप कथा लोड गर्नुहोस्"}
              </span>
            </button>
            <span className="text-xs font-mono text-muted-foreground">
              {isEn
                ? `${articles.length} of ${count} stories`
                : `${articles.length} / ${count} कथा`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
