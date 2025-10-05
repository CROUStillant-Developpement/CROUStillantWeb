"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { formatToISODate } from "@/lib/utils";
import RestaurantCalendar from "./calendar";
import DatePicker from "./date-picker";
import MenuDisplaySection from "@/components/restaurants/slug/menu-display-section";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";

interface MenuHistoryProps {
  restaurantCode: number;
}

export default function MenuHistorySection({
  restaurantCode,
}: MenuHistoryProps) {
  const [showHistory, setShowHistory] = useState(false);
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
  } = useRestaurantMenu({ restaurantCode, mode: "history" });

  const t = useTranslations("RestaurantPage");

  return (
    <section className="mt-12 border-t pt-8">
      <div className="flex items-center flex-wrap w-full gap-2">
        <h1 className="font-bold text-3xl text-center" id="history">
          {t("menuHistory")}
          {noHistoryAtAll ? "No History" : "History"}
        </h1>
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
          <Button onClick={() => setShowHistory(true)} className="mt-2">
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
