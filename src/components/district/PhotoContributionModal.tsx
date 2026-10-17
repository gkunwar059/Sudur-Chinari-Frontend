"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import FTModal from "@/components/common/FTModal";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import { Camera, Image as ImageIcon } from "lucide-react";

interface PhotoContributionModalProps {
  themePrimary?: string;
  trigger?: React.ReactNode;
  defaultDistrict?: string;
}

export default function PhotoContributionModal({
  themePrimary = "var(--color-brand)",
  trigger,
  defaultDistrict = "",
}: PhotoContributionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale } = useLanguage();

  const { data: districtsResponse } = useQuery({
    queryKey: ["districts", locale],
    queryFn: () => newsApi.getDistrictsClient(locale as any),
  });
  const districts = districtsResponse?.results || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {trigger ? (
        <div
          onClick={() => setIsOpen(true)}
          className="inline-block cursor-pointer"
        >
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 font-bold font-sans text-sm hover:bg-brand/90 transition-colors cursor-pointer"
        >
          {locale === "ne" ? "फोटो पठाउनुहोस् +" : "Submit your photo +"}
        </button>
      )}

      {isOpen && (
        <FTModal
          onClose={() => setIsOpen(false)}
          variant="accent-top"
          accentColor={themePrimary}
          maxWidth="max-w-xl"
          maxHeight="max-h-[95vh]"
          zClassName="z-[100]"
          ariaLabel={
            locale === "ne" ? "तपाईंको तस्बिर साझा गर्नुहोस्" : "Share Your Photos"
          }
          paddingClassName="p-4 sm:p-6"
          backdropClassName="bg-black/60 backdrop-blur-sm"
        >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1 z-20"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Fixed Header */}
            <div className="px-8 pt-8 pb-4 shrink-0 bg-background z-10">
              <span className="text-xs font-bold text-brand mb-2 block uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} />
                {locale === "ne" ? "फोटो संग्रह" : "Photo Archive"}
              </span>
              <h2 className="text-3xl sm:text-[32px] font-bold font-headline text-foreground leading-tight">
                {locale === "ne"
                  ? "तपाईंको तस्बिर साझा गर्नुहोस्"
                  : "Share Your Photos"}
              </h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed mt-1">
                {locale === "ne"
                  ? "सुदूरपश्चिमको प्राकृतिक सौन्दर्य, संस्कृति वा जीवनशैली झल्काउने तस्बिरहरू हामीलाई पठाउनुहोस्।"
                  : "Send us photos that reflect the natural beauty, culture, or lifestyle of Sudurpashchim."}
              </p>
            </div>

            {/* Scrollable Body (Form Fields Only) */}
            <div className="px-8 pb-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
              <form
                id="photo-form"
                className="space-y-5 pt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(
                    locale === "ne"
                      ? "तपाईंको तस्बिरको लागि धन्यवाद!"
                      : "Thank you for sharing your photo!",
                  );
                  setIsOpen(false);
                }}
              >
                {/* Photographer Name */}
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "तपाईंको नाम *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      locale === "ne"
                        ? "जस्तै: राम बहादुर थापा"
                        : "e.g. Ram Bahadur Thapa"
                    }
                    className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                  />
                </div>
                {/* District Select */}
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "जिल्ला *" : "District *"}
                  </label>
                  <select
                    required
                    className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none"
                    defaultValue={defaultDistrict}
                  >
                    <option value="">
                      {locale === "ne"
                        ? "जिल्ला छान्नुहोस्"
                        : "Select District..."}
                    </option>
                    {districts.map((d: any) => (
                      <option key={d.id} value={d.slug}>
                        {t(d.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Photo Title */}
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "तस्बिरको शीर्षक *" : "Photo Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      locale === "ne"
                        ? "जस्तै: खप्तडको सुन्दर बिहानी"
                        : "e.g. Beautiful Morning in Khaptad"
                    }
                    className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne"
                      ? "विवरण (वैकल्पिक)"
                      : "Description (Optional)"}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      locale === "ne"
                        ? "तस्बिरको बारेमा केही भन्नुहोस्..."
                        : "Tell us about this photo..."
                    }
                    className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 resize-y"
                  ></textarea>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne"
                      ? "तस्बिर अपलोड गर्नुहोस् *"
                      : "Upload Photo *"}
                  </label>
                  <div className="w-full border-2 border-dashed border-border bg-surface p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/5 transition-colors">
                    <ImageIcon
                      size={24}
                      className="text-muted-foreground mb-2"
                    />
                    <span className="text-sm font-bold text-foreground">
                      {locale === "ne" ? "तस्बिर छान्नुहोस्" : "Choose a photo"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </span>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Footer */}
            <div className="p-8 pt-4 shrink-0 bg-background border-t border-border mt-auto">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 px-4 bg-surface text-foreground text-sm font-bold border border-border hover:bg-surface-tint transition-colors"
                >
                  {locale === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
                </button>
                <button
                  type="submit"
                  form="photo-form"
                  className="flex-1 py-3 px-4 text-white text-sm font-bold hover:brightness-110 transition-colors"
                  style={{ backgroundColor: themePrimary }}
                >
                  {locale === "ne" ? "पेश गर्नुहोस्" : "Submit Photo"}
                </button>
              </div>
            </div>
        </FTModal>
      )}
    </>
  );
}
