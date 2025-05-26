import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import {
  filterRestaurants,
  buildQueryString,
  Filters,
  sortRestaurants,
} from "@/lib/filters";
import { Restaurant } from "@/services/types";
import { findRestaurantsAroundPosition, getGeoLocation } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useUserPreferences } from "@/store/userPreferencesStore";

export function useRestaurantFilters(
  restaurants: Restaurant[],
  setFilteredRestaurants: (restaurants: Restaurant[]) => void,
  setLoading: (loading: boolean) => void
) {
  const initialFilters: Filters = {
    search: "",
    isPmr: false,
    isOpen: false,
    crous: -1,
    izly: false,
    card: false,
    restaurantCityAsc: false,
    restaurantCityDesc: false,
    restaurantNameAsc: false,
    restaurantNameDesc: false,
    restaurantType: -1,
  };

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [geoLocError, setGeoLocError] = useState<string | null>(null);
  const { favouriteRegion } = useUserPreferences();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  /**
   * Initializes the filters for the restaurant search based on URL search parameters.
   *
   * This function uses the `searchParams` to extract filter values from the URL and sets the filters accordingly.
   *
   * @remarks
   * The filters include:
   * - `search`: A string representing the search query.
   * - `isPmr`: A boolean indicating if the restaurant is PMR accessible.
   * - `isOpen`: A boolean indicating if the restaurant is currently open.
   * - `region`: A number representing the region ID.
   * - `izly`: A boolean indicating if the restaurant accepts Izly payments.
   * - `card`: A boolean indicating if the restaurant accepts card payments.
   *
   * @param searchParams - The URLSearchParams object containing the search parameters.
   *
   * @returns void
   */
  const initializeFilters = useCallback(() => {
    if (process.env.NODE_ENV === "development")
      console.info("initializeFilters");
    setLoading(true);
    const tempFilters: Filters = {
      search: searchParams.get("search") || "",
      isPmr: searchParams.get("ispmr") === "true",
      isOpen: searchParams.get("open") === "true",
      crous: parseInt(
        searchParams.get("region") || favouriteRegion?.code.toString() || "-1",
        10
      ), // if no region is set, use the user's favourite region otherwise use -1
      izly: searchParams.get("izly") === "true",
      card: searchParams.get("card") === "true",
      restaurantCityAsc: searchParams.get("restaurantCityAsc") === "true",
      restaurantCityDesc: searchParams.get("restaurantCityDesc") === "true",
      restaurantNameAsc: searchParams.get("restaurantNameAsc") === "true",
      restaurantNameDesc: searchParams.get("restaurantNameDesc") === "true",
      restaurantType: parseInt(searchParams.get("restaurantType") || "-1", 10),
    };
    setFilters(tempFilters);
  }, []);

  /**
   * Handles the request to get the user's current geolocation and find nearby restaurants.
   * useCallback is used to memoize the function and prevent unnecessary re-renders.
   *
   * This function sets the loading state to true while it attempts to get the user's geolocation.
   * If the geolocation is successfully retrieved, it finds restaurants around the user's position
   * within a 10 km radius and updates the filtered restaurants state with the nearby restaurants.
   * If an error occurs during the geolocation request, it sets the geolocation error state with the error message.
   * Finally, it sets the loading state to false.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the location request is complete.
   */
  const handleLocationRequest = useCallback(async () => {
    if (process.env.NODE_ENV === "development")
      console.info("handleLocationRequest");
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
      } else {
        throw new Error();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setGeoLocError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setFilteredRestaurants]);

  /**
   * Resets the restaurant filters to their default values and updates the filtered restaurants list.
   * useCallback is used to memoize the function and prevent unnecessary re-renders.
   *
   * @function
   * @name resetFilters
   * @returns {void}
   */
  const resetFilters = useCallback(() => {
    if (process.env.NODE_ENV === "development") console.info("resetFilters");
    setFilters({
      search: "",
      isPmr: false,
      isOpen: false,
      crous: -1,
      izly: false,
      card: false,
      restaurantCityAsc: false,
      restaurantCityDesc: false,
      restaurantNameAsc: false,
      restaurantNameDesc: false,
      restaurantType: -1,
    });
    setFilteredRestaurants(restaurants);
  }, [setFilteredRestaurants]);

  /**
   * Debounced function to filter restaurants based on the provided filters.
   * This function uses a debounce mechanism to limit the rate at which the filtering
   * operation is performed, reducing the number of times the filtering logic is executed.
   *
   *
   * @constant
   * @function
   * @name debouncedFilterRestaurants
   * @returns {void}
   */
  const debouncedFilterRestaurants = useDebounceCallback(() => {
    // pass 1: filter restaurants based on filters
    const filtered = filterRestaurants(restaurants, filters);

    if (process.env.NODE_ENV === "development")
      console.info("debouncedFilterRestaurants", filters, filtered.length);

    // pass 2: sort restaurants based on filters
    const sorted = sortRestaurants(filtered, filters, locale);

    setFilteredRestaurants(sorted);
    setLoading(false);
  }, 300);

  // Update query string whenever filters change
  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.info("useEffect change query string");
    const queryString = buildQueryString(filters);
    router.push(`${pathname}?${queryString}`);
  }, [filters, router, pathname]);

  // Trigger debounced filtering when filters change
  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.info("useEffect debouncedFilterRestaurants");
    setLoading(true);

    debouncedFilterRestaurants();
    return () => debouncedFilterRestaurants.cancel();
  }, [filters]);

  // Fetch regions and initialize filters on mount
  useEffect(() => {
    initializeFilters();
  }, [initializeFilters]);

  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).reduce((count, key) => {
      const currentValue = filters[key as keyof Filters];
      const initialValue = initialFilters[key as keyof Filters];

      // Increment count if the current value differs from the initial value
      return currentValue !== initialValue ? count + 1 : count;
    }, 0);
  }, [filters]);

  return {
    filters,
    setFilters,
    setLoading,
    geoLocError,
    handleLocationRequest,
    resetFilters,
    activeFilterCount,
  };
}
