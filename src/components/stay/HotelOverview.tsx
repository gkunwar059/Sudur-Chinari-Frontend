import { Building, MapPin, Building2 } from "lucide-react";
import type { Hotel } from "@/types";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelOverview({ hotel, isEn, t }: Props) {
  return (
    <section id="overview" className="scroll-mt-32">
      <FTSectionDivider
        title={isEn ? "About the Hotel" : "होटलको बारेमा"}
        sectionIndex="01"
      />
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground mb-8 mt-6">
        <p className="leading-relaxed">{t(hotel.about)}</p>
      </div>

      <div className="bg-surface border border-border/50 p-6 rounded-none mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between sm:justify-start sm:gap-16 border-b sm:border-b-0 border-border/40 pb-3 sm:pb-0">
            <span className="font-bold text-foreground w-32 flex items-center gap-2">
              <Building size={16} className="text-muted-foreground" />{" "}
              {isEn ? "Hotel Type" : "होटल प्रकार"}
            </span>
            <span className="text-muted-foreground">
              {t(hotel.hotel_type || { en: "Hotel", ne: "होटल" })}
            </span>
          </div>
          <div className="flex justify-between sm:justify-start sm:gap-16 border-b sm:border-b-0 border-border/40 pb-3 sm:pb-0">
            <span className="font-bold text-foreground w-32 flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground" />{" "}
              {isEn ? "District" : "जिल्ला"}
            </span>
            <span className="text-muted-foreground">
              {t(hotel.district?.name)}
            </span>
          </div>
          <div className="flex justify-between sm:justify-start sm:gap-16 border-b sm:border-b-0 border-border/40 pb-3 sm:pb-0">
            <span className="font-bold text-foreground w-32 flex items-center gap-2">
              <Building2 size={16} className="text-muted-foreground" />{" "}
              {isEn ? "Municipality" : "नगरपालिका"}
            </span>
            <span className="text-muted-foreground">
              {t(hotel.municipality)}
            </span>
          </div>
          <div className="flex justify-between sm:justify-start sm:gap-16">
            <span className="font-bold text-foreground w-32 flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground" />{" "}
              {isEn ? "Address" : "ठेगाना"}
            </span>
            <span className="text-muted-foreground">
              {t(hotel.address)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
