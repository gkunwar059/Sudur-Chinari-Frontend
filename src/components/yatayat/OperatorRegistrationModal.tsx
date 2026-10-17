"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, Bus, AlertCircle } from "lucide-react";
import FTModal from "@/components/common/FTModal";

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
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("bus");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeStops, setRouteStops] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [fare, setFare] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <FTModal
      onClose={onClose}
      maxWidth="max-w-xl"
      maxHeight="max-h-[90vh]"
      closeOnBackdrop={false}
      ariaLabel={
        locale === "ne"
          ? "यातायात विवरण दर्ता / अद्यावधिक"
          : "Register or Update Transport Service"
      }
    >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-brand-secondary/10 text-brand-secondary rounded-none">
              <Bus size={22} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-headline leading-tight">
                {locale === "ne"
                  ? "यातायात विवरण दर्ता / अद्यावधिक"
                  : "Register or Update Transport Service"}
              </h2>
              <p className="text-sm text-muted-foreground font-sans mt-0.5">
                {locale === "ne"
                  ? "आफ्नो सवारी साधनको विवरण सुदूर चिनारीमा समावेश गर्नुहोस्"
                  : "Submit your transport service to Sudur Chinari Directory"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-none hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 size={52} className="text-brand animate-bounce" />
              <h3 className="text-xl font-bold text-foreground font-headline">
                {locale === "ne" ? "सफलतापूर्वक पठाइयो !" : "Successfully Submitted!"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-sm font-sans">
                {locale === "ne"
                  ? "तपाईंको अनुरोध प्राप्त भयो। सम्पादकीय टोलीले प्रमाणिकरण गरेपछि यो विवरण पोर्टलमा अद्यावधिक गरिनेछ।"
                  : "Your submission has been received. After verification by our editorial desk, it will be published."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "सवारी / कम्पनीको नाम *" : "Service / Company Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    placeholder={locale === "ne" ? "जस्तै: अछाम सुपर डिलक्स" : "e.g. Achham Super Deluxe"}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "सवारीको प्रकार *" : "Vehicle Type *"}
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  >
                    <option value="bus">{locale === "ne" ? "बस सेवा (Bus)" : "Bus Service"}</option>
                    <option value="hiace">{locale === "ne" ? "हाइस सेवा (Hiace)" : "Hiace Service"}</option>
                    <option value="jeep">{locale === "ne" ? "जीप सेवा (Jeep)" : "Jeep Service"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "प्रस्थान स्थान *" : "Departure Place *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder={locale === "ne" ? "जस्तै: साँफेबगर" : "e.g. Sanfebagar"}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "गन्तव्य स्थान *" : "Destination Place *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={locale === "ne" ? "जस्तै: धनगढी" : "e.g. Dhangadhi"}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                  {locale === "ne" ? "मुख्य स्टपेजहरू (अल्पविराम छुट्याउनुहोस्)" : "Waypoints (Comma separated)"}
                </label>
                <input
                  type="text"
                  value={routeStops}
                  onChange={(e) => setRouteStops(e.target.value)}
                  placeholder={locale === "ne" ? "बयलपाटा, दिपायल, अत्तरिया..." : "Bayalpata, Dipayal, Attariya..."}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "प्रस्थान समय" : "Departure Time"}
                  </label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder={locale === "ne" ? "बिहान ६:०० बजे" : "6:00 AM"}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "भाडादर" : "Fare"}
                  </label>
                  <input
                    type="text"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                    placeholder={locale === "ne" ? "रु. १,२००" : "Rs. 1,200"}
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5 font-sans">
                    {locale === "ne" ? "सम्पर्क नम्बर *" : "Contact Phone *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98xxxxxxxx"
                    className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-border bg-surface rounded-none focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 bg-surface rounded-none text-xs sm:text-sm text-muted-foreground border border-border border-l-[3px] border-l-brand-secondary">
                <AlertCircle size={16} className="text-brand-secondary shrink-0 mt-0.5" />
                <span className="font-sans">
                  {locale === "ne"
                    ? "नोट: गलत जानकारी दिइएमा विवरण तुरुन्त हटाइनेछ। यात्रुहरूको सुविधाका लागि केवल आधिकारिक जानकारी मात्र पठाउनुहोला।"
                    : "Note: Inaccurate submissions will be revoked. Please provide authentic and verifiable operator details."}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-border text-foreground text-sm font-semibold rounded-none hover:bg-surface transition-colors cursor-pointer"
                >
                  {locale === "ne" ? "रद्द गर्नुहोस्" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand text-white text-sm font-bold rounded-none hover:bg-brand-dark transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send size={15} />
                  <span>{locale === "ne" ? "विवरण पठाउनुहोस्" : "Submit Details"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </FTModal>
  );
}
