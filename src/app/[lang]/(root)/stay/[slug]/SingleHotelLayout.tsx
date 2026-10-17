"use client";

import { useState } from "react";
import {
  MapPin,
  BedDouble,
  Building,
  Utensils,
  Image as ImageIcon,
  Contact,
  Coffee,
  Compass,
} from "lucide-react";
import type { Hotel } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import HotelHero from "@/components/stay/HotelHero";
import HotelOverview from "@/components/stay/HotelOverview";
import HotelRooms from "@/components/stay/HotelRooms";
import HotelDining from "@/components/stay/HotelDining";
import HotelGallery from "@/components/stay/HotelGallery";
import HotelLocation from "@/components/stay/HotelLocation";
import HotelStory from "@/components/stay/HotelStory";
import HotelSidebar from "@/components/stay/HotelSidebar";

interface Props {
  hotel: Hotel;
}

export default function SingleHotelLayout({ hotel }: Props) {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: isEn ? "Overview" : "अवलोकन",
      icon: <Building size={16} />,
    },
    {
      id: "rooms",
      label: isEn ? "Rooms" : "कोठाहरू",
      icon: <BedDouble size={16} />,
    },
    {
      id: "facilities",
      label: isEn ? "Facilities" : "सुविधाहरू",
      icon: <Coffee size={16} />,
    },
    {
      id: "dining",
      label: isEn ? "Dining" : "भोजन",
      icon: <Utensils size={16} />,
    },
    {
      id: "gallery",
      label: isEn ? "Gallery" : "ग्यालरी",
      icon: <ImageIcon size={16} />,
    },
    {
      id: "location",
      label: isEn ? "Location" : "स्थान",
      icon: <MapPin size={16} />,
    },
    {
      id: "nearby",
      label: isEn ? "Nearby Places" : "नजिकका ठाउँहरू",
      icon: <Compass size={16} />,
    },
    {
      id: "contact",
      label: isEn ? "Contact" : "सम्पर्क",
      icon: <Contact size={16} />,
    },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <HotelHero hotel={hotel} isEn={isEn} t={t} scrollToSection={scrollToSection} />


      {/* Sticky Navigation Tabs */}
      <div className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
        <div className="container-editorial">
          <nav className="flex items-center justify-start xl:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-6 lg:gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`py-4 px-2 sm:px-3 text-sm font-bold border-b-[3px] whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="container-editorial py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-16">
          <HotelOverview hotel={hotel} isEn={isEn} t={t} />
          <HotelRooms hotel={hotel} isEn={isEn} t={t} />
          <HotelDining isEn={isEn} />
          <HotelGallery hotel={hotel} isEn={isEn} t={t} />
          <HotelLocation hotel={hotel} isEn={isEn} t={t} />
          <HotelStory hotel={hotel} isEn={isEn} t={t} />
        </div>

        <div className="space-y-8 lg:sticky lg:top-32 lg:self-start">
          <HotelSidebar hotel={hotel} isEn={isEn} t={t} />
        </div>
      </main>
    </div>
  );
}
