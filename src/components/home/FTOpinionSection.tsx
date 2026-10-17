import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { Quote, Play, Star } from "lucide-react";
import type { Article } from "@/types";
import FTSectionDivider from "@/components/common/FTSectionDivider";
import { getArticleSlug, t } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

interface FTOpinionSectionProps {
  opinions: Article[];
  locale: Locale;
}

export default function FTOpinionSection({ opinions, locale }: FTOpinionSectionProps) {
  const tr = (v: unknown) => t(v, locale);

  const op1 = opinions[0] || opinions[0];
  const op2 = opinions[1] || opinions[0];
  const subOp1 = opinions[2] || opinions[0];
  const subOp2 = opinions[3] || opinions[1];
  const subOp3 = opinions[4] || opinions[0];

  return (
    <section>
      {/* ── Signature Architectural Broadsheet Divider ── */}
      <FTSectionDivider
        title={locale === "ne" ? "विचार र मन्थन" : "Opinion & Essays"}
        enTitle={locale === "ne" ? "Opinion & Analysis" : "Perspectives"}
        viewAllHref="/category/opinion"
        viewAllText={locale === "ne" ? "सबै विचार लेखहरू" : "All Opinions"}
      />

      {/* ── 1. Top Warm Tinted Editorial Hero Block ── */}
      <div className="bg-surface border border-border p-4 sm:p-7 mb-6 shadow-[0_2px_12px_rgba(20,20,19,0.02)] w-full max-w-full overflow-hidden min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full max-w-full min-w-0">
          {/* Left Op-ed with Split Text & Photo (8 cols) */}
          <div className="lg:col-span-8 min-w-0 lg:pr-6 lg:border-r lg:border-border">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center w-full min-w-0">
              {/* Text on Left */}
              <div className="sm:col-span-6 min-w-0 flex flex-col justify-between">
                <div>
                  <Quote
                    size={24}
                    className="text-accent fill-accent/10 mb-3 opacity-80"
                    strokeWidth={2.5}
                  />
                  <Link
                    href={`/article/${getArticleSlug(op1)}`}
                    className="group block"
                  >
                    <h3 className="text-xl sm:text-[23px] font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-[1.38] mb-3 break-words">
                      {tr(op1.title)}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-muted-foreground line-clamp-4 leading-[1.72] font-sans mb-4 break-words">
                      {tr(op1.excerpt)}
                    </p>
                  </Link>
                </div>
              </div>

              {/* Photo on Right (Video Thumbnail Style) */}
              <div className="sm:col-span-6 min-w-0">
                <Link
                  href={`/article/${getArticleSlug(op1)}`}
                  className="group block h-full"
                >
                  <div className="relative aspect-[4/3] sm:aspect-square md:aspect-[4/3] bg-surface border border-border overflow-hidden rounded-xl">
                    <Image
                      src={op1.featuredImage}
                      alt={tr(op1.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 35vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 opacity-90 transition-opacity group-hover:opacity-100" />

                    {/* Top Left: Author Info */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="text-white font-bold text-[14px] sm:text-[15px] leading-tight font-sans drop-shadow-md">
                        {tr(op1.author.name)}
                      </div>
                      <div className="text-white/80 text-[11px] font-medium font-sans drop-shadow-md">
                        {op1.author.role || "Author"}
                      </div>
                    </div>

                    {/* Top Right: X Icon */}
                    <div className="absolute top-4 right-4 z-10 w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-md">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        className="text-black fill-black"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>

                    {/* Center: Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play
                          size={22}
                          className="text-black fill-black ml-1"
                        />
                      </div>
                    </div>

                    {/* Bottom Left: Stars */}
                    <div className="absolute bottom-3 left-4 z-10 flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="text-warning fill-warning drop-shadow-sm"
                        />
                      ))}
                    </div>

                    {/* Bottom Right: Date */}
                    <div className="absolute bottom-3 right-4 z-10">
                      <div className="text-white/90 text-[11px] font-bold font-sans drop-shadow-md">
                        {new Date(op1.publishedAt).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Op-ed Column (4 cols) */}
          <div className="lg:col-span-4 min-w-0 flex flex-col justify-between h-full pt-6 border-t border-border lg:pt-0 lg:border-t-0">
            <div>
              <Quote
                size={24}
                className="text-accent fill-accent/10 mb-3 opacity-80"
                strokeWidth={2.5}
              />
              <Link
                href={`/article/${getArticleSlug(op2)}`}
                className="group block"
              >
                <h3 className="text-xl sm:text-[23px] font-bold font-headline text-foreground group-hover:text-brand-secondary transition-colors leading-[1.38] mb-3 break-words">
                  {tr(op2.title)}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-muted-foreground line-clamp-4 leading-[1.72] font-sans mb-4 break-words">
                  {tr(op2.excerpt)}
                </p>
              </Link>
            </div>

            {/* Author Avatar + Name */}
            <div className="flex items-center gap-2.5 pt-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                <Image
                  src={op2.author.avatar || "/images/sudur-logo.png"}
                  alt={tr(op2.author.name)}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground font-sans">
                  {tr(op2.author.name)}
                </h4>
                <span className="text-[10.5px] text-muted-foreground block font-sans">
                  {op2.author.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Bottom Row: 3 Sub-Opinion Cards + Regional Columns Directory ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 w-full max-w-full overflow-hidden min-w-0 pb-2">
        {/* Sub Column 1 */}
        <div className="lg:col-span-3 min-w-0 flex flex-col justify-between h-full bg-surface border-t-2 border-t-accent border-x border-b border-border p-4 group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
          <Link
            href={`/article/${getArticleSlug(subOp1)}`}
            className="flex-1 block"
          >
            <div className="mt-1 mb-4 opacity-40 group-hover:opacity-100 transition-opacity">
              <Quote
                size={28}
                className="text-accent fill-accent/20"
                strokeWidth={2.5}
              />
            </div>
            <h4 className="text-[16.5px] sm:text-[17px] font-bold font-headline text-foreground group-hover:text-accent transition-colors leading-[1.4] mb-2.5 break-words">
              {tr(subOp1.title)}
            </h4>
            <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 font-sans leading-relaxed">
              {tr(subOp1.excerpt)}
            </p>
          </Link>
          <div className="flex items-center gap-3 pt-3 border-t border-border/60 mt-auto">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
              <Image
                src={subOp1.author.avatar || "/images/sudur-logo.png"}
                alt={tr(subOp1.author.name)}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-[12px] font-bold text-foreground font-sans leading-tight">
                {tr(subOp1.author.name)}
              </div>
              <div className="text-[10px] text-muted-foreground font-sans mt-0.5">
                {subOp1.author.role || "Columnist"}
              </div>
            </div>
          </div>
        </div>

        {/* Sub Column 2 */}
        <div className="lg:col-span-3 min-w-0 flex flex-col justify-between h-full bg-surface border-t-2 border-t-accent border-x border-b border-border p-4 group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
          <Link
            href={`/article/${getArticleSlug(subOp2)}`}
            className="flex-1 block"
          >
            <div className="mt-1 mb-4 opacity-40 group-hover:opacity-100 transition-opacity">
              <Quote
                size={28}
                className="text-accent fill-accent/20"
                strokeWidth={2.5}
              />
            </div>
            <h4 className="text-[16.5px] sm:text-[17px] font-bold font-headline text-foreground group-hover:text-accent transition-colors leading-[1.4] mb-2.5 break-words">
              {tr(subOp2.title)}
            </h4>
            <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 font-sans leading-relaxed">
              {tr(subOp2.excerpt)}
            </p>
          </Link>
          <div className="flex items-center gap-3 pt-3 border-t border-border/60 mt-auto">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shadow-sm shrink-0">
              <Image
                src={subOp2.author.avatar || "/images/sudur-logo.png"}
                alt={tr(subOp2.author.name)}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-[12px] font-bold text-foreground font-sans leading-tight">
                {tr(subOp2.author.name)}
              </div>
              <div className="text-[10px] text-muted-foreground font-sans mt-0.5">
                {subOp2.author.role || "Columnist"}
              </div>
            </div>
          </div>
        </div>

        {/* Sub Column 3 */}
        <div className="lg:col-span-3 min-w-0 flex flex-col justify-between h-full bg-surface border-t-2 border-t-accent border-x border-b border-border p-4 group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
          <Link
            href={`/article/${getArticleSlug(subOp3)}`}
            className="flex-1 block"
          >
            <div className="mt-1 mb-4 opacity-40 group-hover:opacity-100 transition-opacity">
              <Quote
                size={28}
                className="text-accent fill-accent/20"
                strokeWidth={2.5}
              />
            </div>
            <h4 className="text-[16.5px] sm:text-[17px] font-bold font-headline text-foreground group-hover:text-accent transition-colors leading-[1.4] mb-2.5 break-words">
              {tr(subOp3.title)}
            </h4>
            <p className="text-[13px] text-muted-foreground line-clamp-2 mb-4 font-sans leading-relaxed">
              {tr(subOp3.excerpt)}
            </p>
          </Link>
          <div className="flex items-center gap-3 pt-3 border-t border-border/60 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-semibold font-mono text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 border border-brand-secondary/20">
                {locale === "ne" ? "विशेष" : "Special"}
              </span>
              <span className="text-[11px] text-muted-foreground font-sans font-medium">
                {subOp3.author.role || "Columnist"}
              </span>
            </div>
          </div>
        </div>

        {/* Testimonial Block (3 cols) */}
        <div className="lg:col-span-3 min-w-0 bg-brand-secondary/[0.03] dark:bg-brand-secondary/5 border-t-2 border-t-brand-secondary border-x border-b border-border p-5 flex flex-col h-full justify-center text-center relative overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
          <div className="absolute -top-2 -right-2 opacity-10 group-hover:scale-125 group-hover:opacity-20 group-hover:-rotate-6 transition-all duration-700 ease-out pointer-events-none">
            <Quote
              size={100}
              className="text-brand-secondary fill-brand-secondary"
              strokeWidth={0.5}
            />
          </div>

          <div className="flex-1 flex flex-col justify-center relative z-10 mt-2">
            <p className="text-[14px] sm:text-[15px] font-serif italic text-foreground leading-[1.65] mb-5">
              {locale === "ne"
                ? "“सुदूरपश्चिमको विकास, कला र संस्कृतिलाई राष्ट्रिय तथा अन्तर्राष्ट्रिय स्तरमा चिनाउन यस पोर्टलले निकै उत्कृष्ट र विश्वसनीय भूमिका खेलिरहेको छ।”"
                : "“This portal plays an excellent and reliable role in introducing the development, art, and culture of Sudurpaschim to the national and international level.”"}
            </p>
          </div>

          <div className="pt-4 border-t border-border/60 relative z-10 flex flex-col items-center">
            <h5 className="text-[12px] font-bold text-foreground font-sans tracking-wide">
              {locale === "ne" ? "एक नियमित पाठक" : "A Regular Reader"}
            </h5>
            <span className="text-[10px] text-brand-secondary font-bold mt-1">
              {locale === "ne" ? "सुदूर चिनारी" : "Sudur Chinari"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
