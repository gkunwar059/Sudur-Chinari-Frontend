"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface PhotoLightboxGalleryProps {
  images: string[];
  lang: string;
  title: string;
}

export default function PhotoLightboxGallery({
  images,
  lang,
  title,
}: PhotoLightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-6xl mx-auto">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative break-inside-avoid overflow-hidden border border-border bg-surface group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={src}
              alt={`${title} - Image ${index + 1}`}
              width={800}
              height={600}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-white font-sans text-sm font-bold">
                {lang === "en" ? `Photo ${index + 1}` : `तस्बिर ${index + 1}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-white/80 font-sans text-sm font-bold tracking-widest">
              {currentIndex + 1} <span className="opacity-50">/</span> {images.length}
            </span>
            <button
              onClick={closeLightbox}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-contain select-none animate-in zoom-in-95 duration-300 drop-shadow-2xl"
              sizes="100vw"
              preload
            />
          </div>

          {/* Title Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center z-50 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <h3 className="text-white font-serif-np text-xl md:text-2xl opacity-90 drop-shadow-md">
              {title}
            </h3>
          </div>

          {/* Prev/Next Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all z-50"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} strokeWidth={1.5} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all z-50"
            aria-label="Next image"
          >
            <ChevronRight size={36} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </>
  );
}
