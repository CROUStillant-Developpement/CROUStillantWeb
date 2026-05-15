"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "@/lib/motion";
import { Sun, Moon, X } from "lucide-react";
import type { BuilderState } from "./builder-page";
import ColorPicker from "./color-picker";

const FONTS = ["Inter", "Roboto", "Outfit", "Nunito", "system"] as const;

interface Props {
  state: BuilderState;
  onChange: <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => void;
}

export default function StylePanel({ state, onChange }: Props) {
  const t = useTranslations("IframeBuilderPage");

  return (
    <div className="space-y-5">

      {/* Theme */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("style.theme")}</label>
        <div className="flex rounded-xl overflow-hidden border border-border/60 w-fit shadow-xs">
          {(["light", "dark"] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => onChange("theme", theme)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                state.theme === theme
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              {theme === "light" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {t(`style.${theme}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("style.color")}</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <ColorPicker
              value={state.color}
              onChange={(hex) => onChange("color", hex)}
            />
          </div>
          <AnimatePresence>
            {state.color !== "ef4444" && (
              <motion.button
                key="clear-color"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={() => onChange("color", "ef4444")}
                className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors shadow-xs shrink-0"
                aria-label="Reset colour"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("style.font")}</label>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => onChange("font", font)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all duration-200 ring-1 ${
                state.font === font
                  ? "bg-primary/10 text-primary ring-primary/20"
                  : "bg-card text-muted-foreground ring-border hover:bg-primary/5 hover:text-primary hover:ring-primary/20"
              }`}
            >
              {font === "system" ? t("style.fontSystem") : font}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("style.lang")}</label>
        <div className="flex rounded-xl overflow-hidden border border-border/60 w-fit shadow-xs">
          {(["fr", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onChange("lang", lang)}
              className={`px-4 py-2 text-sm font-semibold uppercase transition-all duration-200 ${
                state.lang === lang
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
