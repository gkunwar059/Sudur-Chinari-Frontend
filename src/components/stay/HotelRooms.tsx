import Image from "next/image";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import type { Hotel } from "@/types";
import { getProxiedImageUrl } from "@/lib/utils";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelRooms({ hotel, isEn, t }: Props) {
  return (
    <section id="rooms" className="scroll-mt-32 mt-16">
      <FTSectionDivider
        title={isEn ? "Rooms & Accommodation" : "कोठाहरू र आवास"}
        sectionIndex="02"
      />
      {hotel.rooms && hotel.rooms.length > 0 ? (
        <>
          <p className="text-muted-foreground mb-8 font-medium">
            {isEn
              ? "Choose from a variety of well-furnished rooms designed for your comfort."
              : "तपाईंको आरामको लागि डिजाइन गरिएका विभिन्न कोठाहरूबाट छनौट गर्नुहोस्।"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {hotel.rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-surface border border-border/50 border-t-[4px] border-t-brand hover:shadow-md transition-shadow"
              >
                {room.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={getProxiedImageUrl(room.image)}
                      alt={t(room.name)}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {t(room.name)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-1.5">
                      <Users size={16} />{" "}
                      <span>
                        {room.guests} {isEn ? "Guests" : "पाहुना"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble size={16} />{" "}
                      <span>{t(room.bed_type)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {room.price ? (
                      <div className="font-bold text-lg">
                        NPR {room.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          {" "}
                          / night
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}
                    <button className="text-brand font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
                      <span>{isEn ? "View Details" : "विवरण हेर्नुहोस्"}</span>
                      <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-surface border border-border/50 p-8 text-center text-muted-foreground italic mt-6">
          {isEn ? "Room details are currently unavailable." : "कोठा विवरणहरू हाल उपलब्ध छैनन्।"}
        </div>
      )}
    </section>
  );
}
