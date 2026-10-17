"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLang } from "./DictionaryProvider";
import { localizedPath } from "@/lib/i18n/paths";

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Unprefixed internal href, e.g. "/article/my-slug" */
  href: string;
};

/**
 * Drop-in replacement for next/link for all internal navigation.
 * Automatically adds the locale prefix based on the current lang.
 */
export default function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const lang = useLang();
  return <Link href={localizedPath(lang, href)} {...props} />;
}
