import { Restaurant } from "@/services/types";

export interface Filters {
  search: string;
  isPmr: boolean;
  isOpen: boolean;
  crous: number;
  izly: boolean;
  card: boolean;
  restaurantCityAsc: boolean;
  restaurantCityDesc: boolean;
  restaurantNameAsc: boolean;
  restaurantNameDesc: boolean;
  restaurantType: number;
}

export const filterRestaurants = (
  restaurants: Restaurant[],
  filters: Filters
): Restaurant[] => {
  return restaurants.filter((restaurant) => {
    const matchesSearch =
      !filters.search ||
      restaurant.nom?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPmr = !filters.isPmr || restaurant.ispmr;
    const matchesOpen = !filters.isOpen || restaurant.ouvert;
    const matchesRegion =
      filters.crous === -1 || restaurant.region.code === filters.crous;
    const matchesIzly = !filters.izly || restaurant.paiement?.includes("IZLY");
    const matchesCard =
      !filters.card || restaurant.paiement?.includes("Carte bancaire");
    const matchesRestaurantType =
      filters.restaurantType === -1 ||
      restaurant.type?.code === filters.restaurantType;

    return (
      matchesSearch &&
      matchesPmr &&
      matchesOpen &&
      matchesRegion &&
      matchesIzly &&
      matchesCard &&
      matchesRestaurantType
    );
  });
};

export const buildQueryString = (filters: Filters): string => {
  const queryString = new URLSearchParams();
  if (filters.search) queryString.set("search", filters.search);
  if (filters.isPmr) queryString.set("ispmr", "true");
  if (filters.isOpen) queryString.set("open", "true");
  if (filters.crous !== -1) queryString.set("region", filters.crous.toString());
  if (filters.izly) queryString.set("izly", "true");
  if (filters.card) queryString.set("card", "true");
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
  console.log(restaurants);

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
    return a.zone.localeCompare(b.nom, locale);
  });
};
