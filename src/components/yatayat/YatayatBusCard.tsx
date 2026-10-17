import { Fragment, type ComponentType } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, Tag, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { YatayatService } from "@/data/yatayatData";
import { YatayatDetailsButton } from "./YatayatClientActions";

interface YatayatBusCardProps {
  service: YatayatService;
  locale: Locale;
}

interface StatItemProps {
  icon: ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}

function StatItem({ icon: Icon, label, value, highlight }: StatItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={15} aria-hidden="true" className="text-brand shrink-0" />
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold ${highlight ? "text-brand" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export default function YatayatBusCard({ service, locale }: YatayatBusCardProps) {
  const isNe = locale === "ne";
  const route = isNe ? service.route.ne : service.route.en;

  return (
    <div className="group bg-card hover:bg-surface border border-border border-t-[3px] border-t-brand rounded-none p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-5 items-stretch">
      <div className="relative w-full md:w-56 h-44 sm:h-48 md:h-auto rounded-none overflow-hidden shrink-0 border border-border">
        <Image
          src={service.image}
          alt={service.title.en}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-none text-xs font-bold bg-brand text-white shadow-2xs">
              {isNe ? service.badge.ne : service.badge.en}
            </span>
            {service.verified && (
              <span className="px-2.5 py-1 rounded-none text-xs font-semibold bg-surface border border-brand/40 text-brand flex items-center gap-1">
                <CheckCircle2 size={13} aria-hidden="true" />
                <span>{isNe ? "पुष्टि" : "Verified"}</span>
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {isNe ? `अन्तिम अपडेट: ${service.updatedAt}` : `Updated: ${service.updatedAt}`}
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground font-headline group-hover:text-brand transition-colors">
            {isNe ? service.title.ne : service.title.en}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground font-sans font-medium mt-1">
            {isNe ? service.subTitle.ne : service.subTitle.en}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-sans">
          <MapPin size={14} aria-hidden="true" className="text-brand shrink-0" />
          {route.map((point, index) => (
            <Fragment key={`${point}-${index}`}>
              <span
                className={
                  index === 0 || index === route.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                {point}
              </span>
              {index < route.length - 1 && (
                <ArrowRight size={13} aria-hidden="true" className="text-brand shrink-0" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-3.5 text-sm font-sans">
          <StatItem
            icon={Clock}
            label={isNe ? "प्रस्थान" : "Departure"}
            value={
              service.departureTime
                ? isNe
                  ? service.departureTime.ne
                  : service.departureTime.en
                : isNe
                  ? "नियमित"
                  : "Regular"
            }
          />
          <StatItem
            icon={Tag}
            label={isNe ? "भाडा" : "Fare"}
            value={service.fare ? (isNe ? service.fare.ne : service.fare.en) : "—"}
            highlight
          />
          <StatItem
            icon={Users}
            label={isNe ? "सिट" : "Seats"}
            value={service.seats ? (isNe ? service.seats.ne : service.seats.en) : "—"}
          />
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Phone size={15} aria-hidden="true" className="text-brand shrink-0" />
            <span className="font-sans font-semibold text-foreground">
              {isNe ? "सम्पर्क:" : "Contact:"}
            </span>
            <span className="text-foreground font-semibold text-sm">{service.contacts.join(", ")}</span>
          </div>

          <YatayatDetailsButton
            service={service}
            locale={locale}
            className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-bold rounded-none flex items-center justify-center gap-1.5 transition-colors self-end sm:self-auto cursor-pointer"
          >
            <span>{isNe ? "विवरण हेर्नुहोस्" : "View Details"}</span>
            <ArrowRight size={14} aria-hidden="true" />
          </YatayatDetailsButton>
        </div>
      </div>
    </div>
  );
}
