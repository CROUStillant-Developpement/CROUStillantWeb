"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "@/lib/motion";
import { LayoutTemplate, Paintbrush, Utensils, Ruler, Building2, CalendarDays, X } from "lucide-react";
import { enUS, fr as frLocale } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Restaurant } from "@/services/types";
import {
  useIframeBuilderStore,
  type BlockConfig,
  type PersistedBuilderState,
} from "@/store/iframeBuilderStore";
import RestaurantSearch from "./restaurant-search";
import BlocksPanel from "./blocks-panel";
import StylePanel from "./style-panel";
import PreviewPanel from "./preview-panel";

export type { BlockConfig };

export interface BuilderState extends PersistedBuilderState {
  date: Date | null;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

interface Props { restaurants: Restaurant[]; apiUrl: string; }

export default function BuilderPage({ restaurants, apiUrl }: Props) {
  const t = useTranslations("IframeBuilderPage");
  const store = useIframeBuilderStore();
  const [date, setDate] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);

  const updateState = useCallback(
    <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => {
      if (key === "date") {
        setDate(value as Date | null);
      } else {
        store.update(
          key as keyof PersistedBuilderState,
          value as PersistedBuilderState[keyof PersistedBuilderState]
        );
      }
    },
    [store]
  );

  const state: BuilderState = useMemo(
    () => ({
      restaurantCode: store.restaurantCode,
      blocks: store.blocks,
      theme: store.theme,
      color: store.color,
      font: store.font,
      meals: store.meals,
      width: store.width,
      height: store.height,
      lang: store.lang,
      date,
    }),
    [store.restaurantCode, store.blocks, store.theme, store.color, store.font,
     store.meals, store.width, store.height, store.lang, date],
  );

  useEffect(() => {
    if (!store.restaurantCode) { setAvailableDates([]); return; }
    setDatesLoading(true);
    const controller = new AbortController();
    fetch(`${apiUrl}/restaurants/${store.restaurantCode}/menu/dates/all`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data.success && Array.isArray(data.data)) {
          setAvailableDates(data.data.map((e: { date: string }) => {
            const [dd, mm, yyyy] = e.date.split("-").map(Number);
            return new Date(yyyy, mm - 1, dd);
          }));
        } else {
          setAvailableDates([]);
        }
      })
      .catch((err) => { if (err.name !== "AbortError") setAvailableDates([]); })
      .finally(() => { if (!controller.signal.aborted) setDatesLoading(false); });
    return () => controller.abort();
  }, [store.restaurantCode, apiUrl]);

  const iframeUrl = useMemo(() => {
    if (!store.restaurantCode) return null;
    const enabledBlocks = store.blocks.filter((b) => b.enabled).map((b) => b.id).join(",");
    if (!enabledBlocks) return null;
    const params = new URLSearchParams({
      theme: store.theme, blocks: enabledBlocks, meals: store.meals.join(","),
      color: store.color, font: store.font, height: String(store.height), lang: store.lang,
    });
    if (date) {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      params.set("date", `${dd}-${mm}-${date.getFullYear()}`);
    }
    return `${apiUrl}/restaurants/${store.restaurantCode}/iframe/custom?${params.toString()}`;
  }, [store.restaurantCode, store.blocks, store.theme, store.color, store.font,
      store.meals, store.height, store.lang, date, apiUrl]);

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => r.code === store.restaurantCode) ?? null,
    [restaurants, store.restaurantCode]
  );
  const menuEnabled = store.blocks.some((b) => b.id === "menu" && b.enabled);
  const dimStep = menuEnabled ? "5" : "4";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 px-4 mt-4 pb-16">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">{t("title")}</h1>
          <div className="mt-4 flex items-center">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">{t("subtitle")}</span>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">

          <motion.div variants={itemVariants}>
            <Section icon={<Building2 className="w-4 h-4" />} step="1" label={t("sections.restaurant")}>
              <RestaurantSearch restaurants={restaurants} value={state.restaurantCode} onChange={(code) => updateState("restaurantCode", code)} />
              <AnimatePresence>
                {selectedRestaurant && (
                  <motion.p key="ri" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="mt-2 text-xs text-muted-foreground overflow-hidden">
                    {selectedRestaurant.zone} · {selectedRestaurant.type?.libelle}
                  </motion.p>
                )}
              </AnimatePresence>
            </Section>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Section icon={<LayoutTemplate className="w-4 h-4" />} step="2" label={t("sections.blocks")}>
              <BlocksPanel blocks={state.blocks} onChange={(blocks) => updateState("blocks", blocks)} />
            </Section>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Section icon={<Paintbrush className="w-4 h-4" />} step="3" label={t("sections.style")}>
              <StylePanel state={state} onChange={updateState} />
            </Section>
          </motion.div>

          <AnimatePresence>
            {menuEnabled && (
              <motion.div key="menu-section" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <Section icon={<Utensils className="w-4 h-4" />} step="4" label={t("sections.menu")}>
                  <MenuOptions state={state} onChange={updateState} t={t} availableDates={availableDates} datesLoading={datesLoading} />
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <Section icon={<Ruler className="w-4 h-4" />} step={dimStep} label={t("sections.dimensions")}>
              <DimensionsPanel state={state} onChange={updateState} t={t} />
            </Section>
          </motion.div>

        </motion.div>

        <motion.div className="lg:sticky lg:top-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <PreviewPanel iframeUrl={iframeUrl} width={state.width} height={state.height} restaurantCode={state.restaurantCode} t={t} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function Section({ icon, step, label, children }: { icon: React.ReactNode; step: string; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs p-5">
      <h2 className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground uppercase tracking-tight mb-4">
        <span className="p-1.5 rounded-lg bg-primary/5 text-primary flex items-center justify-center">{icon}</span>
        <span className="text-xs text-primary font-bold">{step}.</span>
        {label}
      </h2>
      {children}
    </div>
  );
}

const MEALS_OPTIONS = [
  { id: "matin", labelKey: "meals.morning" },
  { id: "midi",  labelKey: "meals.lunch"   },
  { id: "soir",  labelKey: "meals.evening" },
] as const;

function MenuOptions({ state, onChange, t, availableDates, datesLoading }: {
  state: BuilderState;
  onChange: <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  availableDates: Date[];
  datesLoading: boolean;
}) {
  const locale = useLocale();
  const dateLocale = locale === "fr" ? frLocale : enUS;
  const toggleMeal = (meal: string) => {
    const next = state.meals.includes(meal) ? state.meals.filter((m) => m !== meal) : [...state.meals, meal];
    if (next.length > 0) onChange("meals", next);
  };
  const isDateAvailable = (date: Date) =>
    availableDates.some((d) => d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate());
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("menu.date")}</label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="flex flex-1 h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-primary/5 text-foreground text-left">
                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className={state.date ? "text-foreground" : "text-muted-foreground"}>
                  {datesLoading ? t("menu.loadingDates") : state.date ? state.date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" }) : t("menu.pickDate")}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-none border-none" align="start">
              <Calendar mode="single" selected={state.date ?? undefined} onSelect={(date) => onChange("date", date ?? null)} disabled={availableDates.length > 0 ? (date) => !isDateAvailable(date) : false} locale={dateLocale} autoFocus />
            </PopoverContent>
          </Popover>
          <AnimatePresence>
            {state.date && (
              <motion.button key="cd" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }} type="button" onClick={() => onChange("date", null)} className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors shadow-xs shrink-0" aria-label="Reset date">
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{t("menu.dateHint")}</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">{t("menu.meals")}</label>
        <div className="flex gap-2 flex-wrap">
          {MEALS_OPTIONS.map(({ id, labelKey }) => (
            <button key={id} type="button" onClick={() => toggleMeal(id)} className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all duration-200 ring-1 ${state.meals.includes(id) ? "bg-primary/10 text-primary ring-primary/20" : "bg-card text-muted-foreground ring-border hover:bg-primary/5 hover:text-primary hover:ring-primary/20"}`}>
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const SIZE_OPTIONS = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

function DimensionsPanel({ state, onChange, t }: {
  state: BuilderState;
  onChange: <K extends keyof BuilderState>(key: K, value: BuilderState[K]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(["width", "height"] as const).map((dim) => (
        <div key={dim}>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t(`dimensions.${dim}`)} (px)</label>
          <select value={state[dim]} onChange={(e) => onChange(dim, Number(e.target.value))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring text-foreground">
            {SIZE_OPTIONS.map((px) => <option key={px} value={px}>{px} px</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}
