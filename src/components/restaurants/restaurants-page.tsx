"use client";

import { getRestaurants } from "@/services/restaurant-service";
import { Restaurant } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/app/[locale]/loading";
import { AlignLeft, Map } from "lucide-react";
import RestaurantsFilters from "./filters";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useTranslations, useLocale } from "next-intl";
import Pagination from "@/components/pagination";
import useMarkerStore from "@/store/markerStore";
import { slugify } from "@/lib/utils";
import Content from "./content";
import { filterRestaurants, Filters } from "@/lib/filters";
import { useSearchParams } from "next/navigation";

export default function RestaurantsPage() {
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  useState<Restaurant[]>([]); // Store previous filtered restaurants to avoid re-fetching data
  const [favoritesRestaurants, setFavoritesRestaurants] = useState<
    Restaurant[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15); // Default records per page

  const { display, toggleDisplay, favorites } = useUserPreferences();
  const { addMarker, clearMarkers } = useMarkerStore();

  const t = useTranslations("RestaurantsPage");
  const locale = useLocale();

  const [filters, setFilters] = useState<Filters>({
    search: "",
    isPmr: false,
    isOpen: false,
    region: -1,
    izly: false,
    card: false,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    getRestaurants()
      .then((result) => {
        if (result.success) {
          setRestaurants(result.data);
          setFilteredRestaurants(result.data);

          setFilters(
            { ...filters, region: parseInt(searchParams.get("region") || "-1", 10) }
          );

          const filtered = filterRestaurants(
            result.data, 
            { ...filters, region: parseInt(searchParams.get("region") || "-1", 10) }
          );
          setFilteredRestaurants(filtered);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const favRestaurants = filteredRestaurants.filter((restaurant) =>
      favorites.some((f) => f.code === restaurant.code)
    );

    setFavoritesRestaurants(favRestaurants);
  }, [favorites, filteredRestaurants]);

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
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
          `Voir la fiche de <a href="/${locale}/restaurants/${slugify(
            restaurant.nom
          )}-r${restaurant.code}">${restaurant.nom}</a>`
        );
      }
    });
  }, [filteredRestaurants]);

  return (
    <div>
      {/* Page title and filters */}
      <div className="w-full justify-between lg:flex mb-4 z-10">
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
            loading={loading}
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
      {display === "list" && (
        // Pagination
        <Pagination
          loading={loading}
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={filteredRestaurants.length}
          onPageChange={setCurrentPage}
        />
      )}
      {/* Filtered restaurants or skeleton or no results or map */}
      <Content
        display={display}
        filteredRestaurants={filteredRestaurants}
        paginatedRestaurants={paginatedRestaurants}
        favoritesRestaurants={favoritesRestaurants}
        loading={loading}
      />
      {display === "list" && (
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
  );
}
