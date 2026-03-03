"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

const COOKIE_KEY = "wwh_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay if not yet accepted
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-3xl mx-auto bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="w-6 h-6 text-red-500 shrink-0 mt-0.5 sm:mt-0" strokeWidth={1.5} />

        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">We use cookies</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
            We use cookies to improve your experience and analyze site traffic. By clicking &quot;Accept,&quot; you
            consent to our use of cookies.{" "}
            <Link href="/privacy" className="text-red-400 hover:text-red-300 underline underline-offset-2">
              Learn more
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
