import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Tag,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import {
  YatayatQuickActionTrigger,
  YatayatRegisterTrigger,
  type YatayatQuickAction,
} from "./YatayatClientActions";

interface YatayatSidebarProps {
  locale: Locale;
}

interface QuickActionConfig {
  type: YatayatQuickAction;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  titleNe: string;
  titleEn: string;
  subNe: string;
  subEn: string;
  borderClass: string;
  iconBgClass: string;
}

const QUICK_ACTIONS: QuickActionConfig[] = [
  {
    type: "contacts",
    icon: Phone,
    titleNe: "सम्पर्क नम्बर",
    titleEn: "Hotline",
    subNe: "फोन गर्नुहोस्",
    subEn: "Direct Call",
    borderClass: "border-l-brand",
    iconBgClass: "bg-brand",
  },
  {
    type: "routes",
    icon: MapPin,
    titleNe: "रूट हेर्नुहोस्",
    titleEn: "Routes",
    subNe: "नक्शामा मार्ग",
    subEn: "Waypoints",
    borderClass: "border-l-brand-secondary",
    iconBgClass: "bg-brand-secondary",
  },
  {
    type: "schedule",
    icon: Clock,
    titleNe: "समयतालिका",
    titleEn: "Timetable",
    subNe: "प्रस्थान समय",
    subEn: "Timings",
    borderClass: "border-l-brand",
    iconBgClass: "bg-brand",
  },
  {
    type: "guidelines",
    icon: Tag,
    titleNe: "दिशानिर्देश",
    titleEn: "Guidelines",
    subNe: "अगुवा हेर्नुहोस्",
    subEn: "Rules & Tips",
    borderClass: "border-l-brand-secondary",
    iconBgClass: "bg-brand-secondary",
  },
];

export default function YatayatSidebar({ locale }: YatayatSidebarProps) {
  const isNe = locale === "ne";

  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-background border border-border border-t-[3px] border-t-brand rounded-none p-5 shadow-xs space-y-3.5">
        <div className="pb-2.5 border-b border-border">
          <h3 className="text-base font-bold text-foreground font-sans">
            {isNe ? "छिटो पहुँच" : "Quick Access"}
          </h3>
          <p className="text-xs sm:text-[13px] text-muted-foreground font-sans">
            {isNe ? "तलको बटनबाट सिधै सम्पर्क गर्नुहोस्" : "Tap buttons below for direct assistance"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;

            return (
              <YatayatQuickActionTrigger
                key={action.type}
                type={action.type}
                locale={locale}
                className={`p-3.5 rounded-none bg-surface border border-border border-l-[3px] ${action.borderClass} text-left hover:bg-surface-hover transition-all group cursor-pointer`}
              >
                <div
                  className={`w-8 h-8 rounded-none text-white flex items-center justify-center mb-2 shadow-2xs ${action.iconBgClass}`}
                >
                  <Icon size={15} aria-hidden="true" />
                </div>
                <div className="text-sm font-bold text-foreground leading-tight">
                  {isNe ? action.titleNe : action.titleEn}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? action.subNe : action.subEn}
                </div>
              </YatayatQuickActionTrigger>
            );
          })}
        </div>
      </div>

      <div className="rounded-none p-5 bg-surface border border-border border-t-[3px] border-t-brand-secondary shadow-xs space-y-3.5">
        <div className="pb-2 border-b border-border">
          <h3 className="text-base font-bold font-headline text-foreground leading-snug">
            {isNe ? "यातायात सञ्चालकको लागि सम्पर्क" : "For Transport Operators & Fleets"}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
          {isNe
            ? "तपाईंको सवारी साधनको विवरण यहाँ राख्न चाहनुहुन्छ? हामीलाई सम्पर्क गर्नुहोस्।"
            : "Want to feature your bus, hiace, or jeep service schedule on our public directory? Contact us."}
        </p>

        <div className="space-y-2 text-sm text-foreground font-mono bg-background p-3 border border-border rounded-none">
          <div className="flex items-center gap-2">
            <Mail size={14} aria-hidden="true" className="text-brand-secondary shrink-0" />
            <a href="mailto:info@sudurchinari.org" className="hover:underline hover:text-brand-secondary">
              info@sudurchinari.org
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} aria-hidden="true" className="text-brand-secondary shrink-0" />
            <a href="tel:+9779840000000" className="hover:underline hover:text-brand-secondary">
              +977-98400-00000
            </a>
          </div>
        </div>

        <YatayatRegisterTrigger
          locale={locale}
          className="w-full py-3 px-4 bg-brand-secondary hover:bg-brand-secondary/90 text-white font-bold text-sm sm:text-base rounded-none transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{isNe ? "विवरण दर्ता / अद्यावधिक गर्नुहोस्" : "Register / Update Details"}</span>
          <ArrowRight size={15} aria-hidden="true" />
        </YatayatRegisterTrigger>
      </div>

      <div className="bg-background border border-border border-t-[3px] border-t-brand rounded-none p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-2.5 border-b border-border">
          <ShieldCheck size={18} aria-hidden="true" className="text-brand" />
          <h3 className="text-base font-bold text-foreground font-sans">
            {isNe ? "विश्वसनीय जानकारी" : "Verified Transit Data"}
          </h3>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle2 size={14} aria-hidden="true" className="text-brand shrink-0" />
            <span>
              {isNe ? "सबै विवरण पुष्टि गरिएको" : "All service details independently verified"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={14} aria-hidden="true" className="text-brand shrink-0" />
            <span>
              {isNe
                ? "अन्तिम अपडेट मिति सहित"
                : "Updated with latest timestamp & seasonal schedules"}
            </span>
          </li>
          <li>
            <YatayatQuickActionTrigger
              type="report"
              locale={locale}
              className="text-brand hover:underline flex items-center gap-2 font-semibold text-left cursor-pointer"
            >
              <CheckCircle2 size={14} aria-hidden="true" className="text-brand shrink-0" />
              <span>
                {isNe
                  ? "गलत जानकारी रिपोर्ट गर्नुहोस्"
                  : "Report inaccurate or outdated information"}
              </span>
            </YatayatQuickActionTrigger>
          </li>
        </ul>
      </div>

      <div className="relative h-44 rounded-none overflow-hidden border border-border border-t-[3px] border-t-brand shadow-xs group">
        <Image
          src="/images/yatayat/promo.jpg"
          alt={isNe ? "सुदूरपश्चिम हिमाली यात्रा" : "Sudurpashchim Mountain Travel"}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 text-center">
          <h4 className="text-white font-headline font-black text-xl sm:text-2xl drop-shadow-md">
            हाम्रो यात्रा, सामुन्ने पहिचान !
          </h4>
          <p className="text-xs text-white/90 font-mono tracking-widest uppercase mt-1">
            Sudur Chinari • Digital Transport
          </p>
        </div>
      </div>
    </aside>
  );
}
