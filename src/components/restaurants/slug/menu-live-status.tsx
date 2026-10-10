"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

interface MenuLiveStatusProps {
  /** Whether the real-time connection to the API is open. */
  live: boolean;
  /** When the menu was last refreshed by a real-time update, if it was. */
  lastUpdated: Date | null;
}

/**
 * Small status line: a "live" dot while connected to the real-time updates,
 * and how long ago the menu was last updated on screen.
 */
export default function MenuLiveStatus({ live, lastUpdated }: MenuLiveStatusProps) {
  const t = useTranslations("RestaurantPage.live");
  const locale = useLocale();

  // Re-rendered every 30 seconds so "5 minutes ago" keeps counting.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!lastUpdated) return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  if (!live && !lastUpdated) return null;

  let updatedLabel: string | null = null;
  if (lastUpdated) {
    const minutes = Math.floor((now - lastUpdated.getTime()) / 60000);
    updatedLabel =
      minutes < 1
        ? t("updatedJustNow")
        : t("updated", {
            time:
              minutes < 60
                ? new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(-minutes, "minute")
                : new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(
                    -Math.floor(minutes / 60),
                    "hour"
                  ),
          });
  }

  return (
    <p
      className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground"
      aria-live="polite"
    >
      {live && (
        <>
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span title={t("liveDescription")}>{t("live")}</span>
        </>
      )}
      {live && updatedLabel && <span aria-hidden="true">·</span>}
      {updatedLabel && <span>{updatedLabel}</span>}
    </p>
  );
}
