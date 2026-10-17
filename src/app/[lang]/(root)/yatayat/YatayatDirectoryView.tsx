import { Suspense } from "react";
import { ArrowRight, Bus, Car } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { formatNumber } from "@/lib/i18n/format";
import { localizedPath } from "@/lib/i18n/paths";
import {
  POPULAR_LOCATIONS,
  YATAYAT_SERVICES,
  type YatayatLocation,
  type YatayatService,
} from "@/data/yatayatData";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import YatayatHero from "@/components/yatayat/YatayatHero";
import YatayatFilterBar from "@/components/yatayat/YatayatFilterBar";
import YatayatTabs, { type YatayatTab } from "@/components/yatayat/YatayatTabs";
import YatayatBusCard from "@/components/yatayat/YatayatBusCard";
import YatayatCompactCard from "@/components/yatayat/YatayatCompactCard";
import YatayatSidebar from "@/components/yatayat/YatayatSidebar";

type SearchParams = Record<string, string | string[] | undefined>;

interface YatayatDirectoryViewProps {
  locale?: Locale;
  searchParams?: Promise<SearchParams>;
}

const TAB_VALUES: YatayatTab[] = ["all", "bus", "hiace", "jeep"];

function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function buildYatayatHref(
  locale: Locale,
  params: { tab?: YatayatTab; origin?: string; destination?: string; q?: string }
) {
  const search = new URLSearchParams();
  if (params.tab && params.tab !== "all") search.set("tab", params.tab);
  if (params.origin) search.set("origin", params.origin);
  if (params.destination) search.set("destination", params.destination);
  if (params.q) search.set("q", params.q);

  const queryString = search.toString();
  const base = localizedPath(locale, "/yatayat");
  return queryString ? `${base}?${queryString}` : base;
}

function serviceMatchesLocation(
  service: YatayatService,
  location: YatayatLocation,
  endpoint: "origin" | "destination"
) {
  const place = service[endpoint];
  if (place.ne === location.ne || place.en === location.en) return true;
  return service.route.ne.includes(location.ne) || service.route.en.includes(location.en);
}

function serviceMatchesQuery(service: YatayatService, query: string) {
  const haystack = [
    service.title.ne,
    service.title.en,
    service.subTitle.ne,
    service.subTitle.en,
    service.origin.ne,
    service.origin.en,
    service.destination.ne,
    service.destination.en,
    ...service.route.ne,
    ...service.route.en,
    ...service.contacts,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function SectionEmptyState({ locale }: { locale: Locale }) {
  return (
    <div className="p-8 text-center bg-surface border border-border rounded-none text-muted-foreground text-sm">
      {locale === "ne"
        ? "छानिएका फिल्टर अनुसार कुनै सेवा भेटिएन।"
        : "No services found for the selected criteria."}
    </div>
  );
}

interface YatayatDirectoryState {
  activeTab: YatayatTab;
  filteredServices: YatayatService[];
  counts: Record<YatayatTab, number>;
  tabHref: (tab: YatayatTab) => string;
}

function resolveDirectoryState(
  locale: Locale,
  searchParams: SearchParams
): YatayatDirectoryState {
  const originSlug = firstParam(searchParams.origin);
  const destinationSlug = firstParam(searchParams.destination);
  const query = firstParam(searchParams.q).trim();
  const tabParam = firstParam(searchParams.tab);
  const activeTab: YatayatTab = TAB_VALUES.includes(tabParam as YatayatTab)
    ? (tabParam as YatayatTab)
    : "all";

  const origin = POPULAR_LOCATIONS.find((location) => location.slug === originSlug);
  const destination = POPULAR_LOCATIONS.find(
    (location) => location.slug === destinationSlug
  );
  const normalizedQuery = query.toLowerCase();

  const filteredServices = YATAYAT_SERVICES.filter((service) => {
    if (origin && !serviceMatchesLocation(service, origin, "origin")) return false;
    if (destination && !serviceMatchesLocation(service, destination, "destination")) {
      return false;
    }
    if (normalizedQuery && !serviceMatchesQuery(service, normalizedQuery)) return false;
    return true;
  });

  const counts: Record<YatayatTab, number> = {
    all: filteredServices.length,
    bus: 0,
    hiace: 0,
    jeep: 0,
  };
  for (const service of filteredServices) {
    counts[service.type] += 1;
  }

  const tabHref = (tab: YatayatTab) =>
    buildYatayatHref(locale, {
      tab,
      origin: originSlug,
      destination: destinationSlug,
      q: query,
    });

  return { activeTab, filteredServices, counts, tabHref };
}

function YatayatDirectoryFiltersFallback() {
  return (
    <>
      <div className="bg-surface border border-border border-t-[3px] border-t-brand rounded-none p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          {[1, 2].map((i) => (
            <div key={i} className="lg:col-span-4 space-y-1.5">
              <div className="h-5 w-32 skeleton-shimmer" />
              <div className="h-11 w-full skeleton-shimmer" />
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-4 space-y-1.5">
            <div className="h-5 w-20 skeleton-shimmer" />
            <div className="h-11 w-full skeleton-shimmer" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 overflow-hidden border-b border-border pb-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-11 w-32 shrink-0 skeleton-shimmer" />
        ))}
      </div>
    </>
  );
}

function YatayatDirectoryResultsFallback() {
  return (
    <div className="space-y-10">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <div className="h-7 w-44 skeleton-shimmer" />
          <div className="space-y-5">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="h-40 w-full border border-border bg-surface skeleton-shimmer"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

async function YatayatDirectoryFilters({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<SearchParams>;
}) {
  const { activeTab, filteredServices, counts, tabHref } = resolveDirectoryState(
    locale,
    await searchParams
  );

  return (
    <>
      <YatayatFilterBar locale={locale} resultCount={filteredServices.length} />

      <YatayatTabs
        locale={locale}
        activeTab={activeTab}
        counts={counts}
        hrefs={{
          all: tabHref("all"),
          bus: tabHref("bus"),
          hiace: tabHref("hiace"),
          jeep: tabHref("jeep"),
        }}
      />
    </>
  );
}

async function YatayatDirectoryResults({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: Promise<SearchParams>;
}) {
  const { activeTab, filteredServices, counts, tabHref } = resolveDirectoryState(
    locale,
    await searchParams
  );
  const isNe = locale === "ne";

  const busServices = filteredServices.filter((service) => service.type === "bus");
  const hiaceServices = filteredServices.filter((service) => service.type === "hiace");
  const jeepServices = filteredServices.filter((service) => service.type === "jeep");

  return (
    <>
      {(activeTab === "all" || activeTab === "bus") && (
        <section className="space-y-4">
          <FTSectionDivider
            title={isNe ? "बस सेवा" : "Bus Services"}
            enTitle={isNe ? "Bus Services" : undefined}
            sectionIndex="01"
            icon={<Bus size={18} className="text-brand shrink-0" />}
            as="h2"
            className="!my-0 mb-4"
            rightNode={
              <span className="text-xs sm:text-sm text-muted-foreground font-sans hidden sm:inline">
                {isNe
                  ? "सुदूरपश्चिमका विभिन्न रूटमा सञ्चालन हुने बसहरूको सूची"
                  : "List of buses operating across various routes"}
              </span>
            }
          />

          {busServices.length === 0 ? (
            <SectionEmptyState locale={locale} />
          ) : (
            <div className="space-y-5">
              {busServices.map((bus) => (
                <YatayatBusCard key={bus.id} service={bus} locale={locale} />
              ))}
            </div>
          )}

          {activeTab === "all" && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-surface border border-border border-t-[2px] border-t-brand rounded-none text-sm font-semibold">
              <div className="flex items-center gap-2.5 text-foreground font-sans">
                <Bus size={17} aria-hidden="true" className="text-brand" />
                <span>
                  {isNe
                    ? `थप बस सेवा हेर्नुहोस् (सबै ${formatNumber(locale, counts.bus)} सेवा)`
                    : `Explore more bus services (All ${formatNumber(locale, counts.bus)} operators)`}
                </span>
              </div>
              <Link
                href={tabHref("bus")}
                scroll={false}
                className="text-brand hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>{isNe ? "सबै बसहरूको सूची हेर्नुहोस्" : "View Full Bus Directory"}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" || activeTab === "hiace") && (
        <section className="space-y-4">
          <FTSectionDivider
            title={isNe ? "हाइस सेवा" : "Hiace Services"}
            enTitle={isNe ? "Hiace Services" : undefined}
            sectionIndex="02"
            icon={<Car size={18} className="text-brand shrink-0" />}
            as="h2"
            className="!my-0 mb-4"
            rightNode={
              <span className="text-xs sm:text-sm text-muted-foreground font-sans hidden sm:inline">
                {isNe
                  ? "छिटो, सुरक्षित र आरामदायक यात्रा"
                  : "Fast, safe, and comfortable express commute"}
              </span>
            }
          />

          {hiaceServices.length === 0 ? (
            <SectionEmptyState locale={locale} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {hiaceServices.map((hiace) => (
                <YatayatCompactCard
                  key={hiace.id}
                  service={hiace}
                  locale={locale}
                  accent="brand"
                />
              ))}
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" || activeTab === "jeep") && (
        <section className="space-y-4">
          <FTSectionDivider
            title={isNe ? "जीप सेवा" : "Jeep Services"}
            enTitle={isNe ? "Jeep Services" : undefined}
            sectionIndex="03"
            icon={<Car size={18} className="text-brand-secondary shrink-0" />}
            as="h2"
            className="!my-0 mb-4"
            rightNode={
              <span className="text-xs sm:text-sm text-muted-foreground font-sans hidden sm:inline">
                {isNe
                  ? "गाउँ-गाउँको यात्रा, अब अझ सजिलो"
                  : "Connecting remote hills and villages with ease"}
              </span>
            }
          />

          {jeepServices.length === 0 ? (
            <SectionEmptyState locale={locale} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {jeepServices.map((jeep) => (
                <YatayatCompactCard
                  key={jeep.id}
                  service={jeep}
                  locale={locale}
                  accent="secondary"
                />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default function YatayatDirectoryView({
  locale = "ne",
  searchParams = Promise.resolve({}),
}: YatayatDirectoryViewProps) {
  return (
    <main className="flex-1 mobile-safe-bottom bg-background">
      <YatayatHero locale={locale} />

      <div className="container-editorial py-10 sm:py-12">
        <div className="space-y-8">
          <Suspense fallback={<YatayatDirectoryFiltersFallback />}>
            <YatayatDirectoryFilters locale={locale} searchParams={searchParams} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-10">
              <Suspense fallback={<YatayatDirectoryResultsFallback />}>
                <YatayatDirectoryResults locale={locale} searchParams={searchParams} />
              </Suspense>
            </div>

            <YatayatSidebar locale={locale} />
          </div>
        </div>
      </div>
    </main>
  );
}
