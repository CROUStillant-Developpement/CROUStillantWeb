"use client";

import RestaurantCard from "@/components/restaurant-card";
import {
  getRestaurants,
  getRestaurantsByRegion,
} from "@/services/restaurant-service";
import { Restaurant } from "@/services/types";
import { useEffect, useState } from "react";
import RestaurantCardSkeleton from "@/components/restaurant-card-skeleton";
import { Button } from "@/components/ui/button";
import Loading from "../loading";
import { AlignLeft, Map } from "lucide-react";
import RestaurantsFilters from "./filters";
import { useUserPreferences } from "@/store/userPreferencesStore";

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const { display, toggleDisplay } = useUserPreferences();

  useEffect(() => {
    getRestaurantsByRegion("1")
      .then((result) => {
        if (result.success) {
          setRestaurants(result.data);
          setFilteredRestaurants(result.data);
        } else {
          console.error(result.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="w-full justify-between md:flex mb-4">
        <div className="w-3/4">
          <span className="flex items-center flex-wrap gap-2">
            <h1 className="font-bold text-3xl">Restaurants</h1>
          </span>
          <p className="opacity-50">
            {loading ? (
              <Loading />
            ) : (
              `Il y a ${filteredRestaurants.length} restaurants`
            )}
          </p>
          <RestaurantsFilters
            setFilteredRestaurants={setFilteredRestaurants}
            restaurants={restaurants}
          />
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 w-fit">
          <p>Choisir l'affichage</p>
          <div>
            <Button
              size="icon"
              className="rounded-r-none"
              onClick={() => toggleDisplay()}
              variant={display === "list" ? "default" : "outline"}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-l-none"
              onClick={() => toggleDisplay()}
              variant={display === "map" ? "default" : "outline"}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))
        ) : filteredRestaurants.length ? (
          filteredRestaurants
            .slice(0, 20)
            .map((restaurant) => (
              <RestaurantCard key={restaurant.code} restaurant={restaurant} />
            ))
        ) : (
          <p className="w-full col-span-3 font-bold text-xl h-56 flex items-center justify-center">
            Aucun restaurant trouvé pour cette recherche 😢
          </p>
        )}
      </div>
    </div>
  );
}