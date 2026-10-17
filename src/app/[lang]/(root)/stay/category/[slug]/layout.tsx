import { notFound } from "next/navigation";
import Link from "@/components/i18n/LocalizedLink";
import { newsApi } from "@/lib/api";
import type { Category } from "@/types";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/utils";


async function loadCategory(slug: string, lang: any): Promise<any> {
  return await newsApi.getCategoryBySlugServer(slug, lang);
}

async function loadMenu(lang: any): Promise<Category[]> {
  return await newsApi.getMenuServer(lang);
}

export default async function StayCategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  
  const isEn = lang === "en";

  const category = await loadCategory(slug, lang as Locale);
  if (!category) notFound();

  const menu = await loadMenu(lang as Locale);

  let subCategories: Category[] = [];
  let parentCategory: Category | null = (category.parent as Category) || null;

  const topLevelMatch = menu.find((c: any) => c.slug === slug);
  if (topLevelMatch) {
    subCategories = topLevelMatch.children ?? category.children ?? [];
  } else {
    const parentMatch = menu.find((p: any) => p.children?.some((c: any) => c.slug === slug));
    if (parentMatch) {
      parentCategory = parentMatch;
      subCategories = parentMatch.children ?? [];
    } else if (parentCategory) {
      const parentMenuMatch = menu.find((p: any) => p.slug === parentCategory?.slug);
      if (parentMenuMatch) {
        subCategories = parentMenuMatch.children ?? [];
      } else {
        subCategories = category.children ?? [];
      }
    }
  }

  const res = await newsApi.getHotelsServer({ category__slug: slug }, lang as Locale);
  let hotels: any[] = res?.results || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 mobile-safe-bottom">
            {/* Category Header (Editorial Style) */}
            <section className="bg-background pt-12 sm:pt-16 pb-8 sm:pb-12 border-b border-border">
              <div className="container-editorial">
                <div className="flex items-center gap-2 text-[11px] sm:text-[13px] font-bold text-brand uppercase tracking-widest mb-4">
                  <span className="text-red-700 dark:text-red-500">
                    {parentCategory ? t(parentCategory.name, lang as Locale) : (isEn ? "Directory" : "निर्देशिका")}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>{isEn ? "Digital Accommodation" : "डिजिटल आवास"}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/60 pb-8 mb-8">
                  <div className="max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-headline text-foreground tracking-tight leading-tight mb-4">
                      {t(category.name, lang as Locale)}
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {isEn 
                        ? "Explore the best hotels, resorts, and homestays in the region. Find comfortable accommodation, quality food and friendly service." 
                        : "यस क्षेत्रका उत्कृष्ट होटल, रिसोर्ट र होमस्टेहरू खोज्नुहोस्।"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-8 bg-surface border border-border px-6 py-4">
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{isEn ? "Total Stays" : "जम्मा"}</div>
                      <div className="text-xl font-bold font-headline text-brand">{hotels.length} {isEn ? "Listed" : "होटलहरू"}</div>
                    </div>
                    <div className="w-px h-10 bg-border"></div>
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1">{isEn ? "Top Rated" : "उत्कृष्ट"}</div>
                      <div className="text-xl font-bold font-headline text-red-700 dark:text-red-500">
                        {hotels.filter(h => h.rating >= 4).length} {isEn ? "Places" : "ठाउँहरू"}
                      </div>
                    </div>
                  </div>
                </div>

                {subCategories.length > 0 && (
                  <nav className="flex gap-4 overflow-x-auto no-scrollbar">
                    {parentCategory && (
                      <Link
                        href={`/stay/category/${parentCategory.slug}`}
                        className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors pb-2 border-b-2 border-transparent hover:border-brand whitespace-nowrap"
                      >
                        {isEn ? "All Stays" : "सबै"}
                      </Link>
                    )}
                    {subCategories.map((sub) => {
                      const active = sub.slug === category.slug;
                      return (
                        <Link
                          key={sub.slug}
                          href={`/stay/category/${sub.slug}`}
                          className={`text-sm font-bold whitespace-nowrap transition-all pb-2 border-b-2 ${
                            active ? "text-brand border-brand" : "text-muted-foreground border-transparent hover:text-brand hover:border-brand/50"
                          }`}
                        >
                          {t(sub.name, lang as Locale)}
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
            </section>
            
            {children}
            
          </main>
        </div>
  );
}
