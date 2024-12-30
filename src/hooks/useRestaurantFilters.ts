import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { filterRestaurants, buildQueryString, Filters } from "@/lib/filters";
import { Region, Restaurant } from "@/services/types";
import { findRestaurantsAroundPosition, getGeoLocation } from "@/lib/utils";
import { getRegions } from "@/services/region-service";
import { useUserPreferences } from "@/store/userPreferencesStore";

export function useRestaurantFilters(
  restaurants: Restaurant[],
  setFilteredRestaurants: (restaurants: Restaurant[]) => void,
  allRegionText = "Toutes les régions",
  setLoading: (loading: boolean) => void
) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    isPmr: false,
    isOpen: false,
    region: -1,
    izly: false,
    card: false,
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [geoLocError, setGeoLocError] = useState<string | null>(null);

  const { favoriteRegion } = useUserPreferences();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from URL search parameters
  const initializeFilters = useCallback(() => {
    const tempFilters: Filters = {
      search: searchParams.get("search") || "",
      isPmr: searchParams.get("ispmr") === "true",
      isOpen: searchParams.get("open") === "true",
      region: favoriteRegion
        ? favoriteRegion.code
        : parseInt(searchParams.get("region") || "-1", 10),
      izly: searchParams.get("izly") === "true",
      card: searchParams.get("card") === "true",
    };
    setFilters(tempFilters);
  }, [searchParams]);

  // Request user location and find nearby restaurants
  const handleLocationRequest = useCallback(async () => {
    setLoading(true);
    try {
      const position = await getGeoLocation();
      if (position) {
        const nearbyRestaurants = findRestaurantsAroundPosition(
          restaurants,
          position,
          10
        );
        if (nearbyRestaurants.length > 0) {
          setFilteredRestaurants(nearbyRestaurants);
        }
      }
    } catch (error: any) {
      setGeoLocError(error.message);
    } finally {
      setLoading(false);
    }
  }, [restaurants, setFilteredRestaurants]);

  // Reset filters and show all restaurants
  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      isPmr: false,
      isOpen: false,
      region: -1,
      izly: false,
      card: false,
    });
    setFilteredRestaurants(restaurants);
  }, [restaurants, setFilteredRestaurants]);

  // Debounced filtering logic
  const debouncedFilterRestaurants = useDebounceCallback(() => {
    const filtered = filterRestaurants(restaurants, filters);
    setFilteredRestaurants(filtered);
  }, 300);

  // Update query string whenever filters change
  useEffect(() => {
    const queryString = buildQueryString(filters);
    router.push(`${pathname}?${queryString}`);
  }, [filters, router, pathname]);

  // Trigger debounced filtering when filters change
  useEffect(() => {
    debouncedFilterRestaurants();
    return () => debouncedFilterRestaurants.cancel();
  }, [filters]);

  // Fetch regions and initialize filters on mount
  useEffect(() => {
    setLoading(true);
    initializeFilters();

    getRegions()
      .then((result) => {
        if (result.success) {
          const fetchedRegions = result.data;
          fetchedRegions.unshift({ code: -1, libelle: allRegionText });
          setRegions(fetchedRegions);
        } else {
          console.error(result.error);
        }
      })
      .finally(() => setLoading(false));
  }, [initializeFilters]);

  return {
    filters,
    setFilters,
    regions,
    setLoading,
    geoLocError,
    handleLocationRequest,
    resetFilters,
  };
}
