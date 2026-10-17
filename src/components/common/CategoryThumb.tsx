import Image from "next/image";
import { cn, normalizeImageUrl } from "@/lib/utils";

interface CategoryThumbProps {
  image?: string | null;
  label: string;
  size?: number;
  className?: string;
}

/**
 * Circular category thumbnail used in the header sub-menu strip and category pages.
 * Falls back to a tinted initial-letter badge when no image is uploaded.
 */
export default function CategoryThumb({ image, label, size = 36, className }: CategoryThumbProps) {
  const src = normalizeImageUrl(image);
  const style = { width: size, height: size };

  if (src) {
    return (
      <span
        className={cn("relative shrink-0 overflow-hidden rounded-full ring-2 ring-background shadow-sm bg-surface", className)}
        style={style}
      >
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 rounded-full ring-2 ring-background shadow-sm flex items-center justify-center",
        "bg-gradient-to-br from-brand/90 to-brand-dark text-white font-bold",
        className
      )}
      style={{ ...style, fontSize: Math.round(size * 0.42) }}
    >
      {label.trim().charAt(0).toUpperCase() || "•"}
    </span>
  );
}
