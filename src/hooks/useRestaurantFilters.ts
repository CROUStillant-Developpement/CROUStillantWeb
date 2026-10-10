import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import log from "@/lib/log";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import {
  filterRestaurants,
  buildQueryString,
  Filters,
  sortRestaurants,
  DEFAULT_FILTERS,
  filtersFromSearchParams,
} from "@/lib/filters";
import { Restaurant } from "@/services/types";
import { getGeoLocation } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useUserPreferences } from "@/store/userPreferencesStore";

export function useRestaurantFilters(
  restaurants: Restaurant[],
  setFilteredRestaurants: (restaurants: Restaurant[]) => void,
  setLoading: (loading: boolean) => void
) {
  const initialFilters = DEFAULT_FILTERS;

  const searchParams = useSearchParams();
  // Read from the URL straight away, not in an effect: the caller renders the
  // list filtered the same way from its first render (server included), so
  // there is nothing to wait for and no loading state on arrival.
  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromSearchParams(searchParams)
  );
  const [geoLocError, setGeoLocError] = useState<string | null>(null);
  const userPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const { favouriteRegion } = useUserPreferences();
  const isFirstRender = useRef(true);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

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
    log.info(["handleLocationRequest"], "dev");
    setLoading(true);
    try {
      const position = await getGeoLocation();

      if (position) {
        userPositionRef.current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setFilters((prev) => ({ ...prev, nearMe: true }));
      } else {
        throw new Error();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setGeoLocError(error.message);
      setLoading(false);
    }
  }, []);

  /**
   * Resets the restaurant filters to their default values and updates the filtered restaurants list.
   * useCallback is used to memoize the function and prevent unnecessary re-renders.
   *
   * @function
   * @name resetFilters
   * @returns {void}
   */
  const resetFilters = useCallback(() => {
    log.info(["resetFilters"], "dev");
    userPositionRef.current = null;
    setFilters({
      search: "",
      isPmr: false,
      isOpen: false,
      crous: -1,
      restaurantCityAsc: false,
      restaurantCityDesc: false,
      restaurantNameAsc: false,
      restaurantNameDesc: false,
      restaurantType: -1,
      nearMe: false,
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
    const filtered = filterRestaurants(restaurants, filters, userPositionRef.current);

    log.info(["debouncedFilterRestaurants", filters, filtered.length], "dev");

    // pass 2: sort restaurants based on filters
    const sorted = sortRestaurants(filtered, filters, locale);

    setFilteredRestaurants(sorted);
    setLoading(false);
  }, 300);

  // Update query string whenever filters change.
  // scroll: false — otherwise Next.js resets the window scroll to top on every
  // filter change (e.g. clicking a region on the map), which on the map view
  // pushes the sticky map back down under the page header.
  useEffect(() => {
    // The initial filters come from the URL, so it is already up to date.
    if (isFirstRender.current) return;
    log.info(["useEffect change query string"], "dev");
    const queryString = buildQueryString(filters);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [filters, router, pathname]);

  // Trigger debounced filtering when filters change
  useEffect(() => {
    // The list is rendered with the initial filters already applied.
    if (isFirstRender.current) return;
    log.info(["useEffect debouncedFilterRestaurants"], "dev");
    setLoading(true);

    debouncedFilterRestaurants();
    return () => debouncedFilterRestaurants.cancel();
  }, [filters]);

  // The favourite region lives in localStorage, so unlike the URL it can only
  // be applied once in the browser. An explicit region in the URL wins.
  useEffect(() => {
    isFirstRender.current = false;
    if (favouriteRegion && !searchParams.get("region")) {
      setFilters((prev) => ({ ...prev, crous: favouriteRegion.code }));
    }
  }, []);

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
