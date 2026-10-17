"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global uncaught error:", error);
  }, [error]);

  return (
    <html lang="ne">
      <body className="min-h-screen bg-[#F8F6F2] text-[#111827] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-[#D4CFCA] border-t-[4px] border-t-[#0C6FB3] p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold mb-2">गम्भीर त्रुटि / Critical Error</h1>
          <p className="text-sm text-gray-600 mb-6">
            एप्लिकेसन लोड गर्न सकिएन। कृपया पृष्ठ ताजा गर्नुहोस्।
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#05965B] text-white font-semibold text-sm hover:bg-[#047849] transition-colors cursor-pointer"
          >
            पृष्ठ पुन: लोड गर्नुहोस्
          </button>
        </div>
      </body>
    </html>
  );
}
