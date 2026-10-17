"use client";

import { useSyncExternalStore } from "react";
import { formatDate, timeAgo } from "@/lib/utils";
import type { Locale } from "@/types";

const subscribe = () => () => {};

interface RelativeTimeProps {
  date: string;
  locale: Locale;
  className?: string;
  /** Server/prerender fallback when `date` cannot be formatted; defaults to empty */
  fallback?: string;
}

/**
 * Renders a locale-aware "x minutes ago" label.
 *
 * Relative time depends on the current clock, so it can't be part of a
 * prerendered shell. During SSR/prerender this renders the absolute date
 * (deterministic); after hydration the relative label is computed on the
 * client.
 */
export default function RelativeTime({
  date,
  locale,
  className,
  fallback = "",
}: RelativeTimeProps) {
  const label = useSyncExternalStore(
    subscribe,
    () => timeAgo(date, locale) || fallback,
    () => formatDate(date, locale) || fallback,
  );

  return (
    <time className={className} dateTime={date} suppressHydrationWarning>
      {label}
    </time>
  );
}
