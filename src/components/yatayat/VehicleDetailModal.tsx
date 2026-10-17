"use client";

import React from "react";
import Image from "next/image";
import { X, CheckCircle2, Phone, Clock, Users, Tag, MapPin, Bus, ShieldCheck, ArrowRight } from "lucide-react";
import { YatayatService } from "@/data/yatayatData";
import FTModal from "@/components/common/FTModal";

interface VehicleDetailModalProps {
  service: YatayatService | null;
  onClose: () => void;
  locale?: string;
}

export default function VehicleDetailModal({
  service,
  onClose,
  locale = "ne",
}: VehicleDetailModalProps) {
  if (!service) return null;

  return (
    <FTModal
      onClose={onClose}
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      ariaLabel={locale === "ne" ? "सवारी विवरण" : "Vehicle Details"}
    >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-brand/10 text-brand rounded-none">
              <Bus size={22} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-headline leading-tight">
                {locale === "ne" ? service.title.ne : service.title.en}
              </h2>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                {locale === "ne" ? service.subTitle.ne : service.subTitle.en}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-none hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Vehicle Image */}
          <div className="relative w-full h-56 sm:h-64 rounded-none overflow-hidden border border-border">
            <Image
              src={service.image}
              alt={service.title.en}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
            {service.verified && (
              <div className="absolute top-3 right-3 bg-brand text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-none flex items-center gap-1.5 shadow-sm border border-brand-dark">
                <CheckCircle2 size={15} />
                <span>{locale === "ne" ? "प्रमाणित सेवा" : "Verified"}</span>
              </div>
            )}
          </div>

          {/* Route Display */}
          <div className="bg-surface border border-border rounded-none p-4 sm:p-5">
            <span className="text-xs sm:text-sm font-mono font-semibold text-brand-secondary uppercase tracking-wider block mb-2.5">
              {locale === "ne" ? "मार्ग तथा स्टपेजहरू" : "Route & Waypoints"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {(locale === "ne" ? service.route.ne : service.route.en).map((stop, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold bg-background border border-border px-3.5 py-1.5 rounded-none text-foreground shadow-2xs">
                    <MapPin size={14} className="text-brand shrink-0" />
                    {stop}
                  </span>
                  {idx < arr.length - 1 && (
                    <ArrowRight size={15} className="text-muted-foreground shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Key Meta Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-none border border-border bg-background">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm mb-1 font-medium">
                <Clock size={15} className="text-brand" />
                <span>{locale === "ne" ? "प्रस्थान समय" : "Departure"}</span>
              </div>
              <span className="font-bold text-foreground text-sm sm:text-base">
                {service.departureTime
                  ? locale === "ne"
                    ? service.departureTime.ne
                    : service.departureTime.en
                  : locale === "ne"
                  ? "नियमित"
                  : "Daily"}
              </span>
            </div>

            <div className="p-3.5 rounded-none border border-border bg-background">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm mb-1 font-medium">
                <Tag size={15} className="text-brand-secondary" />
                <span>{locale === "ne" ? "अनुमानित भाडा" : "Est. Fare"}</span>
              </div>
              <span className="font-bold text-brand-secondary text-sm sm:text-base">
                {service.fare
                  ? locale === "ne"
                    ? service.fare.ne
                    : service.fare.en
                  : "रु. १०० - ३००"}
              </span>
            </div>

            <div className="p-3.5 rounded-none border border-border bg-background">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm mb-1 font-medium">
                <Users size={15} className="text-purple-600" />
                <span>{locale === "ne" ? "सिट संख्या" : "Seats"}</span>
              </div>
              <span className="font-bold text-foreground text-sm sm:text-base">
                {service.seats
                  ? locale === "ne"
                    ? service.seats.ne
                    : service.seats.en
                  : "१४-३६"}
              </span>
            </div>
          </div>

          {/* Notes & Features */}
          {service.notes && (
            <div className="p-4 bg-surface border border-border border-l-[3px] border-l-brand rounded-none">
              <div className="flex items-center gap-1.5 text-sm font-bold text-brand mb-1">
                <ShieldCheck size={16} />
                <span>{locale === "ne" ? "सुविधा तथा सेवा शर्त" : "Amenities & Conditions"}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                {locale === "ne" ? service.notes.ne : service.notes.en}
              </p>
            </div>
          )}

          {/* Contact Numbers */}
          <div className="border border-border rounded-none p-4 sm:p-5 bg-background">
            <span className="text-sm font-bold text-foreground block mb-2.5 font-sans">
              {locale === "ne" ? "सम्पर्क तथा टिकट बुकिङ काउन्टर" : "Contact & Ticket Counters"}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {service.contacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-none bg-surface border border-border text-foreground hover:border-brand hover:text-brand text-sm font-semibold transition-colors"
                >
                  <Phone size={15} className="text-brand" />
                  <span>{contact}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-surface/50">
          <span className="text-xs sm:text-[13px] text-muted-foreground font-mono">
            {locale === "ne"
              ? `अन्तिम अपडेट: ${service.updatedAt}`
              : `Last Updated: ${service.updatedAt}`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-none hover:bg-brand-dark transition-colors cursor-pointer"
          >
            {locale === "ne" ? "बन्द गर्नुहोस्" : "Close"}
          </button>
        </div>
      </FTModal>
  );
}
