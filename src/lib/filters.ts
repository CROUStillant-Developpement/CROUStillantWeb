import { Restaurant } from "@/services/types";

export interface Filters {
  search: string;
  isPmr: boolean;
  isOpen: boolean;
  region: number;
  izly: boolean;
  card: boolean;
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
      filters.region === -1 || restaurant.region.code === filters.region;
    const matchesIzly = !filters.izly || restaurant.paiement?.includes("IZLY");
    const matchesCard =
      !filters.card || restaurant.paiement?.includes("Carte bancaire");

    return (
      matchesSearch &&
      matchesPmr &&
      matchesOpen &&
      matchesRegion &&
      matchesIzly &&
      matchesCard
    );
  });
};

export const buildQueryString = (filters: Filters): string => {
  const queryString = new URLSearchParams();
  if (filters.search) queryString.set("search", filters.search);
  if (filters.isPmr) queryString.set("ispmr", "true");
  if (filters.isOpen) queryString.set("open", "true");
  if (filters.region !== -1)
    queryString.set("region", filters.region.toString());
  if (filters.izly) queryString.set("izly", "true");
  if (filters.card) queryString.set("card", "true");
  return queryString.toString();
};
