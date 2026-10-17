import Image from "next/image";
import { ArrowRight, MapPin, Phone, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { YatayatService } from "@/data/yatayatData";
import { YatayatDetailsButton } from "./YatayatClientActions";

export type YatayatCardAccent = "brand" | "secondary";

interface YatayatCompactCardProps {
  service: YatayatService;
  locale: Locale;
  accent?: YatayatCardAccent;
}

const ACCENT_CLASSES: Record<
  YatayatCardAccent,
  {
    card: string;
    badge: string;
    icon: string;
    title: string;
    button: string;
  }
> = {
  brand: {
    card: "border-t-brand",
    badge: "bg-brand",
    icon: "text-brand",
    title: "group-hover:text-brand",
    button: "border-brand text-brand hover:bg-brand hover:text-white",
  },
  secondary: {
    card: "border-t-brand-secondary",
    badge: "bg-brand-secondary",
    icon: "text-brand-secondary",
    title: "group-hover:text-brand-secondary",
    button:
      "border-brand-secondary text-brand-secondary hover:bg-brand-secondary hover:text-white",
  },
};

export default function YatayatCompactCard({
  service,
  locale,
  accent = "brand",
}: YatayatCompactCardProps) {
  const isNe = locale === "ne";
  const accentClasses = ACCENT_CLASSES[accent];
  const route = (isNe ? service.route.ne : service.route.en).join(" ➔ ");

  return (
    <div
      className={`group bg-card hover:bg-surface border border-border border-t-[3px] ${accentClasses.card} rounded-none p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
    >
      <div>
        <div className="relative w-full h-36 rounded-none overflow-hidden border border-border mb-3 bg-surface">
          <Image
            src={service.image}
            alt={service.title.en}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <span
            className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-none text-xs font-bold text-white shadow-2xs ${accentClasses.badge}`}
          >
            {isNe ? service.badge.ne : service.badge.en}
          </span>
        </div>

        <h3
          className={`font-bold font-headline text-lg sm:text-xl text-foreground mb-1 line-clamp-1 transition-colors ${accentClasses.title}`}
        >
          {isNe ? service.title.ne : service.title.en}
        </h3>

        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-2.5 font-sans flex-wrap">
          <MapPin size={12} aria-hidden="true" className={`shrink-0 ${accentClasses.icon}`} />
          <span>{route}</span>
        </div>

        <div className="space-y-1 mb-4 text-xs sm:text-sm text-foreground font-mono">
          <div className="flex items-center gap-1.5">
            <Phone size={12} aria-hidden="true" className={`shrink-0 ${accentClasses.icon}`} />
            <span>{service.contacts.join(", ")}</span>
          </div>
          {service.seats && (
            <div className="flex items-center gap-1.5 font-sans text-muted-foreground">
              <Users size={12} aria-hidden="true" className={`shrink-0 ${accentClasses.icon}`} />
              <span>
                {isNe ? `सिट: ${service.seats.ne}` : `Seats: ${service.seats.en}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <YatayatDetailsButton
        service={service}
        locale={locale}
        className={`w-full py-2.5 px-3 border rounded-none text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${accentClasses.button}`}
      >
        <span>{isNe ? "विवरण हेर्नुहोस्" : "View Details"}</span>
        <ArrowRight size={13} aria-hidden="true" />
      </YatayatDetailsButton>
    </div>
  );
}
