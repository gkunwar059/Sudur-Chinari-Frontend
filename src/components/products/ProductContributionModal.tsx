"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import FTModal from "@/components/common/FTModal";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";

interface ProductContributionModalProps {
  themePrimary?: string;
  buttonClassName?: string;
  trigger?: React.ReactNode;
}

export default function ProductContributionModal({
  themePrimary = "var(--brand)",
  buttonClassName = "bg-brand text-white font-bold px-6 py-2.5 text-sm hover:brightness-110 transition-all rounded-none flex items-center gap-2 border border-brand w-max shadow-sm",
  trigger,
}: ProductContributionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, locale } = useLanguage();

  const { data: districtsResponse } = useQuery({
    queryKey: ['districts', locale],
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
        <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className={buttonClassName}
        >
          <span>{locale === "ne" ? "आफ्नो उत्पादन थप्नुहोस्" : "Share your product"}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
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
            locale === "ne" ? "तपाईंको उत्पादन साझा गर्नुहोस्" : "Share Your Product"
          }
          paddingClassName="p-4 sm:p-6"
          backdropClassName="bg-black/60 backdrop-blur-sm"
          overlayClassName="text-left"
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
          <span className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">
            {locale === "ne" ? "डिजिटल कृषि चिनारी" : "Digital Agri-Identity"}
          </span>
          <h2 className="text-3xl sm:text-[32px] font-bold font-headline text-foreground leading-tight">
            {locale === "ne"
              ? "तपाईंको उत्पादन साझा गर्नुहोस्"
              : "Share Your Product"}
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            {locale === "ne"
              ? "तपाईंको कृषि उत्पादन वा स्थानीय व्यवसायको बारेमा जानकारी हामीलाई पठाउनुहोस् र ग्राहकहरुसम्म पुग्नुहोस्।"
              : "Send us information about your agricultural product or local business to reach customers."}
          </p>
        </div>

        {/* Scrollable Body (Form Fields Only) */}
        <div className="px-8 pb-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
          <form
            id="product-form"
            className="space-y-5 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                locale === "ne"
                  ? "तपाईंको उत्पादन जानकारीको लागि धन्यवाद!"
                  : "Thank you for sharing your product!",
              );
              setIsOpen(false);
            }}
          >
            {/* District Select */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "जिल्ला *" : "District *"}
              </label>
              <select required className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none">
                <option value="">
                  {locale === "ne" ? "जिल्ला छान्नुहोस्" : "Select District..."}
                </option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.slug}>
                    {t(d.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Category */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "उत्पादनको प्रकार *" : "Product Category *"}
              </label>
              <select required className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none">
                <option value="">
                  {locale === "ne" ? "छान्नुहोस्" : "Choose..."}
                </option>
                <option value="dairy">{locale === "ne" ? "दुग्धजन्य" : "Dairy"}</option>
                <option value="grains">{locale === "ne" ? "अन्न/धान्य" : "Grains"}</option>
                <option value="fruits">{locale === "ne" ? "फलफूल" : "Fruits"}</option>
                <option value="spices">{locale === "ne" ? "मसला/जडीबुटी" : "Spices"}</option>
                <option value="others">{locale === "ne" ? "अन्य" : "Others"}</option>
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "उत्पादनको नाम *" : "Product Name *"}
              </label>
              <input
                type="text"
                required
                className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                placeholder={
                  locale === "ne"
                    ? "तपाईंको उत्पादनको नाम"
                    : "Name of your product"
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "उत्पादनको विवरण *" : "Product Description *"}
              </label>
              <textarea
                required
                rows={4}
                className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand resize-none transition-colors rounded-none placeholder:text-muted-foreground/50"
                placeholder={
                  locale === "ne"
                    ? "उत्पादनको गुणस्तर, मात्रा र अन्य विवरण लेख्नुहोस्..."
                    : "Write details about product quality, quantity, etc..."
                }
              />
            </div>

            {/* Grid for Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-2">
              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                  {locale === "ne" ? "किसान/व्यवसायीको नाम *" : "Farmer/Business Name *"}
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                  placeholder={locale === "ne" ? "तपाईको नाम" : "Your name"}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                  {locale === "ne" ? "सम्पर्क नम्बर *" : "Contact Number *"}
                </label>
                <input
                  type="tel"
                  required
                  className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                  placeholder="98XXXXXXX"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="pb-2">
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "उत्पादनको तस्वीर" : "Product Picture"}
              </label>
              <input
                type="file"
                className="w-full bg-surface border border-border p-2 text-sm focus:outline-none focus:border-brand transition-colors rounded-none file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-border/50 file:text-xs file:font-bold file:text-foreground cursor-pointer"
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer (Submit Button) */}
        <div className="px-8 py-6 shrink-0 bg-background z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <button
            form="product-form"
            type="submit"
            className="w-full py-3.5 text-white font-bold text-[15px] hover:brightness-110 transition-all cursor-pointer shadow-sm rounded-none"
            style={{ backgroundColor: themePrimary }}
          >
            {locale === "ne" ? "उत्पादन दर्ता गर्नुहोस्" : "Submit Product"}
          </button>
        </div>
    </FTModal>
    )}
  </>
  );
}
