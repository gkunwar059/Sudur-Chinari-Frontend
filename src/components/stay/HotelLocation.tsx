import { Map as MapIcon } from "lucide-react";
import type { Hotel } from "@/types";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelLocation({ hotel, isEn, t }: Props) {
  return (
    <section id="location" className="scroll-mt-32 mt-16">
      <FTSectionDivider
        title={isEn ? "Location & Directions" : "स्थान र दिशा निर्देशन"}
        sectionIndex="05"
        className="mb-6"
      />
      <div className="bg-surface border border-border/50 rounded-none overflow-hidden shadow-sm">
        <div className="relative w-full h-48 sm:h-64 bg-surface">
          <iframe
            src={`https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&hl=${isEn ? 'en' : 'ne'}&z=14&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Google Map"
          />
        </div>
        <div className="p-6 sm:p-8">
          <h4 className="text-lg font-bold text-foreground mb-4">
            {isEn ? "How to Reach" : "कसरी पुग्ने"}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
            {hotel.reach_bus && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-brand mt-2 shrink-0" />
                <span>
                  <strong>
                    {isEn ? "From Bus Park:" : "बसपार्कबाट:"}
                  </strong>{" "}
                  {t(hotel.reach_bus)}
                </span>
              </div>
            )}
            {hotel.reach_airport && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-brand mt-2 shrink-0" />
                <span>
                  <strong>
                    {isEn ? "From Airport:" : "विमानस्थलबाट:"}
                  </strong>{" "}
                  {t(hotel.reach_airport)}
                </span>
              </div>
            )}
            {hotel.reach_highway && (
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-brand mt-2 shrink-0" />
                <span>
                  <strong>
                    {isEn ? "From Highway:" : "राजमार्गबाट:"}
                  </strong>{" "}
                  {t(hotel.reach_highway)}
                </span>
              </div>
            )}
          </div>
          {hotel.map_url && (
            <a
              href={hotel.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-none font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm"
            >
              <MapIcon size={16} />
              {isEn ? "View on Google Maps" : "गुगल म्यापमा हेर्नुहोस्"}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
