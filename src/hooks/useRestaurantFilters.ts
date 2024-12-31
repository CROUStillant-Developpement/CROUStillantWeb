import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { filterRestaurants, buildQueryString, Filters } from "@/lib/filters";
import { Region, Restaurant } from "@/services/types";
import { findRestaurantsAroundPosition, getGeoLocation } from "@/lib/utils";
import { getRegions } from "@/services/region-service";

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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
    console.log("initializeFilters");
    const tempFilters: Filters = {
      search: searchParams.get("search") || "",
      isPmr: searchParams.get("ispmr") === "true",
      isOpen: searchParams.get("open") === "true",
      region: parseInt(searchParams.get("region") || "-1", 10),
      izly: searchParams.get("izly") === "true",
      card: searchParams.get("card") === "true",
    };
    setFilters(tempFilters);
  }, [restaurants]);

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
    console.log("handleLocationRequest");
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

  /**
   * Resets the restaurant filters to their default values and updates the filtered restaurants list.
   * useCallback is used to memoize the function and prevent unnecessary re-renders.
   *
   * @function
   * @name resetFilters
   * @returns {void}
   */
  const resetFilters = useCallback(() => {
    console.log("resetFilters");
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
    console.log("debouncedFilterRestaurants", filters, restaurants.length);
    const filtered = filterRestaurants(restaurants, filters);
    // sort restaurants by area name
    filtered.sort((a, b) => a.zone.localeCompare(b.zone));
    setFilteredRestaurants(filtered);
    setLoading(false);
  }, 300);

  // Update query string whenever filters change
  useEffect(() => {
    console.log("useEffect change query string");
    const queryString = buildQueryString(filters);
    router.push(`${pathname}?${queryString}`);
  }, [filters, router, pathname]);

  // Trigger debounced filtering when filters change
  useEffect(() => {
    console.log("useEffect debouncedFilterRestaurants");
    setLoading(true);
    debouncedFilterRestaurants();
    return () => debouncedFilterRestaurants.cancel();
  }, [filters]);

  // Fetch regions and initialize filters on mount
  useEffect(() => {
    console.log("useEffect fetch regions");
    setLoading(true);
    initializeFilters();

    getRegions()
      .then((result) => {
        if (result.success) {
          const fetchedRegions = result.data;
          // sort regions by name
          fetchedRegions.sort((a, b) => a.libelle.localeCompare(b.libelle));
          fetchedRegions.unshift({ code: -1, libelle: allRegionText });
          setRegions(fetchedRegions);
        } else {
          console.error(result.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
