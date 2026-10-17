import Image from "next/image";
import { Building2, ExternalLink } from "lucide-react";
import FTSectionDivider from "@/components/common/FTSectionDivider";

export interface PartnerItem {
  id: string | number;
  name?: string;
  role?: string;
  nameNe?: string;
  nameEn?: string;
  roleNe?: string;
  roleEn?: string;
  image?: string | null;
  url?: string;
}

export interface PartnersSectionProps {
  partners?: PartnerItem[];
  locale?: string;
  title?: string;
  enTitle?: string;
  sectionIndex?: string;
}

export default function PartnersSection({
  partners,
  locale = "ne",
  title,
  enTitle,
}: PartnersSectionProps) {
  const partnerList = partners || [];
  if (partnerList.length === 0) return null;

  const defaultTitle =
    locale === "ne"
      ? "संस्थागत सहकार्य तथा साझेदारहरू"
      : "Institutional Partners & Affiliates";
  const defaultEnTitle = "Institutional Network";

  // Build a list with at least 8 items, then duplicate it once for a mathematically seamless 50% infinite loop
  let halfList = [...partnerList];
  while (halfList.length < 8 && halfList.length > 0) {
    halfList = [...halfList, ...halfList];
  }
  const displayList = [...halfList, ...halfList];

  return (
    <section className="mb-12">
      <style>{`
        @keyframes partners-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-partners-marquee {
          display: flex;
          width: max-content;
          animation: partners-scroll 35s linear infinite;
        }
        .animate-partners-marquee:hover,
        .group:hover .animate-partners-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── Signature FT Section Divider ── */}
      <FTSectionDivider
        title={title || defaultTitle}
        enTitle={enTitle || defaultEnTitle}
      />

      {/* ── Broadsheet Framed Container ── */}
      <div className="bg-surface border border-border py-3.5 sm:py-4 px-2 sm:px-3 relative overflow-hidden group">
        {/* Subtle Fade Edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-surface to-transparent z-10" />

        {/* Auto-scrolling Partners Marquee */}
        <div className="w-full overflow-hidden">
          <div className="animate-partners-marquee flex items-center gap-3 sm:gap-4 py-1">
            {displayList.map((partner, index) => {
              const partnerName =
                partner.name ||
                (locale === "ne" ? partner.nameNe : partner.nameEn) ||
                partner.nameEn ||
                partner.nameNe ||
                "";
              const partnerRole =
                partner.role ||
                (locale === "ne" ? partner.roleNe : partner.roleEn) ||
                partner.roleNe ||
                partner.roleEn ||
                "";

              const isImageIcon =
                typeof partner.image === "string" &&
                (partner.image.startsWith("http://") ||
                  partner.image.startsWith("https://") ||
                  partner.image.startsWith("/") ||
                  partner.image.includes("."));

              const cardContent = (
                <div className="group/card shrink-0 w-[240px] sm:w-[260px] bg-background hover:bg-surface border border-border hover:border-brand-secondary p-3 sm:p-3.5 transition-all duration-200 flex items-center gap-3 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none">
                  {/* Dignified Emblem or Uploaded Logo */}
                  <div className="w-10 h-10 border border-border bg-surface group-hover/card:bg-background group-hover/card:border-brand-secondary flex items-center justify-center shrink-0 transition-colors overflow-hidden p-1 relative">
                    {isImageIcon ? (
                      <Image
                        src={partner.image!}
                        alt={partnerName}
                        width={36}
                        height={36}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <Building2
                        size={18}
                        className="text-foreground group-hover/card:text-brand-secondary transition-colors"
                      />
                    )}
                  </div>

                  {/* Institution Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-[13px] font-bold font-headline text-foreground group-hover/card:text-brand-secondary transition-colors truncate leading-tight">
                        {partnerName}
                      </h4>
                      {partner.url && (
                        <ExternalLink
                          size={10}
                          className="text-muted-foreground/60 group-hover/card:text-brand-secondary shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                    {partnerRole && (
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">
                        {partnerRole}
                      </div>
                    )}
                  </div>
                </div>
              );

              return partner.url ? (
                <a
                  key={`${partner.id}-${index}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 no-underline"
                >
                  {cardContent}
                </a>
              ) : (
                <div key={`${partner.id}-${index}`} className="shrink-0">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
