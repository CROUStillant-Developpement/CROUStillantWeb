"use client";

import { useEffect, useState } from "react";
import { RestaurantActivity } from "@/services/types";
import { getRestaurantActivity } from "@/services/activity-service";

/**
 * Custom React hook to fetch a restaurant's activity (last updated, ingestion history).
 *
 * @param restaurantCode - The unique code identifying the restaurant.
 * @returns An object containing the activity data and loading state.
 */
export function useRestaurantActivity(restaurantCode: number) {
  const [activity, setActivity] = useState<RestaurantActivity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getRestaurantActivity(restaurantCode).then((result) => {
      if (cancelled) return;

      if (result.success) {
        setActivity(result.data);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [restaurantCode]);

  return { activity, loading, error };
}
