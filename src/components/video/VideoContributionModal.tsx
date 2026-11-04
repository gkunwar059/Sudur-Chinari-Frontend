"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import FTModal from "@/components/common/FTModal";
import AuthModal from "@/components/auth/AuthModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import {
  Play,
  CheckCircle2,
  Loader2,
  X,
  UserCheck,
  ShieldAlert,
  Clock,
  Film,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { YoutubeIcon } from "@/components/common/SocialIcons";

interface VideoContributionModalProps {
  themePrimary?: string;
  trigger?: React.ReactNode;
  defaultDistrict?: string;
}

export default function VideoContributionModal({
  themePrimary = "var(--color-brand)",
  trigger,
  defaultDistrict = "",
}: VideoContributionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: districtsResponse } = useQuery({
    queryKey: ["districts", locale],
    queryFn: () => newsApi.getDistrictsClient(locale as any),
  });
  const districts = districtsResponse?.results || [];

  // Form fields
  const [titleEn, setTitleEn] = useState("");
  const [titleNe, setTitleNe] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [extractedYtId, setExtractedYtId] = useState("");
  const [isShort, setIsShort] = useState(false);
  const [duration, setDuration] = useState("3:00");
  const [districtSlug, setDistrictSlug] = useState(defaultDistrict);
  const [customThumbnail, setCustomThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync defaultDistrict
  useEffect(() => {
    if (defaultDistrict) {
      setDistrictSlug(defaultDistrict);
    }
  }, [defaultDistrict, isOpen]);

  // Derive user display name
  const userDisplayName =
    (user as any)?.full_name ||
    (user as any)?.name ||
    (user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : "") ||
    user?.username ||
    user?.email ||
    "";

  // Auto-parse YouTube URL / ID and format
  useEffect(() => {
    const trimmed = youtubeInput.trim();
    if (!trimmed) {
      setExtractedYtId("");
      return;
    }

    let detectedId = "";
    if (trimmed.includes("/shorts/")) {
      setIsShort(true);
      const match = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (match) detectedId = match[1];
    } else if (trimmed.includes("youtu.be/")) {
      const match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) detectedId = match[1];
    } else if (trimmed.includes("v=")) {
      const match = trimmed.match(/v=([a-zA-Z0-9_-]{11})/);
      if (match) detectedId = match[1];
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      detectedId = trimmed;
    }

    setExtractedYtId(detectedId);
  }, [youtubeInput]);

  const handleOpenModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!titleEn && !titleNe) {
      setErrorMessage(
        locale === "ne"
          ? "कृपया भिडियोको शीर्षक लेख्नुहोस्।"
          : "Please provide a title for the video.",
      );
      return;
    }

    if (!youtubeInput && !videoUrl) {
      setErrorMessage(
        locale === "ne"
          ? "कृपया YouTube लिङ्क वा भिडियो URL प्रविष्ट गर्नुहोस्।"
          : "Please provide a YouTube URL, Video ID, or direct video URL.",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: Record<string, any> = {
        title_en: titleEn || titleNe,
        title_ne: titleNe || titleEn,
        title: titleEn || titleNe,
        isShort,
        duration: duration || (isShort ? "0:45" : "3:00"),
      };

      if (extractedYtId) {
        payload.youtube_id = extractedYtId;
        payload.thumbnail =
          customThumbnail ||
          `https://img.youtube.com/vi/${extractedYtId}/hqdefault.jpg`;
      } else if (youtubeInput) {
        payload.youtube_id = youtubeInput;
      }

      if (videoUrl) {
        payload.video_url = videoUrl;
      }

      if (customThumbnail) {
        payload.thumbnail = customThumbnail;
      }

      if (districtSlug) {
        payload.district = districtSlug;
      }

      await newsApi.postVideoClient(payload);

      // Invalidate queries so video list refreshes immediately
      queryClient.invalidateQueries({ queryKey: ["videos"] });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitleEn("");
        setTitleNe("");
        setYoutubeInput("");
        setExtractedYtId("");
        setVideoUrl("");
        setCustomThumbnail("");
        setIsOpen(false);
      }, 2300);
    } catch (err: any) {
      console.error("Video submission error:", err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        (locale === "ne"
          ? "भिडियो पठाउन समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।"
          : "Could not submit video. Please try again.");
      setErrorMessage(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const previewThumbnailUrl =
    customThumbnail ||
    (extractedYtId
      ? `https://img.youtube.com/vi/${extractedYtId}/hqdefault.jpg`
      : "");

  return (
    <>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={handleOpenModal} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 font-bold font-sans text-sm hover:bg-brand/90 transition-all cursor-pointer shadow-xs active:translate-y-px"
        >
          <Play size={14} fill="white" className="ml-0.5" />
          <span>{locale === "ne" ? "भिडियो पठाउनुहोस् +" : "Add Video +"}</span>
        </button>
      )}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsOpen(true);
        }}
      />

      {/* Main Video Submission Modal */}
      {isOpen && (
        <FTModal
          onClose={() => setIsOpen(false)}
          variant="accent-top"
          accentColor={themePrimary}
          maxWidth="max-w-xl"
          maxHeight="max-h-[92vh]"
          zClassName="z-[100]"
          ariaLabel={locale === "ne" ? "भिडियो साझा गर्नुहोस्" : "Share Video"}
          paddingClassName="p-4 sm:p-6"
          backdropClassName="bg-black/60 backdrop-blur-sm"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1.5 z-20 cursor-pointer hover:bg-muted/50 rounded-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Fixed Editorial Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-4 shrink-0 bg-background z-10 border-b border-border/60 pr-14">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                {locale === "ne"
                  ? "डिजिटल भिडियो निर्देशिका"
                  : "Digital Video Archive"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-tight">
              {locale === "ne"
                ? "नयाँ भिडियो समाचार वा रिल साझा गर्नुहोस्"
                : "Share a Video Report / Short"}
            </h2>

            <p className="text-muted-foreground text-xs sm:text-sm font-sans mt-1 leading-relaxed">
              {locale === "ne"
                ? "सुदूरपश्चिमका विशेष भिडियो रिपोर्ट, अन्तर्वार्ता तथा छोटा भिडियो रिल्सहरू यहाँ दर्ता गर्नुहोस्।"
                : "Publish editorial video reports, news clips, or short visual reels from Sudurpashchim."}
            </p>
          </div>

          {/* Scrollable Form Body */}
          <div className="px-6 sm:px-8 py-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-background">
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-14 h-14 bg-brand/10 border-2 border-brand flex items-center justify-center">
                  <CheckCircle2
                    size={36}
                    className="text-brand animate-bounce"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground font-headline">
                  {locale === "ne"
                    ? "भिडियो सफलतापूर्वक दर्ता भयो !"
                    : "Video Published!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md font-sans">
                  {locale === "ne"
                    ? "तपाईंको भिडियो सामग्री अभिलेखमा समावेश गरिएको छ। अब यो भिडियो सेक्सनमा देखिनेछ।"
                    : "Your video report has been added to the regional multimedia portal."}
                </p>
              </div>
            ) : !user ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert size={44} className="text-amber-600" />
                <h3 className="text-xl font-bold text-foreground font-headline">
                  {locale === "ne"
                    ? "लगइन आवश्यक छ"
                    : "Authentication Required"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md font-sans">
                  {locale === "ne"
                    ? "भिडियो सामग्री पठाउनका लागि प्रमाणित प्रयोगकर्ता लगइन हुनु अनिवार्य छ।"
                    : "You must be signed in with a verified account to submit video dispatches."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-brand text-white px-6 py-2.5 text-xs font-bold font-sans hover:bg-brand/90 transition-colors cursor-pointer"
                >
                  {locale === "ne" ? "अहिले लगइन गर्नुहोस्" : "Sign In Now"}
                </button>
              </div>
            ) : (
              <form
                id="video-form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Verified Contributor Account Banner */}
                <div className="flex items-center justify-between gap-3 p-3 bg-surface border border-border border-l-[3px] border-l-brand rounded-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserCheck size={18} className="text-brand shrink-0" />
                    <div className="text-xs sm:text-sm font-sans truncate">
                      <span className="text-muted-foreground">
                        {locale === "ne"
                          ? "प्रमाणित खाता:"
                          : "Verified Account:"}{" "}
                      </span>
                      <span className="font-bold text-foreground">
                        {userDisplayName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 font-semibold shrink-0">
                    {locale === "ne" ? "सम्पादकीय प्रेषक" : "Verified Sender"}
                  </span>
                </div>
                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 text-xs sm:text-sm font-sans flex items-start gap-2">
                    <span className="font-bold shrink-0">!</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Video Format Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "भिडियोको प्रारूप *" : "Video Format *"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsShort(false)}
                      className={`p-3 text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                        !isShort
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-border bg-surface text-muted-foreground hover:border-brand/50"
                      }`}
                    >
                      <Film
                        size={18}
                        className={
                          !isShort ? "text-brand" : "text-muted-foreground"
                        }
                      />
                      <div>
                        <div className="text-xs font-bold font-sans">
                          {locale === "ne"
                            ? "पूर्ण भिडियो समाचार"
                            : "Full Video Report"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {locale === "ne"
                            ? "१६:९ तेर्सो ढाँचा"
                            : "16:9 Landscape"}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsShort(true)}
                      className={`p-3 text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isShort
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-border bg-surface text-muted-foreground hover:border-brand/50"
                      }`}
                    >
                      <Sparkles
                        size={18}
                        className={
                          isShort ? "text-brand" : "text-muted-foreground"
                        }
                      />
                      <div>
                        <div className="text-xs font-bold font-sans">
                          {locale === "ne" ? "छोटो रिल / सर्ट" : "Short / Reel"}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {locale === "ne"
                            ? "९:१६ ठाडो ढाँचा"
                            : "9:16 Vertical"}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* YouTube Link or ID */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <YoutubeIcon size={14} className="text-red-600" />
                      <span>
                        {locale === "ne"
                          ? "YouTube लिङ्क वा भिडियो आइडी *"
                          : "YouTube Link or Video ID *"}
                      </span>
                    </span>
                    {extractedYtId && (
                      <span className="text-[11px] font-mono text-brand font-semibold">
                        ID: {extractedYtId}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                    className="w-full bg-surface border border-border p-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1 font-sans">
                    {locale === "ne"
                      ? "YouTube URL वा ११-अक्षरको भिडियो आइडी यहाँ टाँस्नुहोस्।"
                      : "Paste any standard YouTube video URL, Shorts link, or 11-char Video ID."}
                  </p>
                </div>

                {/* Live YouTube Thumbnail Preview */}
                {previewThumbnailUrl && (
                  <div className="border border-border bg-surface p-2.5 flex items-center gap-3">
                    <div className="relative w-24 aspect-video bg-black/10 border border-border overflow-hidden shrink-0">
                      <img
                        src={previewThumbnailUrl}
                        alt="Video preview thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play size={14} fill="white" className="text-white" />
                      </div>
                    </div>
                    <div className="overflow-hidden text-xs">
                      <span className="text-brand font-bold uppercase tracking-wider text-[10px] block">
                        Preview Detected
                      </span>
                      <p className="font-mono text-muted-foreground truncate max-w-[280px]">
                        {previewThumbnailUrl}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bilingual Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                      {locale === "ne"
                        ? "शीर्षक (अंग्रेजी) *"
                        : "Title (English) *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Dhangadhi Modern Farming Dispatch"
                      className="w-full bg-surface border border-border p-2.5 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                      {locale === "ne" ? "शीर्षक (नेपाली)" : "Title (नेपाली)"}
                    </label>
                    <input
                      type="text"
                      value={titleNe}
                      onChange={(e) => setTitleNe(e.target.value)}
                      placeholder="जस्तै: धनगढी आधुनिक कृषि समाचार"
                      className="w-full bg-surface border border-border p-2.5 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-serif-np"
                    />
                  </div>
                </div>

                {/* District & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                      {locale === "ne" ? "जिल्ला" : "District"}
                    </label>
                    <select
                      value={districtSlug}
                      onChange={(e) => setDistrictSlug(e.target.value)}
                      className="w-full bg-surface border border-border p-2.5 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none font-sans"
                    >
                      <option value="">
                        {locale === "ne"
                          ? "— जिल्ला छान्नुहोस् —"
                          : "— Select District (Optional) —"}
                      </option>
                      {districts.map((d: any) => (
                        <option key={d.id} value={d.slug}>
                          {t(d.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5 flex items-center gap-1">
                      <Clock size={12} className="text-muted-foreground" />
                      <span>
                        {locale === "ne"
                          ? "भिडियोको समय (Duration)"
                          : "Duration (e.g. 3:45)"}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder={isShort ? "0:45" : "3:30"}
                      className="w-full bg-surface border border-border p-2.5 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-sans"
                    />
                  </div>
                </div>

                {/* Direct Video or Stream URL (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5 flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-muted-foreground" />
                    <span>
                      {locale === "ne"
                        ? "प्रत्यक्ष MP4 वा स्ट्रिमिङ URL (वैकल्पिक)"
                        : "Direct MP4 or Stream URL (Optional)"}
                    </span>
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-surface border border-border p-2.5 text-xs focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-mono"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Fixed Footer */}
          {!isSuccess && user && (
            <div className="px-6 sm:px-8 py-3.5 shrink-0 bg-background border-t border-border mt-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-sans text-muted-foreground hidden sm:block">
                  <span className="font-medium text-foreground">
                    {isShort
                      ? locale === "ne"
                        ? "छोटो रिल"
                        : "Short format"
                      : locale === "ne"
                        ? "पूर्ण भिडियो"
                        : "Standard 16:9 report"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial py-2 px-4 bg-surface text-foreground text-xs font-bold border border-border hover:bg-surface-tint transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {locale === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    form="video-form"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial py-2 px-5 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer shadow-xs active:translate-y-px"
                    style={{ backgroundColor: themePrimary }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>
                          {locale === "ne" ? "दर्ता गर्दै..." : "Publishing..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Play size={13} fill="currentColor" />
                        <span>
                          {locale === "ne"
                            ? "भिडियो प्रकाशित गर्नुहोस्"
                            : "Publish Video"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </FTModal>
      )}
    </>
  );
}
