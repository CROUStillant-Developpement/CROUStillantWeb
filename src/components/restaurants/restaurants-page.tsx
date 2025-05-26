"use client";

import { Restaurant, Region, TypeRestaurant } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import Loading from "@/app/[locale]/loading";
import RestaurantsFilters from "./filters";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useTranslations } from "next-intl";
import useMarkerStore from "@/store/markerStore";
import { slugify } from "@/lib/utils";
import Content from "./content";
import { Link } from "@/i18n/routing";
import { useRestaurantFilters } from "@/hooks/useRestaurantFilters";
import { useMediaQuery } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area"
import Map from "../map";
import { Button } from "../ui/button";
import { MapIcon } from "lucide-react";

export default function RestaurantsPage({
  restaurants,
  regions,
  typesRestaurants,
}: {
  restaurants: Restaurant[];
  regions: Region[];
  typesRestaurants: TypeRestaurant[];
}) {
  const [loading, setLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] =
    useState<Restaurant[]>(restaurants);
  const [favouritesRestaurants, setfavouritesRestaurants] = useState<
    Restaurant[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(21); // Default records per page

  const { display, favourites } = useUserPreferences();
  const { addMarker, clearMarkers } = useMarkerStore();

  const t = useTranslations("RestaurantsPage");

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const favRestaurants = filteredRestaurants.filter((restaurant) =>
      favourites.some((f) => f.code === restaurant.code)
    );

    setfavouritesRestaurants(favRestaurants);
  }, [favourites, filteredRestaurants]);

  /**
   * Computes a paginated subset of the filtered restaurants based on the current page and page size.
   *
   * @constant
   * @type {Array}
   * @returns {Array} A slice of the filtered restaurants array corresponding to the current page.
   *
   * @dependencies
   * - `filteredRestaurants`: The array of restaurants filtered by some criteria.
   * - `currentPage`: The current page number.
   * - `pageSize`: The number of restaurants to display per page.
   *
   * @remarks
   * - In development mode, logs the length of the filtered restaurants array whenever it changes.
   */
  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (process.env.NODE_ENV === "development")
      console.info("filteredRestaurants changed", filteredRestaurants.length);
    return filteredRestaurants.slice(startIndex, endIndex);
  }, [filteredRestaurants, currentPage, pageSize]);

  useEffect(() => {
    clearMarkers();
    filteredRestaurants.forEach((restaurant) => {
      if (restaurant.latitude && restaurant.longitude) {
        addMarker(
          restaurant.code,
          [restaurant.latitude, restaurant.longitude],
          restaurant.nom,
          t.rich("markerDescription", {
            link: (chunks) => (
              <Link
                href={`/restaurants/${slugify(restaurant.nom)}-r${restaurant.code
                  }`}
              >
                {chunks}
              </Link>
            ),
            name: restaurant.nom,
          })
        );
      }
    });
  }, [filteredRestaurants]);

  const {
    filters,
    setFilters,
    geoLocError,
    handleLocationRequest,
    resetFilters,
    activeFilterCount,
  } = useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading);

  if (!isMobile || filters.crous === -1) {
    return (
      <div>
        {/* Page title and filters */}
        <div className="w-full justify-between lg:flex mb-4 z-10">
          <div className="w-full">
            <h1 className="font-bold text-3xl">Restaurants</h1>
            <div className="opacity-50">
              {loading ? (
                <Loading className="!justify-start" />
              ) : (
                t("results", { count: filteredRestaurants.length })
              )}
            </div>
            <RestaurantsFilters
              filters={filters}
              setFilters={setFilters}
              geoLocError={geoLocError}
              handleLocationRequest={handleLocationRequest}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              loading={loading}
              regions={regions}
              typesRestaurants={typesRestaurants}
            />
          </div>
        </div>
        {/* Filtered restaurants or skeleton or no results or map */}
        <Content
          filters={filters}
          display={display}
          filteredRestaurants={filteredRestaurants}
          paginatedRestaurants={paginatedRestaurants}
          favouritesRestaurants={favouritesRestaurants}
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  } else {
    return (
      <div className="h-[90vh] relative">
        <Sheet>
          <SheetTrigger className="absolute bottom-4 z-50 flex items-center justify-center w-full">
            <Button className="w-fit">
              OPEN <MapIcon className="ml-2 h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh]">
            <ScrollArea className="h-[90vh]">
              <div>
                {/* Page title and filters */}
                <div className="w-full justify-between lg:flex mb-4 z-10">
                  <div className="w-full">
                    <div className="opacity-50">
                      {loading ? (
                        <Loading className="!justify-start" />
                      ) : (
                        t("results", { count: filteredRestaurants.length })
                      )}
                    </div>
                    <RestaurantsFilters
                      filters={filters}
                      setFilters={setFilters}
                      geoLocError={geoLocError}
                      handleLocationRequest={handleLocationRequest}
                      resetFilters={resetFilters}
                      activeFilterCount={activeFilterCount}
                      loading={loading}
                      regions={regions}
                      typesRestaurants={typesRestaurants}
                    />
                  </div>
                </div>
                {/* Filtered restaurants or skeleton or no results or map */}
                <Content
                  filters={filters}
                  display={display}
                  filteredRestaurants={filteredRestaurants}
                  paginatedRestaurants={paginatedRestaurants}
                  favouritesRestaurants={favouritesRestaurants}
                  loading={loading}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  className="pb-10"
                />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Map loading={loading} />
      </div>
    );
  }

}
