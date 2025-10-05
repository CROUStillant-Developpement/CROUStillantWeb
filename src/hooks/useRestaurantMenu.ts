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

/**
 * Custom React hook to manage and fetch restaurant menu data for a given restaurant and mode (future or history).
 *
 * This hook provides state and logic for:
 * - Fetching available menu dates (future or history) for a restaurant.
 * - Fetching and caching menu data for a selected date.
 * - Managing loading states for menu and dates.
 * - Selecting and exposing meals for breakfast, lunch, and dinner for the selected date.
 * - Handling unavailable menu dates via a blacklist.
 *
 * @param restaurantCode - The unique code identifying the restaurant.
 * @param mode - The mode of operation, either `"future"` for upcoming menus or `"history"` for past menus.
 * @returns An object containing:
 * - `menuLoading`: Indicates if the menu data is currently loading.
 * - `datesLoading`: Indicates if the available dates are currently loading.
 * - `dates`: Array of available dates for the menu.
 * - `menu`: Array of menu data for the restaurant.
 * - `selectedDate`: The currently selected date.
 * - `setSelectedDate`: Setter for the selected date.
 * - `selectedDateMeals`: Array of meals for the selected date.
 * - `selectedDateBreakfast`: The breakfast meal for the selected date, if available.
 * - `selectedDateLunch`: The lunch meal for the selected date, if available.
 * - `selectedDateDinner`: The dinner meal for the selected date, if available.
 */
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
  const [noMenuAtAll, setNoMenuAtAll] = useState<boolean>(false);
  const [noHistoryAtAll, setNoHistoryAtAll] = useState<boolean>(false);

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
          } else {
            setNoMenuAtAll(true);
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
          console.log(result);
          if (result.success && result.data) {
            const today = new Date();
            const pastDates = result.data.filter(
              (d) => new Date(d.date) < today
            );
            setDates(pastDates);
            if (pastDates.length > 0) {
              setSelectedDate(formatToISODate(pastDates[0].date));
            } else {
              setNoHistoryAtAll(true);
            }
          } else {
            console.log(
              "Failed to fetch history dates, setting noHistoryAtAll to true"
            );
            setNoHistoryAtAll(true);
          }
        }
      } finally {
        setMenuLoading(false);
        setDatesLoading(false);
      }
    };

    fetchData();
  }, [restaurantCode, mode]);

  /**
   * Fetches the restaurant menu for a specific date and updates the local state.
   *
   * Formats the provided date, retrieves the menu using the restaurant code and formatted date,
   * and updates the menu state if successful. If the menu is not found or the request fails,
   * adds the date to the list of blacklisted dates.
   *
   * @param date - The date for which to fetch the restaurant menu.
   * @returns A promise that resolves when the menu fetch and state update are complete.
   */
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

    // If menu for this date already exists, update state immediately
    if (selectedDateMenu) {
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
      return;
    }

    // No menu yet → fetch it if needed
    if (
      mode === "history" &&
      blacklistedDates.every((d) => d.getTime() !== selectedDate.getTime())
    ) {
      setMenuLoading(true);

      fetchMenuForDate(selectedDate)
        .catch(() => {
          // Fetch failed → clear meals (menu not found)
          setSelectedDateMeals([]);
          setSelectedDateBreakfast(null);
          setSelectedDateLunch(null);
          setSelectedDateDinner(null);
        })
        .finally(() => {
          setMenuLoading(false);
        });

      // 🚫 Don't clear meals immediately — wait for fetch result
      return;
    }

    // If blacklisted (known no menu), clear immediately
    setSelectedDateMeals([]);
    setSelectedDateBreakfast(null);
    setSelectedDateLunch(null);
    setSelectedDateDinner(null);
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
    noMenuAtAll,
    noHistoryAtAll,
  };
}
