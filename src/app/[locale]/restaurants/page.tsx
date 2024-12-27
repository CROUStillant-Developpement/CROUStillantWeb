"use client";

import RestaurantCard from "@/components/restaurant-card";
import { getRestaurants } from "@/services/restaurant-service";
import { Restaurant } from "@/services/types";
import { useEffect, useState } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    getRestaurants().then((result) => {
      if (result.success) {
        setRestaurants(result.data);
      } else {
        console.error(result.error);
      }
    });
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {restaurants.slice(0, 20).map((restaurant) => (
          <RestaurantCard key={restaurant.code} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
