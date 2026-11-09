"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockBodyScroll } from "@/lib/scroll-lock";

const emptySubscribe = () => () => {};

/**
 * Shared modal behavior: Escape-to-close + body scroll lock.
 * Safe to call from modal components that render conditionally;
 * pass `enabled` to only attach the behavior while the modal is open.
 */
export function useModalDismiss(onClose: () => void, enabled = true) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const unlock = lockBodyScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [enabled]);
}

interface FTModalProps {
  onClose: () => void;
  children: ReactNode;
  /** "boxed" = full border + brand top accent (default); "accent-top" = top accent bar only */
  variant?: "boxed" | "accent-top";
  /** Tailwind max-width class for the panel, e.g. "max-w-2xl" */
  maxWidth?: string;
  /** Tailwind max-height class for the panel, e.g. "max-h-[90vh]" */
  maxHeight?: string;
  /** Close when the backdrop (outside the panel) is clicked. Default true. */
  closeOnBackdrop?: boolean;
  /** Inline color for the top accent bar (accent-top variant), e.g. a district theme color */
  accentColor?: string;
  labelledBy?: string;
  ariaLabel?: string;
  zClassName?: string;
  paddingClassName?: string;
  backdropClassName?: string;
  overlayClassName?: string;
  panelClassName?: string;
}

export default function FTModal({
  onClose,
  children,
  variant = "boxed",
  maxWidth = "max-w-lg",
  maxHeight = "max-h-[85vh]",
  closeOnBackdrop = true,
  accentColor,
  labelledBy,
  ariaLabel,
  zClassName = "z-[120]",
  paddingClassName = "p-4",
  backdropClassName = "bg-black/60 backdrop-blur-xs",
  overlayClassName = "",
  panelClassName = "",
}: FTModalProps) {
  useModalDismiss(onClose);

  // Render in a portal so `position: fixed` is always relative to the viewport,
  // even when the modal is mounted inside transformed/`will-change` ancestors
  // (e.g. `.scroll-reveal` wrappers around ad slots).
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const panelBase =
    variant === "accent-top"
      ? "relative bg-background w-full rounded-none shadow-2xl overflow-hidden flex flex-col border-t-4 animate-in fade-in zoom-in-95 duration-200"
      : "relative bg-background border border-border border-t-[4px] border-t-brand w-full rounded-none shadow-2xl overflow-hidden flex flex-col animate-scaleUp";

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      className={`fixed inset-0 ${zClassName} flex items-center justify-center ${paddingClassName} ${backdropClassName} animate-fadeIn ${overlayClassName}`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`${panelBase} ${maxWidth} ${maxHeight} ${panelClassName}`}
        style={accentColor ? { borderColor: accentColor } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
