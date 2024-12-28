import RestaurantsPage from "@/components/restaurants/restaurants-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liste des restaurants - CROUStillant",
  description:
    "Découvrez la liste des restaurants disponibles sur CROUStillant.",
};

export default function Restaurants() {
  return <RestaurantsPage />;
}
