"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

interface DictionaryContextValue {
  lang: Locale;
  dict: Dictionary;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ lang, dict }}>
      {children}
    </DictionaryContext.Provider>
  );
}

/** Get the current locale string */
export function useLang(): Locale {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error("useLang() must be used inside <DictionaryProvider>. Make sure app/[lang]/layout.tsx wraps children with it.");
  }
  return ctx.lang;
}

/** Get the full dictionary for the current locale */
export function useDictionary(): Dictionary {
  const ctx = useContext(DictionaryContext);
  if (!ctx) {
    throw new Error("useDictionary() must be used inside <DictionaryProvider>. Make sure app/[lang]/layout.tsx wraps children with it.");
  }
  return ctx.dict;
}
