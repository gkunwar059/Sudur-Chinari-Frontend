import type { Metadata } from "next";
import {
  ChevronDown,
  Globe,
  List,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import { buildMetadata } from "@/lib/seo";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import {
  PRIVACY_CONTACT,
  PRIVACY_COPYRIGHT,
  PRIVACY_META,
  PRIVACY_SECTIONS,
} from "@/data/privacy-policy";
import type { BilingualText } from "@/data/privacy-policy";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const locale = lang as Locale;

  return buildMetadata({
    locale,
    path: "/privacy",
    title: PRIVACY_META[locale].title,
    description: PRIVACY_META[locale].description,
  });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? (lang as Locale) : defaultLocale;
  const isNe = locale === "ne";

  const labels = {
    kicker: isNe ? "कानुनी तथा अनुपालन" : "Legal & Compliance",
    title: isNe ? "गोपनीयता नीति" : "Privacy Policy",
    subtitle: isNe
      ? "सुदूर चिनारी प्रा. लि. ले आफ्नो डिजिटल प्लेटफर्ममा व्यक्तिगत जानकारी कसरी सङ्कलन, प्रयोग, प्रशोधन, भण्डारण तथा संरक्षण गर्दछ भन्ने नीति।"
      : "How Sudur Chinari Pvt. Ltd. collects, uses, processes, stores, and protects personal information across its digital platform.",
    toc: isNe ? "विषयसूची" : "Table of Contents",
    contact: isNe ? "सम्पर्क" : "Contact",
    website: isNe ? "वेबसाइट" : "Website",
    email: isNe ? "इमेल" : "Email",
    phone: isNe ? "फोन" : "Phone",
    quickHelp: isNe
      ? "गोपनीयतासम्बन्धी प्रश्न वा अनुरोध छ?"
      : "Questions or privacy requests?",
    quickHelpBody: isNe
      ? "हाम्रो टोलीलाई इमेल वा फोनमार्फत सम्पर्क गर्नुहोस्।"
      : "Reach our team by email or phone and we will respond.",
  };

  const renderParagraphs = (paragraphs?: BilingualText[]) => {
    if (!paragraphs?.length) return null;
    return (
      <>
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${paragraph.en.slice(0, 24)}-${index}`}
            className="mb-3 text-sm sm:text-[15px] leading-relaxed text-muted-foreground last:mb-0"
          >
            {paragraph[locale]}
          </p>
        ))}
      </>
    );
  };

  const renderBullets = (bullets?: BilingualText[]) => {
    if (!bullets?.length) return null;
    return (
      <ul className="mb-3 mt-2 list-disc space-y-1.5 pl-5 text-sm sm:text-[15px] leading-relaxed text-muted-foreground marker:text-brand/70 last:mb-0">
        {bullets.map((bullet, index) => (
          <li key={`${bullet.en.slice(0, 24)}-${index}`}>{bullet[locale]}</li>
        ))}
      </ul>
    );
  };

  const tocLinks = (
    <ol className="space-y-0.5 text-xs">
      {PRIVACY_SECTIONS.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="group flex items-start gap-2 px-4 py-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-brand"
          >
            <span className="font-mono text-[10px] font-bold text-brand/70 mt-0.5 shrink-0">
              {section.number}
            </span>
            <span className="leading-snug group-hover:text-brand">
              {section.title[locale]}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main className="flex-1 mobile-safe-bottom bg-background min-h-screen">
      <FTBreadcrumb
        locale={locale}
        items={[{ name: labels.title }]}
      />

      {/* ── Legal Masthead ── */}
      <header className="border-b border-border bg-background">
        <div className="container-editorial py-8 sm:py-10 pt-2 sm:pt-4">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-brand">
              <ShieldCheck size={14} />
              <span>{labels.kicker}</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              {labels.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground font-sans">
              {labels.subtitle}
            </p>
          </div>
        </div>
      </header>

      <div className="container-editorial py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Desktop Table of Contents ── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-44 space-y-4">
              <nav
                aria-label={labels.toc}
                className="border border-border bg-surface/40"
              >
                <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-foreground">
                  <List size={14} className="text-brand" />
                  <span>{labels.toc}</span>
                </div>
                <div className="max-h-[62vh] overflow-y-auto py-2">
                  {tocLinks}
                </div>
              </nav>

              <div className="border border-brand/20 bg-brand/5 p-4">
                <p className="font-headline text-sm font-bold text-foreground">
                  {labels.quickHelp}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {labels.quickHelpBody}
                </p>
                <div className="mt-3 space-y-1.5 text-xs">
                  <a
                    href={`mailto:${PRIVACY_CONTACT.email}`}
                    className="flex items-center gap-2 font-medium text-foreground hover:text-brand transition-colors"
                  >
                    <Mail size={13} className="text-brand shrink-0" />
                    <span className="truncate">{PRIVACY_CONTACT.email}</span>
                  </a>
                  <a
                    href={`tel:${PRIVACY_CONTACT.phone}`}
                    className="flex items-center gap-2 font-medium text-foreground hover:text-brand transition-colors"
                  >
                    <Phone size={13} className="text-brand shrink-0" />
                    <span>{PRIVACY_CONTACT.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Policy Article ── */}
          <article className="lg:col-span-8 min-w-0">
            {/* Mobile Table of Contents */}
            <details className="group mb-8 border border-border bg-surface/40 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-mono font-bold uppercase tracking-[0.16em] text-foreground">
                <span className="flex items-center gap-2">
                  <List size={14} className="text-brand" />
                  <span>{labels.toc}</span>
                </span>
                <ChevronDown
                  size={16}
                  className="text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="border-t border-border py-2">{tocLinks}</div>
            </details>

            <div className="space-y-9">
              {PRIVACY_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-40 sm:scroll-mt-44"
                >
                  <h2 className="mb-3 border-b border-border pb-2 font-headline text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    <span className="mr-2 font-mono text-sm font-bold text-brand">
                      {section.number}.
                    </span>
                    {section.title[locale]}
                  </h2>

                  {renderParagraphs(section.paragraphs)}
                  {renderBullets(section.bullets)}

                  {section.subsections?.map((sub) => (
                    <div
                      key={sub.id}
                      id={sub.id}
                      className="mt-5 scroll-mt-40 sm:scroll-mt-44"
                    >
                      <h3 className="mb-2 font-headline text-base sm:text-lg font-bold tracking-tight text-foreground">
                        <span className="mr-1.5 font-mono text-xs font-bold text-brand/80">
                          {sub.number}
                        </span>
                        {sub.title[locale]}
                      </h3>
                      {renderParagraphs(sub.paragraphs)}
                      {renderBullets(sub.bullets)}
                      {renderParagraphs(sub.paragraphsAfter)}
                    </div>
                  ))}

                  {renderParagraphs(section.paragraphsAfter)}

                  {section.id === "contact" && (
                    <div className="mt-5 border border-border bg-surface/60 p-5">
                      <p className="font-headline text-base font-bold text-foreground">
                        {PRIVACY_CONTACT.company[locale]}
                      </p>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <a
                          href={PRIVACY_CONTACT.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 border border-border bg-background p-3 transition-colors hover:border-brand"
                        >
                          <Globe
                            size={16}
                            className="shrink-0 text-brand"
                          />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                              {labels.website}
                            </span>
                            <span className="block truncate text-xs font-semibold text-foreground group-hover:text-brand">
                              {PRIVACY_CONTACT.website}
                            </span>
                          </span>
                        </a>
                        <a
                          href={`mailto:${PRIVACY_CONTACT.email}`}
                          className="group flex items-center gap-3 border border-border bg-background p-3 transition-colors hover:border-brand"
                        >
                          <Mail size={16} className="shrink-0 text-brand" />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                              {labels.email}
                            </span>
                            <span className="block truncate text-xs font-semibold text-foreground group-hover:text-brand">
                              {PRIVACY_CONTACT.email}
                            </span>
                          </span>
                        </a>
                        <a
                          href={`tel:${PRIVACY_CONTACT.phone}`}
                          className="group flex items-center gap-3 border border-border bg-background p-3 transition-colors hover:border-brand"
                        >
                          <Phone size={16} className="shrink-0 text-brand" />
                          <span className="min-w-0">
                            <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                              {labels.phone}
                            </span>
                            <span className="block text-xs font-semibold text-foreground group-hover:text-brand">
                              {PRIVACY_CONTACT.phone}
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <p className="mt-10 border-t border-border pt-5 text-[11px] font-mono text-muted-foreground">
              {PRIVACY_COPYRIGHT[locale]}
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
