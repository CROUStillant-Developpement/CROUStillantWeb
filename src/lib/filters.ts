import { Restaurant } from "@/services/types";

export interface Filters {
  search: string;
  isPmr: boolean;
  isOpen: boolean;
  crous: number;
  restaurantCityAsc: boolean;
  restaurantCityDesc: boolean;
  restaurantNameAsc: boolean;
  restaurantNameDesc: boolean;
  restaurantType: number;
  nearMe: boolean;
}

export const DEFAULT_FILTERS: Filters = {
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
};

/**
 * Reads the filters out of the URL's query string (the inverse of
 * `buildQueryString`). Works on the server as well as in the browser, so the
 * list can be rendered already filtered.
 */
export const filtersFromSearchParams = (searchParams: {
  get(name: string): string | null;
}): Filters => ({
  search: searchParams.get("search") || "",
  isPmr: searchParams.get("ispmr") === "true",
  isOpen: searchParams.get("open") === "true",
  crous: parseInt(searchParams.get("region") || "-1", 10),
  restaurantCityAsc: searchParams.get("restaurantCityAsc") === "true",
  restaurantCityDesc: searchParams.get("restaurantCityDesc") === "true",
  restaurantNameAsc: searchParams.get("restaurantNameAsc") === "true",
  restaurantNameDesc: searchParams.get("restaurantNameDesc") === "true",
  restaurantType: parseInt(searchParams.get("restaurantType") || "-1", 10),
  nearMe: false,
});

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const filterRestaurants = (
  restaurants: Restaurant[],
  filters: Filters,
  userPosition?: { latitude: number; longitude: number } | null
): Restaurant[] => {
  return restaurants.filter((restaurant) => {
    const matchesPmr = !filters.isPmr || restaurant.ispmr;
    const matchesOpen = !filters.isOpen || restaurant.ouvert;
    const matchesRegion =
      filters.crous === -1 || restaurant.region.code === filters.crous;
    const matchesRestaurantType =
      filters.restaurantType === -1 ||
      restaurant.type?.code === filters.restaurantType;
    const matchesNearMe =
      !filters.nearMe ||
      !userPosition ||
      (restaurant.latitude !== undefined &&
        restaurant.longitude !== undefined &&
        haversineKm(userPosition.latitude, userPosition.longitude, restaurant.latitude, restaurant.longitude) <= 10);

    // Search by restaurant name or city
    const search = filters.search.toLowerCase();
    const matchesSearch =
      !search ||
      restaurant.nom.toLowerCase().includes(search) ||
      restaurant.zone.toLowerCase().includes(search) ||
      restaurant.adresse?.toLowerCase().includes(search) ||
      restaurant.code.toString().includes(search);

    return (
      matchesSearch &&
      matchesPmr &&
      matchesOpen &&
      matchesRegion &&
      matchesRestaurantType &&
      matchesNearMe
    );
  });
};

export const buildQueryString = (filters: Filters): string => {
  const queryString = new URLSearchParams();
  if (filters.search) queryString.set("search", filters.search);
  if (filters.isPmr) queryString.set("ispmr", "true");
  if (filters.isOpen) queryString.set("open", "true");
  if (filters.crous !== -1) queryString.set("region", filters.crous.toString());
  if (filters.restaurantCityAsc) queryString.set("restaurantCityAsc", "true");
  if (filters.restaurantCityDesc) queryString.set("restaurantCityDesc", "true");
  if (filters.restaurantNameAsc) queryString.set("restaurantNameAsc", "true");
  if (filters.restaurantNameDesc) queryString.set("restaurantNameDesc", "true");
  if (filters.restaurantType !== -1)
    queryString.set("restaurantType", filters.restaurantType.toString());
  return queryString.toString();
};

export const sortRestaurants = (
  restaurants: Restaurant[],
  filters: Filters,
  locale: string
): Restaurant[] => {
  import("@/lib/log").then(mod => mod.default.debug(restaurants, "dev"));


  return restaurants.slice().sort((a, b) => {
    if (filters.restaurantCityAsc) {
      return a.zone.localeCompare(b.zone, locale);
    }
    if (filters.restaurantCityDesc) {
      return b.zone.localeCompare(a.zone, locale);
    }
    if (filters.restaurantNameAsc) {
      return a.nom.localeCompare(b.nom, locale);
    }
    if (filters.restaurantNameDesc) {
      return b.nom.localeCompare(a.nom, locale);
    }

    // if no sort is applied, sort by restaurant's area
    return a.zone.localeCompare(b.zone, locale);
  });
};
