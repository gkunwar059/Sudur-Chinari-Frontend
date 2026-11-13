"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import FTModal from "@/components/common/FTModal";
import AuthModal from "@/components/auth/AuthModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import { revalidateCacheTagsAction } from "@/app/actions/cache";
import {
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  UserCheck,
  ShieldAlert,
  Link as LinkIcon,
  Layers,
  FileText,
} from "lucide-react";

interface PhotoContributionModalProps {
  themePrimary?: string;
  trigger?: React.ReactNode;
  defaultDistrict?: string;
}

interface GalleryItem {
  id: string;
  file?: File;
  previewUrl: string;
  isUrl?: boolean;
  caption_en: string;
  caption_ne: string;
  order: number;
}

export default function PhotoContributionModal({
  themePrimary = "var(--color-brand)",
  trigger,
  defaultDistrict = "",
}: PhotoContributionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: districtsResponse } = useQuery({
    queryKey: ["districts", locale],
    queryFn: () => newsApi.getDistrictsClient(locale as any),
  });
  const districts = districtsResponse?.results || [];

  // Active sub-tab inside modal: 'story' | 'gallery'
  const [activeTab, setActiveTab] = useState<"story" | "gallery">("story");

  // Story fields (matching backend PhotoStory model)
  const [titleEn, setTitleEn] = useState("");
  const [titleNe, setTitleNe] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionNe, setDescriptionNe] = useState("");
  const [districtSlug, setDistrictSlug] = useState(defaultDistrict);
  const [photographerName, setPhotographerName] = useState("");

  // Gallery items (matching backend PhotoStoryImage model)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync defaultDistrict
  useEffect(() => {
    if (defaultDistrict) {
      setDistrictSlug(defaultDistrict);
    }
  }, [defaultDistrict, isOpen]);

  // Derive authenticated user display name
  const userDisplayName =
    (user as any)?.full_name ||
    (user as any)?.name ||
    (user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : "") ||
    user?.username ||
    user?.email ||
    "";

  useEffect(() => {
    if (user && userDisplayName && !photographerName) {
      setPhotographerName(userDisplayName);
    }
  }, [user, userDisplayName, photographerName, isOpen]);

  const handleOpenModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  // Add files to gallery
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: GalleryItem[] = [];
    const maxFiles = 20;

    if (galleryItems.length + files.length > maxFiles) {
      setErrorMessage(
        locale === "ne"
          ? `अधिकतम ${maxFiles} तस्बिरहरू मात्र थप्न सकिन्छ।`
          : `Maximum ${maxFiles} photos allowed per story.`,
      );
    }

    Array.from(files).forEach((file) => {
      if (file.size > 12 * 1024 * 1024) {
        setErrorMessage(
          locale === "ne"
            ? `${file.name} को साइज १२ MB भन्दा धेरै छ। कृपया सानो तस्बिर छान्नुहोस्।`
            : `${file.name} exceeds 12MB limit.`,
        );
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id,
        file,
        previewUrl,
        isUrl: false,
        caption_en: "",
        caption_ne: "",
        order: galleryItems.length + newItems.length + 1,
      });
    });

    if (newItems.length > 0) {
      setGalleryItems((prev) => [...prev, ...newItems]);
      setErrorMessage(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add image by URL
  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setErrorMessage(
        locale === "ne"
          ? "कृपया मान्य इमेज URL प्रविष्ट गर्नुहोस् (http:// वा https://)"
          : "Please enter a valid image URL starting with http:// or https://",
      );
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: GalleryItem = {
      id,
      previewUrl: trimmed,
      isUrl: true,
      caption_en: "",
      caption_ne: "",
      order: galleryItems.length + 1,
    };

    setGalleryItems((prev) => [...prev, newItem]);
    setUrlInput("");
    setShowUrlInput(false);
    setErrorMessage(null);
  };

  const handleRemoveItem = (id: string) => {
    setGalleryItems((prev) => {
      const filtered = prev.filter((item) => {
        if (item.id === id && item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
        return item.id !== id;
      });
      return filtered.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    setGalleryItems((prev) => {
      const items = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return items.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleUpdateCaption = (
    id: string,
    field: "caption_en" | "caption_ne",
    value: string,
  ) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setGalleryItems((prev) => {
      const items = [...prev];
      const selected = items.splice(index, 1)[0];
      items.unshift(selected);
      return items.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!titleEn && !titleNe) {
      setActiveTab("story");
      setErrorMessage(
        locale === "ne"
          ? "कृपया फोटो कथाको शीर्षक लेख्नुहोस्।"
          : "Please provide a title for the photo story.",
      );
      return;
    }

    if (!districtSlug) {
      setActiveTab("story");
      setErrorMessage(
        locale === "ne"
          ? "कृपया जिल्ला छान्नुहोस्।"
          : "Please select a district.",
      );
      return;
    }

    if (galleryItems.length === 0) {
      setActiveTab("gallery");
      setErrorMessage(
        locale === "ne"
          ? "कृपया कम्तीमा एउटा फोटो संलग्न गर्नुहोस्।"
          : "Please attach at least one photo for the story.",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("title_en", titleEn || titleNe);
      formData.append("title_ne", titleNe || titleEn);
      formData.append("title", titleEn || titleNe);
      formData.append("description_en", descriptionEn || descriptionNe);
      formData.append("description_ne", descriptionNe || descriptionEn);
      formData.append("description", descriptionEn || descriptionNe);
      formData.append("district", districtSlug);
      formData.append(
        "photographer",
        photographerName || userDisplayName || "Contributor",
      );

      const galleryMeta: Array<{
        caption_en: string;
        caption_ne: string;
        order: number;
      }> = [];

      galleryItems.forEach((item, idx) => {
        if (item.file) {
          formData.append("images", item.file);
        } else if (item.isUrl) {
          formData.append("image_urls", item.previewUrl);
        }
        galleryMeta.push({
          caption_en: item.caption_en || "",
          caption_ne: item.caption_ne || "",
          order: idx + 1,
        });
      });

      formData.append("gallery_meta", JSON.stringify(galleryMeta));

      await newsApi.postPhotoStoryClient(formData);

      // Invalidate server "use cache" tags and client queries so lists refresh immediately
      await revalidateCacheTagsAction([
        "photo-stories",
        "photo-stories-ne",
        "photo-stories-en",
      ]).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["photo-stories"] });
      router.refresh();

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitleEn("");
        setTitleNe("");
        setDescriptionEn("");
        setDescriptionNe("");
        galleryItems.forEach((item) => {
          if (item.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
        setGalleryItems([]);
        setIsOpen(false);
        setActiveTab("story");
      }, 2500);
    } catch (err: any) {
      console.error("Photo Story submission error:", err);
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        (locale === "ne"
          ? "फोटो कथा पेश गर्न समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।"
          : "Could not submit photo story. Please try again.");
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
          <Camera size={16} />
          <span>
            {locale === "ne" ? "फोटो कथा थप्नुहोस् +" : "Add Photo Story +"}
          </span>
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

      {/* Main Photo Story Modal */}
      {isOpen && (
        <FTModal
          onClose={() => setIsOpen(false)}
          variant="accent-top"
          accentColor={themePrimary}
          maxWidth="max-w-2xl"
          maxHeight="max-h-[92vh]"
          zClassName="z-[100]"
          ariaLabel={
            locale === "ne"
              ? "फोटो कथा सिर्जना गर्नुहोस्"
              : "Create Photo Story"
          }
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

          {/* Fixed Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-4 shrink-0 bg-background border-b border-border z-10 pr-14">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                {locale === "ne" ? "डिजिटल फोटो कथा" : "Digital Photo Essay"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2 py-0.5 bg-surface border border-border text-foreground font-semibold">
                <Camera size={10} className="text-brand shrink-0" />
                <span>{locale === "ne" ? "फोटो ग्यालरी" : "Visual Stories"}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-tight">
              {locale === "ne"
                ? "नयाँ फोटो कथा सिर्जना गर्नुहोस्"
                : "Create a Photo Story"}
            </h2>

            <p className="text-muted-foreground text-xs sm:text-sm font-sans mt-1">
              {locale === "ne"
                ? "सुदूरपश्चिमको प्राकृतिक सौन्दर्य, संस्कृति तथा जनजीवन समेटिएका तस्बिर कथाहरू यहाँ दर्ता गर्नुहोस्।"
                : "Publish editorial visual stories and photo essays showcasing the landscape and culture of Sudurpashchim."}
            </p>

            {/* Step Navigation Tabs */}
            <div className="flex items-center gap-2 mt-5 border-b border-border/80">
              <button
                type="button"
                onClick={() => setActiveTab("story")}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "story"
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={15} />
                <span>
                  {locale === "ne" ? "१. कथाको विवरण" : "1. Story Details"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "gallery"
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers size={15} />
                <span>
                  {locale === "ne" ? "२. फोटो ग्यालरी" : "2. Photo Gallery"}
                </span>
                {galleryItems.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-brand text-white text-[10px] font-mono font-bold">
                    {galleryItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="px-6 sm:px-8 py-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 bg-background">
            {isSuccess ? (
              <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-brand/10 border-2 border-brand flex items-center justify-center">
                  <CheckCircle2
                    size={40}
                    className="text-brand animate-bounce"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground font-headline">
                  {locale === "ne"
                    ? "फोटो कथा सफलतापूर्वक दर्ता भयो !"
                    : "Photo Story Published!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md font-sans">
                  {locale === "ne"
                    ? "तपाईंको फोटो कथा अभिलेखमा समावेश गरिएको छ। अब यो सार्वजनिक फोटो ग्यालरीमा देखिनेछ।"
                    : "Your photo story with all associated gallery images has been added to the regional digital archive."}
                </p>
                <div className="pt-2 text-xs text-brand font-bold uppercase tracking-wider">
                  {galleryItems.length}{" "}
                  {locale === "ne" ? "तस्बिरहरू समावेश" : "Photos Included"}
                </div>
              </div>
            ) : !user ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert size={48} className="text-amber-600" />
                <h3 className="text-xl font-bold text-foreground font-headline">
                  {locale === "ne"
                    ? "लगइन आवश्यक छ"
                    : "Authentication Required"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md font-sans">
                  {locale === "ne"
                    ? "फोटो कथा सिर्जना तथा प्रकाशित गर्नका लागि प्रमाणित प्रयोगकर्ता लगइन हुनु अनिवार्य छ।"
                    : "You must be signed in with a verified account to submit photo stories to Sudur Chinari."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-brand text-white px-6 py-2.5 text-sm font-bold font-sans hover:bg-brand/90 transition-colors cursor-pointer"
                >
                  {locale === "ne" ? "अहिले लगइन गर्नुहोस्" : "Sign In Now"}
                </button>
              </div>
            ) : (
              <form
                id="photostory-form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Verified Contributor Account Banner */}
                <div className="flex items-center justify-between gap-3 p-3 bg-surface border border-border border-l-[3px] border-l-brand rounded-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserCheck size={18} className="text-brand shrink-0" />
                    <div className="text-xs sm:text-sm font-sans truncate">
                      <span className="text-muted-foreground">
                        {locale === "ne" ? "प्रमाणित खाता:" : "Verified Account:"}{" "}
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

                {/* TAB 1: STORY DETAILS */}
                {activeTab === "story" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Bilingual Title Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          placeholder="e.g. Morning Mist at Khaptad Lake"
                          className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                          {locale === "ne"
                            ? "शीर्षक (नेपाली)"
                            : "Title (नेपाली)"}
                        </label>
                        <input
                          type="text"
                          value={titleNe}
                          onChange={(e) => setTitleNe(e.target.value)}
                          placeholder="जस्तै: खप्तड दहको मनमोहक बिहानी कुहिरो"
                          className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-serif-np"
                        />
                      </div>
                    </div>

                    {/* District & Photographer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                          {locale === "ne" ? "जिल्ला *" : "District *"}
                        </label>
                        <select
                          required
                          value={districtSlug}
                          onChange={(e) => setDistrictSlug(e.target.value)}
                          className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none font-sans"
                        >
                          <option value="">
                            {locale === "ne"
                              ? "— जिल्ला छान्नुहोस् —"
                              : "— Select District —"}
                          </option>
                          {districts.map((d: any) => (
                            <option key={d.id} value={d.slug}>
                              {t(d.name)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                          {locale === "ne"
                            ? "फोटोग्राफर / श्रेय *"
                            : "Photographer Credit *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={photographerName}
                          onChange={(e) => setPhotographerName(e.target.value)}
                          placeholder="e.g. Ram Bahadur Thapa"
                          className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 font-sans"
                        />
                      </div>
                    </div>

                    {/* Bilingual Descriptions */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                        {locale === "ne"
                          ? "विवरण (अंग्रेजी)"
                          : "Description (English)"}
                      </label>
                      <textarea
                        rows={3}
                        value={descriptionEn}
                        onChange={(e) => setDescriptionEn(e.target.value)}
                        placeholder="Provide the context, location details, or narrative behind these photographs..."
                        className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 resize-y font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider font-sans text-foreground mb-1.5">
                        {locale === "ne"
                          ? "विवरण (नेपाली)"
                          : "Description (नेपाली)"}
                      </label>
                      <textarea
                        rows={3}
                        value={descriptionNe}
                        onChange={(e) => setDescriptionNe(e.target.value)}
                        placeholder="तस्बिरहरूको पृष्ठभूमि, स्थान र सन्दर्भको बारेमा यहाँ लेख्नुहोस्..."
                        className="w-full bg-surface border border-border p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/40 resize-y font-serif-np"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveTab("gallery")}
                        className="inline-flex items-center gap-2 bg-surface border border-border px-4 py-2.5 text-xs font-bold font-sans text-foreground hover:border-brand transition-colors cursor-pointer"
                      >
                        <span>
                          {locale === "ne"
                            ? "अर्को: तस्बिरहरू थप्नुहोस्"
                            : "Next: Add Photos"}
                        </span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: PHOTO GALLERY IMAGES */}
                {activeTab === "gallery" && (
                  <div className="space-y-5 animate-fadeIn">
                    {/* Multi-Photo Upload Dropzone */}
                    <div className="border border-dashed border-border bg-surface/60 p-6 text-center hover:border-brand transition-colors group">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleFilesSelected}
                        className="hidden"
                      />

                      <div className="flex flex-col items-center justify-center">
                        <Upload
                          size={28}
                          className="text-muted-foreground group-hover:text-brand transition-colors mb-2"
                        />
                        <h4 className="font-bold text-sm text-foreground font-sans">
                          {locale === "ne"
                            ? "कम्प्युटरबाट तस्बिरहरू छान्नुहोस्"
                            : "Choose Photos from Your Device"}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 font-sans">
                          {locale === "ne"
                            ? "एकैपटक धेरै तस्बिरहरू छान्न सक्नुहुन्छ (PNG, JPG, WebP — अधिकतम १२MB)"
                            : "Select multiple photos at once (PNG, JPG, WebP up to 12MB each)"}
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-brand text-white px-5 py-2 text-xs font-bold font-sans hover:bg-brand/90 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus size={14} />
                            <span>
                              {locale === "ne"
                                ? "तस्बिरहरू थप्नुहोस्"
                                : "Browse Files"}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="bg-background border border-border px-3.5 py-2 text-xs font-bold font-sans text-foreground hover:border-brand transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <LinkIcon size={13} />
                            <span>
                              {locale === "ne"
                                ? "URL बाट थप्नुहोस्"
                                : "Add by URL"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* URL input collapsible */}
                      {showUrlInput && (
                        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 max-w-md mx-auto">
                          <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="flex-1 bg-background border border-border p-2 text-xs font-sans focus:outline-none focus:border-brand rounded-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddUrlImage}
                            className="bg-brand text-white px-3.5 py-2 text-xs font-bold font-sans hover:bg-brand/90 transition-colors"
                          >
                            {locale === "ne" ? "थप्नुहोस्" : "Add"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Gallery Items List */}
                    {galleryItems.length === 0 ? (
                      <div className="py-8 text-center border border-border/60 bg-surface/30">
                        <ImageIcon
                          size={32}
                          className="mx-auto text-muted-foreground/40 mb-2"
                        />
                        <p className="text-xs text-muted-foreground font-sans">
                          {locale === "ne"
                            ? "हाल कुनै फोटो संलग्न गरिएको छैन। माथिको बटनबाट फोटोहरू थप्नुहोस्।"
                            : "No photos added yet. Upload at least one photo above."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider pb-1">
                          <span>
                            {locale === "ne"
                              ? "संलग्न तस्बिरहरू"
                              : "Attached Gallery Images"}{" "}
                            ({galleryItems.length})
                          </span>
                          <span className="text-[11px] text-brand">
                            {locale === "ne"
                              ? "पहिलो फोटो कभर फोटो बन्नेछ"
                              : "1st Photo serves as Story Cover"}
                          </span>
                        </div>

                        {galleryItems.map((item, index) => (
                          <div
                            key={item.id}
                            className="border border-border bg-surface p-3.5 transition-all hover:border-brand/40"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                              {/* Thumbnail with Cover Badge */}
                              <div className="relative w-20 h-20 shrink-0 bg-black/5 border border-border overflow-hidden">
                                <img
                                  src={item.previewUrl}
                                  alt={`Gallery photo ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1 font-bold">
                                  #{index + 1}
                                </div>
                                {index === 0 && (
                                  <div className="absolute bottom-0 inset-x-0 bg-brand text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-tight">
                                    Cover
                                  </div>
                                )}
                              </div>

                              {/* Captions Inputs (English & Nepali) */}
                              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                    {locale === "ne"
                                      ? "क्याप्सन (अंग्रेजी)"
                                      : "Caption (English)"}
                                  </label>
                                  <input
                                    type="text"
                                    value={item.caption_en}
                                    onChange={(e) =>
                                      handleUpdateCaption(
                                        item.id,
                                        "caption_en",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Photo caption in English..."
                                    className="w-full bg-background border border-border p-2 text-xs font-sans focus:outline-none focus:border-brand rounded-none"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                    {locale === "ne"
                                      ? "क्याप्सन (नेपाली)"
                                      : "Caption (नेपाली)"}
                                  </label>
                                  <input
                                    type="text"
                                    value={item.caption_ne}
                                    onChange={(e) =>
                                      handleUpdateCaption(
                                        item.id,
                                        "caption_ne",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="फोटोको नेपाली क्याप्सन..."
                                    className="w-full bg-background border border-border p-2 text-xs font-serif-np focus:outline-none focus:border-brand rounded-none"
                                  />
                                </div>
                              </div>

                              {/* Actions: Reorder, Set Cover, Delete */}
                              <div className="flex sm:flex-col items-center justify-end gap-1 shrink-0 self-end sm:self-center">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCover(index)}
                                    title={
                                      locale === "ne"
                                        ? "कभर फोटो बनाउनुहोस्"
                                        : "Make Cover"
                                    }
                                    className="px-2 py-1 text-[10px] font-bold bg-background border border-border text-foreground hover:border-brand hover:text-brand transition-colors cursor-pointer"
                                  >
                                    Cover
                                  </button>
                                )}

                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => handleMoveItem(index, "up")}
                                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                    title="Move up"
                                  >
                                    <ArrowUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={index === galleryItems.length - 1}
                                    onClick={() =>
                                      handleMoveItem(index, "down")
                                    }
                                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                                    title="Move down"
                                  >
                                    <ArrowDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 text-muted-foreground hover:text-red-500 transition-colors ml-1 cursor-pointer"
                                    title="Remove"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Fixed Footer */}
          {!isSuccess && user && (
            <div className="px-6 sm:px-8 py-4 shrink-0 bg-background border-t border-border mt-auto">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground font-sans hidden sm:block">
                  {galleryItems.length > 0 ? (
                    <span>
                      {galleryItems.length}{" "}
                      {locale === "ne"
                        ? "तस्बिरहरू छानिएको छ"
                        : "photo(s) attached"}
                    </span>
                  ) : (
                    <span>
                      {locale === "ne"
                        ? "कम्तीमा १ तस्बिर आवश्यक"
                        : "At least 1 photo required"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial py-2.5 px-4 bg-surface text-foreground text-xs font-bold border border-border hover:bg-surface-tint transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {locale === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    form="photostory-form"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial py-2.5 px-6 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-xs active:translate-y-px"
                    style={{ backgroundColor: themePrimary }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>
                          {locale === "ne"
                            ? "दर्ता गर्दै..."
                            : "Publishing Story..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera size={14} />
                        <span>
                          {locale === "ne"
                            ? "फोटो कथा प्रकाशित गर्नुहोस्"
                            : "Publish Photo Story"}
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
