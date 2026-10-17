export const locales = ['en', 'ne'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/** BCP-47 language tags for Intl APIs */
export const bcp47: Record<Locale, string> = {
  en: 'en-US',
  ne: 'ne-NP-u-nu-latn', // Latin digits by default; remove -u-nu-latn for Devanagari digits
};

/** OpenGraph locale strings */
export const ogLocale: Record<Locale, string> = {
  en: 'en_US',
  ne: 'ne_NP',
};
