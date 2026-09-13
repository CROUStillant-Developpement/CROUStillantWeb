"use client";

import { useEffect, useMemo, useState } from "react";
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
  mode: "future" | "history" | "all";
  defaultDate?: Date;
  /**
   * Menus already fetched server-side. When provided, the first render (the one
   * sent in the HTML, so the one crawlers see) shows the menu straight away
   * instead of waiting for hydration to kick off a fetch.
   */
  initialMenu?: Menu[];
  /** Available dates already fetched server-side, same rationale as `initialMenu`. */
  initialDates?: DateMenu[];
}

/**
 * Custom React hook to manage and fetch restaurant menu data for a given restaurant and mode (future, history, or all).
 *
 * This hook provides state and logic for:
 * - Fetching available menu dates (future, history, or all) for a restaurant.
 * - Fetching and caching menu data for a selected date.
 * - Managing loading states for menu and dates.
 * - Selecting and exposing meals for breakfast, lunch, and dinner for the selected date.
 * - Handling unavailable menu dates via a blacklist.
 *
 * @param restaurantCode - The unique code identifying the restaurant.
 * @param mode - The mode of operation: `"future"`, `"history"`, or `"all"`.
 * @param defaultDate - The date selected on first render (defaults to today).
 * @param initialMenu - Menus prefetched server-side, rendered without waiting for hydration.
 * @param initialDates - Available dates prefetched server-side.
 * @returns An object containing hook state and functions.
 */
export function useRestaurantMenu({
  restaurantCode,
  mode,
  defaultDate,
  initialMenu,
  initialDates,
}: UseRestaurantMenuOptions) {
  const hasInitialMenu = Boolean(initialMenu && initialMenu.length > 0);

  const [menu, setMenu] = useState<Menu[]>(initialMenu ?? []);
  const [dates, setDates] = useState<DateMenu[]>(initialDates ?? []);
  const [selectedDate, setSelectedDate] = useState<Date>(
    normalizeToDate(defaultDate ?? new Date())
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
            // Only set selectedDate if not already set by defaultDate
            setSelectedDate(
              (prev) => prev ?? formatToISODate(menuResult.data[0].date)
            );
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
        } else if (mode === "history") {
          // HISTORY mode
          const result = await getDatesMenuAvailable(restaurantCode);
          if (result.success && result.data) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const pastDates = result.data.filter(
              (d) => normalizeToDate(formatToISODate(d.date)) < today
            );
            setDates(pastDates);
            if (pastDates.length > 0) {
              setSelectedDate(
                (prev) => prev ?? formatToISODate(pastDates[0].date)
              );
            } else {
              setNoHistoryAtAll(true);
            }
          } else {
            setNoHistoryAtAll(true);
          }
        } else {
          // ALL mode
          const result = await getDatesMenuAvailable(restaurantCode);
          if (result.success && result.data) {
            // Remove duplicates and sort by date ascending
            const uniqueDates = result.data.filter(
              (date, index, self) =>
                index === self.findIndex((d) => d.date === date.date)
            );
            
            uniqueDates.sort((a, b) => 
               normalizeToDate(formatToISODate(a.date)).getTime() - 
               normalizeToDate(formatToISODate(b.date)).getTime()
            );
            
            setDates(uniqueDates);
            
            if (uniqueDates.length === 0) {
               setNoMenuAtAll(true);
            } else {
               // Find today or closest future date
               const today = new Date();
               today.setHours(0, 0, 0, 0);
               const closestDate = uniqueDates.find(d => 
                  normalizeToDate(formatToISODate(d.date)) >= today
               ) || uniqueDates[uniqueDates.length - 1];

               setSelectedDate(prev => prev ?? formatToISODate(closestDate.date));
            }
          } else if (!hasInitialMenu) {
            // A server-prefetched menu proves at least one exists: a failure on
            // the date list must not wipe out the menu already being displayed.
            setNoMenuAtAll(true);
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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${day}-${month}-${date.getFullYear()}`;

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

  // The selected date's meals are *derived* from `menu` rather than held in
  // state fed by an effect. That is what lets the server render contain the menu
  // when `initialMenu` is provided: an effect never runs during SSR, a `useMemo`
  // does.
  const selectedDateMenu = useMemo(
    () =>
      menu.find(
        (m) =>
          normalizeToDate(formatToISODate(m.date)).getTime() ===
          normalizeToDate(selectedDate).getTime()
      ),
    [menu, selectedDate]
  );

  const selectedDateMeals: Repas[] = useMemo(
    () => selectedDateMenu?.repas ?? [],
    [selectedDateMenu]
  );

  const selectedDateBreakfast =
    selectedDateMeals.find((r) => r.type === "matin") ?? null;
  const selectedDateLunch =
    selectedDateMeals.find((r) => r.type === "midi") ?? null;
  const selectedDateDinner =
    selectedDateMeals.find((r) => r.type === "soir") ?? null;

  useEffect(() => {
    // Menu already known (prefetched server-side or loaded earlier).
    if (selectedDateMenu) {
      return;
    }

    if (mode !== "history" && mode !== "all") {
      return;
    }

    // Date already known to have no menu -> no point asking the API again.
    const isBlacklisted = blacklistedDates.some(
      (d) =>
        normalizeToDate(d).getTime() === normalizeToDate(selectedDate).getTime()
    );

    if (isBlacklisted) {
      return;
    }

    setMenuLoading(true);

    fetchMenuForDate(selectedDate).finally(() => {
      setMenuLoading(false);
    });
  }, [selectedDate, selectedDateMenu, blacklistedDates, mode]);

  return {
    // With prefetched menus the first render already has content: showing the
    // skeleton on top of it would make the page flicker on hydration.
    menuLoading: menuLoading && !hasInitialMenu,
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
