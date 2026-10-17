import React, { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import RoadblockAdModal from "@/components/ads/RoadblockAdModal";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="container-editorial py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <div className="h-10 w-40 sm:w-48 bg-muted animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="hidden md:block h-4 w-28 bg-muted animate-pulse" />
            <div className="hidden sm:block h-7 w-20 bg-muted animate-pulse" />
            <div className="sm:hidden h-8 w-8 bg-muted animate-pulse" />
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-editorial flex items-center gap-6 py-3 overflow-hidden">
          {[72, 56, 64, 48, 60, 68].map((w, i) => (
            <div
              key={i}
              className={`h-4 bg-muted animate-pulse ${i > 3 ? "hidden lg:block" : ""}`}
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

function MobileBottomNavSkeleton() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-t border-border pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1.5 px-3 py-1 min-h-[48px] min-w-[48px]"
          >
            <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
            <div className="h-2.5 w-8 bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </nav>
  );
}

export default async function RootRouteGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground w-full max-w-full">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
        {children}
      </div>
      <Footer locale={locale} />
      <Suspense fallback={<MobileBottomNavSkeleton />}>
        <MobileBottomNav />
      </Suspense>
      <RoadblockAdModal />
    </div>
  );
}
