"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, X } from "lucide-react";
import { useTranslations } from "next-intl";

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SERVER_ACTION_ERROR = "Failed to find Server Action";

export default function UpdateBanner() {
  const [visible, setVisible] = useState(false);
  const currentBuildId = useRef<string | null>(null);
  const t = useTranslations("UpdateBanner");

  useEffect(() => {
    async function checkVersion() {
      try {
        const res = await fetch("/version", { cache: "no-store" });
        if (!res.ok) return;
        const { buildId } = await res.json();
        if (buildId === "development") return;
        if (!currentBuildId.current) {
          currentBuildId.current = buildId;
        } else if (buildId !== currentBuildId.current) {
          setVisible(true);
        }
      } catch {
        // network error — ignore silently
      }
    }

    function handleRejection(event: PromiseRejectionEvent) {
      if (event.reason?.message?.includes(SERVER_ACTION_ERROR)) {
        setVisible(true);
      }
    }

    function handleVisibilityChange() {
      if (!document.hidden) checkVersion();
    }

    checkVersion();
    const interval = setInterval(checkVersion, POLL_INTERVAL);
    window.addEventListener("unhandledrejection", handleRejection);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("unhandledrejection", handleRejection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-md shadow-xl shadow-black/10 p-4 pr-10">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={t("dismiss")}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-xl bg-primary/10 p-2 text-primary">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold leading-snug">{t("title")}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("message")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-medium text-primary hover:underline underline-offset-2"
            >
              {t("refresh")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
