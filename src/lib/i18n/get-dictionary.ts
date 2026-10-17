import 'server-only';
import { cache } from 'react';
import type { Locale } from './config';
import type en from '@/dictionaries/en.json';

// Import dictionaries dynamically — keeps each locale's JSON out of the other's bundle
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default as Dictionary),
  ne: () => import('@/dictionaries/ne.json').then((m) => m.default as Dictionary),
};

export type Dictionary = typeof en;

/** Request-scoped memoized dictionary loader (layout + pages share one import). */
export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const loader = dictionaries[locale];
  if (!loader) {
    return dictionaries.en();
  }
  return loader();
});
