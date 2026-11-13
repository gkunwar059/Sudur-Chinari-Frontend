"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { forceUnlockBodyScroll } from "@/lib/scroll-lock";

const REVEAL_SELECTOR =
  ".scroll-reveal:not([data-revealed='true']), .scroll-reveal-fade:not([data-revealed='true']), .scroll-reveal-scale:not([data-revealed='true']), .scroll-reveal-card:not([data-revealed='true'])";

function markRevealed(el: Element, staggerIndex = 0) {
  if (el.classList.contains("scroll-reveal-card")) {
    const htmlEl = el as HTMLElement;
    if (staggerIndex > 0) {
      htmlEl.style.animationDelay = `${Math.min(staggerIndex, 5) * 45}ms`;
    }
    const onEnd = (e: Event) => {
      if ((e as AnimationEvent).animationName !== "cardRevealIn") return;
      el.classList.add("reveal-done");
      htmlEl.style.animationDelay = "";
      el.removeEventListener("animationend", onEnd);
    };
    el.addEventListener("animationend", onEnd);
  }
  el.setAttribute("data-revealed", "true");
  el.classList.add("is-revealed");
}

function hasRevealNode(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as Element;
  if (
    el.classList.contains("scroll-reveal") ||
    el.classList.contains("scroll-reveal-fade") ||
    el.classList.contains("scroll-reveal-scale") ||
    el.classList.contains("scroll-reveal-card")
  ) {
    return true;
  }
  return Boolean(
    el.querySelector(
      ".scroll-reveal, .scroll-reveal-fade, .scroll-reveal-scale, .scroll-reveal-card",
    ),
  );
}

/**
 * ScrollObserver:
 * Lightweight GPU-accelerated scroll-reveal observer with rAF-coalesced DOM scans
 * so scrolling and streaming mounts never stall the main thread.
 */
function ScrollObserverContent() {
  const pathname = usePathname();

  useEffect(() => {
    forceUnlockBodyScroll();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll(
          ".scroll-reveal, .scroll-reveal-fade, .scroll-reveal-scale, .scroll-reveal-card",
        )
        .forEach((el) => markRevealed(el));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        let cardIdx = 0;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const isCard = entry.target.classList.contains("scroll-reveal-card");
            markRevealed(entry.target, isCard ? cardIdx++ : 0);
            obs.unobserve(entry.target);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 80px 0px",
        threshold: 0.01,
      },
    );

    const observeElements = () => {
      const viewportBottom = window.innerHeight + 80;
      const targets = document.querySelectorAll(REVEAL_SELECTOR);
      let visibleCardIdx = 0;
      targets.forEach((target) => {
        if (target.getBoundingClientRect().top <= viewportBottom) {
          const isCard = target.classList.contains("scroll-reveal-card");
          markRevealed(target, isCard ? visibleCardIdx++ : 0);
        } else {
          observer.observe(target);
        }
      });
    };

    const rafId = requestAnimationFrame(observeElements);
    let mutationRafId: number | null = null;

    const mutationObserver = new MutationObserver((mutations) => {
      if (mutationRafId !== null) return;
      const relevant = mutations.some((m) =>
        Array.from(m.addedNodes).some(hasRevealNode),
      );
      if (!relevant) return;
      mutationRafId = requestAnimationFrame(() => {
        mutationRafId = null;
        observeElements();
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (mutationRafId !== null) cancelAnimationFrame(mutationRafId);
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
