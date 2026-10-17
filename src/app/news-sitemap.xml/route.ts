import { newsApi } from "@/lib/api";
import { ARTICLES } from "@/data/articles";
import { getArticleSlug, t } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sudurpashchim.com";

export async function GET() {
  let articles: any[] = [];
  try {
    const res = await newsApi.getArticlesServer({ limit: 100, ordering: "-created_at" });
    if (res?.results?.length > 0) {
      articles = res.results;
    }
  } catch (e) {
    articles = ARTICLES;
  }

  if (articles.length === 0) {
    articles = ARTICLES;
  }

  // Google News guidelines: only articles published in the last 48 hours, or the most recent up to 1000
  const recentArticles = articles.slice(0, 100);

  const xmlEntries = recentArticles
    .map((art) => {
      const slug = getArticleSlug(art);
      const title =
        typeof art.title === "string" ? art.title : t(art.title, "ne");
      const pubDate = new Date(art.publishedAt || art.createdAt || Date.now()).toISOString();
      const escapedTitle = title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

      return `  <url>
    <loc>${SITE_URL}/article/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>सुदूर चिनारी</news:name>
        <news:language>ne</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapedTitle}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
