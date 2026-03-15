"use client";

import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MealsDisplay from "./meals-display";
import { AnimatePresence, motion } from "@/lib/motion";
import { DateMenu, Repas } from "@/services/types";
import { useLocale, useTranslations } from "next-intl";
import DateScroller from "./date-scroller";
import DatePicker from "./date-picker";
import { CalendarCheck, History } from "lucide-react";
import { cn, formatToISODate, normalizeToDate } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuDisplaySectionProps {
  menuLoading: boolean;
  availableDates: DateMenu[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedDateMeals: Repas[];
  selectedDateBreakfast: Repas | null;
  selectedDateLunch: Repas | null;
  selectedDateDinner: Repas | null;
  rightPanel?: ReactNode;
  noMenuAtAll?: boolean;
}

export default function MenuDisplaySection({
  menuLoading,
  availableDates,
  selectedDate,
  onDateChange,
  selectedDateMeals,
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
  noMenuAtAll = false,
}: MenuDisplaySectionProps) {
  const t = useTranslations("RestaurantPage");
  const locale = useLocale();

  // Automatically show history if selected date is in the past
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const filteredDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const futureDates = availableDates.filter(d =>
      normalizeToDate(formatToISODate(d.date)).getTime() >= todayTime
    );

    return [...futureDates];
  }, [availableDates, selectedDate]);

  return (
    <div className="flex flex-col gap-8 w-full min-w-0">
      <div className="flex flex-col gap-6 font-medium min-w-0 w-full max-w-full">
        {!noMenuAtAll && (
          <div className="sticky top-0 z-30 pt-2 bg-background/80 backdrop-blur-xl mb-2 overflow-x-hidden w-full max-w-full p-4 pt-4 border-b border-border/30">
            <div className="flex flex-col gap-3 max-w-full min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 w-full">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight px-1 flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="bg-primary/10 text-primary p-1.5 sm:p-2 rounded-xl">
                    <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <span className="truncate">
                    {t("menuOfTheDay", {
                      date: !isNaN(selectedDate.getTime())
                        ? selectedDate.toLocaleDateString(locale, {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })
                        : "..."
                    })}
                  </span>
                </h2>

                <div className="flex items-center gap-2 shrink-0 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
                  <DatePicker
                    onDateChange={onDateChange}
                    minDate={availableDates.length > 0 ? normalizeToDate(formatToISODate(availableDates[0].date)) : undefined}
                    maxDate={availableDates.length > 0 ? normalizeToDate(formatToISODate(availableDates[availableDates.length - 1].date)) : undefined}
                    current={selectedDate}
                    availableDates={
                      availableDates.length > 0 ? availableDates.map(d => normalizeToDate(formatToISODate(d.date))).includes(new Date()) ? availableDates.map(d => normalizeToDate(formatToISODate(d.date))) : [...availableDates.map(d => normalizeToDate(formatToISODate(d.date))), new Date()] : [new Date()]
                    }
                  />
                </div>
              </div>

              <div className="relative w-full max-w-[65vw] group m-auto">
                <DateScroller
                  availableDates={filteredDates}
                  selectedDate={selectedDate}
                  onDateChange={onDateChange}
                />
              </div>
            </div>
          </div>
        )}

        {menuLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-40 rounded-3xl" />
            <Skeleton className="w-full h-40 rounded-3xl" />
            <Skeleton className="w-full h-40 rounded-3xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 min-w-0 w-full p-4">
            {noMenuAtAll ? (
              <Alert className="rounded-3xl border-warning/20 bg-warning/5 p-8" variant={"warning"}>
                <AlertTitle className="text-2xl font-bold mb-4">{t("noMealAvailable")}</AlertTitle>
                <AlertDescription className="text-lg opacity-90">
                  {t("noMealAvailableDescription")}
                  <p className="text-sm text-muted-foreground mt-4 italic">
                    {t("noMealAvailableDescription2")}
                  </p>
                </AlertDescription>
              </Alert>
            ) : selectedDateMeals.length === 0 ? (
              <Alert className="rounded-3xl border-warning/20 bg-warning/5 p-8" variant={"warning"}>
                <AlertTitle className="text-2xl font-bold">{t("noMenuAvailable")}</AlertTitle>
              </Alert>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedDate?.toISOString?.() || "no-date"}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col gap-6"
                >
                  <MealsDisplay
                    selectedDateBreakfast={selectedDateBreakfast}
                    selectedDateLunch={selectedDateLunch}
                    selectedDateDinner={selectedDateDinner}
                    date={selectedDate}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
