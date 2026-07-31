"use client";

import { useEffect, useState } from "react";
import { RestaurantInsights } from "@/services/types";
import { getRestaurantInsights } from "@/services/insights-service";

/**
 * Custom React hook to fetch a restaurant's insights (menu coverage and most
 * frequent dishes for the current school year).
 *
 * @param restaurantCode - The unique code identifying the restaurant.
 * @returns An object containing the insights data and loading state.
 */
export function useRestaurantInsights(restaurantCode: number) {
  const [insights, setInsights] = useState<RestaurantInsights | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    getRestaurantInsights(restaurantCode).then((result) => {
      if (cancelled) return;

      if (result.success) {
        setInsights(result.data);
      } else {
        setError(true);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [restaurantCode]);

  return { insights, loading, error };
}
