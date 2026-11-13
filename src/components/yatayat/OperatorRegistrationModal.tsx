"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  X,
  Send,
  CheckCircle2,
  Bus,
  Car,
  AlertCircle,
  Loader2,
  UploadCloud,
  UserCheck,
  LogIn,
} from "lucide-react";
import FTModal from "@/components/common/FTModal";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { newsApi } from "@/lib/api";
import { revalidateCacheTagsAction } from "@/app/actions/cache";

interface OperatorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

export default function OperatorRegistrationModal({
  isOpen,
  onClose,
  locale = "ne",
}: OperatorRegistrationModalProps) {
  const isNe = locale === "ne";
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [vehicleName, setVehicleName] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [vehicleType, setVehicleType] = useState<"bus" | "hiace" | "jeep">("bus");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeStops, setRouteStops] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [fare, setFare] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const userDisplayName =
    (user as any)?.full_name ||
    (user as any)?.name ||
    user?.username ||
    user?.email ||
    "";

  // Pre-fill operator name and phone from verified user profile
  useEffect(() => {
    if (user) {
      if (!operatorName && userDisplayName) {
        setOperatorName(userDisplayName);
      }
      if (!phone) {
        const userPhone = (user as any)?.phone || (user as any)?.phone_number || "";
        if (userPhone) setPhone(userPhone);
      }
    }
  }, [user, userDisplayName, operatorName, phone]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(isNe ? "कृपया तस्बिर मात्र चयन गर्नुहोस्।" : "Please select an image file only.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert(isNe ? "तस्बिरको आकार ८ MB भन्दा कम हुनुपर्छ।" : "Image size must be less than 8MB.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
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
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", vehicleName);
      formData.append("service_name", vehicleName);
      formData.append("vehicle_name", vehicleName);
      if (operatorName) {
        formData.append("operator_name", operatorName);
      }
      if (subTitle) formData.append("sub_title", subTitle);
      formData.append("service_type", vehicleType);
      formData.append("vehicle_type", vehicleType);

      formData.append("origin_name", origin);
      formData.append("origin", origin);
      formData.append("destination_name", destination);
      formData.append("destination", destination);

      if (routeStops) {
        formData.append("route_stops", routeStops);
        formData.append("route_waypoints", routeStops);
      }

      if (departureTime) formData.append("departure_time", departureTime);
      if (fare) {
        formData.append("estimated_fare", fare);
        formData.append("fare", fare);
      }
      if (totalSeats) formData.append("total_seats", totalSeats);

      formData.append("contact_phone", phone);
      formData.append("phone", phone);

      let combinedNotes = notes;
      if (operatorName && operatorName !== vehicleName) {
        combinedNotes = `सञ्चालक / Operator: ${operatorName}${notes ? ` | ${notes}` : ""}`;
      }
      if (combinedNotes) formData.append("notes", combinedNotes);
      if (selectedFile) formData.append("image", selectedFile);

      await newsApi.postYatayatRegistrationClient(formData);
      await revalidateCacheTagsAction([
        "yatayat",
        "yatayat-ne",
        "yatayat-en",
      ]).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["yatayat"] });
      router.refresh();

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setVehicleName("");
        setOperatorName("");
        setSubTitle("");
        setOrigin("");
        setDestination("");
        setRouteStops("");
        setDepartureTime("");
        setFare("");
        setTotalSeats("");
        setNotes("");
        handleRemoveFile();
      }, 2500);
    } catch (err: any) {
      console.error("Yatayat registration submission error:", err);
      setErrorMessage(
        isNe
          ? "विवरण पठाउन प्राविधिक समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।"
          : "An error occurred while submitting details. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FTModal
      onClose={onClose}
      variant="accent-top"
      accentColor="var(--brand)"
      maxWidth="max-w-2xl"
      maxHeight="max-h-[94vh]"
      closeOnBackdrop={false}
      paddingClassName="p-4 sm:p-6"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      overlayClassName="text-left"
      ariaLabel={
        isNe
          ? "यातायात सेवा दर्ता वा अद्यावधिक गर्नुहोस्"
          : "Register or Update Transport Service"
      }
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1.5 z-20 cursor-pointer"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Fixed Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-4 shrink-0 bg-background z-10 border-b border-border/40">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[11px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
            {isNe ? "डिजिटल यातायात निर्देशिका" : "Digital Transit Directory"}
          </span>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-mono px-2 py-0.5 bg-surface border border-border text-foreground font-semibold">
            <Bus size={11} className="text-brand shrink-0" />
            <span>{isNe ? "रुट तथा समयतालिका" : "Routes & Timetables"}</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground leading-tight">
          {isNe
            ? "यातायात सेवा दर्ता वा अद्यावधिक गर्नुहोस्"
            : "Register or Update Transport Service"}
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mt-1 font-sans">
          {isNe
            ? "सुदूर चिनारी यातायात डिजिटल निर्देशिकामा नयाँ रुट, सवारी वा समयतालिका थप्नुहोस्।"
            : "Submit your transport service to Sudur Chinari Directory"}
        </p>
      </div>

      {/* Scrollable Body */}
      <div className="px-6 sm:px-8 py-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
        {submitted ? (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-3.5">
            <CheckCircle2 size={56} className="text-brand animate-bounce" />
            <h3 className="text-2xl font-bold text-foreground font-headline">
              {isNe ? "सफलतापूर्वक पेश भयो!" : "Successfully Submitted!"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md font-sans leading-relaxed">
              {isNe
                ? "तपाईंको यातायात विवरण प्राप्त भयो। सम्पादकीय टोलीले प्रमाणिकरण गरेपछि यो विवरण पोर्टलमा अद्यावधिक हुनेछ।"
                : "Your transport service details have been submitted. Once verified by our editorial desk, it will be published to the public directory."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Verified Contributor Account Banner / Auth Prompt */}
            {user ? (
              <div className="flex items-center justify-between gap-3 p-3 bg-surface border border-border border-l-[3px] border-l-brand rounded-none">
                <div className="flex items-center gap-2.5">
                  <UserCheck size={18} className="text-brand shrink-0" />
                  <div className="text-xs sm:text-sm font-sans">
                    <span className="text-muted-foreground">
                      {isNe ? "प्रमाणित खाता:" : "Verified Account:"}{" "}
                    </span>
                    <span className="font-bold text-foreground">
                      {userDisplayName}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-brand/10 text-brand border border-brand/20 font-semibold shrink-0">
                  {isNe ? "प्रमाणित प्रेषक" : "Verified Sender"}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 p-3 bg-brand/5 border border-brand/20 border-l-[3px] border-l-brand rounded-none flex-wrap">
                <div className="text-xs sm:text-sm font-sans text-foreground">
                  {isNe
                    ? "यातायात विवरण पेश गर्नका लागि लगइन हुन अनिवार्य छ।"
                    : "Please sign in to your account to submit transport service details."}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  <LogIn size={13} />
                  <span>{isNe ? "लगइन / दर्ता गर्नुहोस्" : "Sign In / Register"}</span>
                </button>
              </div>
            )}

            {/* Service Name & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "सवारी / कम्पनीको नाम *" : "Service / Company Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder={isNe ? "जस्तै: अछाम सुपर डिलक्स" : "e.g. Achham Super Deluxe"}
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "उपशीर्षक / सुविधा ट्याग" : "Service Subtitle / Fleet Tag"}
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder={isNe ? "जस्तै: सुपर डिलक्स एसी बस" : "e.g. Super Deluxe AC Coach"}
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>
            </div>

            {/* Vehicle Type Picker */}
            <div>
              <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                {isNe ? "सवारी साधनको प्रकार *" : "Vehicle Type *"}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "bus", icon: Bus, labelNe: "बस सेवा", labelEn: "Bus Service" },
                  { id: "hiace", icon: Bus, labelNe: "हाइस सेवा", labelEn: "Hiace Service" },
                  { id: "jeep", icon: Car, labelNe: "जीप सेवा", labelEn: "Jeep Service" },
                ].map((type) => {
                  const active = vehicleType === type.id;
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setVehicleType(type.id as any)}
                      className={`py-3 px-3.5 border text-left transition-all cursor-pointer rounded-none flex items-center justify-center sm:justify-start gap-2 ${
                        active
                          ? "border-brand bg-brand/5 border-l-[3px] border-l-brand"
                          : "border-border bg-surface hover:bg-surface-hover"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={active ? "text-brand" : "text-muted-foreground"}
                      />
                      <span className="text-sm font-bold text-foreground">
                        {isNe ? type.labelNe : type.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "प्रस्थान स्थान *" : "Departure Place *"}
                </label>
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder={isNe ? "जस्तै: साँफेबगर" : "e.g. Sanfebagar"}
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "गन्तव्य स्थान *" : "Destination Place *"}
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={isNe ? "जस्तै: धनगढी" : "e.g. Dhangadhi"}
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>
            </div>

            {/* Route Waypoints */}
            <div>
              <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                {isNe
                  ? "मुख्य स्टपेजहरू (अल्पविराम छुट्याउनुहोस्)"
                  : "Waypoints (Comma separated)"}
              </label>
              <input
                type="text"
                value={routeStops}
                onChange={(e) => setRouteStops(e.target.value)}
                placeholder={isNe ? "बयलपाटा, दिपायल, अत्तरिया..." : "Bayalpata, Dipayal, Attariya..."}
                className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
              />
            </div>

            {/* Departure Time, Fare, Seats, Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "प्रस्थान समय" : "Departure Time"}
                </label>
                <input
                  type="text"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  placeholder={isNe ? "बिहान ६:०० बजे" : "6:00 AM"}
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "भाडादर" : "Fare"}
                </label>
                <input
                  type="text"
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  placeholder={isNe ? "रु. १,२००" : "Rs. 1,200"}
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "सिट सङ्ख्या" : "Seats"}
                </label>
                <input
                  type="text"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                  placeholder="36"
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                  {isNe ? "सम्पर्क नम्बर *" : "Contact Phone *"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98xxxxxxxx"
                  className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
                />
              </div>
            </div>

            {/* Operator / Submitter Name (Editable) */}
            <div>
              <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                {isNe ? "सञ्चालक / सम्पर्क व्यक्तिको नाम" : "Operator / Contact Person Name"}
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder={isNe ? "जस्तै: राम बहादुर सिंह" : "e.g. Ram Bahadur Singh"}
                className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
              />
              {user && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-1 font-sans">
                  <CheckCircle2 size={13} className="shrink-0 text-brand" />
                  <span>
                    {isNe ? "दाखिलकर्ता खाता:" : "Submitted via:"}{" "}
                    <span className="text-foreground font-semibold">
                      {user.username || user.email}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Vehicle Photo Upload (Matching ProductContributionModal) */}
            <div>
              <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                {isNe ? "सवारी साधनको तस्बिर (ऐच्छिक)" : "Vehicle Photo (Optional)"}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="yatayat-vehicle-image-upload"
              />

              {previewUrl ? (
                <div className="relative border border-border bg-surface p-2.5 flex items-center gap-3">
                  <div className="relative w-16 h-16 shrink-0 bg-background border border-border overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Vehicle preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-medium text-foreground truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-muted-foreground font-mono">
                      {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 hover:bg-background text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="yatayat-vehicle-image-upload"
                  className="border border-dashed border-border hover:border-brand bg-surface/50 hover:bg-surface p-4 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <UploadCloud size={22} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">
                    {isNe
                      ? "सवारीको तस्बिर छान्नुहोस् वा यहाँ ड्र्याग गर्नुहोस्"
                      : "Click to upload vehicle photo or drag & drop"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    PNG, JPG, WEBP (Max 8MB)
                  </span>
                </label>
              )}
            </div>

            {/* Amenities & Notes */}
            <div>
              <label className="block text-xs sm:text-sm font-bold font-sans text-foreground mb-1.5">
                {isNe
                  ? "सुविधा तथा थप विवरण (ऐच्छिक)"
                  : "Amenities & Operational Notes (Optional)"}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isNe
                    ? "जस्तै: एयर कन्डिसनर (AC), निःशुल्क वाइफाइ, मिनरल वाटर, आरामदायी सिट..."
                    : "e.g. AC Coach, pushback seats, free Wi-Fi, mineral water, mobile charging..."
                }
                className="w-full bg-surface border border-border p-2.5 sm:p-3 text-sm focus:outline-none focus:border-brand resize-none transition-colors rounded-none placeholder:text-muted-foreground/50 font-sans"
              />
            </div>

            {/* Inaccurate Submission Warning Notice */}
            <div className="flex items-start gap-2.5 p-3.5 bg-surface rounded-none text-xs sm:text-sm text-muted-foreground border border-border border-l-[3px] border-l-brand">
              <AlertCircle size={17} className="text-brand shrink-0 mt-0.5" />
              <span className="font-sans leading-relaxed">
                <strong className="text-foreground">{isNe ? "नोट: " : "Note: "}</strong>
                {isNe
                  ? "गलत वा अपूर्ण जानकारी दिइएमा विवरण खारेज गरिनेछ। यात्रुहरूको सुविधा र विश्वसनीयताका लागि केवल आधिकारिक र प्रमाणित अपरेटर विवरण मात्र पठाउनुहोला।"
                  : "Inaccurate submissions will be revoked. Please provide authentic and verifiable operator details for passenger safety and schedule accuracy."}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-sans">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 border border-border text-foreground text-sm font-semibold rounded-none hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
              >
                {isNe ? "रद्द गर्नुहोस्" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-brand text-white text-sm font-bold rounded-none hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{isNe ? "पेश गर्दै..." : "Submitting..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isNe ? "विवरण पेश गर्नुहोस्" : "Submit Details"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </FTModal>
  );
}
