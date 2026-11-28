"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";

/**
 * Toggles the vegetarian menu filter (stored with the user's preferences).
 * When on, starters and mains not announced vegetarian are hidden.
 */
export default function VegetarianFilter() {
  const t = useTranslations("RestaurantPage.vegetarianFilter");
  const umami = useUmami();
  const hydrated = useHydrated();
  const stored = useUserPreferences((state) => state.vegetarianOnly);
  const toggle = useUserPreferences((state) => state.toggleVegetarianOnly);
  const active = hydrated && stored;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        aria-pressed={active}
        onClick={() => {
          toggle();
          umami.event(active ? "Menu.VegetarianOff" : "Menu.VegetarianOn");
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-primary text-primary-foreground ring-primary"
            : "bg-primary/5 text-primary ring-primary/10 hover:bg-primary/10"
        )}
      >
        <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
        {t("label")}
      </button>
      {active && <p className="text-xs text-muted-foreground">{t("hint")}</p>}
    </div>
  );
}
