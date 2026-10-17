import type { Hotel } from "@/types";
import FTSectionDivider from "@/components/common/FTSectionDivider";

interface Props {
  hotel: Hotel;
  isEn: boolean;
  t: (obj: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => string;
}

export default function HotelStory({ hotel, isEn, t }: Props) {
  return (
    <section className="mt-16 mb-8 scroll-mt-32">
      <FTSectionDivider
        title={isEn ? "Hotel Story" : "होटलको कथा"}
        sectionIndex="06"
        className="mb-6"
      />
      {hotel.story ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 text-muted-foreground leading-relaxed text-base">
            <p>{t(hotel.story)}</p>
          </div>

          {hotel.quote_text && (
            <div className="md:col-span-1 bg-brand/5 border border-brand/20 p-8 rounded-none relative">
              <div className="absolute top-4 left-4 text-brand/20">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21v-7.391c0-5.714 4.143-9.609 9.983-9.609v3.313c-3.791 0-5.617 1.83-5.617 5.48h5.617v8.207h-10.017zm-14.017 0v-7.391c0-5.714 4.143-9.609 9.983-9.609v3.313c-3.791 0-5.617 1.83-5.617 5.48h5.617v8.207h-10.017z" />
                </svg>
              </div>
              <p className="text-foreground italic relative z-10 text-lg mb-4 mt-4 font-medium leading-relaxed">
                &quot;{t(hotel.quote_text)}&quot;
              </p>
              {hotel.quote_author && (
                <p className="text-sm font-bold text-muted-foreground text-right relative z-10">
                  — {hotel.quote_author}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-border/50 p-8 text-center text-muted-foreground italic">
          {isEn ? "The hotel story is not available." : "होटलको कथा उपलब्ध छैन।"}
        </div>
      )}
    </section>
  );
}
