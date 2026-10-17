import { Clock, MapPin, ShieldCheck } from "lucide-react";
import { formatNumber } from "@/lib/i18n/format";
import FTBreadcrumb from "@/components/common/FTBreadcrumb";
import type { Locale } from "@/lib/i18n/config";
import { SUDURPASHCHIM_DISTRICTS_LIST } from "@/data/yatayatData";
import YatayatHeroCarousel, {
  type YatayatHeroSlide,
} from "./YatayatHeroCarousel";

interface YatayatHeroProps {
  locale: Locale;
}

export default function YatayatHero({ locale }: YatayatHeroProps) {
  const isNe = locale === "ne";
  const districtCount = SUDURPASHCHIM_DISTRICTS_LIST.length;

  const slides: YatayatHeroSlide[] = [
    {
      src: "/images/yatayat/hero_bus.jpg",
      alt: isNe ? "सुदूरपश्चिम यातायात बस" : "Sudurpashchim Yatayat Bus",
      caption: isNe ? "यात्रा सुरक्षित, गन्तव्य सुनिश्चित" : "Safe Journey, Guaranteed Destination",
    },
    {
      src: "/images/yatayat/bus_dolphin.jpg",
      alt: isNe ? "लामो रुटको बस" : "Long-route bus service",
      caption: isNe ? "प्रदेशव्यापी लामो रुटका बस सेवा" : "Long-route bus services across the province",
    },
    {
      src: "/images/yatayat/hiace_van.jpg",
      alt: isNe ? "हाइस भ्यान सेवा" : "Hiace van service",
      caption: isNe ? "छिटो र आरामदायक हाइस यात्रा" : "Fast & comfortable hiace express rides",
    },
    {
      src: "/images/yatayat/jeep_bolero.jpg",
      alt: isNe ? "पहाडी मार्गमा जीप" : "Jeep on a hill route",
      caption: isNe ? "पहाडी गाउँ जोड्ने जीप मार्ग" : "Jeep routes connecting remote hills & villages",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: isNe ? "दैनिक प्रस्थान" : "Daily Departures",
      subtitle: isNe ? "बस, हाइस र जीप — हरेक दिन" : "Buses, hiace & jeeps every day",
      tileClass: "bg-gradient-to-br from-brand to-brand-dark",
    },
    {
      icon: MapPin,
      title: isNe
        ? `${formatNumber(locale, districtCount)} जिल्ला जोडिएको`
        : `${formatNumber(locale, districtCount)} Districts Covered`,
      subtitle: isNe ? "प्रदेशव्यापी मार्ग सञ्जाल" : "Province-wide route network",
      tileClass: "bg-gradient-to-br from-brand-secondary to-brand-secondary/70",
    },
    {
      icon: ShieldCheck,
      title: isNe ? "प्रमाणित जानकारी" : "Verified Information",
      subtitle: isNe ? "भाडा र सम्पर्क नियमित अद्यावधिक" : "Fares & contacts regularly updated",
      tileClass: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
  ];

  return (
    <>
      <FTBreadcrumb
        locale={locale}
        items={[{ name: isNe ? "सुदूर यातायात" : "Sudur Yatayat" }]}
      />

      <div className="border-b border-border bg-background">
        <div className="container-editorial py-8 sm:py-10 pt-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="lg:w-7/12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-foreground tracking-tight leading-tight">
                {isNe ? "सुदूर यातायात" : "Sudur Yatayat"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-sans mt-2 max-w-2xl leading-relaxed">
                {isNe
                  ? "सुदूरपश्चिम प्रदेशका बस, हाइस तथा जीप सेवाहरूको रूट, प्रस्थान समय, सम्पर्क नम्बर, भाडादर र यातायातसम्बन्धी आवश्यक जानकारी एउटै स्थानमा खोज्नुहोस्।"
                  : "Find routes, departure timings, contact numbers, fares, and essential transit information for buses, hiace vans, and jeeps across Sudurpashchim Province."}
              </p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4 lg:gap-x-8">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 shrink-0 flex items-center justify-center text-white shadow-md ${feature.tileClass}`}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-foreground font-sans">
                          {feature.title}
                        </span>
                        <span className="block text-xs text-muted-foreground font-sans">
                          {feature.subtitle}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-4 shrink-0 self-stretch md:self-auto lg:w-5/12">
              <YatayatHeroCarousel slides={slides} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
