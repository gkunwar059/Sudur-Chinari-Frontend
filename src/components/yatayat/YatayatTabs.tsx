import Link from "next/link";
import { formatNumber } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/config";
import type { YatayatService } from "@/data/yatayatData";

export type YatayatTab = "all" | YatayatService["type"];

interface YatayatTabsProps {
  locale: Locale;
  activeTab: YatayatTab;
  counts: Record<YatayatTab, number>;
  hrefs: Record<YatayatTab, string>;
}

interface TabConfig {
  key: YatayatTab;
  labelNe: string;
  labelEn: string;
}

const TABS: TabConfig[] = [
  { key: "all", labelNe: "सबै सेवा", labelEn: "All Services" },
  { key: "bus", labelNe: "बस सेवा", labelEn: "Bus Service" },
  { key: "hiace", labelNe: "हाइस सेवा", labelEn: "Hiace Service" },
  { key: "jeep", labelNe: "जीप सेवा", labelEn: "Jeep Service" },
];

export default function YatayatTabs({ locale, activeTab, counts, hrefs }: YatayatTabsProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-border pb-3.5">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Link
            key={tab.key}
            href={hrefs[tab.key]}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`px-5 py-2.5 rounded-none font-bold text-sm sm:text-base transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border ${
              isActive
                ? "bg-brand text-white border-brand shadow-xs"
                : "bg-surface text-foreground hover:bg-surface-hover border-border"
            }`}
          >
            <span>{locale === "ne" ? tab.labelNe : tab.labelEn}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-none font-semibold ${
                isActive ? "bg-white/20 text-white" : "bg-border text-foreground"
              }`}
            >
              {formatNumber(locale, counts[tab.key])}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
