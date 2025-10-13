"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { formatToISODate } from "@/lib/utils";
import RestaurantCalendar from "./calendar";
import DatePicker from "./date-picker";
import MenuDisplaySection from "@/components/restaurants/slug/menu-display-section";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { useUmami } from "next-umami";

interface MenuHistoryProps {
  restaurantCode: number;
  showHistory?: boolean;
  setShowHistory?: (show: boolean) => void;
  initialSelectedDate?: Date | null;
}

export default function MenuHistorySection({
  restaurantCode,
  showHistory: showHistoryProp = false,
  setShowHistory: setShowHistoryProp,
  initialSelectedDate = null,
}: MenuHistoryProps) {
  const [showHistory, setShowHistory] = useState(showHistoryProp);
  const [selectedDateOverride, setSelectedDateOverride] = useState<Date | null>(
    initialSelectedDate
  );
  const {
    menuLoading,
    datesLoading,
    dates,
    selectedDate,
    setSelectedDate,
    selectedDateMeals,
    selectedDateBreakfast,
    selectedDateLunch,
    selectedDateDinner,
    noHistoryAtAll,
  } = useRestaurantMenu({
    restaurantCode,
    mode: "history",
    defaultDate: selectedDateOverride ?? undefined,
  });

  const t = useTranslations("RestaurantPage");
  const umami = useUmami();

  // Sync showHistory state with prop if provided
  useEffect(() => {
    if (typeof setShowHistoryProp === "function") {
      setShowHistoryProp(showHistory);
    }
  }, [showHistory]);

  // If initialSelectedDate changes (from parent), update selectedDateOverride
  useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDateOverride(initialSelectedDate);
      setShowHistory(true);
    }
  }, [initialSelectedDate]);

  return (
    <section className="mt-12 border-t pt-8" id="history">
      <div className="flex items-center flex-wrap w-full gap-2">
        <h1 className="font-bold text-3xl text-center">{t("menuHistory")}</h1>
        <Badge>{t("newBadge")}</Badge>
      </div>

      {showHistory && !noHistoryAtAll ? (
        <MenuDisplaySection
          menuLoading={menuLoading}
          datesLoading={datesLoading}
          selectedDate={selectedDate}
          selectedDateMeals={selectedDateMeals}
          selectedDateBreakfast={selectedDateBreakfast}
          selectedDateLunch={selectedDateLunch}
          selectedDateDinner={selectedDateDinner}
          rightPanel={
            <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {t("pastDays")}
              </legend>
              {dates.length > 0 && (
                <>
                  <DatePicker
                    onDateChange={setSelectedDate}
                    minDate={formatToISODate(dates[0].date)}
                    maxDate={formatToISODate(dates[dates.length - 1].date)}
                    current={selectedDate}
                  />
                  <RestaurantCalendar
                    availableDates={dates}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    menuIsLoading={menuLoading}
                    href="#history"
                    showYear={true}
                  />
                </>
              )}
            </fieldset>
          }
        />
      ) : !noHistoryAtAll ? (
        <div className="text-muted-foreground mt-4">
          {t("menuHistoryCta")}
          <br />
          <Button
            onClick={() => {
              setShowHistory(true);
              umami.event("MenuHistory.Requested", { restaurantCode });
            }}
            className="mt-2"
          >
            {t("menuHistoryCtaBtn")}
          </Button>
        </div>
      ) : (
        <div className="text-muted-foreground mt-4">
          {t("noMenuHistoryAtAll")}
        </div>
      )}
    </section>
  );
}
