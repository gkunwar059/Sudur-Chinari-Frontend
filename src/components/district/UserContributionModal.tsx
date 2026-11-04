"use client";

import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Loader2, Upload, ImageIcon, X, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
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
  const { user } = useAuth();

  const [districtSlug, setDistrictSlug] = useState(defaultDistrict);
  const [mainCategory, setMainCategory] = useState("culture");
  const [subTopic, setSubTopic] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync defaultDistrict whenever it changes or modal opens
  useEffect(() => {
    if (defaultDistrict) {
      setDistrictSlug(defaultDistrict);
    }
  }, [defaultDistrict, isOpen]);

  // Pre-fill and lock author name from logged-in user
  const userDisplayName = user
    ? user.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user.username || user.email || ""
    : "";

  useEffect(() => {
    if (userDisplayName) {
      setAuthorName(userDisplayName);
    }
  }, [userDisplayName, isOpen]);

  // If user is not logged in when opening modal, trigger AuthModal first
  useEffect(() => {
    if (isOpen && !user) {
      setIsAuthModalOpen(true);
    }
  }, [isOpen, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(
          locale === "ne"
            ? "तस्बिरको साइज १० एमबीभन्दा कम हुनुपर्छ।"
            : "Image size must be less than 10MB."
        );
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setErrorMessage(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { data: districtsResponse } = useQuery({
    queryKey: ['districts', locale],
    queryFn: () => newsApi.getDistrictsClient(locale as any),
    enabled: showDistrictSelect,
  });
  const districts = districtsResponse?.results || [];

  if (!isOpen) return null;

  // Intercept with AuthModal if not logged in
  if (!user) {
    return (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          onClose();
        }}
        initialMode="login"
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />
    );
  }

  const effectiveDistrict = districtSlug || defaultDistrict;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveDistrict) {
      setErrorMessage(locale === "ne" ? "कृपया जिल्ला छान्नुहोस्" : "Please select a district");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const finalAuthorName = userDisplayName || authorName;
      const formData = new FormData();
      formData.append("author_name", finalAuthorName);
      formData.append("district", String(effectiveDistrict));
      formData.append("main_category", mainCategory || "culture");
      if (subTopic) formData.append("sub_topic", subTopic);
      formData.append("title", title);
      formData.append("description", description);
      if (imageFile) {
        formData.append("media_file", imageFile);
      }

      await newsApi.postStoryContributionClient(formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle("");
        setDescription("");
        setSubTopic("");
        handleRemoveImage();
        onClose();
      }, 2300);
    } catch (err) {
      console.error("Story contribution error:", err);
      setErrorMessage(
        locale === "ne"
          ? "कथा पठाउन समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।"
          : "Could not submit story. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 size={52} className="text-brand animate-bounce" />
              <h3 className="text-2xl font-bold text-foreground font-headline">
                {locale === "ne" ? "कथा प्राप्त भयो !" : "Story Submitted!"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-sm font-sans">
                {locale === "ne"
                  ? "तपाईंको विचार तथा कथा सम्पादकीय संग्रहमा दर्ता भएको छ। धन्यवाद !"
                  : "Thank you for contributing your story to the regional archive!"}
              </p>
            </div>
          ) : (
            <form
              id="story-form"
              className="space-y-5 pt-2"
              onSubmit={handleSubmit}
            >
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-sans">
                  {errorMessage}
                </div>
              )}

              {/* District Select or Locked District Badge */}
              {showDistrictSelect ? (
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "जिल्ला *" : "District *"}
                  </label>
                  <select 
                    className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none"
                    value={districtSlug}
                    onChange={(e) => setDistrictSlug(e.target.value)}
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
              ) : effectiveDistrict ? (
                <div className="flex items-center gap-2 p-2.5 bg-surface border border-border text-xs text-foreground font-sans">
                  <MapPin size={14} className="text-brand shrink-0" />
                  <span className="text-muted-foreground">{locale === "ne" ? "जिल्ला:" : "District:"}</span>
                  <span className="font-bold text-foreground font-headline">{t(districtName)}</span>
                </div>
              ) : null}

              {/* Main Category */}
              <div>
                <label className="block text-sm font-bold font-sans text-foreground mb-1.5">
                  {locale === "ne" ? "मुख्य विधा *" : "Main Category *"}
                </label>
                <select
                  value={mainCategory}
                  onChange={(e) => setMainCategory(e.target.value)}
                  className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none"
                >
                  <option value="culture">
                    {locale === "ne" ? "संस्कृति (Culture)" : "Culture"}
                  </option>
                  <option value="history">
                    {locale === "ne" ? "इतिहास (History)" : "History"}
                  </option>
                  <option value="lifestyle">
                    {locale === "ne" ? "जीवनशैली (Lifestyle)" : "Lifestyle"}
                  </option>
                  <option value="tourism">
                    {locale === "ne" ? "पर्यटन (Tourism)" : "Tourism"}
                  </option>
                  <option value="folklore">
                    {locale === "ne" ? "लोककथा तथा जनश्रुति (Folklore)" : "Folklore"}
                  </option>
                  <option value="oral_history">
                    {locale === "ne" ? "मौखिक इतिहास (Oral History)" : "Oral History"}
                  </option>
                  <option value="memories">
                    {locale === "ne" ? "सम्झनाहरू (Memories)" : "Memories"}
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
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-bold font-sans text-foreground">
                      {locale === "ne" ? "लेखकको नाम *" : "Author Name *"}
                    </label>
                    {user && (
                      <span className="text-[11px] font-bold text-brand flex items-center gap-1 font-mono">
                        <CheckCircle2 size={12} />
                        {locale === "ne" ? "प्रमाणित खाता" : "Verified Account"}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    disabled={!!user}
                    value={authorName || userDisplayName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className={`w-full bg-surface border border-border p-3 text-sm focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground/50 ${
                      user
                        ? "bg-black/[0.04] dark:bg-white/[0.04] opacity-90 cursor-not-allowed font-medium select-none"
                        : "focus:border-brand"
                    }`}
                    placeholder={locale === "ne" ? "तपाईको नाम" : "Your name"}
                    title={user ? (locale === "ne" ? "लगइन भएको खाताबाट स्वतः लिइएको" : "Auto-filled from your logged in account") : undefined}
                  />
                </div>

                {/* Image Field */}
                <div>
                  <label className="block text-sm font-bold font-sans text-foreground mb-1.5 flex items-center justify-between">
                    <span>{locale === "ne" ? "तस्बिर संलग्न (वैकल्पिक)" : "Attach Image (Optional)"}</span>
                    {imageFile && (
                      <span className="text-xs text-brand font-medium">
                        {(imageFile.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-surface border border-dashed border-border hover:border-brand p-3 text-sm flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-all cursor-pointer rounded-none group h-[46px]"
                    >
                      <Upload size={16} className="text-brand group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold">
                        {locale === "ne" ? "तस्बिर छान्नुहोस् (PNG, JPG)" : "Choose Image (PNG, JPG)"}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-3 p-1.5 px-3 bg-surface border border-border rounded-none h-[46px]">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Story upload preview"
                          className="w-8 h-8 object-cover border border-border shrink-0"
                        />
                        <span className="text-xs text-foreground font-medium truncate max-w-[120px] sm:max-w-[140px]">
                          {imageFile?.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                        title={locale === "ne" ? "हटाउनुहोस्" : "Remove"}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Fixed Footer (Submit Button) */}
        {!isSuccess && (
          <div className="px-8 py-6 shrink-0 bg-background z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <button
              form="story-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-white font-bold text-[15px] hover:brightness-110 transition-all cursor-pointer shadow-sm rounded-none flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: themePrimary }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{locale === "ne" ? "पठाउँदै..." : "Submitting..."}</span>
                </>
              ) : (
                <span>{locale === "ne" ? "कथा पठाउनुहोस्" : "Submit Story"}</span>
              )}
            </button>
          </div>
        )}
      </FTModal>
  );
}
