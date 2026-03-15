"use client";

import { Restaurant } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Heart, QrCode } from "lucide-react";
import QrCodeDialog from "@/components/qr-code-dialog";
import RestaurantInfo from "./restaurant-info";
import MenuDisplaySection from "@/components/restaurants/slug/menu-display-section";
import RestaurantPageSkeleton from "./restaurant-page-skeleton";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useUmami } from "next-umami";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { useSearchParams } from "next/navigation";
import log from "@/lib/log";
import { X as CloseIcon } from "lucide-react";

interface RestaurantPageProps {
  restaurant: Restaurant;
}

export default function RestaurantPage({ restaurant }: RestaurantPageProps) {
  const {
    menuLoading,
    datesLoading,
    dates,
    selectedDate,
    setSelectedDate,
    selectedDateMeals,
    selectedDateBreakfast,
    selectedDateLunch,
    selectedDateDinner,
    noMenuAtAll,
  } = useRestaurantMenu({ restaurantCode: restaurant.code, mode: "all" });

  const t = useTranslations("RestaurantPage");
  const umami = useUmami();
  const { addOrRemoveFromfavourites, favourites } = useUserPreferences();
  const isFavourite = favourites.some((f) => f.code === restaurant.code);
  const searchParams = useSearchParams();
  const [showFavoriteHint, setShowFavoriteHint] = useState(false);

  useEffect(() => {
    // Show hint after a short delay if not favourite
    if (!isFavourite) {
      const timer = setTimeout(() => setShowFavoriteHint(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowFavoriteHint(false);
    }
  }, [isFavourite]);

  // On mount, if date param is in the past, open history and set date
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      log.info(["Found date param in URL:", dateParam], "dev");
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        log.info(["Parsed date from URL:", parsedDate], "dev");
        setSelectedDate(parsedDate);
      }
    }
  }, []);

  // Scroll to selected date is handled by DateScroller in MenuDisplaySection

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={restaurant.code}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full mt-4 px-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-secondary/20 border border-primary/10 shadow-lg mb-8 h-56 md:h-72 flex items-end group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />
          <img
            src={restaurant.image_url || "/default_ru.png"}
            alt={restaurant.nom}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "/default_ru.png";
            }}
          />

          <div className="relative z-20 w-full p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between items-start">
            <div className="max-w-3xl">
              <h1 className="font-extrabold text-3xl md:text-5xl text-white drop-shadow-lg tracking-tight">{restaurant.nom}</h1>
              <div className="mt-2 md:mt-3 flex items-center gap-3 text-white/90 font-medium">
                <span className="flex items-center text-sm md:text-base drop-shadow-md bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {restaurant.zone}
                </span>
                <Badge className={cn(
                  "px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all border shadow-lg",
                  restaurant?.ouvert
                    ? "bg-green-500/20 text-green-400 border-green-500/30 ring-1 ring-green-500/20"
                    : "bg-red-500/20 text-red-400 border-red-500/30 ring-1 ring-red-500/20"
                )} variant="outline">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mr-2",
                    restaurant?.ouvert ? "bg-green-400 animate-pulse" : "bg-red-400"
                  )} />
                  {restaurant?.ouvert ? t("open") : t("closed")}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0 drop-shadow-md">
              <Button
                size="icon"
                className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white transition-all hover:scale-110 hover:-translate-y-1 shadow-lg h-12 w-12"
                onClick={() => {
                  addOrRemoveFromfavourites(restaurant.code, restaurant.nom);
                  umami.event("Restaurant.Favorite", {
                    restaurant: restaurant.code,
                  });
                }}
              >
                <Heart className={isFavourite ? "text-red-500 fill-red-500 scale-110 transition-transform" : "scale-100 transition-transform"} />
              </Button>
              <QrCodeDialog
                dialogTrigger={
                  <Button
                    size="icon"
                    className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white transition-all hover:scale-110 hover:-translate-y-1 shadow-lg h-12 w-12"
                    onClick={() =>
                      umami.event("Restaurant.QRCode", {
                        restaurant: restaurant.code,
                      })
                    }
                  >
                    <QrCode />
                  </Button>
                }
                title={`${restaurant.nom} - CROUStillant`}
                description={t("qrCodeDescription")}
                url={(() => {
                  if (typeof window !== "undefined") {
                    const u = new URL(window.location.href);
                    return u.toString();
                  }
                  return "";
                })()}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFavoriteHint && !isFavourite && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="bg-primary/5 border border-primary/20 backdrop-blur-md rounded-3xl p-4 md:p-6 flex items-center justify-between gap-4 group hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex h-12 w-12 rounded-2xl bg-primary/10 text-primary items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Heart size={24} />
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-semibold text-foreground/90 leading-relaxed">
                      {t("favoriteHint")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-10 px-4 font-bold hover:bg-primary/10 text-primary"
                    onClick={() => {
                      addOrRemoveFromfavourites(restaurant.code, restaurant.nom);
                      umami.event("Restaurant.Favorite.HintClick", {
                        restaurant: restaurant.code,
                      });
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {t("favoriteHintCta")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={() => setShowFavoriteHint(false)}
                  >
                    <CloseIcon size={18} className="opacity-50" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {menuLoading && datesLoading ? (
          <RestaurantPageSkeleton />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start relative flex-col-reverse lg:flex-row">
            <aside className="w-full lg:w-80 lg:sticky lg:top-4 h-fit shrink-0">
              <RestaurantInfo restaurant={restaurant} />
            </aside>

            <div className="flex-1 w-full min-w-0">
              {/* Menu Display Section */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -32 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <MenuDisplaySection
                  menuLoading={menuLoading}
                  availableDates={dates}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  selectedDateMeals={selectedDateMeals}
                  selectedDateBreakfast={selectedDateBreakfast}
                  selectedDateLunch={selectedDateLunch}
                  selectedDateDinner={selectedDateDinner}
                  noMenuAtAll={noMenuAtAll}
                />
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
