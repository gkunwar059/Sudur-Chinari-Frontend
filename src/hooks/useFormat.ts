"use client";

import { useMemo } from "react";
import { useLang } from "@/components/i18n/DictionaryProvider";
import { formatNumber, formatDate, formatRelativeTime, formatCurrency, t } from "@/lib/i18n/format";

/**
 * Client hook for locale-aware formatting.
 *
 * Nepali digits note:
 * Uses Latin digits by default via `ne-NP-u-nu-latn` in config.ts.
 * To switch to Devanagari digits, change `bcp47.ne` to 'ne-NP' in src/lib/i18n/config.ts.
 */
export function useFormat() {
  const lang = useLang();

  return useMemo(() => ({
    lang,
    t: (template: string, vars?: Record<string, string | number>) => t(template, vars),
    number: (value: number, opts?: Intl.NumberFormatOptions) => formatNumber(lang, value, opts),
    date: (date: Date | string, opts?: Intl.DateTimeFormatOptions) => formatDate(lang, date, opts),
    relativeTime: (date: Date | string) => formatRelativeTime(lang, date),
    currency: (amount: number) => formatCurrency(lang, amount),
  }), [lang]);
}
