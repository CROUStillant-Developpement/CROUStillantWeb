"use client";

import { Restaurant, Region, TypeRestaurant } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import log from "@/lib/log";
import Loading from "@/app/[locale]/loading";
import RestaurantsFilters from "./filters";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useTranslations } from "next-intl";
import Pagination from "@/components/pagination";
import useMarkerStore from "@/store/markerStore";
import { slugify } from "@/lib/utils";
import Content from "./content";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";

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
  const umami = useUmami();

  useEffect(() => {
    const favRestaurants = filteredRestaurants.filter((restaurant) =>
      favourites.some((f) => f.code === restaurant.code)
    );

    setfavouritesRestaurants(favRestaurants);
  }, [favourites, filteredRestaurants]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    log.info(["filteredRestaurants changed", filteredRestaurants.length], "dev");
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
                onClick={() => {
                  umami.event("Restaurant.Card.View", {
                    restaurant: restaurant.code,
                  });
                }}
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

  return (
    <div className="w-full mt-4 px-4">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Restaurants
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            {loading ? (
              <Loading className="justify-start!" />
            ) : (
              <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
                {t("results", { count: filteredRestaurants.length })}
              </span>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="w-full z-10 relative">
        <RestaurantsFilters
          setFilteredRestaurants={setFilteredRestaurants}
          restaurants={restaurants}
          setLoading={setLoading}
          loading={loading}
          regions={regions}
          typesRestaurants={typesRestaurants}
        >
          {/* Filtered restaurants or skeleton or no results or map */}
          <Content
            display={display}
            filteredRestaurants={filteredRestaurants}
            paginatedRestaurants={paginatedRestaurants}
            favouritesRestaurants={favouritesRestaurants}
            loading={loading}
          />
          {display === "list" && filteredRestaurants.length > 0 && (
            <div className="mx-4">
              <Pagination
                loading={loading}
                currentPage={currentPage}
                pageSize={pageSize}
                totalRecords={filteredRestaurants.length}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </RestaurantsFilters>
      </div>
    </div>
  );
}
