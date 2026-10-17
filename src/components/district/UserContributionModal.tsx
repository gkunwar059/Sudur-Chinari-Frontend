"use client";

import { useLanguage } from "@/context/LanguageContext";
import FTModal from "@/components/common/FTModal";
import type { BilingualText } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
interface UserContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  districtName: BilingualText;
  themePrimary: string;
  showDistrictSelect?: boolean;
  defaultDistrict?: string;
}

export default function UserContributionModal({
  isOpen,
  onClose,
  districtName,
  themePrimary,
  showDistrictSelect = false,
  defaultDistrict = "",
}: UserContributionModalProps) {
  const { t, locale } = useLanguage();

  const { data: districtsResponse } = useQuery({
    queryKey: ['districts', locale],
    queryFn: () => newsApi.getDistrictsClient(locale as any),
    enabled: showDistrictSelect,
  });
  const districts = districtsResponse?.results || [];

  if (!isOpen) return null;

  return (
    <FTModal
      onClose={onClose}
      variant="accent-top"
      accentColor={themePrimary}
      maxWidth="max-w-xl"
      maxHeight="max-h-[95vh]"
      zClassName="z-[100]"
      ariaLabel={
        locale === "ne" ? "तपाईंको कथा यहाँ लेख्नुहोस्" : "Write Your Story Here"
      }
      paddingClassName="p-4 sm:p-6"
      backdropClassName="bg-black/60 backdrop-blur-sm"
    >
        {/* Close Button */}
        <button
          onClick={onClose}
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
            {locale === "ne" ? "साझा संग्रहमा थप्नुहोस्" : "Add to Archive"}
          </span>
          <h2 className="text-3xl sm:text-[32px] font-bold font-headline text-foreground leading-tight">
            {locale === "ne"
              ? "तपाईंको कथा यहाँ लेख्नुहोस्"
              : "Write Your Story Here"}
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            {locale === "ne"
              ? `${t(districtName)}सँग जोडिएको कुनै पनि सम्झना, तस्वीर वा ज्ञान हामीसँग साझा गर्नुहोस्।`
              : `Share any memory, picture, or knowledge related to ${t(districtName)} with us.`}
          </p>
        </div>

        {/* Scrollable Body (Form Fields Only) */}
        <div className="px-8 pb-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
          <form
            id="story-form"
            className="space-y-5 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                locale === "ne"
                  ? "तपाईंको विचारको लागि धन्यवाद!"
                  : "Thank you for your thoughts!",
              );
              onClose();
            }}
          >
            {/* District Select (Conditional) */}
            {showDistrictSelect && (
              <div>
                <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                  {locale === "ne" ? "जिल्ला *" : "District *"}
                </label>
                <select 
                  className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none"
                  defaultValue={defaultDistrict}
                >
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
            )}

            {/* Main Category */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "मुख्य विधा *" : "Main Category *"}
              </label>
              <select className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none">
                <option value="">
                  {locale === "ne" ? "छान्नुहोस्" : "Choose..."}
                </option>
                <option value="history">
                  {locale === "ne" ? "इतिहास" : "History"}
                </option>
                <option value="culture">
                  {locale === "ne" ? "संस्कृति" : "Culture"}
                </option>
              </select>
            </div>

            {/* Sub Topic */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "उपविषय" : "Sub-topic"}
              </label>
              <input
                type="text"
                className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                placeholder={
                  locale === "ne" ? "जस्तै: मौखिक इतिहास" : "e.g. Oral History"
                }
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "शीर्षक *" : "Title *"}
              </label>
              <input
                type="text"
                required
                className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                placeholder={
                  locale === "ne"
                    ? "तपाईंको कथाको शीर्षक"
                    : "Title of your story"
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                {locale === "ne" ? "विवरण *" : "Description *"}
              </label>
              <textarea
                required
                rows={4}
                className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand resize-none transition-colors rounded-none placeholder:text-muted-foreground/50"
                placeholder={
                  locale === "ne"
                    ? "कथा, अनुभव वा ज्ञान विस्तारमा लेख्नुहोस्..."
                    : "Write story, experience or knowledge in detail..."
                }
              />
            </div>

            {/* Grid for Name & File */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-2">
              {/* Author Name */}
              <div>
                <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                  {locale === "ne" ? "लेखकको नाम *" : "Author Name *"}
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50"
                  placeholder={locale === "ne" ? "तपाईको नाम" : "Your name"}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                  {locale === "ne" ? "तस्वीर वा अडियो" : "Picture or Audio"}
                </label>
                <input
                  type="file"
                  className="w-full bg-surface border border-border p-2 text-sm focus:outline-none focus:border-brand transition-colors rounded-none file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-border/50 file:text-xs file:font-bold file:text-foreground cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer (Submit Button) */}
        <div className="px-8 py-6 shrink-0 bg-background z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <button
            form="story-form"
            type="submit"
            className="w-full py-3.5 text-white font-bold text-[15px] hover:brightness-110 transition-all cursor-pointer shadow-sm rounded-none"
            style={{ backgroundColor: themePrimary }}
          >
            {locale === "ne" ? "कथा पठाउनुहोस्" : "Submit Story"}
          </button>
        </div>
      </FTModal>
  );
}
