"use client";

import { useMemo, ReactNode } from "react";
import { CalendarCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "@/lib/motion";
import { getNormalizedISODate, normalizeToDate } from "@/lib/utils";
import { DateMenu, Repas } from "@/services/types";
import DatePicker from "./date-picker";
import DateScroller from "./date-scroller";
import MealsDisplay from "./meals-display";

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

const MenuAlert = ({
  title,
  description,
  description2
}: {
  title: string;
  description?: string;
  description2?: string
}) => (
  <Alert className="rounded-3xl border-warning/20 bg-warning/5 p-8" variant={"warning"}>
    <AlertTitle className="text-2xl font-bold mb-4">{title}</AlertTitle>
    {description && (
      <AlertDescription className="text-lg opacity-90">
        {description}
        {description2 && (
          <p className="text-sm text-muted-foreground mt-4 italic">
            {description2}
          </p>
        )}
      </AlertDescription>
    )}
  </Alert>
);

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

  const filteredDates = useMemo(() => {
    const today = normalizeToDate(new Date()).getTime();

    return availableDates.filter(d =>
      getNormalizedISODate(d.date).getTime() >= today
    );
  }, [availableDates]);

  const datePickerMinMax = useMemo(() => {
    if (availableDates.length === 0) return { min: undefined, max: undefined };
    return {
      min: getNormalizedISODate(availableDates[0].date),
      max: getNormalizedISODate(availableDates[availableDates.length - 1].date)
    };
  }, [availableDates]);

  const datePickerAvailableDates = useMemo(() => {
    const dates = availableDates.map(d => getNormalizedISODate(d.date));
    const today = normalizeToDate(new Date());

    if (!dates.some(d => d.getTime() === today.getTime())) {
      return [...dates, today];
    }
    return dates;
  }, [availableDates]);

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
                    minDate={datePickerMinMax.min}
                    maxDate={datePickerMinMax.max}
                    current={selectedDate}
                    availableDates={datePickerAvailableDates}
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
              <MenuAlert
                title={t("noMealAvailable")}
                description={t("noMealAvailableDescription")}
                description2={t("noMealAvailableDescription2")}
              />
            ) : selectedDateMeals.length === 0 ? (
              <MenuAlert title={t("noMenuAvailable")} />
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
