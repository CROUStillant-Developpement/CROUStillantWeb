"use client";

import { useEffect, useState } from "react";
import { Menu, Repas, DateMenu } from "@/services/types";
import {
  getMenuByRestaurantId,
  getMenuByRestaurantIdAndDate,
  getFutureDatesMenuAvailable,
  getDatesMenuAvailable,
} from "@/services/menu-service";
import { formatToISODate, normalizeToDate } from "@/lib/utils";

interface UseRestaurantMenuOptions {
  restaurantCode: number;
  mode: "future" | "history";
}

export function useRestaurantMenu({
  restaurantCode,
  mode,
}: UseRestaurantMenuOptions) {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [dates, setDates] = useState<DateMenu[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateMeals, setSelectedDateMeals] = useState<Repas[]>([]);
  const [selectedDateBreakfast, setSelectedDateBreakfast] =
    useState<Repas | null>(null);
  const [selectedDateLunch, setSelectedDateLunch] = useState<Repas | null>(
    null
  );
  const [selectedDateDinner, setSelectedDateDinner] = useState<Repas | null>(
    null
  );
  const [menuLoading, setMenuLoading] = useState<boolean>(false);
  const [datesLoading, setDatesLoading] = useState<boolean>(false);
  const [blacklistedDates, setBlacklistedDates] = useState<Date[]>([]);

  useEffect(() => {
    setMenuLoading(true);
    setDatesLoading(true);

    const fetchData = async () => {
      try {
        if (mode === "future") {
          const [menuResult, futureDatesResult] = await Promise.all([
            getMenuByRestaurantId(restaurantCode),
            getFutureDatesMenuAvailable(restaurantCode),
          ]);

          if (menuResult.success && menuResult.data.length > 0) {
            setMenu(menuResult.data);
            setSelectedDate(formatToISODate(menuResult.data[0].date));
          }

          if (futureDatesResult.success && futureDatesResult.data) {
            // Remove duplicates
            const uniqueDates = futureDatesResult.data.filter(
              (date, index, self) =>
                index === self.findIndex((d) => d.date === date.date)
            );
            setDates(uniqueDates);
          }
        } else {
          // HISTORY mode
          const result = await getDatesMenuAvailable(restaurantCode);
          if (result.success && result.data) {
            const today = new Date();
            const pastDates = result.data.filter(
              (d) => new Date(d.date) < today
            );
            setDates(pastDates);
            if (pastDates.length > 0) {
              setSelectedDate(formatToISODate(pastDates[0].date));
            }
          }
        }
      } finally {
        setMenuLoading(false);
        setDatesLoading(false);
      }
    };

    fetchData();
  }, [restaurantCode, mode]);

  const fetchMenuForDate = async (date: Date) => {
    const formattedDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    const result = await getMenuByRestaurantIdAndDate(
      restaurantCode,
      formattedDate
    );
    if (result.success && result.data) {
      setMenu((prev) => [...prev, result.data as Menu]);
    } else {
      setBlacklistedDates((prev) => [...prev, date]);
    }
  };

  useEffect(() => {
    const selectedDateMenu = menu.find(
      (m) =>
        normalizeToDate(formatToISODate(m.date)).getTime() ===
        normalizeToDate(selectedDate).getTime()
    );

    if (!selectedDateMenu) {
      if (
        mode === "history" &&
        blacklistedDates.every((d) => d.getTime() !== selectedDate.getTime())
      ) {
        setMenuLoading(true);
        fetchMenuForDate(selectedDate).finally(() => setMenuLoading(false));
      }
      setSelectedDateMeals([]);
      setSelectedDateBreakfast(null);
      setSelectedDateLunch(null);
      setSelectedDateDinner(null);
      return;
    }

    setSelectedDateMeals(selectedDateMenu.repas);
    setSelectedDateBreakfast(
      selectedDateMenu.repas.find((r) => r.type === "matin") ?? null
    );
    setSelectedDateLunch(
      selectedDateMenu.repas.find((r) => r.type === "midi") ?? null
    );
    setSelectedDateDinner(
      selectedDateMenu.repas.find((r) => r.type === "soir") ?? null
    );
  }, [selectedDate, menu]);

  return {
    menuLoading,
    datesLoading,
    dates,
    menu,
    selectedDate,
    setSelectedDate,
    selectedDateMeals,
    selectedDateBreakfast,
    selectedDateLunch,
    selectedDateDinner,
  };
}
