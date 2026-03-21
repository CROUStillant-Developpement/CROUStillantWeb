"use server";

import { getMenuByRestaurantId } from "@/services/menu-service";
import { Menu } from "@/services/types";
import { getNormalizedISODate, normalizeToDate } from "@/lib/utils";

/**
 * Fetches today's menu for a restaurant.
 * Uses the 5-minute cached endpoint so calling this every 5 minutes
 * will always return fresh data.
 */
export async function fetchTodayMenuForScreen(
  restaurantId: number
): Promise<Menu | null> {
  const result = await getMenuByRestaurantId(restaurantId);
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
