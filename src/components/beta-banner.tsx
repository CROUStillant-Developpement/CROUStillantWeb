"use client";

import { useState, useEffect } from "react";
import { X, FlaskConical } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "beta-banner-dismissed";

export default function BetaBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("BetaBanner");

  useEffect(() => {
    if (
      (window.location.hostname === "beta.croustillant.menu" || window.location.hostname === "localhost") &&
      !sessionStorage.getItem(STORAGE_KEY)
    ) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative rounded-2xl border border-amber-500/30 bg-background/95 backdrop-blur-md shadow-xl shadow-black/10 p-4 pr-10">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={t("dismiss")}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-xl bg-amber-500/10 p-2 text-amber-500">
            <FlaskConical className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold leading-snug">{t("title")}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("message")}{" "}
              <Link
                href="/contact"
                onClick={dismiss}
                className="inline-flex items-center gap-1 text-amber-500 underline-offset-2 hover:underline font-medium"
              >
                {t("contact")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
