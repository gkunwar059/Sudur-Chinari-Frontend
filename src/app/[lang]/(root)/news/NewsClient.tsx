"use client";

import Link from "@/components/i18n/LocalizedLink";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";

import EditorialCard from "@/components/common/EditorialCard";
import { useLanguage } from "@/context/LanguageContext";

export default function NewsClient({
  initialArticles,
}: {
  initialArticles: any[];
}) {
  const { locale } = useLanguage();
  const { data: articles = initialArticles } = useQuery({
    queryKey: ["articles", "all", locale],
    queryFn: () => newsApi.getArticlesClient({ lang: locale }),
    initialData: {
      count: initialArticles.length,
      next: null,
      previous: null,
      results: initialArticles,
    },
    select: (data) => data.results || data,
  });

  return (
    <main className="flex-1 mobile-safe-bottom">
      <div className="border-b border-border">
        <div className="container-editorial py-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Link href="/" className="hover:text-brand-secondary">
              {locale === "ne" ? "मुख्यपृष्ठ" : "Home"}
            </Link>
            <ChevronRight size={12} />
            <span>{locale === "ne" ? "समाचार" : "News"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {locale === "ne" ? "ताजा समाचार" : "Latest News"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {locale === "ne"
              ? "यहाँ ताजा समाचारहरू छन्"
              : "Here are the latest news from Sudurpashchim Province."}
          </p>
        </div>
      </div>
      <div className="container-editorial py-8 md:py-12">
        {articles.length === 0 && (
          <div className="bg-background border border-border p-8 sm:p-12 text-center">
            <p className="text-muted-foreground text-base">
              {locale === "ne"
                ? "कुनै समाचार फेला परेन।"
                : "No news found."}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {articles.map((article: any) => (
            <EditorialCard
              key={article.id}
              article={article}
              locale={locale}
              chrome="bordered"
              aspect="video"
              badgeSize="xs"
              metaBorder={false}
              showAuthor
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
