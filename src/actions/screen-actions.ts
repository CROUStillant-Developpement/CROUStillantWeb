"use server";

import { getMenuByRestaurantId } from "@/services/menu-service";
import { Menu } from "@/services/types";
import { getNormalizedISODate, normalizeToDate } from "@/lib/utils";

// See REFRESH_MAX_AGE in useRestaurantMenu: screens showing the same
// restaurant share one API call when an update comes in.
const FRESH_MAX_AGE = 10 * 1000; // 10 seconds in milliseconds

/**
 * Fetches today's menu for a restaurant.
 * Uses the 5-minute cached endpoint so calling this every 5 minutes
 * will always return fresh data.
 *
 * @param restaurantId - Restaurant ID
 * @param fresh - Bypasses the cache; used when the API has just reported a change.
 */
export async function fetchTodayMenuForScreen(
  restaurantId: number,
  fresh: boolean = false
): Promise<Menu | null> {
  const result = await getMenuByRestaurantId(
    restaurantId,
    fresh ? { maxAge: FRESH_MAX_AGE } : {}
  );
  if (!result.success || !result.data) return null;

  const today = normalizeToDate(new Date());

  const todayMenu = result.data.find((m) => {
    try {
      return getNormalizedISODate(m.date).getTime() === today.getTime();
    } catch {
      return false;
    }
  });

  return todayMenu ?? null;
}
