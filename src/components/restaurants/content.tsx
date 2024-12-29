import { DisplayType, Restaurant } from "@/services/types";
import RestaurantCardSkeleton from "./restaurant-card-skeleton";
import RestaurantCard from "./restaurant-card";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const MapComponent = dynamic(() => import("@/components/map"), { ssr: false }); // Don't render on server side to avoid window is not defined error

interface ContentProps {
  display: DisplayType;
  filteredRestaurants: Restaurant[];
  paginatedRestaurants: Restaurant[];
  loading: boolean;
}

export default function Content({
  display,
  filteredRestaurants,
  paginatedRestaurants,
  loading,
}: ContentProps) {
  const t = useTranslations("RestaurantsPage");

  if (display === "map") {
    return <MapComponent />;
  } else {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))
        ) : filteredRestaurants.length > 0 ? (
          paginatedRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.code} restaurant={restaurant} />
          ))
        ) : (
          <p className="w-full col-span-3 font-bold text-xl h-56 flex items-center justify-center">
            {t("noResults")}
          </p>
        )}
      </div>
    );
  }
}

{
  /* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))
        ) : filteredRestaurants.length > 0 ? (
          display === "map" ? (
            <MapComponent loading={loading} />
          ) : (
            paginatedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.code} restaurant={restaurant} />
            ))
          )
        ) : (
          <p className="w-full col-span-3 font-bold text-xl h-56 flex items-center justify-center">
            {t("noResults")}
          </p>
        )}
      </div> */
}
