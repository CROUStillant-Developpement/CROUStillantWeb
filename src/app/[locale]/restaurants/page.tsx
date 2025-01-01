import RestaurantsPage from "@/components/restaurants/restaurants-page";
import { getRestaurants } from "@/services/restaurant-service";
import { getRegions } from "@/services/region-service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liste des restaurants - CROUStillant",
  description:
    "Découvrez la liste des restaurants disponibles sur CROUStillant.",
};

export default async function Restaurants() {
  const restaurants = await getRestaurants();
  const regions = await getRegions();

  if (!restaurants.success || !regions.success) {
    return <div>Erreur lors de la récupération des données</div>;
  }

  // Collect unique restaurant types based on `code`
  const typesRestaurants = Array.from(
    new Map(
      restaurants.data.map((restaurant) => [
        restaurant.type!.code,
        restaurant.type!,
      ])
    ).values()
  );

  return (
    <RestaurantsPage
      restaurants={restaurants.data}
      regions={regions.data}
      typesRestaurants={typesRestaurants}
    />
  );
}
