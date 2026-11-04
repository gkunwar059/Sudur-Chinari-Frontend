"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { newsApi } from "@/lib/api";
import type { Locale } from "@/lib/i18n/config";

export default function NewsletterSubscription({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setError(null);
    try {
      await newsApi.postNewsletterSubscriptionClient(email);
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      setError(
        locale === "ne"
          ? "दर्ता हुन सकेन। कृपया सही इमेल प्रविष्ट गर्नुहोस्।"
          : "Subscription failed. Please enter a valid email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-brand mb-1 flex items-center gap-1.5">
        <Mail size={13} />
        <span>{locale === "ne" ? "दैनिक सम्पादकीय बुलेटिन" : "Daily Editorial Digest"}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2.5">
        {locale === "ne"
          ? "सुदूरपश्चिमका ताजा समाचार र विश्लेषण सिधै तपाईंको इनबक्समा।"
          : "Essential news and in-depth analytical pieces directly in your inbox."}
      </p>

      {success ? (
        <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>
            {locale === "ne"
              ? "धन्यवाद ! तपाईंको इमेल सफलतापूर्वक दर्ता भयो।"
              : "Thank you! You are now subscribed."}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-stretch border border-border bg-background">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={locale === "ne" ? "तपाईंको इमेल ठेगाना..." : "Enter your email..."}
            className="flex-1 px-3 py-2 text-xs bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3.5 bg-brand text-white text-xs font-bold hover:bg-brand/90 transition-colors flex items-center gap-1 disabled:opacity-60 cursor-pointer shrink-0"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <>
                <span>{locale === "ne" ? "दर्ता" : "Join"}</span>
                <ArrowRight size={12} />
              </>
            )}
          </button>
        </form>
      )}

      {error && <p className="text-[11px] text-red-500 mt-1 font-sans">{error}</p>}
    </div>
  );
}
