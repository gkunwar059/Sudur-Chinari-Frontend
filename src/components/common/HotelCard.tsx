import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { getProxiedImageUrl, t } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export interface HotelCardProps {
  hotel: any;
  variant?: "horizontal" | "vertical";
  accentColor?: string;
  locale: Locale;
}

export default function HotelCard({
  hotel,
  variant = "horizontal",
  accentColor = "var(--brand-dark)",
  locale,
}: HotelCardProps) {
  const tr = (v: unknown) => t(v, locale);
  const isEn = locale === "en";

  if (variant === "vertical") {
    return (
      <Link
        href={`/stay/${hotel.slug}`}
        className="group relative rounded-none overflow-hidden border border-border border-t-[4px] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col bg-surface hover:border-brand/50"
        style={{ borderTopColor: accentColor }}
      >
        {/* Photo */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={getProxiedImageUrl(hotel.hero_image) || "/images/placeholder-hotel.jpg"}
            alt={hotel.name || "Hotel"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Rating Badge */}
          {hotel.rating > 0 && (
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 flex items-center gap-1 shadow-sm border border-border/50">
              <Star size={12} className="fill-warning text-warning" />
              <span>{hotel.rating}</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-1 border-t border-border/30">
          <div className="mb-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              {hotel.hotel_type || "Hotel"}
            </span>
            <h3 className="text-xl font-bold font-headline leading-tight mt-1 line-clamp-1 group-hover:text-brand transition-colors">
              {hotel.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans mb-3">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{hotel.address}</span>
          </div>

          <p className="text-xs sm:text-[13px] text-foreground/80 font-sans line-clamp-2 leading-relaxed mb-4 flex-1">
            {hotel.about ||
              (locale === "ne"
                ? "थप जानकारीको लागि भित्र हेर्नुहोस्।"
                : "Click to view more details about this property.")}
          </p>

          <div className="pt-3 border-t border-border/40 flex items-center justify-between mt-auto">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold"
              style={{ color: accentColor }}
            >
              <span>{locale === "ne" ? "विवरण हेर्नुहोस्" : "View Details"}</span>
              <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal variant (default)
  return (
    <Link
      href={`/stay/${hotel.slug}`}
      className="group relative flex flex-col overflow-hidden bg-surface border border-border transition-all duration-300 hover:shadow-lg aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]"
    >
      {/* Background Image */}
      {hotel.hero_image && (
        <Image
          src={getProxiedImageUrl(hotel.hero_image)}
          alt={tr(hotel.name) || "Hotel"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-right transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Gradient Overlay to make text readable on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-transparent w-[85%] md:w-[75%]" />

      {/* Dark gradient from bottom for mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent sm:hidden" />

      {/* Top Right Box (Rating/Type) */}
      <div className="absolute top-4 right-4 bg-background p-2 shadow-sm border border-border z-10">
        <div className="flex flex-col items-center justify-center min-w-[36px]">
          <span className="text-sm font-bold text-brand">{hotel.rating || "New"}</span>
          {hotel.rating > 0 && <Star size={10} className="fill-brand text-brand mt-0.5" />}
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 w-full sm:w-[75%]">
        <h3 className="text-2xl sm:text-3xl font-bold font-headline text-brand mb-3">
          {tr(hotel.name)}
        </h3>

        <div className="flex items-start gap-1.5 text-sm font-bold text-foreground mb-3">
          <MapPin size={16} className="text-brand shrink-0 mt-0.5" />
          <span className="leading-tight">{tr(hotel.address)}</span>
        </div>

        {hotel.district?.name && (
          <div className="text-[13px] text-muted-foreground mb-4 pb-4 border-b border-border/50 w-3/4">
            {tr(hotel.district.name)} {isEn ? "District" : "जिल्ला"}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-6 leading-relaxed hidden sm:block w-[90%]">
          {tr(hotel.about)}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div className="bg-brand text-white text-xs sm:text-sm font-bold px-4 py-2 hover:bg-brand/90 transition-colors flex items-center gap-1.5">
            <span>{isEn ? "View Details" : "विस्तृत जानकारी"}</span>
            <ArrowRight size={14} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
            {tr(hotel.hotel_type || { en: "Hotel", ne: "होटल" })}
          </div>
        </div>
      </div>
    </Link>
  );
}
