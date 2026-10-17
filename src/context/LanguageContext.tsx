"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Locale, BilingualText } from "@/types";
import { UI_TRANSLATIONS, type TranslationKey } from "@/data/translations";
import { formatDate as utilsFormatDate, timeAgo as utilsTimeAgo } from "@/lib/utils";
import { useLang } from "@/components/i18n/DictionaryProvider";
import { localizedPath, stripLocalePrefix } from "@/lib/i18n/paths";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  isNepali: boolean;
  isEnglish: boolean;
  t: (obj?: BilingualText | null | string, fallback?: string) => string;
  tr: (key: TranslationKey) => string;
  formatTimeAgo: (dateStr: string) => string;
  formatLocaleDate: (dateStr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useLang();
  const router = useRouter();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      const unprefixed = stripLocalePrefix(window.location.pathname);
      const target = localizedPath(newLocale, unprefixed);
      router.push(target);
    },
    [router]
  );

  const toggleLocale = useCallback(() => {
    setLocale(lang === "ne" ? "en" : "ne");
  }, [lang, setLocale]);

  const t = useCallback(
    (obj?: BilingualText | null | string, fallback = ""): string => {
      if (!obj) return fallback;
      if (typeof obj === "string") return obj;
      return obj[lang] || (lang === "ne" ? obj.ne : obj.en) || obj.en || obj.ne || fallback;
    },
    [lang]
  );

  const tr = useCallback(
    (key: TranslationKey): string => {
      const item = UI_TRANSLATIONS[key];
      if (!item) return key;
      return item[lang] || item.ne || key;
    },
    [lang]
  );

  const formatTimeAgo = useCallback(
    (dateStr: string) => utilsTimeAgo(dateStr, lang),
    [lang]
  );

  const formatLocaleDate = useCallback(
    (dateStr: string) => utilsFormatDate(dateStr, lang),
    [lang]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale: lang,
        setLocale,
        toggleLocale,
        isNepali: lang === "ne",
        isEnglish: lang === "en",
        t,
        tr,
        formatTimeAgo,
        formatLocaleDate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context) return context;
  return {
    locale: "en" as Locale,
    setLocale: () => {},
    toggleLocale: () => {},
    isNepali: false,
    isEnglish: true,
    t: (obj?: BilingualText | null | string, fallback = "") => (typeof obj === "string" ? obj : obj ? (obj.en || obj.ne || fallback) : fallback),
    tr: (key: TranslationKey) => UI_TRANSLATIONS[key]?.en ?? key,
    formatTimeAgo: (d: string) => utilsTimeAgo(d, "en"),
    formatLocaleDate: (d: string) => utilsFormatDate(d, "en"),
  };
}
