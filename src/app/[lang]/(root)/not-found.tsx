import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/paths";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ lang?: string }>;
}) {
  const resolvedParams = params ? await params : {};
  const lang: Locale = isLocale(resolvedParams.lang || "") ? (resolvedParams.lang as Locale) : defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground">
      <div className="text-center px-6 py-16 max-w-lg">
        <p className="text-8xl font-black text-brand mb-4">404</p>
        <h1 className="text-2xl font-bold font-headline mb-3">{dict.errors.notFound}</h1>
        <p className="text-muted-foreground mb-8">{dict.errors.notFoundDesc}</p>
        <Link
          href={localizedPath(lang, "/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          {dict.errors.backHome}
        </Link>
      </div>
    </div>
  );
}
