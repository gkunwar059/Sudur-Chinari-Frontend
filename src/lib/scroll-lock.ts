"use client";

import { useEffect, useRef } from "react";

/**
 * Global reference-counted body scroll lock.
 * Prevents race conditions and nested modal collisions where one modal
 * closing restores 'overflow: hidden' that another modal set, permanently
 * locking the screen.
 */

let activeLocks = 0;
let originalOverflow: string | null = null;

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  if (activeLocks === 0) {
    const current = document.body.style.overflow;
    // If body already somehow had "hidden", fall back to restoring empty string
    originalOverflow = current === "hidden" ? "" : current;
    document.body.style.overflow = "hidden";
  }
  activeLocks++;

  let unlocked = false;
  return () => {
    if (unlocked) return;
    unlocked = true;
    activeLocks = Math.max(0, activeLocks - 1);
    if (activeLocks === 0) {
      document.body.style.overflow = originalOverflow ?? "";
      originalOverflow = null;
    }
  };
}

/**
 * Force-clears all body scroll locks.
 * Helpful on page route transitions to guarantee scrolling is never stuck.
 */
export function forceUnlockBodyScroll() {
  if (typeof document === "undefined") return;
  activeLocks = 0;
  originalOverflow = null;
  document.body.style.overflow = "";
}

/**
 * React hook to lock body scroll when `enabled` is true.
 * Automatically cleans up on unmount or when `enabled` becomes false.
 */
export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const unlock = lockBodyScroll();
    return () => {
      unlock();
    };
  }, [enabled]);
}

