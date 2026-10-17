import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Hotel } from "@/types";
import { getProxiedImageUrl } from "@/lib/utils";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelGallery({ hotel, isEn, t }: Props) {
  return (
    <section id="gallery" className="scroll-mt-32 mt-16">
      <div className="flex justify-between items-end mb-6">
        <div className="flex-1">
          <FTSectionDivider
            title={isEn ? "Photo Gallery" : "फोटो ग्यालरी"}
            sectionIndex="04"
            className="mb-0"
          />
        </div>
        {hotel.gallery && hotel.gallery.length > 0 && (
          <button className="text-xs sm:text-sm font-bold text-brand hover:underline tracking-widest uppercase mb-1 inline-flex items-center gap-1.5 group cursor-pointer">
            <span>{isEn ? "View All Photos" : "सबै तस्बिरहरू हेर्नुहोस्"}</span>
            <ArrowRight size={13} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}
      </div>
      {hotel.gallery && hotel.gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {hotel.gallery.slice(0, 5).map((img, idx) => (
            <div
              key={img.id}
              className={`relative aspect-square overflow-hidden rounded-none ${idx === 0 ? "row-span-2 col-span-2 aspect-auto" : ""}`}
            >
              <Image
                src={getProxiedImageUrl(img.image)}
                alt={t(img.caption) || "Gallery Image"}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border/50 p-8 text-center text-muted-foreground italic mt-6">
          {isEn ? "No photos available for this hotel yet." : "यस होटलका लागि हाल कुनै फोटोहरू उपलब्ध छैनन्।"}
        </div>
      )}
    </section>
  );
}
