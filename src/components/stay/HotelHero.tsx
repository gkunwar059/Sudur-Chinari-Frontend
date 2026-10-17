import Image from "next/image";
import Link from "@/components/i18n/LocalizedLink";
import {
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";
import type { Hotel } from "@/types";
import { getProxiedImageUrl } from "@/lib/utils";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (
    obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
  ) => string;
}

interface HotelHeroProps extends Props {
  scrollToSection: (id: string) => void;
}

export default function HotelHero({
  hotel,
  isEn,
  t,
  scrollToSection,
}: HotelHeroProps) {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] md:h-[70vh] bg-surface">
      {hotel.hero_image && (
        <Image
          src={getProxiedImageUrl(hotel.hero_image)}
          alt={t(hotel.name)}
          fill
          sizes="100vw"
          className="object-cover opacity-90"
          preload
        />
      )}

      {/* Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent sm:hidden" />

      {/* Content */}
      <div className="absolute inset-0 container-editorial mx-auto flex flex-col justify-center pb-8 pt-12">
        <div className="max-w-2xl flex flex-col items-start text-left relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-brand uppercase tracking-widest mb-4">
            <Link href="/" className="hover:underline">
              {isEn ? "Home" : "गृह"}
            </Link>
            <span>•</span>
            <Link href="/stay" className="hover:underline">
              {isEn ? "Hotel & Stay" : "होटल तथा बासस्थान"}
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-block px-3 py-1 bg-brand text-white text-[11px] font-bold uppercase tracking-widest mb-6 rounded-none">
            {t(hotel.hotel_type || { en: "Hotel", ne: "होटल" })}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-foreground tracking-tight leading-tight mb-6 drop-shadow-sm">
            {t(hotel.name)}
          </h1>

          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-muted-foreground mb-4">
            <MapPin size={16} className="text-brand" />
            <span>{t(hotel.address)}</span>
          </div>

          {hotel.rating > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(hotel.rating)
                        ? "fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-bold text-foreground text-lg">
                {hotel.rating}
              </span>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                ({hotel.reviews_count || "120+"}{" "}
                {isEn ? "reviews" : "समीक्षाहरू"})
              </span>
            </div>
          )}

          {hotel.short_description && (
            <p className="text-base text-foreground font-medium max-w-lg mb-8 leading-relaxed">
              {t(hotel.short_description)}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {hotel.phone1 && (
              <a
                href={`tel:${hotel.phone1}`}
                className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand/90 transition-colors rounded-none shadow-md"
              >
                <Phone size={16} />
                {isEn ? "Call Now" : "कल गर्नुहोस्"}
              </a>
            )}
            {hotel.email && (
              <a
                href={`mailto:${hotel.email}`}
                className="inline-flex items-center gap-2 bg-card text-foreground border border-border px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-surface transition-colors rounded-none shadow-sm"
              >
                <Mail size={16} className="text-brand" />
                {isEn ? "Email" : "इमेल"}
              </a>
            )}
          </div>

          {/* Bottom Badges */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-none text-[12px] font-bold text-foreground shadow-sm"
                >
                  <CheckCircle2 size={14} className="text-brand" />
                  <span>{t(amenity.name)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
