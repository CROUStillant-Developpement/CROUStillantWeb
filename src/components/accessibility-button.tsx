"use client";

import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function AccessibilityButton() {
  const { dislexicFont, toggleDislexicFont } = useUserPreferences();
  const t = useTranslations("Footer");

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
      onClick={toggleDislexicFont}
      variant="outline"
      className=""
    >
      {dislexicFont ? t("accessibility.normal") : t("accessibility.dislexic")}
    </Button>
  );
}
