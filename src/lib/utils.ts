import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locale } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function t(obj: any, locale: Locale = 'ne'): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[locale] ?? obj.ne ?? obj.en ?? '';
}

export function getArticleSlug(article: any): string {
  if (!article) return '';
  if (typeof article === 'string') return article;
  if (typeof article.slug === 'string') return article.slug;
  if (article.slug && typeof article.slug === 'object') {
    return article.slug.en || article.slug.ne || '';
  }
  return '';
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') 
  : 'http://127.0.0.1:8001';

export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
  return `${BACKEND_URL}/${url}`;
}

export function formatDate(dateStr: string, locale: Locale = 'ne'): string {
  const date = new Date(dateStr);
  if (locale === 'ne') {
    // Format as Nepali-readable date
    const months = [
      'जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन',
      'जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function timeAgo(dateStr: string, locale: Locale = 'ne'): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (locale === 'ne') {
    if (diffMins < 1) return 'अहिले';
    if (diffMins < 60) return `${diffMins} मिनेट अघि`;
    if (diffHours < 24) return `${diffHours} घण्टा अघि`;
    if (diffDays < 7) return `${diffDays} दिन अघि`;
    return formatDate(dateStr, 'ne');
  } else {
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr, 'en');
  }
}

export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
export const toNepaliDigits = (num: number | string) => num.toString().split('').map(d => nepaliDigits[parseInt(d)] || d).join('');
const nepaliMonths = ['वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
const nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

export function getCurrentNepaliDateString() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const NepaliDate = require('nepali-date');
    const now = new NepaliDate();
    const year = toNepaliDigits(now.getYear());
    const month = nepaliMonths[now.getMonth()];
    const day = toNepaliDigits(now.getDate());
    const weekday = nepaliDays[now.getDay()];
    return `${year} ${month} ${day}, ${weekday}`;
  } catch (e) {
    return "२०८१ भाद्र २३, सोमबार";
  }
}

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '';
  // If backend host was prepended to a frontend /images/... or /media/... path, extract relative path
  if (url.includes('/images/')) {
    const idx = url.indexOf('/images/');
    return url.slice(idx);
  }
  if (url.includes('/media/')) {
    const idx = url.indexOf('/media/');
    return url.slice(idx);
  }
  return url;
}


