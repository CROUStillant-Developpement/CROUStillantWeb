"use client";

import { Restaurant, Region, TypeRestaurant } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import log from "@/lib/log";
import Loading from "@/components/page-loading";
import RestaurantsFilters from "./filters";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  filterRestaurants,
  filtersFromSearchParams,
  sortRestaurants,
} from "@/lib/filters";
import Pagination from "@/components/pagination";
import useMarkerStore from "@/store/markerStore";
import Content from "./content";
import { AnimatePresence, motion } from "@/lib/motion";
import CelebrationBanner, { useCelebrationBanner } from "./slug/celebration-banner";
import EasterEggLauncher from "@/components/easter-egg/easter-egg-launcher";
import { PageContainer, PageHeader } from "@/components/page-layout";

export default function RestaurantsPage({
  restaurants,
  regions,
  typesRestaurants,
  children,
}: {
  restaurants: Restaurant[];
  regions: Region[];
  typesRestaurants: TypeRestaurant[];
  /** Sections shown under the list. */
  children?: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  // Filtered and sorted from the first render, so the server sends the actual
  // restaurants instead of skeletons that only clear once the page hydrates.
  // Must match what `useRestaurantFilters` starts from.
  const [loading, setLoading] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    () => {
      const filters = filtersFromSearchParams(searchParams);
      return sortRestaurants(
        filterRestaurants(restaurants, filters),
        filters,
        locale
      );
    }
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(21); // Default records per page
  const { visible: showCelebration, dismiss: dismissCelebration } = useCelebrationBanner();
  
  const { display, favourites } = useUserPreferences();

  // Links can ask for a view ("See the restaurants on the map" on the region
  // pages links to ?display=map). It is applied once, on arrival, and from
  // then on the toggle is the only thing that changes it.
  useEffect(() => {
    const requested = searchParams.get("display");
    if (requested !== "map" && requested !== "list") return;

    const apply = () => {
      const { display: current, toggleDisplay } = useUserPreferences.getState();
      if (current !== requested) toggleDisplay();
    };

    // The saved preference is restored from localStorage after the first
    // render; applied any earlier, the request would be overwritten by it.
    if (useUserPreferences.persist.hasHydrated()) apply();
    else return useUserPreferences.persist.onFinishHydration(apply);
  }, []);
  const { setMarkers } = useMarkerStore();

  const t = useTranslations("RestaurantsPage");

  const favouritesRestaurants = useMemo(() =>
    filteredRestaurants.filter((restaurant) =>
      favourites.some((f) => f.code === restaurant.code)
    ),
    [favourites, filteredRestaurants]
  );

  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    log.info(["filteredRestaurants changed", filteredRestaurants.length], "dev");
    return filteredRestaurants.slice(startIndex, endIndex);
  }, [filteredRestaurants, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRestaurants]);

  useEffect(() => {
    setMarkers(
      filteredRestaurants
        .filter((r) => r.latitude && r.longitude)
        .map((restaurant) => ({
          id: restaurant.code,
          position: [restaurant.latitude!, restaurant.longitude!] as [number, number],
          title: restaurant.nom,
          restaurant,
        }))
    );
  }, [filteredRestaurants]);

  return (
    <PageContainer>
      <PageHeader
        title="Restaurants"
        titleProps={{ "data-easter-egg": true, className: "select-none" }}
        badge={
          loading ? (
            <Loading className="justify-start!" />
          ) : (
            t("results", { count: filteredRestaurants.length })
          )
        }
      />

      {/* <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden"
            >
              <CelebrationBanner onDismiss={dismissCelebration} />
            </motion.div>
          )}
        </AnimatePresence> */}

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

      {children}

      <EasterEggLauncher />
    </PageContainer>
  );
}
