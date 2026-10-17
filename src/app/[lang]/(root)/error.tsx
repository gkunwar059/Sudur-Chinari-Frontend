"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md w-full bg-surface border border-border border-t-[4px] border-t-brand-secondary p-6 sm:p-8 text-center shadow-xs">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
          <AlertCircle size={24} />
        </div>

        <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight mb-2">
          केही समस्या आयो / Something went wrong
        </h1>

        <p className="text-sm text-muted-foreground font-sans mb-6 leading-relaxed">
          सामग्री लोड गर्दा प्राविधिक त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस् वा गृहपृष्ठमा फर्कनुहोस्।
        </p>

        {error?.digest && (
          <p className="text-[11px] font-mono text-muted-foreground/70 mb-6 bg-background p-2 border border-border">
            त्रुटि संकेत: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-none transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>पुन: प्रयास (Retry)</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-background hover:bg-surface text-foreground border border-border font-semibold text-sm rounded-none transition-colors"
          >
            <Home size={15} />
            <span>गृहपृष्ठ (Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
