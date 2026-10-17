"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  locale: Locale;
  districtThemeColor: string;
}

export default function HotelSearch({ locale, districtThemeColor }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto sm:mx-0">
      <div className="relative flex items-center">
        <Search
          size={18}
          className="absolute left-4 text-muted-foreground"
          style={{ color: query ? districtThemeColor : undefined }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={locale === "ne" ? "होटल खोज्नुहोस्..." : "Search hotels..."}
          className="w-full h-12 pl-11 pr-12 bg-surface border border-border focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          style={{ focusRingColor: districtThemeColor } as any}
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 h-8 px-3 flex items-center justify-center text-white text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: districtThemeColor }}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : locale === "ne" ? "खोज" : "Find"}
        </button>
      </div>
    </form>
  );
}
