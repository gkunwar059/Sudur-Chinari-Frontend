"use client";

import Link from "@/components/i18n/LocalizedLink";
import { ArrowRight } from "lucide-react";
import type { District } from "@/types";
import { DISTRICTS } from "@/data/districts";
import { t as translate } from "@/lib/utils";
import FTSectionDivider from "../common/FTSectionDivider";

interface DistrictQuickSwitcherProps {
  currentDistrictSlug: string;
  locale: string;
}

export default function DistrictQuickSwitcher({
  currentDistrictSlug,
  locale,
}: DistrictQuickSwitcherProps) {
  const t = (val: any) => translate(val, locale as "ne" | "en");
  const otherDistricts = DISTRICTS.filter((d) => d.slug !== currentDistrictSlug);

  return (
    <div className="border-t border-border bg-surface py-10">
      <div className="container-editorial">
        <FTSectionDivider
          title={
            locale === "ne"
              ? "सुदूरपश्चिमका अन्य ८ जिल्लाहरू"
              : "Other 8 Districts of Far-West"
          }
          viewAllHref="/district"
          viewAllText={locale === "ne" ? "सबै ९ जिल्लाहरू" : "All Districts"}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {otherDistricts.map((od) => {
            const odTheme = od.theme || { primary: od.accentColor };
            return (
              <Link
                key={od.slug}
                href={`/district/${od.slug}`}
                className="group scroll-reveal-card bg-background hover:bg-surface border border-border rounded-none p-3 text-center transition-all flex flex-col items-center justify-between shadow-2xs"
                style={{ borderTop: `3px solid ${odTheme.primary}` }}
              >
                <span className="text-sm font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors truncate w-full">
                  {t(od.name)}
                </span>
                {typeof od.name === "object" && od.name?.en && (
                  <span className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate w-full">
                    {od.name.en}
                  </span>
                )}
                <span
                  className="text-[9.5px] font-bold px-2 py-0.5 mt-1.5 rounded-none bg-surface border border-border inline-flex items-center gap-1"
                  style={{
                    color: odTheme.primary,
                  }}
                >
                  <span>विवरण</span>
                  <ArrowRight size={10} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
