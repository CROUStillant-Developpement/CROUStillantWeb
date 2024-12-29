"use client";

import RestaurantCard from "@/components/restaurants/restaurant-card";
import {
  getRestaurants,
  getRestaurantsByRegion,
} from "@/services/restaurant-service";
import { Restaurant } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import RestaurantCardSkeleton from "@/components/restaurants/restaurant-card-skeleton";
import { Button } from "@/components/ui/button";
import Loading from "@/app/[locale]/loading";
import { AlignLeft, Map } from "lucide-react";
import RestaurantsFilters from "./filters";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useTranslations } from "next-intl";
import Pagination from "@/components/pagination";

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [favoritesRestaurants, setFavoritesRestaurants] = useState<
    Restaurant[]
  >([]);
  const [collapsedFavorites, setCollapsedFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Default records per page
  const [totalRecords, setTotalRecords] = useState(0);

  const { display, toggleDisplay, favorites } = useUserPreferences();

  const t = useTranslations("RestaurantsPage");

  useEffect(() => {
    getRestaurants()
      .then((result) => {
        if (result.success) {
          setRestaurants(result.data);
          setFilteredRestaurants(result.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const favRestaurants = filteredRestaurants.filter((restaurant) =>
      favorites.includes(restaurant.code)
    );

    // Collapse favorites if there are more than 3, and expand if there are less than 3
    if (favorites.length > 3 && !collapsedFavorites) {
      setCollapsedFavorites(true);
    } else if (favorites.length <= 3 && collapsedFavorites) {
      setCollapsedFavorites(false);
    }

    setFavoritesRestaurants(favRestaurants);
  }, [favorites, filteredRestaurants]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRestaurants.slice(startIndex, endIndex);
  }, [filteredRestaurants, currentPage, pageSize]);

  return (
    <div>
      {/* Page title and filters */}
      <div className="w-full justify-between lg:flex mb-4">
        <div className="lg:w-3/4">
          <span className="flex items-center flex-wrap gap-2">
            <h1 className="font-bold text-3xl">Restaurants</h1>
          </span>
          <div className="opacity-50">
            {loading ? (
              <Loading />
            ) : (
              t("results", { count: filteredRestaurants.length })
            )}
          </div>
          <RestaurantsFilters
            setFilteredRestaurants={setFilteredRestaurants}
            restaurants={restaurants}
            setLoading={setLoading}
          />
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0 w-fit">
          <p>{t("display.title")}</p>
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
      {/* Pagination */}
      <Pagination
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalRecords={filteredRestaurants.length}
        onPageChange={setCurrentPage}
      />
      {/* Favorites */}
      {favoritesRestaurants.length > 0 && (
        <fieldset className="grid gap-6 md:col-span-2 rounded-lg border p-4 mb-4 md:mb-8">
          <legend className="-ml-1 px-1 text-sm font-medium">
            {t("favorites", { count: favoritesRestaurants.length })} -{" "}
            <span
              className="underline select-none cursor-pointer"
              onClick={() => setCollapsedFavorites(!collapsedFavorites)}
            >
              {collapsedFavorites ? t("clickToSeeAll") : t("clickToSeeLess")}
            </span>
          </legend>
          <div
            className={`gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 ${
              collapsedFavorites ? "hidden" : "grid"
            }`}
          >
            {favoritesRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.code} restaurant={restaurant} />
            ))}
          </div>
        </fieldset>
      )}
      {/* Filtered restaurants or skeleton or no results */}
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
      {/* Pagination */}
      <Pagination
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalRecords={filteredRestaurants.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
