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
} from "lucide-react";
import type { District, Article } from "@/types";

import { newsApi } from "@/lib/api";

const fetchArchives = async (
  districtSlug: string,
  category: string,
  locale: string,
  search?: string,
) => {
  try {
    const params: Record<string, string> = {
      district: districtSlug,
      lang: locale,
    };
    if (category !== "all") {
      params.category = category;
    }
    if (search && search.trim() !== "") {
      params.search = search.trim();
    }
    const res = await newsApi.getArticlesClient(params);
    return res.results || [];
  } catch (error) {
    console.error("Failed to fetch archives", error);
    return [];
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

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when category or search changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const categoryForApi =
      activeCategory === "archives-all" ? "all" : activeCategory;

    fetchArchives(district.slug, categoryForApi, locale, debouncedSearch).then(
      (data) => {
        if (isMounted) {
          setArticles(data);
          setLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, [district.slug, activeCategory, locale, debouncedSearch]);

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
            <AdBanner placement="sidebar" className="!mb-4" />
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
      </div>
    </div>
  );
}
