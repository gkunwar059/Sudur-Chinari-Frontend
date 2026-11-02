"use client";

import { useState, useEffect } from "react";
import { BookMarked, MapPin, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import UserContributionModal from "@/components/district/UserContributionModal";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import type { District, Article, BilingualText } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { useTheme } from "next-themes";
import { cn, t as translate } from "@/lib/utils";
import DistrictArchives, { getArchiveCategories } from "./DistrictArchives";
import DistrictHeroBanner from "./DistrictHeroBanner";
import DistrictStoriesTab from "./DistrictStoriesTab";
import DistrictDestinationsView from "./DistrictDestinationsView";
import DistrictPhotosView from "./DistrictPhotosView";
import DistrictQuickSwitcher from "./DistrictQuickSwitcher";

interface DistrictContentViewProps {
  district: District;
  articles: Article[];
  totalStories?: number;
  storiesHref?: string;
  nearbyDistricts: District[];
  initialTab?: string;
  lang: string;
}

export default function DistrictContentView({
  district,
  articles,
  totalStories = articles.length,
  storiesHref,
  initialTab = "all",
  lang,
}: DistrictContentViewProps) {
  const locale = lang;
  const isEn = locale === "en";

  const t = (obj?: BilingualText | null | string, fallback = ""): string =>
    translate(obj, lang as "en" | "ne") || fallback;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { user } = useAuth();

  const handleOpenContributionModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsContributionModalOpen(true);
  };

  const { data: communityStoriesRes } = useQuery({
    queryKey: ['community-stories', district.slug],
    queryFn: () => newsApi.getStoryContributionsClient({ district: district.slug, status: 'approved' }),
  });
  const communityStories = (communityStoriesRes?.results || []).filter(
    (story: any) => story.status === 'approved'
  );

  const archiveCategories = getArchiveCategories(isEn);
  const isArchiveTab =
    archiveCategories.some((c) => c.id === activeTab) ||
    activeTab === "archives";

  const COMBINED_TABS = [
    {
      id: "all",
      label: isEn ? "All Stories" : "सबै कथा",
      icon: <BookMarked size={14} />,
    },
    {
      id: "destinations",
      label: isEn ? "Places & Nature" : "पर्यटन र प्रमुख गन्तव्य",
      icon: <MapPin size={14} />,
    },
    ...archiveCategories,
    {
      id: "photos",
      label: isEn ? "Multimedia" : "मल्टिमिडिया",
      icon: <Camera size={14} />,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        ["all", "destinations", "culture", "photos"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const theme = district.theme || {
    primary: district.accentColor,
    dark: "var(--foreground)",
    light: "var(--surface)",
    border: "var(--border)",
    badgeBg: "var(--surface-tint)",
    badgeText: district.accentColor,
    gradient: "from-gray-900 to-black",
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tabId === "all") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tabId);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <div className="bg-background min-h-screen w-full max-w-full overflow-x-hidden">
      {/* ── Broadsheet Breadcrumb ── */}
      <FTBreadcrumb
        locale={locale as Locale}
        navClassName="flex items-center gap-2 text-xs text-muted-foreground font-medium font-sans overflow-x-auto no-scrollbar whitespace-nowrap min-w-0"
        items={[
          {
            name:
              locale === "ne"
                ? "सुदूरपश्चिमका ९ जिल्लाहरू"
                : "9 Districts of Far-West",
            href: "/district",
          },
          {
            name:
              typeof district.name === "object" &&
              district.name?.ne &&
              district.name?.en
                ? `${district.name.ne} (${district.name.en})`
                : t(district.name),
            color: theme.primary,
          },
        ]}
      />

      {/* ── Modern Right-Aligned District Masthead Banner ── */}
      <DistrictHeroBanner
        district={district}
        theme={theme}
        locale={locale}
        isDark={isDark}
        onExploreDestinations={() => handleTabChange("destinations")}
        onOpenContributionModal={handleOpenContributionModal}
      />

      {/* ── Broadsheet Navigation Solid Tabs ── */}
      <div className="border-y border-border bg-surface mb-8">
        <div className="container-editorial">
          <nav className="flex items-center gap-1 sm:gap-1 overflow-x-auto no-scrollbar py-1">
            {COMBINED_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3.5 whitespace-nowrap text-sm font-bold font-sans transition-colors rounded-none my-2 cursor-pointer",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
                  )}
                  style={{
                    backgroundColor: isActive ? theme.primary : "transparent",
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── TAB 1: ALL / STORIES VIEW ── */}
      {activeTab === "all" && (
        <DistrictStoriesTab
          district={district}
          articles={articles}
          communityStories={communityStories}
          totalStories={totalStories}
          storiesHref={storiesHref}
          theme={theme}
          locale={locale}
          isEn={isEn}
          isDark={isDark}
          onOpenContributionModal={handleOpenContributionModal}
        />
      )}

      {/* ── TAB 2: DESTINATIONS & NATURE SHOWCASE ── */}
      {activeTab === "destinations" && (
        <DistrictDestinationsView
          district={district}
          theme={theme}
          locale={locale}
          isDark={isDark}
        />
      )}

      {/* ── TAB 3: PHOTO FEATURE TAB VIEW ── */}
      {activeTab === "photos" && (
        <DistrictPhotosView
          districtSlug={district.slug}
          articles={articles}
          themePrimary={theme.primary}
          locale={locale}
        />
      )}

      {/* ── TAB 4: ARCHIVES & VOICES ── */}
      {isArchiveTab && (
        <DistrictArchives
          district={district}
          activeCategory={activeTab === "archives" ? "archives-all" : activeTab}
        />
      )}

      {/* ── Broadsheet Quick Switcher: Explore Other Districts ── */}
      <DistrictQuickSwitcher
        currentDistrictSlug={district.slug}
        locale={locale}
      />

      {/* ── Auth Modal for unauthenticated users ── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsContributionModalOpen(true);
        }}
      />

      {/* ── User Contribution Modal ── */}
      <UserContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        districtName={district.name}
        themePrimary={theme.primary}
        defaultDistrict={district.slug}
      />
    </div>
  );
}
