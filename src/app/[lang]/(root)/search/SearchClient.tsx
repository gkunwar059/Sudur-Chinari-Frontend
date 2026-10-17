"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { Search, Clock, Filter, X, ArrowRight, SearchX, MapPin, Flame, BookOpen } from "lucide-react";
import { t, getArticleSlug } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import FTCategoryBadge from "@/components/common/FTCategoryBadge";
import RelativeTime from "@/components/common/RelativeTime";

const TRENDING_TOPICS = [
  "कर्णाली पुल",
  "खप्तड पर्यटन",
  "प्रदेश बजेट",
  "सेती अस्पताल",
  "देउडा संस्कृति",
  "दोधारा चाँदनी",
  "शुक्लाफाँटा",
];

export default function SearchClient({ 
  initialArticles, 
  districts, 
  categories 
}: { 
  initialArticles: any[], 
  districts: any[], 
  categories: any[] 
}) {
  const { locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [districtFilter, setDistrictFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = initialArticles.filter((a: any) => {
      const titleNe = typeof a.title === "string" ? a.title : (a.title?.ne || "");
      const titleEn = typeof a.title === "string" ? a.title : (a.title?.en || "");
      const excerptNe = typeof a.excerpt === "string" ? a.excerpt : (a.excerpt?.ne || a.excerpt || "");
      const dName = typeof a.district?.name === "string" ? a.district.name : (a.district?.name?.ne || a.district?.name?.en || "");
      const cName = typeof a.category?.name === "string" ? a.category.name : (a.category?.name?.ne || a.category?.name?.en || "");
      
      const matchQ =
        !q ||
        titleNe.toLowerCase().includes(q) ||
        titleEn.toLowerCase().includes(q) ||
        excerptNe.toLowerCase().includes(q) ||
        dName.toLowerCase().includes(q) ||
        cName.toLowerCase().includes(q) ||
        (a.tags && a.tags.some((tItem: string) => tItem.toLowerCase().includes(q)));

      const matchD = districtFilter === "all" || (a.district && a.district.slug === districtFilter);
      const matchC = categoryFilter === "all" || (a.category && a.category.slug === categoryFilter);

      return matchQ && matchD && matchC;
    });

    if (sortBy === "popular") {
      return [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return [...filtered].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [query, districtFilter, categoryFilter, sortBy, initialArticles]);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    router.push(`/search?q=${encodeURIComponent(topic)}`);
  };

  const hasActiveFilters = districtFilter !== "all" || categoryFilter !== "all" || query !== "";

  const clearAllFilters = () => {
    setQuery("");
    setDistrictFilter("all");
    setCategoryFilter("all");
    router.push("/search");
  };

  return (
    <>
            <main className="flex-1 mobile-safe-bottom bg-background min-h-screen">
        {/* ── Search Hero Section ── */}
        <section className="bg-background border-b border-border py-10 sm:py-14 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="container-editorial max-w-4xl mx-auto text-center px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand transition-colors">
                गृह
              </Link>
              <span>/</span>
              <span className="text-foreground">समाचार खोज</span>
            </nav>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              समाचार खोज्नुहोस्
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 font-medium">
              सुदूरपश्चिम प्रदेशका ९ वटै जिल्लाका ताजा समाचार, लेख, विचार र घटनाक्रमहरू
            </p>

            {/* Main Search Input Form */}
            <form onSubmit={handleQuerySubmit} className="relative max-w-2xl mx-auto mb-5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-surface hover:bg-surface focus-within:bg-background border-2 border-border focus-within:border-brand rounded-none p-1.5 sm:p-2 transition-all duration-200 shadow-xs">
                {/* Search Input Row */}
                <div className="flex items-center flex-1 min-w-0">
                  <Search
                    size={20}
                    strokeWidth={2.2}
                    className="text-gray-400 focus-within:text-brand ml-2.5 mr-1 shrink-0"
                  />

                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="समाचार, शीर्षक, विषय वा जिल्ला खोज्नुहोस्..."
                    className="flex-1 w-full bg-transparent text-foreground placeholder:text-gray-400 text-sm sm:text-base font-bold tracking-tight px-2.5 py-2 border-0 outline-none focus:outline-none focus:ring-0 shadow-none"
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      border: "none",
                    }}
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="p-2 text-gray-400 hover:text-foreground hover:bg-surface-hover/60 transition-colors cursor-pointer shrink-0"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white text-xs sm:text-sm font-bold rounded-none transition-all shadow-xs cursor-pointer min-h-[42px] shrink-0 mt-1 sm:mt-0 flex items-center justify-center"
                >
                  खोज्नुहोस्
                </button>
              </div>
            </form>

            {/* Trending Tags Row */}
            <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 text-gray-400 font-bold tracking-normal text-[11px]">
                <Flame size={13} className="text-warning" />
                चर्चित खोज:
              </span>
              {TRENDING_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicClick(topic)}
                  className="px-3 py-1.5 border border-border bg-background hover:bg-brand hover:text-white text-foreground font-medium transition-all cursor-pointer min-h-[36px] flex items-center"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Content Grid: Filters + Results ── */}
        <section className="container-editorial py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-background p-4 sm:p-5 rounded-none border border-border shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Filter size={15} className="text-brand" />
                    <h3 className="font-bold font-headline text-foreground text-sm">फिल्टरहरू</h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="text-xs text-brand-secondary hover:text-brand-secondary font-semibold cursor-pointer"
                    >
                      सबै हटाउनुहोस्
                    </button>
                  )}
                </div>

                {/* District Filter */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-normal mb-2">
                    जिल्ला अनुसार
                  </label>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-border rounded-none bg-background text-foreground font-medium focus:outline-none focus:border-brand transition-colors cursor-pointer min-h-[42px]"
                  >
                    <option value="all">{locale === 'en' ? "All Districts (9)" : "सबै जिल्ला (९ वटा)"}</option>
                    {districts.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {t(d.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-normal mb-2">
                    {locale === 'en' ? "Filter by Category" : "विधा / श्रेणी अनुसार"}
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-border rounded-none bg-background text-foreground font-medium focus:outline-none focus:border-brand transition-colors cursor-pointer min-h-[42px]"
                  >
                    <option value="all">{locale === 'en' ? "All Categories" : "सबै विधा"}</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {t(c.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Option */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground tracking-normal mb-2">
                    {locale === 'en' ? "Sort by" : "क्रमबद्ध गर्नुहोस्"}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-hover rounded-none">
                    <button
                      type="button"
                      onClick={() => setSortBy("latest")}
                      className={`py-2 text-xs font-bold rounded-none transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                        sortBy === "latest"
                          ? "bg-background text-brand shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {locale === 'en' ? "Latest" : "हालै प्रकाशित"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortBy("popular")}
                      className={`py-2 text-xs font-bold rounded-none transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                        sortBy === "popular"
                          ? "bg-background text-brand shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {locale === 'en' ? "Popular" : "धेरै पढिएका"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick District Navigation Cards */}
              <div className="bg-background p-4 sm:p-5 rounded-none border border-border shadow-xs">
                <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-muted-foreground tracking-normal">
                  <MapPin size={13} className="text-brand" />
                  <span>{locale === 'en' ? "Districts of Sudurpashchim" : "सुदूरपश्चिमका जिल्लाहरू"}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {districts.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => setDistrictFilter(d.slug)}
                      className={`px-2 py-2 border rounded-none text-xs font-semibold text-center transition-all cursor-pointer truncate min-h-[38px] flex items-center justify-center ${
                        districtFilter === d.slug
                          ? "bg-brand text-white border-brand"
                          : "bg-surface hover:bg-surface-hover text-foreground border-border"
                      }`}
                    >
                      {t(d.name, locale)}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Results Column */}
            <div className="lg:col-span-3 space-y-4">
              {/* Results status banner */}
              <div className="flex items-center justify-between bg-background px-4 sm:px-5 py-3 rounded-none border border-border shadow-2xs">
                <div className="text-sm font-semibold text-foreground">
                  <span>
                    {locale === 'en' ? "Total " : "कुल "}
                    <strong className="text-brand font-black">{results.length}</strong>
                    {locale === 'en' ? " stories found" : " वटा समाचार फेला परे"}
                  </span>
                  {query && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      — &apos;{query}&apos; {locale === 'en' ? "for" : "को लागि"}
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">
                    {locale === 'en' ? "Filter active" : "फिल्टर सक्रिय"}
                  </span>
                )}
              </div>

              {/* Article Results List */}
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((article: any) => (
                    <Link
                      key={article.id}
                      href={`/article/${getArticleSlug(article)}`}
                      className="group flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-none bg-background border border-border hover:border-gray-300 hover:shadow-xs transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full sm:w-56 h-48 sm:h-36 rounded-none overflow-hidden shrink-0 bg-surface-hover">
                        <Image
                          src={article.featuredImage}
                          alt={t(article.title, locale)}
                          fill
                          className="object-cover group-hover:scale-104 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 224px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div>
                          {/* Category Tag */}
                          <div className="mb-2">
                            <FTCategoryBadge category={article.category} size="xs" asLink={false} />
                          </div>

                          {/* Title */}
                          <h2 className="text-base sm:text-lg font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-snug line-clamp-2 mb-2">
                            {t(article.title, locale)}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                            {t(article.excerpt, locale)}
                          </p>
                        </div>

                        {/* Meta footer */}
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-2 border-t border-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              <RelativeTime
                                date={article.publishedAt}
                                locale={locale}
                              />
                            </span>
                            {article.readTime && (
                              <span className="flex items-center gap-1">
                                <BookOpen size={12} />
                                {article.readTime} {locale === 'en' ? "min read" : "मिनेट पढाइ"}
                              </span>
                            )}
                          </div>

                          <span className="flex items-center gap-1 font-bold text-brand">
                            <span>{locale === 'en' ? "Read more" : "पुरा पढ्नुहोस्"}</span>
                            <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="bg-background rounded-none border border-border p-8 sm:p-16 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-none bg-surface border border-border flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <SearchX size={32} />
                  </div>
                  <h3 className="text-lg font-bold font-headline text-foreground mb-1">
                    कुनै समाचार फेला परेन
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    {query
                      ? `"${query}" सँग सम्बन्धित कुनै समाचार फेला परेन। कृपया फरक शब्द प्रयोग गर्नुहोस् वा फिल्टरहरू हटाउनुहोस्।`
                      : "कृपया खोज्न चाहेको शब्द प्रविष्ट गर्नुहोस् वा तल दिइएका लोकप्रिय विषयहरू हेर्नुहोस्।"}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                    {TRENDING_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleTopicClick(topic)}
                        className="px-3.5 py-1.5 border border-border bg-background hover:bg-brand hover:text-white text-foreground text-xs font-semibold transition-all cursor-pointer min-h-[38px] flex items-center"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
                </>
  );
}


