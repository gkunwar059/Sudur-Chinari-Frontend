"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Search } from "lucide-react";
import { formatNumber } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/config";
import { POPULAR_LOCATIONS } from "@/data/yatayatData";

interface YatayatFilterBarProps {
  locale: Locale;
  resultCount: number;
}

interface LocationSelectProps {
  id: string;
  locale: Locale;
  label: string;
  allLabel: string;
  value: string;
  onChange: (value: string) => void;
}

function LocationSelect({ id, locale, label, allLabel, value, onChange }: LocationSelectProps) {
  return (
    <div className="lg:col-span-4">
      <label htmlFor={id} className="block text-sm font-bold text-foreground mb-1.5 font-sans">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-11 px-3.5 text-sm sm:text-base font-medium border border-border bg-background rounded-none focus:outline-none focus:border-brand shadow-2xs"
      >
        <option value="">{allLabel}</option>
        {POPULAR_LOCATIONS.map((location) => (
          <option key={location.slug} value={location.slug}>
            {locale === "ne" ? location.ne : location.en}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FilterUpdates {
  origin?: string | null;
  destination?: string | null;
  q?: string | null;
}

export default function YatayatFilterBar({ locale, resultCount }: YatayatFilterBarProps) {
  const isNe = locale === "ne";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";
  const query = searchParams.get("q") ?? "";

  const [draftOrigin, setDraftOrigin] = useState(origin);
  const [draftDestination, setDraftDestination] = useState(destination);
  const [draftQuery, setDraftQuery] = useState(query);

  const lastPushedKeyRef = useRef(`${origin}|${destination}|${query}`);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const key = `${origin}|${destination}|${query}`;
    if (lastPushedKeyRef.current === key) return;
    lastPushedKeyRef.current = key;
    setDraftOrigin(origin);
    setDraftDestination(destination);
    setDraftQuery(query);
  }, [origin, destination, query]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const pushParams = useCallback(
    (updates: FilterUpdates) => {
      const nextOrigin = updates.origin !== undefined ? updates.origin : draftOrigin;
      const nextDestination =
        updates.destination !== undefined ? updates.destination : draftDestination;
      const nextQuery =
        updates.q !== undefined ? updates.q : draftQuery.trim() || null;

      const params = new URLSearchParams();
      const tab = searchParams.get("tab");
      if (tab) params.set("tab", tab);
      if (nextOrigin) params.set("origin", nextOrigin);
      if (nextDestination) params.set("destination", nextDestination);
      if (nextQuery) params.set("q", nextQuery);

      lastPushedKeyRef.current = `${nextOrigin ?? ""}|${nextDestination ?? ""}|${nextQuery ?? ""}`;

      const queryString = params.toString();
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [draftOrigin, draftDestination, draftQuery, pathname, router, searchParams]
  );

  const handleQueryChange = (value: string) => {
    setDraftQuery(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => pushParams({ q: value.trim() || null }), 350);
  };

  const handleOriginChange = (value: string) => {
    setDraftOrigin(value);
    pushParams({ origin: value || null });
  };

  const handleDestinationChange = (value: string) => {
    setDraftDestination(value);
    pushParams({ destination: value || null });
  };

  const handleReset = () => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setDraftQuery("");
    setDraftOrigin("");
    setDraftDestination("");
    pushParams({ origin: null, destination: null, q: null });
  };

  const hasActiveFilters = origin !== "" || destination !== "" || query !== "";

  return (
    <div
      aria-busy={isPending}
      className="bg-surface border border-border border-t-[3px] border-t-brand rounded-none p-5 sm:p-6 shadow-xs"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        <LocationSelect
          id="yatayat-origin"
          locale={locale}
          label={isNe ? "प्रस्थान स्थान" : "Departure Place"}
          allLabel={isNe ? "सबै प्रस्थान स्थान" : "All Departure Places"}
          value={draftOrigin}
          onChange={handleOriginChange}
        />

        <LocationSelect
          id="yatayat-destination"
          locale={locale}
          label={isNe ? "गन्तव्य स्थान" : "Destination Place"}
          allLabel={isNe ? "सबै गन्तव्य स्थान" : "All Destinations"}
          value={draftDestination}
          onChange={handleDestinationChange}
        />

        <div className="sm:col-span-2 lg:col-span-4">
          <label htmlFor="yatayat-search" className="block text-sm font-bold text-foreground mb-1.5 font-sans">
            {isNe ? "खोज्नुहोस्" : "Search"}
          </label>
          <div className="relative">
            <Search
              size={16}
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              id="yatayat-search"
              type="search"
              value={draftQuery}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder={
                isNe ? "सेवा, मार्ग वा सम्पर्क नम्बर..." : "Service, route, or contact number..."
              }
              className="w-full h-11 pl-10 pr-3.5 text-sm sm:text-base font-medium border border-border bg-background rounded-none focus:outline-none focus:border-brand shadow-2xs"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-3 text-sm flex-wrap">
          <span className="text-muted-foreground font-medium font-sans">
            {isNe
              ? `फिल्टर गरिएको: ${formatNumber(locale, resultCount)} वटा सेवा फेला पर्यो`
              : `Filtered: ${formatNumber(locale, resultCount)} services found`}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-brand font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>{isNe ? "फिल्टर हटाउनुहोस्" : "Reset Filters"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
