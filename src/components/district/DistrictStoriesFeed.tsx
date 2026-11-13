"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Newspaper, RefreshCw, Search, X } from "lucide-react";
import EditorialCard from "@/components/common/EditorialCard";
import { newsApi } from "@/lib/api";
import type { Locale } from "@/lib/i18n/config";
import type { Article } from "@/types";

const LOAD_THROTTLE_MS = 1600;
const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 8;

interface DistrictStoriesFeedProps {
  districtSlug: string;
  locale: Locale;
  initialArticles: Article[];
  totalCount: number;
  accentColor: string;
}

export default function DistrictStoriesFeed({
  districtSlug,
  locale,
  initialArticles,
  totalCount,
  accentColor,
}: DistrictStoriesFeedProps) {
  const isEn = locale === "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef(false);
  const lastLoadAtRef = useRef(0);
  const trailingLoadRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreRef = useRef<() => void>(() => {});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasSearch = debouncedSearch.length > 0;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["district-stories", districtSlug, locale, PAGE_SIZE, debouncedSearch],
    queryFn: ({ pageParam }) =>
      newsApi.getArticlesClient({
        district: districtSlug,
        lang: locale,
        page: pageParam,
        limit: PAGE_SIZE,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.next && lastPage.results.length > 0
        ? lastPageParam + 1
        : undefined,
    initialData: hasSearch
      ? undefined
      : {
          pages: [
            {
              count: totalCount,
              next: initialArticles.length < totalCount ? "initial" : null,
              previous: null,
              results: initialArticles,
            },
          ],
          pageParams: [1],
        },
    staleTime: 60 * 1000,
  });

  const articles = data?.pages.flatMap((page) => page.results) ?? [];
  const count = data?.pages[0]?.count ?? 0;
  const canLoadMore = Boolean(hasNextPage);

  const loadMore = useCallback(() => {
    if (!canLoadMore || fetchingRef.current) return;

    const now = Date.now();
    const elapsed = now - lastLoadAtRef.current;
    if (elapsed < LOAD_THROTTLE_MS) {
      if (!trailingLoadRef.current) {
        trailingLoadRef.current = setTimeout(() => {
          trailingLoadRef.current = null;
          loadMoreRef.current();
        }, LOAD_THROTTLE_MS - elapsed);
      }
      return;
    }

    lastLoadAtRef.current = now;
    fetchingRef.current = true;
    void fetchNextPage().finally(() => {
      fetchingRef.current = false;
    });
  }, [canLoadMore, fetchNextPage]);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    if (trailingLoadRef.current) {
      clearTimeout(trailingLoadRef.current);
      trailingLoadRef.current = null;
    }
    lastLoadAtRef.current = 0;
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      if (trailingLoadRef.current) {
        clearTimeout(trailingLoadRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !canLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [articles.length, canLoadMore, loadMore]);

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              isEn
                ? "Search stories in this district..."
                : "यो जिल्लाका कथा खोज्नुहोस्..."
            }
            aria-label={isEn ? "Search district stories" : "जिल्लाका कथा खोज्नुहोस्"}
            autoComplete="off"
            className="w-full bg-surface border border-border py-3.5 pl-12 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label={isEn ? "Clear search" : "खोजी हटाउनुहोस्"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex min-h-5 items-center gap-2 text-xs font-mono font-semibold text-muted-foreground">
          {isFetching && !isFetchingNextPage && (
            <Loader2 size={14} className="animate-spin" />
          )}
          {!isPending && (
            <span className="max-w-full truncate" title={hasSearch ? debouncedSearch : undefined}>
              {hasSearch
                ? isEn
                  ? `${count} ${count === 1 ? "result" : "results"} for “${debouncedSearch}”`
                  : `“${debouncedSearch}” का ${count} नतिजा`
                : isEn
                  ? `${count} stories`
                  : `${count} कथा`}
            </span>
          )}
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video w-full bg-surface" />
              <div className="mt-4 h-3 w-24 bg-surface" />
              <div className="mt-3 h-5 w-full bg-surface" />
              <div className="mt-2 h-5 w-4/5 bg-surface" />
            </div>
          ))}
        </div>
      ) : isError && articles.length === 0 ? (
        <div className="border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
          <Newspaper size={32} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-sans">
            {isEn
              ? "Could not load stories right now."
              : "अहिले कथा लोड गर्न सकिएन।"}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-5 inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-surface"
          >
            <RefreshCw size={14} />
            <span>{isEn ? "Try again" : "पुनः प्रयास गर्नुहोस्"}</span>
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
          <Newspaper size={32} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground font-sans">
            {hasSearch
              ? isEn
                ? `No stories match “${debouncedSearch}”.`
                : `“${debouncedSearch}” सँग मिल्ने कथा भेटिएन।`
              : isEn
                ? "No stories found in this district yet."
                : "यो जिल्लामा अझै कुनै कथा फेला परेन।"}
          </p>
          {hasSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="mt-5 inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-surface"
            >
              <X size={14} />
              <span>{isEn ? "Clear search" : "खोजी हटाउनुहोस्"}</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <EditorialCard
                key={article.id}
                article={article}
                locale={locale}
                chrome="accent"
                accentColor={accentColor}
                aspect="video"
                showBadge={false}
                showExcerpt
                monoTime
                metaBorder={false}
                className="scroll-reveal-card"
              />
            ))}
          </div>

          <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

          <div className="mt-10 flex min-h-12 flex-col items-center justify-center gap-3">
            {isFetchingNextPage && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground font-sans">
                <Loader2 size={16} className="animate-spin" />
                <span>
                  {isEn ? "Loading more stories..." : "थप कथा लोड हुँदैछ..."}
                </span>
              </span>
            )}

            {isFetchNextPageError && (
              <button
                type="button"
                onClick={() => void fetchNextPage()}
                className="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-surface"
              >
                <RefreshCw size={14} />
                <span>{isEn ? "Retry loading" : "पुनः लोड गर्नुहोस्"}</span>
              </button>
            )}

            {!canLoadMore && !isFetchingNextPage && (
              <div className="flex w-full max-w-md items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-center text-xs font-mono font-semibold text-muted-foreground">
                  {hasSearch
                    ? isEn
                      ? `All ${count} matching stories loaded`
                      : `सबै ${count} मिल्दा कथा लोड भए`
                    : isEn
                      ? `All ${count} stories loaded`
                      : `सबै ${count} कथा लोड भए`}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            )}

            {canLoadMore && !isFetchingNextPage && !isFetchNextPageError && (
              <span className="text-xs text-muted-foreground font-sans">
                {isEn
                  ? "Scroll down to load more stories"
                  : "थप कथा हेर्न तल स्क्रोल गर्नुहोस्"}
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}
