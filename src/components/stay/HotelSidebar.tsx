import { 
  MapPin, CheckCircle2, Phone, Mail, Globe, 
  Map as MapIcon, Coffee 
} from "lucide-react";
import type { Hotel } from "@/types";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelSidebar({ hotel, isEn, t }: Props) {
  return (
    <div className="space-y-8 lg:sticky lg:top-32 lg:self-start">
      {/* Quick Contact Card */}
      <div id="contact" className="scroll-mt-32 bg-surface border border-border/50 rounded-none p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold font-headline text-foreground mb-5 pb-4 border-b border-border/60">
          {isEn ? "Quick Contact" : "सम्पर्क गर्नुहोस्"}
        </h3>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Phone size={18} className="text-brand shrink-0" />
            <span className="font-medium text-foreground">
              {hotel.phone1}
            </span>
          </div>
          {hotel.phone2 && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone size={18} className="text-transparent shrink-0" />
              <span className="font-medium text-foreground">
                {hotel.phone2}
              </span>
            </div>
          )}
          {hotel.email && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail size={18} className="text-brand shrink-0" />
              <a
                href={`mailto:${hotel.email}`}
                className="font-medium text-foreground hover:text-brand transition-colors"
              >
                {hotel.email}
              </a>
            </div>
          )}
          {hotel.website && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe size={18} className="text-brand shrink-0" />
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-brand transition-colors line-clamp-1"
              >
                {hotel.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {hotel.map_url && (
          <a
            href={hotel.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-brand text-white py-3 rounded-none font-bold hover:bg-brand/90 transition-colors shadow-sm"
          >
            <MapIcon size={18} />
            {isEn ? "Get Direction" : "बाटो हेर्नुहोस्"}
          </a>
        )}
      </div>

      {/* Hotel Highlights */}
      <div className="bg-brand/5 border border-brand/20 border-t-[4px] border-t-brand rounded-none p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold font-headline text-foreground mb-5 pb-4 border-b border-brand/20">
          {isEn ? "Hotel Highlights" : "होटलका मुख्य आकर्षणहरू"}
        </h3>
        {hotel.highlights && hotel.highlights.length > 0 ? (
          <div className="space-y-3">
            {hotel.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2
                  size={16}
                  className="text-brand shrink-0 mt-0.5"
                />
                <span className="text-sm font-medium text-foreground">
                  {t(highlight)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic text-sm">
            {isEn ? "No highlights provided." : "कुनै मुख्य आकर्षणहरू प्रदान गरिएको छैन।"}
          </div>
        )}
      </div>

      {/* Other Facilities */}
      <div
        id="facilities"
        className="scroll-mt-32 bg-surface border border-border/50 rounded-none p-6 sm:p-8 shadow-sm"
      >
        <h3 className="text-lg font-bold font-headline text-foreground mb-5 pb-4 border-b border-border/60">
          {isEn ? "Other Facilities" : "अन्य सुविधाहरू"}
        </h3>
        {hotel.amenities && hotel.amenities.length > 0 ? (
          <div className="space-y-4">
            {hotel.amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center gap-3">
                <Coffee
                  size={16}
                  className="text-muted-foreground shrink-0"
                />
                <span className="text-sm font-medium text-foreground">
                  {t(amenity.name)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic text-sm">
            {isEn ? "No facilities listed." : "कुनै सुविधाहरू सूचीबद्ध छैनन्।"}
          </div>
        )}
      </div>

      {/* Nearby Places */}
      <div
        id="nearby"
        className="scroll-mt-32 bg-surface border border-border/50 rounded-none overflow-hidden shadow-sm"
      >
        <div className="p-6 sm:p-8 pb-4">
          <h3 className="text-lg font-bold font-headline text-foreground mb-5 pb-4 border-b border-border/60">
            {isEn ? "Nearby Places" : "नजिकका ठाउँहरू"}
          </h3>
          {hotel.nearby_places && hotel.nearby_places.length > 0 ? (
            <div className="space-y-4 text-sm mb-6">
              {hotel.nearby_places.map((place) => (
                <div
                  key={place.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <MapPin size={14} className="text-brand shrink-0" />
                    <span>{t(place.name)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {t(place.distance)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic text-sm mb-6">
              {isEn ? "No nearby places listed." : "कुनै नजिकका ठाउँहरू सूचीबद्ध छैनन्।"}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
