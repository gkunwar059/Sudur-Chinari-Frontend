"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import FTModal from "@/components/common/FTModal";
import { useQuery } from "@tanstack/react-query";
import { newsApi } from "@/lib/api";
import { CheckCircle2, Loader2, UploadCloud, X, MapPin, ImageIcon } from "lucide-react";

interface ProductContributionModalProps {
  themePrimary?: string;
  buttonClassName?: string;
  trigger?: React.ReactNode;
  defaultDistrict?: string;
}

export default function ProductContributionModal({
  themePrimary = "var(--brand)",
  buttonClassName = "bg-brand text-white font-bold px-6 py-2.5 text-sm hover:brightness-110 transition-all rounded-none flex items-center gap-2 border border-brand w-max shadow-sm cursor-pointer",
  trigger,
  defaultDistrict,
}: ProductContributionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t, locale } = useLanguage();
  const { user } = useAuth();

  const [districtId, setDistrictId] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDisplayName =
    (user as any)?.full_name ||
    (user as any)?.name ||
    user?.username ||
    user?.email ||
    "";

  // Pre-fill initial name from verified user if not already set
  useEffect(() => {
    if (user && userDisplayName && !farmerName) {
      setFarmerName(userDisplayName);
    }
  }, [user, userDisplayName, farmerName]);

  const { data: districtsResponse } = useQuery({
    queryKey: ['districts', locale],
    queryFn: () => newsApi.getDistrictsClient(locale as any),
  });
  const districts = districtsResponse?.results || [];

  // Match default district when provided
  useEffect(() => {
    if (defaultDistrict && districts.length > 0) {
      const match = districts.find(
        (d: any) =>
          String(d.slug).toLowerCase() === defaultDistrict.toLowerCase() ||
          String(d.id) === defaultDistrict
      );
      if (match) {
        setDistrictId(String(match.id));
      }
    }
  }, [defaultDistrict, districts]);

  const { data: categoriesResponse } = useQuery({
    queryKey: ['product-categories', locale],
    queryFn: () => newsApi.getProductCategoriesServer(locale as any),
  });
  const categories = categoriesResponse?.results || [];

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

  const handleOpenModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(locale === "ne" ? "फोटो १० MB भन्दा सानो हुनुपर्छ।" : "Image must be under 10MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("product_name", productName);
      formData.append("category_slug", categorySlug);
      if (districtId) {
        formData.append("district", districtId);
      }
      formData.append("description", description);
      formData.append("farmer_name", farmerName || userDisplayName || "Verified Contributor");
      formData.append("contact_phone", contactPhone);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await newsApi.postProductContributionClient(formData);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setProductName("");
        setDescription("");
        setContactPhone("");
        handleRemoveFile();
      }, 2500);
    } catch (err) {
      console.error("Failed to submit product contribution:", err);
      alert(locale === "ne" ? "पेश गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।" : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeDistrictObj = districts.find((d: any) => String(d.id) === String(districtId));

  return (
    <>
      {trigger ? (
        <div onClick={handleOpenModal} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button 
          type="button"
          onClick={handleOpenModal}
          className={buttonClassName}
        >
          <span>{locale === "ne" ? "आफ्नो उत्पादन थप्नुहोस्" : "Share your product"}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}

      {/* Auth Modal intercepted if not logged in */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsOpen(true);
        }}
      />

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
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1 z-20 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Fixed Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 shrink-0 bg-background z-10 border-b border-border/40">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                {locale === "ne" ? "डिजिटल कृषि चिनारी" : "Digital Agri-Identity"}
              </span>
              {activeDistrictObj && (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-mono px-2 py-0.5 bg-surface border border-border text-foreground font-semibold">
                  <MapPin size={11} className="text-brand shrink-0" />
                  <span>{t(activeDistrictObj.name)}</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-tight">
              {locale === "ne"
                ? "तपाईंको उत्पादन साझा गर्नुहोस्"
                : "Share Your Product"}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mt-1 font-sans">
              {locale === "ne"
                ? "सुदूरपश्चिमका किसान तथा स्थानीय उद्यमीको उत्पादनलाई प्रवर्द्धन गर्न विवरण पठाउनुहोस्।"
                : "Send us information about your regional product or local agricultural produce to reach consumers."}
            </p>
          </div>

          {/* Scrollable Body */}
          <div className="px-6 sm:px-8 py-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 size={52} className="text-brand animate-bounce" />
                <h3 className="text-xl font-bold text-foreground font-headline">
                  {locale === "ne" ? "सफलतापूर्वक पठाइयो!" : "Successfully Submitted!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm font-sans">
                  {locale === "ne"
                    ? "तपाईंको उत्पादन जानकारी प्राप्त भयो। सम्पादकीय टोलीले प्रमाणीकरण गरेपछि यो पोर्टलमा देखिनेछ।"
                    : "Your product info has been submitted. It will appear on the portal after editorial verification."}
                </p>
              </div>
            ) : (
              <form
                id="product-form"
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {/* District Select */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "जिल्ला *" : "District *"}
                  </label>
                  <select
                    required
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none font-sans"
                  >
                    <option value="">
                      {locale === "ne" ? "जिल्ला छान्नुहोस्" : "Select District..."}
                    </option>
                    {districts.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {t(d.name)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Category */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "उत्पादनको प्रकार *" : "Product Category *"}
                  </label>
                  <select
                    required
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none appearance-none font-sans"
                  >
                    <option value="">
                      {locale === "ne" ? "छान्नुहोस्" : "Choose..."}
                    </option>
                    {categories.length > 0 ? (
                      categories.map((c: any) => (
                        <option key={c.id} value={c.slug}>
                          {c.icon ? `${c.icon} ` : ""}{t(c.name)}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="dairy">{locale === "ne" ? "दुग्धजन्य" : "Dairy"}</option>
                        <option value="grains">{locale === "ne" ? "अन्न/धान्य" : "Grains"}</option>
                        <option value="fruits">{locale === "ne" ? "फलफूल" : "Fruits"}</option>
                        <option value="spices">{locale === "ne" ? "मसला/जडीबुटी" : "Spices"}</option>
                        <option value="others">{locale === "ne" ? "अन्य" : "Others"}</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "उत्पादनको नाम *" : "Product Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                    placeholder={
                      locale === "ne"
                        ? "तपाईंको उत्पादनको नाम (जस्तै: अछामी लोकल घिउ, बाजुराको स्याउ)"
                        : "Name of your product (e.g. Achhami Ghee, Bajura Apples)"
                    }
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "उत्पादनको विवरण *" : "Product Description *"}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand resize-none transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                    placeholder={
                      locale === "ne"
                        ? "उत्पादनको विशेषता, गुणस्तर, उत्पादन हुने सिजन र उपलब्ध मात्रा लेख्नुहोस्..."
                        : "Write details about product features, quality, seasonality, and quantity..."
                    }
                  />
                </div>

                {/* Image Upload Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                    {locale === "ne" ? "उत्पादनको फोटो (ऐच्छिक)" : "Product Photo (Optional)"}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="product-image-upload"
                  />

                  {previewUrl ? (
                    <div className="relative border border-border bg-surface p-2.5 flex items-center gap-3">
                      <div className="relative w-16 h-16 shrink-0 bg-background border border-border overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-medium text-foreground truncate">
                          {selectedFile?.name}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 hover:bg-background text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="product-image-upload"
                      className="border border-dashed border-border hover:border-brand bg-surface/40 hover:bg-surface/80 p-4 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <UploadCloud size={20} className="text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">
                        {locale === "ne" ? "फोटो छान्नुहोस् वा ड्र्याग गर्नुहोस्" : "Click to upload product image"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        PNG, JPG, WEBP (Max 10MB)
                      </span>
                    </label>
                  )}
                </div>

                {/* Grid for Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
                  {/* Farmer / Business Name (Editable) */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                      {locale === "ne" ? "किसान/व्यवसायीको नाम *" : "Farmer/Business Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                      placeholder={locale === "ne" ? "किसान वा फर्म/व्यवसायको नाम" : "Farmer or Farm/Business name"}
                    />
                    {user && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-1 font-sans">
                        <CheckCircle2 size={13} className="shrink-0 text-brand" />
                        <span>
                          {locale === "ne" ? "दाखिलकर्ता खाता:" : "Submitted via:"}{" "}
                          <span className="text-foreground font-semibold">{user.username || user.email}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                      {locale === "ne" ? "सम्पर्क नम्बर *" : "Contact Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Fixed Footer */}
          {!submitted && (
            <div className="px-6 sm:px-8 py-4 shrink-0 bg-background z-10 border-t border-border">
              <button
                form="product-form"
                type="submit"
                disabled={submitting}
                className="w-full py-3 text-white font-bold text-sm sm:text-base hover:brightness-110 transition-all cursor-pointer shadow-sm rounded-none flex items-center justify-center gap-2"
                style={{ backgroundColor: themePrimary }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                <span>{locale === "ne" ? "उत्पादन दर्ता गर्नुहोस्" : "Submit Product"}</span>
              </button>
            </div>
          )}
        </FTModal>
      )}
    </>
  );
}
