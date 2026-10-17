"use client";

import { Home, Clock, MapPin, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { stripLocalePrefix } from "@/lib/i18n/paths";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const unprefixedPath = stripLocalePrefix(pathname);
  const { t } = useLanguage();

  const bottomNav = [
    { label: { ne: "गृह", en: "Home" }, href: "/", Icon: Home },
    { label: { ne: "ताजा", en: "Latest" }, href: "/news", Icon: Clock },
    { label: { ne: "जिल्ला", en: "Districts" }, href: "/district", Icon: MapPin },
    { label: { ne: "खोज", en: "Search" }, href: "/search", Icon: Search },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-border pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {bottomNav.map(({ label, href, Icon }) => {
          const active = unprefixedPath === href || (href !== "/" && unprefixedPath.startsWith(href));
          return (
            <LocalizedLink
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-1 min-h-[48px] min-w-[48px] transition-colors",
                active
                  ? "text-brand font-bold"
                  : "text-muted-foreground hover:text-brand"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10.5px] font-medium leading-none">{t(label)}</span>
            </LocalizedLink>
          );
        })}
      </div>
    </nav>
  );
}
