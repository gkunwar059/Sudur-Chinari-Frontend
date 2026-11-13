"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { forceUnlockBodyScroll } from "@/lib/scroll-lock";

/**
 * ScrollObserver:
 * Lightweight GPU-accelerated scroll-reveal observer.
 * Listens for elements with `.scroll-reveal`, `.scroll-reveal-fade`, or `.scroll-reveal-scale`.
 * Applies `.is-revealed` when the element intersects the viewport (12% margin).
 * Leaves Server Components 100% untouched while adding smooth broadsheet reveals.
 */
function ScrollObserverContent() {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure body scroll is free whenever user transitions routes
    forceUnlockBodyScroll();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback for environments without IntersectionObserver
      document.querySelectorAll(".scroll-reveal, .scroll-reveal-fade, .scroll-reveal-scale").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.setAttribute("data-revealed", "true");
            target.classList.add("is-revealed");
            obs.unobserve(target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px", // triggers slightly before full entry for smoother experience
        threshold: 0.08,
      }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll(
        ".scroll-reveal:not([data-revealed='true']), .scroll-reveal-fade:not([data-revealed='true']), .scroll-reveal-scale:not([data-revealed='true'])"
      );
      targets.forEach((target) => observer.observe(target));
    };

    // Initial scan after frame to avoid race with hydration
    const rafId = requestAnimationFrame(() => {
      observeElements();
    });

    // Observe dynamically mounted elements or route transitions
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}

export default function ScrollObserver() {
  return (
    <Suspense fallback={null}>
      <ScrollObserverContent />
    </Suspense>
  );
}
