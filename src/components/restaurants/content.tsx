import { DisplayType, Restaurant } from "@/services/types";
import RestaurantCardSkeleton from "./restaurant-card-skeleton";
import RestaurantCard from "./restaurant-card";
import { motion, AnimatePresence } from "@/lib/motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useUmami } from "next-umami";
import { Button } from "@/components/ui/button";

const MapComponent = dynamic(() => import("@/components/map"), { ssr: false }); // Don't render on server side to avoid window is not defined error

interface ContentProps {
  display: DisplayType;
  filteredRestaurants: Restaurant[];
  paginatedRestaurants: Restaurant[];
  favouritesRestaurants: Restaurant[];
  loading: boolean;
}

export default function Content({
  display,
  filteredRestaurants,
  paginatedRestaurants,
  favouritesRestaurants,
  loading,
}: ContentProps) {
  const t = useTranslations("RestaurantsPage");
  const umami = useUmami();
  const [autoCollapsedfavourites, setAutoCollapsedfavourites] = useState(true);
  const [userCollapsedfavourites, setUserCollapsedfavourites] = useState(false);

  useEffect(() => {
    if (autoCollapsedfavourites && favouritesRestaurants.length > 3) {
      setUserCollapsedfavourites(true);
    }
  }, [favouritesRestaurants]);

  if (display === "map") {
    return <MapComponent loading={loading} />;
  } else {
    return (
      <div className="flex flex-col gap-6 p-4">
        {/* favourites */}
        {favouritesRestaurants.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-secondary/20 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/10 bg-secondary/30 px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="bg-primary text-primary-foreground font-semibold p-4 rounded-full mr-3 h-8 w-8 flex items-center justify-center">
                  {favouritesRestaurants.length}
                </span>
                {t("favourites", { count: favouritesRestaurants.length })}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                onClick={() => {
                  setAutoCollapsedfavourites(false);
                  setUserCollapsedfavourites(!userCollapsedfavourites);
                  umami.event("Restaurants.Favourites.Toggle", {
                    action: userCollapsedfavourites ? "expand" : "collapse",
                  });
                }}
              >
                {userCollapsedfavourites
                  ? t("clickToSeeAll")
                  : t("clickToSeeLess")}
              </Button>
            </div>

            <div
              className={`p-6 gap-6 md:grid-cols-2 lg:grid-cols-3 ${userCollapsedfavourites ? "hidden" : "grid"
                }`}
            >
              {favouritesRestaurants.map((restaurant) => (
                <RestaurantCard key={`fav-${restaurant.code}`} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? "loading" : "restaurants"}
            className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {loading ? (
              Array.from({ length: 20 }).map((_, index) => (
                <RestaurantCardSkeleton key={index} />
              ))
            ) : filteredRestaurants.length > 0 ? (
              paginatedRestaurants.map((restaurant, i) => (
                <motion.div
                  key={restaurant.code}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.04,
                    ease: "easeOut",
                  }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))
            ) : (
              <motion.p
                className="w-full col-span-3 font-bold text-xl h-56 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {t("noResults")}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
}
