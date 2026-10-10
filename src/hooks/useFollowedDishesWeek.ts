"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { getMenuByRestaurantId } from "@/services/menu-service";
import { findFollowedDishes, FollowedDishMatch } from "@/lib/followed-dishes";
import { getNormalizedISODate, normalizeToDate } from "@/lib/utils";

// One request per favourite restaurant: keep it bounded.
const MAX_RESTAURANTS = 8;
const DAYS_AHEAD = 7;

export interface FollowedDishWeekMatch extends FollowedDishMatch {
  restaurant: { code: number; nom: string };
}

/**
 * Finds the followed dishes that the user's favourite restaurants serve in the
 * coming week.
 *
 * Followed dishes and favourites live in localStorage, so nothing is known
 * (and nothing is fetched) until the page has hydrated.
 *
 * @returns `matches` is `null` while loading, then sorted soonest first;
 * `hasFollowedDishes` and `hasFavourites` tell an empty result apart from a
 * visitor who has not set anything up.
 */
export function useFollowedDishesWeek() {
  const hydrated = useHydrated();
  const favourites = useUserPreferences((state) => state.favourites);
  const followedDishes = useUserPreferences((state) => state.followedDishes);

  const [matches, setMatches] = useState<FollowedDishWeekMatch[] | null>(null);

  useEffect(() => {
    if (!hydrated || followedDishes.length === 0 || favourites.length === 0) {
      setMatches(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const today = normalizeToDate(new Date()).getTime();
      const lastDay = today + DAYS_AHEAD * 24 * 60 * 60 * 1000;

      const results = await Promise.all(
        favourites.slice(0, MAX_RESTAURANTS).map(async (favourite) => {
          const menus = await getMenuByRestaurantId(favourite.code);
          if (!menus.success) return [];

          return findFollowedDishes(menus.data, followedDishes).map((match) => ({
            ...match,
            restaurant: { code: favourite.code, nom: favourite.name },
          }));
        })
      );

      if (cancelled) return;

      setMatches(
        results
          .flat()
          .filter((match) => {
            const time = getNormalizedISODate(match.date).getTime();
            return time >= today && time < lastDay;
          })
          .sort(
            (a, b) =>
              getNormalizedISODate(a.date).getTime() - getNormalizedISODate(b.date).getTime()
          )
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, favourites, followedDishes]);

  return {
    matches,
    hasFollowedDishes: hydrated && followedDishes.length > 0,
    hasFavourites: hydrated && favourites.length > 0,
  };
}
