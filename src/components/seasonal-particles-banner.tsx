"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { detectSeasonFromDate, SEASON_CONFIGS } from "@/lib/seasonal";
import { useUserPreferences } from "@/store/userPreferencesStore";

export default function SeasonalParticlesBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("SeasonalParticlesBanner");
  const { seasonalParticles } = useUserPreferences();

  const season = detectSeasonFromDate(new Date());
  const config = SEASON_CONFIGS.find((s) => s.id === season) ?? null;
  const storageKey = `seasonal-particles-hint-${season}`;

  useEffect(() => {
    if (!config || !seasonalParticles) return;
    if (!sessionStorage.getItem(storageKey)) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [config, seasonalParticles, storageKey]);

  function dismiss() {
    sessionStorage.setItem(storageKey, "1");
    setVisible(false);
  }

  if (!config) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-6 z-50 max-w-sm transition-all duration-500 ease-out ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="relative rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-md shadow-xl shadow-black/10 p-4 pr-10">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={t("dismiss")}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 rounded-xl bg-primary/10 p-2 text-lg leading-none select-none">
            {config.emoji}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold leading-snug">{t("title")}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("message")}{" "}
              <Link
                href="/settings"
                onClick={dismiss}
                className="text-primary underline-offset-2 hover:underline font-medium"
              >
                {t("settingsLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
