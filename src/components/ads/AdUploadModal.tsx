"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Megaphone,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Calendar,
  Phone,
  Mail,
  User as UserIcon,
  ExternalLink,
  ShieldCheck,
  FileText,
  MapPin,
  Sparkles,
  Lock,
} from "lucide-react";
import FTModal from "@/components/common/FTModal";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { newsApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import type { AdPlacement } from "@/components/common/AdBanner";

export interface AdUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlacement?: AdPlacement;
  initialPage?: string;
  initialPath?: string;
  slotName?: string;
  slotDims?: string;
  onSuccess?: () => void;
}

function getPageDetails(page: string, pathname: string, isNe: boolean) {
  const map: Record<string, { titleNe: string; titleEn: string; descNe: string; descEn: string }> = {
    home: {
      titleNe: "गृहपृष्ठ (Homepage)",
      titleEn: "Homepage",
      descNe: "सुदूर चिनारीको मुख्य गृहपृष्ठ",
      descEn: "Main Home Broadsheet",
    },
    article: {
      titleNe: "समाचार भित्री पृष्ठ (Article Detail)",
      titleEn: "Article Detail Page",
      descNe: "विस्तृत समाचार तथा विश्लेषण पृष्ठ",
      descEn: "Single Article View",
    },
    category: {
      titleNe: "विधा पृष्ठ (Category Section)",
      titleEn: "Category Section",
      descNe: "विशेष समाचार विधा अर्काइभ",
      descEn: "Category Archive Feed",
    },
    district: {
      titleNe: "जिल्ला पृष्ठ (District Section)",
      titleEn: "District Section",
      descNe: "सुदूरपश्चिमका ९ वटै जिल्ला प्रोफाइल",
      descEn: "District Profile & Archives",
    },
    yatayat: {
      titleNe: "सुदूर यातायात निर्देशिका (Yatayat Transit)",
      titleEn: "Transport Directory",
      descNe: "बस, हाइस र जीप सेवाहरूको डिजिटल निर्देशिका",
      descEn: "Transit Timetable & Routes",
    },
    products: {
      titleNe: "स्थानीय उत्पादन तथा कृषि (Local Products)",
      titleEn: "Local Products / Agriculture",
      descNe: "सुदूरपश्चिमका रैथाने तथा स्थानीय उत्पादन खण्ड",
      descEn: "Indigenous Produce & Farmers",
    },
    video: {
      titleNe: "भिडियो रिपोर्ट खण्ड (Video Section)",
      titleEn: "Video Section",
      descNe: "डकुमेन्ट्री तथा सर्ट भिडिओ खण्ड",
      descEn: "Video Documentaries & Shorts",
    },
    photo: {
      titleNe: "फोटो फिचर खण्ड (Photo Stories)",
      titleEn: "Photo Stories Section",
      descNe: "तस्बिर कथा तथा दृश्य ग्यालरी खण्ड",
      descEn: "Visual Photo Journalism",
    },
    sports: {
      titleNe: "खेलकुद (Sports)",
      titleEn: "Sports Page",
      descNe: "सुदूरपश्चिमका खेल गतिविधि खण्ड",
      descEn: "Sports Coverage",
    },
    politics: {
      titleNe: "राजनीति (Politics)",
      titleEn: "Politics Page",
      descNe: "राजनीतिक घटनाक्रम तथा नीति खण्ड",
      descEn: "Political Analysis",
    },
    tourism: {
      titleNe: "पर्यटन तथा खप्तड (Tourism)",
      titleEn: "Tourism & Heritage",
      descNe: "प्राकृतिक सम्पदा तथा पर्यटन खण्ड",
      descEn: "Tourism & Travel Destination",
    },
    stay: {
      titleNe: "होटल तथा बास (Hotels & Stay)",
      titleEn: "Hotels & Stay Directory",
      descNe: "आवास तथा होटल निर्देशिका",
      descEn: "Hospitality & Stay",
    },
    all: {
      titleNe: "सम्पूर्ण पोर्टल (All Pages / Global)",
      titleEn: "All Pages (Global Placement)",
      descNe: "वेबसाइटका सबै प्रमुख पृष्ठहरूमा",
      descEn: "Global Site-wide Placement",
    },
  };

  const item = map[page] || {
    titleNe: "हालको पृष्ठ (Current Page)",
    titleEn: "Current Page",
    descNe: "अनुरोध गरिएको पृष्ठ",
    descEn: "Requested Page",
  };

  return {
    title: isNe ? item.titleNe : item.titleEn,
    desc: isNe ? item.descNe : item.descEn,
    path: pathname || "/",
  };
}

function getPlacementDetails(placement: AdPlacement, isNe: boolean) {
  const map: Record<AdPlacement, { nameNe: string; nameEn: string; dims: string; descNe: string; descEn: string }> = {
    "top-leaderboard": {
      nameNe: "शीर्ष ब्यानर (Top Leaderboard)",
      nameEn: "Top Leaderboard (Header)",
      dims: "970x90 / 728x90 px",
      descNe: "वेबसाइटको मुख्य हेडर मुनि उच्च दृश्यता भएको स्थान",
      descEn: "Prime above-the-fold visibility below header",
    },
    "billboard-mid": {
      nameNe: "मुख्य ब्यानर (Billboard Mid)",
      nameEn: "Billboard Mid (Between sections)",
      dims: "1200x120 / 1200x150 px",
      descNe: "खण्डहरूका बीचमा रहने पूर्ण चौडाइको ब्यानर",
      descEn: "Full-width broadsheet break between major sections",
    },
    sidebar: {
      nameNe: "साइडबार बक्स (Sidebar Square)",
      nameEn: "Sidebar Square / Rectangle",
      dims: "300x250 / 336x280 px",
      descNe: "दायाँ स्तम्भमा रहने प्रभावकारी विज्ञापन स्थान",
      descEn: "Right column sticky engagement slot",
    },
    "in-article": {
      nameNe: "समाचार भित्रको ब्यानर (In-Article)",
      nameEn: "In-Article Banner",
      dims: "728x90 / 300x250 px",
      descNe: "समाचार अनुच्छेदका बीचमा स्वाभाविक रूपमा देखिने स्थान",
      descEn: "Native reading flow placement inside content",
    },
    "bottom-strip": {
      nameNe: "पुछारको ब्यानर (Bottom Strip)",
      nameEn: "Bottom Strip (Footer Area)",
      dims: "1200x100 px",
      descNe: "फुटारभन्दा ठिक माथि रहने पूर्ण चौडाइको ब्यानर",
      descEn: "End-of-page full-width anchor placement",
    },
  };

  const item = map[placement] || map["billboard-mid"];
  return {
    name: isNe ? item.nameNe : item.nameEn,
    dims: item.dims,
    desc: isNe ? item.descNe : item.descEn,
  };
}

export default function AdUploadModal({
  isOpen,
  onClose,
  initialPlacement = "billboard-mid",
  initialPage = "home",
  initialPath = "/",
  slotName,
  slotDims,
  onSuccess,
}: AdUploadModalProps) {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const isNe = locale === "ne";
  const queryClient = useQueryClient();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Locked target dynamically determined by where user clicked
  const [page, setPage] = useState(initialPage);
  const [placement, setPlacement] = useState<AdPlacement>(initialPlacement);
  const [customPagePath, setCustomPagePath] = useState(initialPath);

  // Creative Fields
  const [title, setTitle] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [notes, setNotes] = useState("");

  // Image Upload Handling
  const [imageType, setImageType] = useState<"file" | "url">("file");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFilePreview, setImageFilePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamically sync and lock the clicked slot & page
  useEffect(() => {
    if (initialPlacement) setPlacement(initialPlacement);
    if (initialPage) setPage(initialPage);
    if (initialPath) setCustomPagePath(initialPath);
  }, [initialPlacement, initialPage, initialPath, isOpen]);

  // Pre-fill user data when user is present
  useEffect(() => {
    if (user) {
      if (!contactName) {
        setContactName(
          (user as any).full_name ||
          (user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "") ||
          user.username ||
          ""
        );
      }
      if (!contactEmail && user.email) {
        setContactEmail(user.email);
      }
      if (!contactPhone && (user as any).phone) {
        setContactPhone((user as any).phone);
      }
    }
  }, [user, isOpen]);

  const pageDetails = getPageDetails(page, customPagePath, isNe);
  const placementDetails = getPlacementDetails(placement, isNe);
  const effectiveDims = slotDims || placementDetails.dims;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        isNe
          ? "कृपया मान्य फोटो फाइल (JPG, PNG, WebP) छान्नुहोस्।"
          : "Please select a valid image file (JPG, PNG, WebP)."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        isNe ? "फोटोको आकार ५MB भन्दा कम हुनुपर्छ।" : "File size must be under 5MB."
      );
      return;
    }

    setImageFile(file);
    setImageFilePreview(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const handleClearImage = () => {
    if (imageFilePreview) {
      URL.revokeObjectURL(imageFilePreview);
    }
    setImageFile(null);
    setImageFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!title.trim()) {
      setErrorMessage(
        isNe ? "कृपया विज्ञापनको शीर्षक लेख्नुहोस्।" : "Please enter the advertisement title."
      );
      return;
    }

    if (imageType === "file" && !imageFile) {
      setErrorMessage(
        isNe
          ? "कृपया विज्ञापनको ब्यानर फोटो अपलोड गर्नुहोस्।"
          : "Please upload the banner image file."
      );
      return;
    }

    if (imageType === "url" && !imageUrl.trim()) {
      setErrorMessage(
        isNe ? "कृपया मान्य फोटोको URL प्रविष्ट गर्नुहोस्।" : "Please enter a valid image URL."
      );
      return;
    }

    if (!contactPhone.trim() && !contactEmail.trim()) {
      setErrorMessage(
        isNe
          ? "कृपया फोन नम्बर वा ईमेल ठेगाना दिनुहोस्।"
          : "Please provide a contact phone or email address."
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("page", page);
      formData.append("custom_page_path", customPagePath || "");
      formData.append("placement", placement);
      formData.append(
        "advertiser",
        advertiser.trim() || contactName.trim() || "Advertiser"
      );
      formData.append("target_url", targetUrl.trim());
      formData.append("alt_text", altText.trim() || title.trim());
      formData.append("contact_name", contactName.trim());
      formData.append("contact_phone", contactPhone.trim());
      formData.append("contact_email", contactEmail.trim());
      formData.append("notes", notes.trim());
      formData.append("duration_days", String(durationDays));

      if (imageType === "file" && imageFile) {
        formData.append("image", imageFile);
      } else if (imageType === "url" && imageUrl.trim()) {
        formData.append("image_url", imageUrl.trim());
      }

      await newsApi.requestBannerAdClient(formData);

      queryClient.invalidateQueries({ queryKey: ["banner-ads"] });
      queryClient.invalidateQueries({ queryKey: ["active-banner-ad"] });

      setIsSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (isNe
          ? "अनुरोध पेश गर्न समस्या भयो। कृपया पुन: प्रयास गर्नुहोस्।"
          : "Failed to submit ad request. Please try again.");
      setErrorMessage(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <FTModal
        onClose={onClose}
        maxWidth="max-w-2xl"
        maxHeight="max-h-[92vh]"
        labelledBy="ad-upload-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <Megaphone size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="ft-kicker !mb-0 text-[10px]">
                  {isNe ? "डिजिटल विज्ञापन पोर्टल" : "DIGITAL ADVERTISING"}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-brand text-white font-bold">
                  {isNe ? "स्थान सुरक्षित" : "DYNAMIC SLOT"}
                </span>
              </div>
              <h2
                id="ad-upload-modal-title"
                className="font-headline font-bold text-base sm:text-lg text-foreground tracking-tight leading-tight mt-0.5"
              >
                {isNe
                  ? "विज्ञापन अनुरोध तथा सामाग्री अपलोड"
                  : "Request Advertisement Placement"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent hover:border-border transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto overscroll-contain flex-1 min-h-0 text-sm">
          {!user ? (
            <div className="text-center py-8 px-4 bg-surface border border-border">
              <Megaphone className="mx-auto h-12 w-12 text-brand mb-3 opacity-90" />
              <h3 className="font-headline font-bold text-lg text-foreground mb-2">
                {isNe
                  ? "विज्ञापन अनुरोधका लागि लगइन गर्नुहोस्"
                  : "Login Required to Request Advertisement"}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-6">
                {isNe
                  ? "यस स्थानमा तपाईंको व्यवसायको विज्ञापन अपलोड गर्न तथा स्थिति ट्र्याक गर्न कृपया पहिले लगइन गर्नुहोस्।"
                  : "To submit your banner ad for this placement and track editorial verification, please sign in."}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  {isNe ? "लगइन वा खाता खोल्नुहोस्" : "Login / Register"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-background border border-border hover:bg-surface text-foreground font-semibold text-xs transition-colors cursor-pointer"
                >
                  {isNe ? "रद्द गर्नुहोस्" : "Cancel"}
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-10 px-4">
              <div className="w-14 h-14 bg-brand/10 border-2 border-brand text-brand rounded-full flex items-center justify-center mx-auto mb-4 animate-scaleUp">
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <h3 className="font-headline font-bold text-xl text-foreground mb-2">
                {isNe
                  ? "विज्ञापन अनुरोध सफलतापूर्वक पेश भयो!"
                  : "Ad Request Submitted Successfully!"}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-4 leading-relaxed">
                {isNe
                  ? "तपाईंको विज्ञापन हाम्रो सम्पादकीय प्रशासन (Admin) द्वारा समीक्षा भई प्रमाणीकरण भएपछि यसै खण्डमा तुरुन्त प्रकाशित हुनेछ।"
                  : "Your advertisement has been submitted for editorial verification. Once approved by the administrator, it will go live on this exact slot."}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border text-xs text-muted-foreground font-medium">
                <ShieldCheck size={14} className="text-brand" />
                <span>स्थिति: प्रमाणीकरण प्रक्रियामा (Pending Verification)</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border-l-4 border-red-600 text-red-800 dark:text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ── 1. DYNAMICALLY AUTO-DETECTED TARGET PLACEMENT (No Dropdowns) ── */}
              <div className="bg-surface/80 border border-border border-l-4 border-l-brand p-4 shadow-2xs">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/70">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand shrink-0" />
                    <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                      {isNe
                        ? "१. स्वतः पहिचान गरिएको स्थान (Auto-Detected Target Slot)"
                        : "1. Auto-Detected Target Placement"}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 bg-brand/10 text-brand border border-brand/20">
                    <Lock size={10} />
                    <span>{isNe ? "स्वतः लक्षित" : "Slot Locked"}</span>
                  </span>
                </div>

                {/* Locked target summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {/* Page Card */}
                  <div className="bg-background p-3 border border-border">
                    <span className="block text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">
                      {isNe ? "लक्षित पृष्ठ (Target Page)" : "Target Page"}
                    </span>
                    <div className="font-headline font-bold text-sm text-foreground">
                      {pageDetails.title}
                    </div>
                    {customPagePath && (
                      <div className="text-[11px] font-mono text-brand truncate mt-1 bg-surface px-1.5 py-0.5 border border-border/50">
                        {customPagePath}
                      </div>
                    )}
                  </div>

                  {/* Placement Card */}
                  <div className="bg-background p-3 border border-border">
                    <span className="block text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">
                      {isNe ? "विज्ञापनको स्थान (Ad Placement)" : "Ad Placement Slot"}
                    </span>
                    <div className="font-headline font-bold text-sm text-foreground">
                      {placementDetails.name}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center justify-between">
                      <span>📐 आकार: <strong className="text-foreground">{effectiveDims}</strong></span>
                      <span className="text-[10px] bg-brand text-white px-1 font-bold">Active</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground leading-normal">
                  <Sparkles size={13} className="text-brand shrink-0" />
                  <span>
                    {isNe
                      ? "तपाईंले क्लिक गर्नुभएको खण्डका आधारमा प्रणालीले पृष्ठ र स्थान स्वतः निश्चित गरेको छ।"
                      : "Dynamically resolved based on the exact section and page where you clicked."}
                  </span>
                </div>
              </div>

              {/* ── 2. CREATIVE & CONTENT ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Megaphone size={15} className="text-brand" />
                  <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                    २. विज्ञापन सामाग्री (Creative & Campaign Details)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      {isNe ? "विज्ञापन / योजनाको शीर्षक *" : "Campaign Title *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        isNe
                          ? "उदा. खप्तड पर्यटन वर्ष २०२६ विशेष छुट"
                          : "e.g. Special Tourism Promotion 2026"
                      }
                      className="w-full px-3 py-2 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      {isNe ? "विज्ञापनदाता / संस्थाको नाम" : "Advertiser / Company Name"}
                    </label>
                    <input
                      type="text"
                      value={advertiser}
                      onChange={(e) => setAdvertiser(e.target.value)}
                      placeholder={
                        isNe
                          ? "उदा. नेपाल टेलिकम / होटल वेस्टर्न"
                          : "e.g. Nepal Telecom / Western Hotel"
                      }
                      className="w-full px-3 py-2 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      {isNe
                        ? "क्लिक गर्दा जाने लिङ्क (Target URL)"
                        : "Click-through Target URL"}
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>
                </div>

                {/* Image Upload Area */}
                <div className="border border-border p-3.5 bg-surface/30">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isNe ? "ब्यानर फोटो अपलोड वा लिङ्क *" : "Banner Image Creative *"}
                    </label>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageType("file")}
                        className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                          imageType === "file"
                            ? "bg-brand text-white border-brand font-bold"
                            : "bg-background text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        <Upload size={11} className="inline mr-1" />
                        {isNe ? "फाइल अपलोड" : "File Upload"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageType("url")}
                        className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                          imageType === "url"
                            ? "bg-brand text-white border-brand font-bold"
                            : "bg-background text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        <LinkIcon size={11} className="inline mr-1" />
                        {isNe ? "इमेज URL" : "Image URL"}
                      </button>
                    </div>
                  </div>

                  {imageType === "file" ? (
                    <div>
                      {imageFilePreview ? (
                        <div className="relative border border-border bg-black/5 p-2">
                          <div className="relative w-full h-32 overflow-hidden flex items-center justify-center bg-surface">
                            <Image
                              src={imageFilePreview}
                              alt="Banner preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
                            <span className="truncate max-w-[220px]">
                              {imageFile?.name} ({(imageFile!.size / 1024).toFixed(1)} KB)
                            </span>
                            <button
                              type="button"
                              onClick={handleClearImage}
                              className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                            >
                              {isNe ? "हटाउनुहोस् (Remove)" : "Remove"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-border hover:border-brand transition-colors p-6 text-center cursor-pointer bg-background"
                        >
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-xs font-semibold text-foreground mb-1">
                            {isNe
                              ? "यहाँ क्लिक गरी फोटो छान्नुहोस्"
                              : "Click to browse or drop banner image"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            JPG, PNG, WebP (अधिकतम ५ MB • सिफारिस: {effectiveDims})
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... वा https://example.com/banner.jpg"
                        className="w-full px-3 py-2 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none mb-2"
                      />
                      {imageUrl && (
                        <div className="relative w-full h-24 border border-border bg-surface overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt="URL preview"
                            fill
                            unoptimized
                            className="object-contain"
                            onError={() =>
                              setErrorMessage("प्रविष्ट गरिएको इमेज URL लोड हुन सकेन।")
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── 3. CONTACT & DURATION ── */}
              <div className="bg-surface/50 border border-border p-4 space-y-3.5">
                <div className="flex items-center gap-2">
                  <UserIcon size={15} className="text-brand" />
                  <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                    ३. सम्पर्क तथा समयावधि (Contact & Duration)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      {isNe ? "सम्पर्क व्यक्तिको नाम" : "Contact Person Name"}
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      {isNe ? "सम्पर्क फोन नम्बर *" : "Contact Phone *"}
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      {isNe ? "ईमेल ठेगाना" : "Contact Email"}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    {isNe ? "इच्छित समयावधि (Campaign Duration)" : "Campaign Duration"}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[7, 15, 30, 60].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationDays(d)}
                        className={`py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                          durationDays === d
                            ? "bg-brand text-white border-brand font-bold"
                            : "bg-background text-muted-foreground border-border hover:text-foreground"
                        }`}
                      >
                        {d} {isNe ? "दिन" : "days"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    {isNe
                      ? "अतिरिक्त निर्देशन (Notes to Editorial Admin)"
                      : "Notes / Special Requests"}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isNe
                        ? "कुनै विशेष निर्देशन भए यहाँ लेख्नुहोस्..."
                        : "Any special instructions for the editorial team..."
                    }
                    className="w-full px-2.5 py-1.5 border border-border bg-background text-foreground text-xs focus:outline-none focus:border-brand rounded-none resize-none"
                  />
                </div>
              </div>

              {/* ── 4. VERIFICATION NOTICE ── */}
              <div className="p-3 bg-brand/5 border border-brand/20 text-xs text-muted-foreground flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-brand shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {isNe
                    ? "ℹ️ तपाईंले पेश गर्नुभएको विज्ञापन हाम्रो सम्पादकीय प्रशासन (Admin Portal) द्वारा समीक्षा र प्रमाणीकरण भएपछि मात्र यसै स्थानमा प्रकाशित हुनेछ।"
                    : "ℹ️ Your ad request will be reviewed and verified by our editorial administration before going live on this targeted slot."}
                </p>
              </div>

              {/* Form Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-background border border-border hover:bg-surface text-foreground font-semibold text-xs transition-colors cursor-pointer"
                >
                  {isNe ? "रद्द गर्नुहोस्" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{isNe ? "पेश गर्दै..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Megaphone size={14} />
                      <span>
                        {isNe
                          ? "प्रमाणीकरणका लागि पेश गर्नुहोस्"
                          : "Submit for Admin Verification"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </FTModal>

      {/* Auth Modal Trigger if not logged in */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}
