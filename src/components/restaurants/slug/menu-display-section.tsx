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
import MenuLiveStatus from "./menu-live-status";
import { FollowedDishMatch } from "@/lib/followed-dishes";

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
  /** Enables the "add to calendar" shortcut on each meal card. */
  restaurant?: { code: number; nom: string };
  /** Whether the menu is being kept up to date in real time. */
  live?: boolean;
  /** When a real-time update last refreshed the menu, if one did. */
  lastUpdated?: Date | null;
  /** Upcoming dishes the user follows at this restaurant: starred on their day. */
  followedMatches?: FollowedDishMatch[];
}

const EMPTY_MATCHES: FollowedDishMatch[] = [];

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
  restaurant,
  live = false,
  lastUpdated = null,
  followedMatches = EMPTY_MATCHES,
}: MenuDisplaySectionProps) {
  const t = useTranslations("RestaurantPage");
  const locale = useLocale();

  const starredDates = useMemo(
    () => new Set(followedMatches.map((match) => match.date)),
    [followedMatches]
  );

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
    <div className="flex flex-col w-full min-w-0">
      <div className="flex flex-col gap-4 sm:gap-6 font-medium min-w-0 w-full max-w-full">
        {!noMenuAtAll && (
          <div className="sticky top-0 z-30 -mt-4 pt-4 sm:-mt-6 sm:pt-6 min-w-0 before:absolute before:inset-x-0 before:top-0 before:h-8 sm:before:h-10 before:bg-background">
          <div className="relative overflow-hidden min-w-0 bg-background/60 backdrop-blur-xl p-3 md:p-4 ring-1 ring-primary/5 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs">
            <div className="flex flex-col gap-2 sm:gap-3 max-w-full min-w-0 w-full">
              <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="hidden sm:inline-flex bg-primary/10 text-primary p-2 rounded-xl">
                      <CalendarCheck className="w-6 h-6" />
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
                  <MenuLiveStatus live={live} lastUpdated={lastUpdated} />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <DatePicker
                    onDateChange={onDateChange}
                    minDate={datePickerMinMax.min}
                    maxDate={datePickerMinMax.max}
                    current={selectedDate}
                    availableDates={datePickerAvailableDates}
                  />
                </div>
              </div>

              <div className="relative w-full min-w-0 group">
                <DateScroller
                  availableDates={filteredDates}
                  selectedDate={selectedDate}
                  onDateChange={onDateChange}
                  starredDates={starredDates}
                />
              </div>
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
          <div className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full px-2 sm:p-4 sm:pb-0">
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
                  className="flex flex-col gap-4 sm:gap-6"
                >
                  <MealsDisplay
                    selectedDateBreakfast={selectedDateBreakfast}
                    selectedDateLunch={selectedDateLunch}
                    selectedDateDinner={selectedDateDinner}
                    date={selectedDate}
                    restaurant={restaurant}
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
