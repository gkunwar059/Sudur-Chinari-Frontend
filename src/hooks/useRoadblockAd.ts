"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";

export interface PopupAdData {
  id: number | string;
  title: string;
  image: string;
  target_url: string;
  advertiser: string;
  duration_seconds: number;
  is_active: boolean;
}

export function useRoadblockAd() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();

  const forcePreview = useMemo(() => {
    if (!searchParams) return false;
    return (
      searchParams.get("showAd") === "1" ||
      searchParams.get("showAd") === "true" ||
      searchParams.get("roadblock") === "1"
    );
  }, [searchParams]);

  const { data: adData = null } = useQuery<PopupAdData | null>({
    queryKey: ["popup-ad-active", locale],
    queryFn: async ({ signal }) => {
      const lang = locale === "ne" ? "ne" : "en";
      const res = await fetch(`/api/v1/popup-ads/active/?lang=${lang}`, {
        headers: { Accept: "application/json" },
        signal,
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (!json?.active || !json?.data) return null;
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [isHovered, setIsHovered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedRef = useRef(false);

  const totalDuration = Math.max(1, adData?.duration_seconds || 6);

  const handleClose = () => {
    setIsClosing(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (adData && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(`sudur_ad_seen_${adData.id}`, "true");
      } catch {
        // storage disabled or quota exceeded
      }
    }

    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    if (!adData || !adData.image) {
      setIsOpen(false);
      return;
    }

    if (hasCheckedRef.current && !forcePreview) return;
    hasCheckedRef.current = true;

    let alreadySeen = false;
    try {
      alreadySeen = !!sessionStorage.getItem(`sudur_ad_seen_${adData.id}`);
    } catch {
      alreadySeen = false;
    }

    if (!alreadySeen || forcePreview) {
      setIsOpen(true);
      setIsClosing(false);
      setCountdown(adData.duration_seconds || 6);
    }
  }, [adData, forcePreview]);

  useEffect(() => {
    if (!isOpen || isClosing || isHovered) return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, isClosing, isHovered]);

  useEffect(() => {
    if (isOpen && !isClosing && countdown <= 0) {
      handleClose();
    }
  }, [isOpen, isClosing, countdown]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalDuration - countdown) / totalDuration) * 100)
  );

  return {
    adData,
    isOpen,
    isClosing,
    countdown,
    progressPercent,
    isHovered,
    setIsHovered,
    handleClose,
  };
}
