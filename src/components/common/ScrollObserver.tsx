"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollObserver:
 * Lightweight GPU-accelerated scroll-reveal observer.
 * Listens for elements with `.scroll-reveal`, `.scroll-reveal-fade`, or `.scroll-reveal-scale`.
 * Applies `.is-revealed` when the element intersects the viewport (12% margin).
 * Leaves Server Components 100% untouched while adding smooth broadsheet reveals.
 */
export default function ScrollObserver() {
  const pathname = usePathname();

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
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
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
        ".scroll-reveal:not(.is-revealed), .scroll-reveal-fade:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed)"
      );
      targets.forEach((target) => observer.observe(target));
    };

    // Initial scan
    observeElements();

    // Observe dynamically mounted elements or route transitions
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
