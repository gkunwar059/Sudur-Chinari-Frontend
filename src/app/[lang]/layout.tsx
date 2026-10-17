import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
  Martel,
  Mukta,
} from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import QueryProvider from "@/components/common/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { notFound } from "next/navigation";
import { isLocale, ogLocale, bcp47 } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/paths";
import { DictionaryProvider } from "@/components/i18n/DictionaryProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { getSessionUser } from "@/lib/auth-session";
import { newsApi } from "@/lib/api";
import type { Locale } from "@/lib/i18n/config";
import type { Category } from "@/types";

// The header renders the resolved session into the first paint (no
// login-button flash). Reading cookies here blocks prerendering, so this
// tree opts out of the instant/static-shell guarantee (see next docs:
// route-segment-config/instant.md — "Disabling static shell validation").
export const instant = false;

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-mukta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-devanagari",
  display: "swap",
});

const notoSerif = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-noto-serif",
  display: "swap",
});

const martel = Martel({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-martel",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";

export function generateStaticParams() {
  return [{ lang: "ne" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.home.title,
      template: `%s | ${dict.brand.name}`,
    },
    description: dict.meta.home.description,
    keywords: [
      "सुदूर चिनारी",
      "सुदूरपश्चिम",
      "समाचार",
      "कैलाली",
      "कञ्चनपुर",
      "नेपाल",
    ],
    alternates: {
      canonical: `${SITE_URL}${localizedPath(lang as Locale, "/")}`,
      languages: {
        en: `${SITE_URL}/`,
        ne: `${SITE_URL}/ne`,
        "x-default": `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale[lang as Locale],
      alternateLocale: lang === "en" ? ogLocale.ne : ogLocale.en,
      siteName: dict.brand.name,
      images: ["/images/sudur-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  // Validate locale — unknown locale → 404
  if (!isLocale(lang)) notFound();

  const [dict, menu, initialUser] = await Promise.all([
    getDictionary(lang as Locale),
    newsApi.getMenuServer(lang as Locale).catch((err): Category[] => {
      console.warn("[Header menu] Failed to load categories menu:", err);
      return [];
    }),
    getSessionUser(),
  ]);

  return (
    <html
      lang={bcp47[lang as Locale]}
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${mukta.variable} ${inter.variable} ${devanagari.variable} ${notoSerif.variable} ${martel.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <NextTopLoader
          color="var(--brand-secondary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--brand-secondary),0 0 5px var(--brand-secondary)"
          zIndex={1600}
          showAtBottom={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider initialUser={initialUser}>
              <DictionaryProvider lang={lang as Locale} dict={dict}>
                <LanguageProvider>
                  <NavigationProvider menu={menu || []}>
                    {children}
                  </NavigationProvider>
                  <ScrollToTop />
                </LanguageProvider>
              </DictionaryProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
