"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Shared horizontal scroll-rail behavior for card carousels:
 * a scroll container ref, arrow-button scrolling, and scroll progress.
 */
export function useScrollRail(step = 320) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      ref.current?.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    },
    [step],
  );

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const total = el.scrollWidth - el.clientWidth;
    setProgress(
      total > 0 ? Math.min(100, Math.max(0, (el.scrollLeft / total) * 100)) : 0,
    );
  }, []);

  return { ref, scroll, progress, onScroll };
}
