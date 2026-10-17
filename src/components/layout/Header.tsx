"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Menu, X, Sun, Moon, User, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigationMenu } from "@/context/NavigationContext";
import Logo from "@/components/common/Logo";
import CategoryThumb from "@/components/common/CategoryThumb";
import { cn, getCurrentNepaliDateString } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { stripLocalePrefix } from "@/lib/i18n/paths";
import AuthModal from "@/components/auth/AuthModal";
import type { BilingualText, Category } from "@/types";

interface NavItem {
  key: string;
  label: BilingualText;
  href: string;
  icon?: any;
  children: Category[];
}

/** Always-present links; everything else comes from the Category menu API. */
const FIXED_NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    label: { ne: "मुख्यपृष्ठ", en: "Home" },
    href: "/",
    children: [],
  },
  {
    key: "district",
    label: { ne: "जिल्ला", en: "Districts" },
    href: "/district",
    children: [],
  },
  {
    key: "products",
    label: { ne: "सुदूर उत्पादन", en: "Local Products" },
    href: "/products",
    children: [],
  },
  {
    key: "yatayat",
    label: { ne: "सुदूर यातायात", en: "Sudur Yatayat" },
    href: "/yatayat",
    children: [],
  },
];

const categoryHref = (cat: any) => {
  const isTopLevel = !cat.parent && !cat.parent_slug;
  const layout = cat.layout_type === "stayor_hotel" ? "stay" : cat.layout_type;

  if (layout && layout !== "base") {
    return isTopLevel ? `/${layout}` : `/${layout}/category/${cat.slug}`;
  }

  return `/category/${cat.slug}`;
};

function isNavItemActive(item: NavItem, path: string) {
  if (item.href === "/") return path === "/";
  if (path === item.href || path.startsWith(`${item.href}/`)) return true;
  return item.children.some((c) => path === categoryHref(c));
}

export default function Header() {
  const pathname = usePathname();
  const unprefixedPath = stripLocalePrefix(pathname);
  const router = useRouter();
  const { locale, setLocale, t, tr } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const menu = useNavigationMenu();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [expandedMobileKey, setExpandedMobileKey] = useState<string | null>(
    null,
  );

  const navItems = useMemo<NavItem[]>(
    () => [
      ...FIXED_NAV_ITEMS,
      ...menu.map((cat) => ({
        key: `cat-${cat.slug}`,
        label: cat.name,
        href: categoryHref(cat),
        children: cat.children ?? [],
      })),
    ],
    [menu],
  );

  // Sub-menu strip: hovered item wins (desktop); otherwise the active section's children stay visible
  const activeItem = navItems.find((item) =>
    isNavItemActive(item, unprefixedPath),
  );
  const hoveredItem = hoveredKey
    ? navItems.find((item) => item.key === hoveredKey)
    : undefined;
  const stripItem = hoveredItem?.children.length
    ? hoveredItem
    : activeItem?.children.length
      ? activeItem
      : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset transient menu state on navigation
  useEffect(() => {
    setHoveredKey(null);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Bikram Sambat / Nepali date format matching reference image
  const getDisplayDate = () => {
    if (locale === "ne") {
      return getCurrentNepaliDateString();
    }
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <header
      className={cn(
        "sticky top-0 bg-background border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.03)]",
        menuOpen ? "z-[200]" : "z-50",
      )}
    >
      {/* ── Top Bar: Logo & Utility Row ── */}
      <div className="container-editorial py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          {/* Logo with Mountain Emblem */}
          <Logo />

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-4 text-sm shrink-0">
            {/* Nepali / English Date */}
            <span
              suppressHydrationWarning
              className="text-xs sm:text-sm text-muted-foreground font-medium hidden md:inline-block"
            >
              {mounted ? getDisplayDate() : ""}
            </span>

            {/* Language Switch: ने | EN */}
            <LanguageSwitcher />

            {/* User Profile / Login (Desktop) */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3 ml-2">
                <span className="text-sm font-semibold truncate max-w-[120px]">
                  {user.username}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-xs font-semibold text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden sm:flex items-center justify-center gap-1.5 px-4 py-1.5 bg-brand hover:bg-brand-dark text-white transition-colors cursor-pointer font-bold shadow-sm ml-1"
              >
                <User size={14} strokeWidth={2.5} />
                <span className="text-xs">
                  {locale === "ne" ? "लगइन" : "Login"}
                </span>
              </button>
            )}

            {/* Login Icon (Mobile) */}
            {!user ? (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="sm:hidden text-foreground hover:text-brand transition-colors p-2 min-h-[40px] flex items-center justify-center cursor-pointer"
              >
                <User size={18} strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => logout()}
                className="sm:hidden text-foreground hover:text-red-500 transition-colors p-2 min-h-[40px] flex items-center justify-center cursor-pointer"
              >
                <X size={18} strokeWidth={2} />
              </button>
            )}

            {/* Theme Toggle (Mobile & Tablet) */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="lg:hidden text-foreground hover:text-brand transition-colors p-2 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer rounded-full hover:bg-surface"
            >
              {mounted && theme === "dark" ? (
                <Moon size={18} className="text-brand" />
              ) : (
                <Sun size={18} className="text-warning" />
              )}
            </button>

            {/* Search Icon button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="text-foreground hover:text-brand transition-colors p-2 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            >
              <Search size={18} strokeWidth={2} />
            </button>

            {/* Mobile Menu Icon */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="xl:hidden text-foreground hover:text-brand transition-colors p-2 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Inline Search Bar when search button clicked */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="mt-3 relative max-w-xl mx-auto animate-fadeIn"
          >
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr("searchPlaceholder")}
              className="w-full pl-10 pr-24 py-2.5 border border-border bg-background rounded-none text-sm focus:outline-none focus:border-brand shadow-xs"
            />
            <Search
              size={16}
              className="absolute left-3.5 top-3.5 text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-brand text-white text-xs font-semibold rounded-none hover:bg-brand-dark transition-colors cursor-pointer flex items-center"
            >
              {tr("search")}
            </button>
          </form>
        )}
      </div>

      {/* ── Bottom Row: Navigation Bar with Horizontal Swipe on Mobile & Tablet ── */}
      <div onMouseLeave={() => setHoveredKey(null)}>
        <div className="border-t border-border bg-surface/90 w-full overflow-hidden">
          <div className="container-editorial flex items-center justify-between">
            {/* Main Nav Items - Swipeable on mobile/tablet, full on desktop */}
            <div className="w-full min-w-0 overflow-x-auto no-scrollbar">
              <nav
                className="flex items-center space-x-1 py-1 -ml-3"
                aria-label="Main"
              >
                {navItems.map((item) => {
                  const isActive = isNavItemActive(item, unprefixedPath);
                  const hasChildren = item.children.length > 0;

                  return (
                    <LocalizedLink
                      key={item.key}
                      href={item.href}
                      onMouseEnter={() => setHoveredKey(item.key)}
                      onFocus={() => setHoveredKey(item.key)}
                      aria-haspopup={hasChildren ? "true" : undefined}
                      className={cn(
                        "px-3.5 py-2.5 text-sm sm:text-base font-semibold transition-all relative whitespace-nowrap min-h-[42px] flex items-center gap-1.5 shrink-0",
                        isActive
                          ? "text-brand font-bold"
                          : "text-muted-foreground hover:text-brand",
                      )}
                    >
                      {item.icon && <item.icon size={16} className="shrink-0" />}
                      {t(item.label)}
                      {hasChildren && (
                        <ChevronDown
                          size={15}
                          className={cn(
                            "transition-transform duration-200 opacity-60",
                            stripItem?.key === item.key &&
                              "rotate-180 opacity-100",
                          )}
                        />
                      )}
                      {/* Active Green Underline Bar matching reference image */}
                      {isActive && (
                        <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-brand rounded-none" />
                      )}
                    </LocalizedLink>
                  );
                })}
              </nav>
            </div>

            {/* Right: Theme Toggle Switch */}
            <div className="hidden lg:flex items-center py-1 pl-4 shrink-0 border-l border-border ml-2">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className={cn(
                  "relative inline-flex h-[26px] w-[50px] items-center rounded-full transition-colors cursor-pointer shrink-0 border border-transparent shadow-inner",
                  theme === "dark" ? "bg-brand" : "bg-gray-300",
                )}
              >
                <span
                  className={cn(
                    "inline-flex flex-shrink-0 items-center justify-center h-[20px] w-[20px] transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                    theme === "dark"
                      ? "translate-x-[26px]"
                      : "translate-x-[4px]",
                  )}
                >
                  {mounted && theme === "dark" ? (
                    <Moon size={12} className="text-brand" />
                  ) : (
                    <Sun size={12} className="text-warning" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Sub-menu Strip: sub-categories with images (hover on desktop / active section) ── */}
        <AnimatePresence initial={false} mode="wait">
          {stripItem && (
            <motion.div
              key={stripItem.key}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="border-t border-border bg-background w-full overflow-hidden"
            >
              <div className="container-editorial overflow-x-auto no-scrollbar">
                <nav
                  className="flex items-center gap-1 sm:gap-2 py-2 -ml-1.5"
                  aria-label={t(stripItem.label)}
                >
                  {stripItem.children.map((child) => {
                    const childHref = categoryHref(child);
                    const isChildActive = unprefixedPath === childHref;
                    const childLabel = t(child.name);
                    return (
                      <LocalizedLink
                        key={child.slug}
                        href={childHref}
                        className={cn(
                          "group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full shrink-0 whitespace-nowrap transition-colors",
                          isChildActive
                            ? "bg-brand/10 text-brand"
                            : "text-foreground hover:bg-surface hover:text-brand",
                        )}
                      >
                        <CategoryThumb
                          image={child.image}
                          label={childLabel}
                          size={34}
                          className="transition-transform duration-200 group-hover:scale-105"
                        />
                        <span className="text-sm font-semibold">
                          {childLabel}
                        </span>
                      </LocalizedLink>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Menu Sidebar ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[100] xl:hidden backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background z-[101] xl:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-bold text-lg text-foreground">Menu</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="Toggle theme"
                    className="p-2 text-foreground hover:text-brand transition-colors bg-surface rounded-full min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  >
                    {mounted && theme === "dark" ? (
                      <Moon size={16} className="text-brand" />
                    ) : (
                      <Sun size={16} className="text-warning" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-surface rounded-full min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-4">
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = isNavItemActive(item, unprefixedPath);
                    const hasChildren = item.children.length > 0;
                    const isExpanded =
                      expandedMobileKey === item.key ||
                      (expandedMobileKey === null && isActive && hasChildren);
                    return (
                      <div key={item.key}>
                        <div className="flex items-center gap-1">
                          <LocalizedLink
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                              "flex-1 px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-2.5",
                              isActive
                                ? "bg-brand/10 text-brand"
                                : "text-foreground hover:bg-surface",
                            )}
                          >
                            {item.icon && <item.icon size={18} className="shrink-0" />}
                            {t(item.label)}
                          </LocalizedLink>
                          {hasChildren && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMobileKey(isExpanded ? "" : item.key)
                              }
                              aria-label={`Toggle ${t(item.label)} sub-menu`}
                              aria-expanded={isExpanded}
                              className="p-3 rounded-xl text-muted-foreground hover:bg-surface hover:text-brand transition-colors"
                            >
                              <ChevronDown
                                size={18}
                                className={cn(
                                  "transition-transform duration-200",
                                  isExpanded && "rotate-180",
                                )}
                              />
                            </button>
                          )}
                        </div>

                        <AnimatePresence initial={false}>
                          {hasChildren && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-3 border-l-2 border-brand/20 py-1 flex flex-col gap-0.5">
                                {item.children.map((child) => {
                                  const childHref = categoryHref(child);
                                  const childLabel = t(child.name);
                                  return (
                                    <LocalizedLink
                                      key={child.slug}
                                      href={childHref}
                                      onClick={() => setMenuOpen(false)}
                                      className={cn(
                                        "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                                        unprefixedPath === childHref
                                          ? "text-brand bg-brand/5"
                                          : "text-foreground hover:bg-surface",
                                      )}
                                    >
                                      <CategoryThumb
                                        image={child.image}
                                        label={childLabel}
                                        size={30}
                                      />
                                      {childLabel}
                                    </LocalizedLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 pb-safe mb-16 md:mb-0 border-t border-border bg-surface/50 flex items-center justify-between gap-2">
                <LanguageSwitcher />
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground font-medium font-sans">
                    {mounted && theme === "dark"
                      ? locale === "ne"
                        ? "डार्क"
                        : "Dark"
                      : locale === "ne"
                        ? "लाइट"
                        : "Light"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="Toggle theme"
                    className={cn(
                      "relative inline-flex h-[26px] w-[50px] items-center rounded-full transition-colors cursor-pointer shrink-0 border border-transparent shadow-inner",
                      theme === "dark" ? "bg-brand" : "bg-gray-300",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex flex-shrink-0 items-center justify-center h-[20px] w-[20px] transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                        theme === "dark"
                          ? "translate-x-[26px]"
                          : "translate-x-[4px]",
                      )}
                    >
                      {mounted && theme === "dark" ? (
                        <Moon size={12} className="text-brand" />
                      ) : (
                        <Sun size={12} className="text-warning" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Auth Modal (Extracted Component) ── */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}
