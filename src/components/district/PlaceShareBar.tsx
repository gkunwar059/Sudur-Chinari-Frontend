"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

interface PlaceShareBarProps {
  title: string;
  locale: "en" | "ne";
  accentColor: string;
}

export default function PlaceShareBar({
  title,
  locale,
  accentColor,
}: PlaceShareBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or unsupported
      }
    }
    await handleCopy();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-sans border border-border bg-background hover:bg-surface transition-colors cursor-pointer"
        style={{ borderTop: `2px solid ${accentColor}` }}
      >
        <Share2 size={13} style={{ color: accentColor }} />
        <span>{locale === "ne" ? "सेयर गर्नुहोस्" : "Share"}</span>
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-sans border border-border bg-background hover:bg-surface transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check size={13} className="text-brand" />
            <span className="text-brand">
              {locale === "ne" ? "लिङ्क कपी भयो" : "Link Copied"}
            </span>
          </>
        ) : (
          <>
            <Copy size={13} className="text-muted-foreground" />
            <span>{locale === "ne" ? "लिङ्क कपी" : "Copy Link"}</span>
          </>
        )}
      </button>
    </div>
  );
}

