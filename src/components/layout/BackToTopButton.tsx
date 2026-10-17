"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-brand-secondary transition-colors cursor-pointer"
    >
      <span>शीर्षमा जानुहोस्</span>
      <ArrowUp size={14} />
    </button>
  );
}
