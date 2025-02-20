import { DisplayType, Restaurant } from "@/services/types";
import RestaurantCardSkeleton from "./restaurant-card-skeleton";
import RestaurantCard from "./restaurant-card";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Filters } from "@/lib/filters";
import useMarkerStore from "@/store/markerStore";
import Pagination from "../pagination";

const MapComponent = dynamic(() => import("@/components/map"), { ssr: false }); // Don't render on server side to avoid window is not defined error

interface ContentProps {
  display: DisplayType;
  filteredRestaurants: Restaurant[];
  paginatedRestaurants: Restaurant[];
  favouritesRestaurants: Restaurant[];
  loading: boolean;
  filters: Filters;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Content({
  display,
  filteredRestaurants,
  paginatedRestaurants,
  favouritesRestaurants,
  loading,
  filters,
  currentPage,
  pageSize,
  onPageChange: setCurrentPage,
}: ContentProps) {
  const t = useTranslations("RestaurantsPage");
  const [autoCollapsedfavourites, setAutoCollapsedfavourites] = useState(true);
  const [userCollapsedfavourites, setUserCollapsedfavourites] = useState(false);

  const { setHighlightedMarker } = useMarkerStore();

  useEffect(() => {
    if (autoCollapsedfavourites && favouritesRestaurants.length > 3) {
      setUserCollapsedfavourites(true);
    }
  }, [favouritesRestaurants]);

  if (display === "map" && filters.crous === -1) {
    return (
      <div className="h-[90vh] py-8">
        <MapComponent loading={loading} />
      </div>
    );
  } else {
    return (
      <div className="flex gap-4 md:gap-8">
        <div className="flex-1">
          {display === "list" && filteredRestaurants.length > 0 && (
            // Pagination
            <Pagination
              loading={loading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalRecords={filteredRestaurants.length}
              onPageChange={setCurrentPage}
            />
          )}
          {/* favourites */}
          {favouritesRestaurants.length > 0 && (
            <fieldset className="grid gap-6 md:col-span-2 rounded-lg border p-4 mb-4 md:mb-8">
              <legend className="-ml-1 px-1 text-sm font-medium">
                {t("favourites", { count: favouritesRestaurants.length })} -{" "}
                <span
                  className="underline select-none cursor-pointer"
                  onClick={() => {
                    setAutoCollapsedfavourites(false);
                    setUserCollapsedfavourites(!userCollapsedfavourites);
                  }}
                >
                  {userCollapsedfavourites
                    ? t("clickToSeeAll")
                    : t("clickToSeeLess")}
                </span>
              </legend>
              <div
                className={`gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 ${
                  userCollapsedfavourites ? "hidden" : "grid"
                }`}
              >
                {favouritesRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.code}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </fieldset>
          )}
          <div
            className={`grid gap-4 md:gap-8 md:grid-cols-2 ${
              filters.crous !== -1 ? "" : "lg:grid-cols-3"
            }`}
          >
            {loading ? (
              Array.from({ length: 20 }).map((_, index) => (
                <RestaurantCardSkeleton key={index} />
              ))
            ) : filteredRestaurants.length > 0 ? (
              paginatedRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.code}
                  restaurant={restaurant}
                  onHover={() => setHighlightedMarker(restaurant.code)}
                  onLeave={() => setHighlightedMarker(undefined)}
                />
              ))
            ) : (
              <p className="w-full col-span-3 font-bold text-xl h-56 flex items-center justify-center">
                {t("noResults")}
              </p>
            )}
          </div>
          {display === "list" && filteredRestaurants.length > 0 && (
            // Pagination
            <Pagination
              loading={loading}
              currentPage={currentPage}
              pageSize={pageSize}
              totalRecords={filteredRestaurants.length}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        {filters.crous !== -1 && (
          <div className="w-1/3 h-[100vh] sticky top-0 py-4">
            <MapComponent loading={loading} />
          </div>
        )}
      </div>
    );
  }
}
