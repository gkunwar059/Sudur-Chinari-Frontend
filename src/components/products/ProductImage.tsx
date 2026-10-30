"use client";

import { useState } from "react";
import Image from "next/image";

const CATEGORY_STYLES: Record<
  string,
  { icon: string; background: string }
> = {
  dairy: { icon: "🥛", background: "linear-gradient(135deg, #FBF4E4 0%, #F0E2C3 100%)" },
  grains: { icon: "🌾", background: "linear-gradient(135deg, #F8F0D8 0%, #E7D5A0 100%)" },
  fruits: { icon: "🍎", background: "linear-gradient(135deg, #FFF1E9 0%, #F4CDB8 100%)" },
  spices: { icon: "🌿", background: "linear-gradient(135deg, #EEF6EA 0%, #CFE5C4 100%)" },
};

interface ProductImageProps {
  src: string;
  alt: string;
  categoryId: string;
  sizes: string;
}

export default function ProductImage({
  src,
  alt,
  categoryId,
  sizes,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const style = CATEGORY_STYLES[categoryId] ?? CATEGORY_STYLES.dairy;

  if (!src || failed) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
        style={{ background: style.background }}
      >
        <span aria-hidden="true" className="text-5xl">
          {style.icon}
        </span>
        <span aria-hidden="true" className="mt-1 h-px w-8 bg-foreground/15" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}
