"use client";

import { Accessibility, BookOpen, Contrast, Rows3, Type, ZapOff } from "lucide-react";
import { useUserPreferences, type TextSize } from "@/store/userPreferencesStore";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

// Keeps the dropdown open after toggling a switch, so several preferences
// can be changed in a row without re-opening the menu each time.
const keepOpen = (e: Event) => e.preventDefault();

export default function AccessibilityMenu() {
  const {
    dislexicFont,
    toggleDislexicFont,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    readingSpacing,
    toggleReadingSpacing,
    textSize,
    setTextSize,
  } = useUserPreferences();
  const t = useTranslations("Footer");
  const umami = useUmami();
  const isDesktopMedia = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDesktop = mounted && isDesktopMedia;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isDesktop ? "default" : "icon"}
          className={cn(
            "select-none h-9 rounded-lg transition-all duration-300 font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 bg-background/50 dark:bg-white/10",
            isDesktop ? "px-4 gap-2" : "p-0 w-9"
          )}
        >
          <Accessibility className="h-[1.2rem] w-[1.2rem]" />
          {isDesktop && <span>{t("accessibility.title")}</span>}
          <span className="sr-only">{t("accessibility.title")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border-primary/20 shadow-xl p-2 gap-1 flex flex-col bg-background/80 backdrop-blur-xl min-w-[260px]"
      >
        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">
          {t("accessibility.title")}
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={dislexicFont}
          onSelect={keepOpen}
          onCheckedChange={(checked) => {
            toggleDislexicFont();
            umami.event("Accessibility.ToggleDislexicFont", { enabled: String(checked), source: "footer" });
          }}
          className="rounded-lg cursor-pointer gap-2 py-2"
        >
          <BookOpen className="h-4 w-4" />
          {t("accessibility.dislexicFont")}
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={highContrast}
          onSelect={keepOpen}
          onCheckedChange={(checked) => {
            toggleHighContrast();
            umami.event("Accessibility.ToggleHighContrast", { enabled: String(checked), source: "footer" });
          }}
          className="rounded-lg cursor-pointer gap-2 py-2"
        >
          <Contrast className="h-4 w-4" />
          {t("accessibility.highContrast")}
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={reducedMotion}
          onSelect={keepOpen}
          onCheckedChange={(checked) => {
            toggleReducedMotion();
            umami.event("Accessibility.ToggleReducedMotion", { enabled: String(checked), source: "footer" });
          }}
          className="rounded-lg cursor-pointer gap-2 py-2"
        >
          <ZapOff className="h-4 w-4" />
          {t("accessibility.reducedMotion")}
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={readingSpacing}
          onSelect={keepOpen}
          onCheckedChange={(checked) => {
            toggleReadingSpacing();
            umami.event("Accessibility.ToggleReadingSpacing", { enabled: String(checked), source: "footer" });
          }}
          className="rounded-lg cursor-pointer gap-2 py-2"
        >
          <Rows3 className="h-4 w-4" />
          {t("accessibility.readingSpacing")}
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Type className="h-3.5 w-3.5" />
          {t("accessibility.textSize.title")}
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={textSize}
          onValueChange={(value) => {
            setTextSize(value as TextSize);
            umami.event("Accessibility.SetTextSize", { size: value, source: "footer" });
          }}
        >
          <DropdownMenuRadioItem value="normal" onSelect={keepOpen} className="rounded-lg cursor-pointer py-2">
            {t("accessibility.textSize.normal")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="large" onSelect={keepOpen} className="rounded-lg cursor-pointer py-2">
            {t("accessibility.textSize.large")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="x-large" onSelect={keepOpen} className="rounded-lg cursor-pointer py-2">
            {t("accessibility.textSize.xlarge")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="rounded-lg cursor-pointer justify-center text-primary font-semibold py-2">
          <Link href="/settings">{t("accessibility.moreSettings")}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
