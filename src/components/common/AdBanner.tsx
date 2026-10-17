import Image from "next/image";
import Link from "next/link";

export type AdPlacement =
  | "top-leaderboard"
  | "billboard-mid"
  | "sidebar"
  | "in-article"
  | "bottom-strip";

interface AdItem {
  id: string;
  image: string;
  alt: string;
  href: string;
  containerClass: string;
}

// Authentic commercial advertising banners for Nepal / Sudurpashchim
const PLACEMENT_ADS: Record<AdPlacement, AdItem> = {
  "top-leaderboard": {
    id: "top-telecom",
    image: "/images/ads/telecom_5g_banner.jpg",
    alt: "Nepal Telecom 5G Network - Experience the Future Now",
    href: "https://ntc.net.np",
    containerClass: "h-20 sm:h-24 md:h-28 max-h-[118px]",
  },
  "billboard-mid": {
    id: "mid-tourism",
    image: "/images/ads/tourism_banner.jpg",
    alt: "Visit Khaptad & Sudurpashchim Nepal 2026 - Discover the Unexplored",
    href: "/category/tourism",
    containerClass: "h-24 sm:h-28 md:h-32 max-h-[135px]",
  },
  sidebar: {
    id: "sidebar-bank",
    image: "/images/ads/bank_sidebar_ad.jpg",
    alt: "Rastriya Banijya Bank - Sudurpashchim Agri & Business Loans",
    href: "/category/economy",
    containerClass: "aspect-square max-w-[320px] mx-auto",
  },
  "in-article": {
    id: "article-edu",
    image: "/images/ads/university_banner.jpg",
    alt: "Far-Western University Admissions Open 2026",
    href: "/category/education",
    containerClass: "h-20 sm:h-24 md:h-28 max-h-[115px]",
  },
  "bottom-strip": {
    id: "bottom-edu",
    image: "/images/ads/university_banner.jpg",
    alt: "Far-Western University - Excellence in Higher Education",
    href: "/category/education",
    containerClass: "h-20 sm:h-24 md:h-28 max-h-[115px]",
  },
};

export interface AdBannerProps {
  placement?: AdPlacement;
  className?: string;
  customHref?: string;
  customImage?: string;
  customAlt?: string;
}

export default function AdBanner({
  placement = "billboard-mid",
  className = "",
  customHref,
  customImage,
  customAlt,
}: AdBannerProps) {
  const ad = PLACEMENT_ADS[placement] || PLACEMENT_ADS["billboard-mid"];
  const href = customHref || ad.href;
  const image = customImage || ad.image;
  const alt = customAlt || ad.alt;

  return (
    <div className={`w-full my-2.5 sm:my-3.5 ${className}`}>
      {/* Subtle Ad label */}
      <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground tracking-normal px-1 mb-1">
        <span>विज्ञापन • Advertisement</span>
        <Link
          href="/contact"
          className="hover:text-brand transition-colors normal-case text-muted-foreground text-[10px]"
        >
          विज्ञापनका लागि सम्पर्क
        </Link>
      </div>

      {/* The Ad: Reduced height and softer opacity with smooth hover brighten */}
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : "_self"}
        rel="noopener noreferrer"
        aria-label={alt}
        className="block relative w-full overflow-hidden rounded-none border border-border shadow-2xs hover:shadow-xs transition-all duration-300 group"
      >
        <div className={`relative w-full ${ad.containerClass} overflow-hidden bg-surface`}>
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover object-center opacity-85 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      </a>
    </div>
  );
}
