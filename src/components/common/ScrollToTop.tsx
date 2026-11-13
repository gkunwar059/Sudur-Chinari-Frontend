"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const next = window.scrollY > 300;
      setIsVisible((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={cn(
        "fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 p-3 bg-brand text-primary-foreground shadow-lg rounded-full hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 cursor-pointer transition-[opacity,transform,background-color] duration-150 ease-out active:scale-95",
        isVisible
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-90 translate-y-2 pointer-events-none",
      )}
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
}
