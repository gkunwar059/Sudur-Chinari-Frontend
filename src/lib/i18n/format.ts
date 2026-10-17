import type { Locale } from './config';
import { bcp47 } from './config';

/**
 * Replace {variable} placeholders in a dictionary string.
 * Example: t("Found {count} results", { count: 5 }) → "Found 5 results"
 */
export function t(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

// ─── Intl formatters ────────────────────────────────────────────────────────

function tag(lang: Locale) {
  return bcp47[lang];
}

/** Format a number with locale-appropriate separators */
export function formatNumber(lang: Locale, value: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(tag(lang), opts).format(value);
}

/** Format a date with locale-appropriate display */
export function formatDate(lang: Locale, date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(tag(lang), opts ?? { dateStyle: 'medium' }).format(d);
}

/** Format a relative time (e.g. "3 days ago") */
export function formatRelativeTime(lang: Locale, date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = d.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat(tag(lang), { numeric: 'auto' });

  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diffSec / 86400), 'day');
  if (abs < 31536000) return rtf.format(Math.round(diffSec / 2592000), 'month');
  return rtf.format(Math.round(diffSec / 31536000), 'year');
}

/** Format currency in NPR */
export function formatCurrency(lang: Locale, amount: number): string {
  return new Intl.NumberFormat(tag(lang), {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Server-side formatter factory for a given locale.
 */
export function getFormatter(lang: Locale) {
  return {
    t: (template: string, vars?: Record<string, string | number>) => t(template, vars),
    number: (value: number, opts?: Intl.NumberFormatOptions) => formatNumber(lang, value, opts),
    date: (date: Date | string, opts?: Intl.DateTimeFormatOptions) => formatDate(lang, date, opts),
    relativeTime: (date: Date | string) => formatRelativeTime(lang, date),
    currency: (amount: number) => formatCurrency(lang, amount),
  };
}
