"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./DictionaryProvider";
import { localizedPath, stripLocalePrefix } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

/**
 * Language switcher that links to the same page in the other locale.
 * Uses real URLs (not client state/cookies) so crawlers can follow.
 */
export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const lang = useLang();
  const pathname = usePathname();
  const unprefixed = stripLocalePrefix(pathname);

  const neHref = localizedPath("ne", unprefixed);
  const enHref = localizedPath("en", unprefixed);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground",
        className,
      )}
    >
      <Link
        href={neHref}
        hrefLang="ne"
        lang="ne"
        className={cn(
          "hover:text-brand transition-colors",
          lang === "ne"
            ? "text-brand font-bold"
            : "text-muted-foreground hover:text-foreground",
        )}
        title="नेपाली संस्करण"
        aria-label="नेपाली संस्करण"
      >
        ने
      </Link>
      <span className="text-gray-300 dark:text-gray-600 select-none">|</span>
      <Link
        href={enHref}
        hrefLang="en"
        lang="en"
        className={cn(
          "hover:text-brand transition-colors",
          lang === "en"
            ? "text-brand font-bold"
            : "text-muted-foreground hover:text-foreground",
        )}
        title="English version"
        aria-label="English version"
      >
        EN
      </Link>
    </div>
  );
}
