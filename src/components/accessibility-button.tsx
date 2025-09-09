"use client";

import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { useEffect } from "react";

export default function AccessibilityButton() {
  const { dislexicFont, toggleDislexicFont } = useUserPreferences();
  const t = useTranslations("Footer");
  const umami = useUmami();

  // Update body class and save preference when font state changes
  useEffect(() => {
    if (dislexicFont) {
      document.body.classList.add("dyslexic-font");
    } else {
      document.body.classList.remove("dyslexic-font");
    }
  }, [dislexicFont]);

  return (
    <Button
      onClick={
        () => {
          toggleDislexicFont();
          umami.event('Accessibility.ToggleDislexicFont');
        }
      }
      variant="outline"
      className=""
    >
      {dislexicFont ? t("accessibility.normal") : t("accessibility.dislexic")}
    </Button>
  );
}
