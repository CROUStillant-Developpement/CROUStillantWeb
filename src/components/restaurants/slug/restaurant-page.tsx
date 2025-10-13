"use client";

import { Restaurant } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Heart, QrCode } from "lucide-react";
import QrCodeDialog from "@/components/qr-code-dialog";
import RestaurantInfo from "./restaurant-info";
import RestaurantCalendar from "./calendar";
import DatePicker from "./date-picker";
import MenuDisplaySection from "@/components/restaurants/slug/menu-display-section";
import RestaurantPageSkeleton from "./restaurant-page-skeleton";
import MenuHistorySection from "./menu-history-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { useUmami } from "next-umami";
import { useTranslations } from "next-intl";
import { formatToISODate } from "@/lib/utils";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { useSearchParams } from "next/navigation";
import log from "@/lib/log";

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
    noHistoryAtAll,
  } = useRestaurantMenu({ restaurantCode: restaurant.code, mode: "future" });

  // State for history section
  const [showHistory, setShowHistory] = useState(false);
  const [historySelectedDate, setHistorySelectedDate] = useState<Date | null>(
    null
  );

  const t = useTranslations("RestaurantPage");
  const umami = useUmami();
  const { addOrRemoveFromfavourites, favourites } = useUserPreferences();
  const isFavourite = favourites.some((f) => f.code === restaurant.code);
  const [tab, setTab] = useState<string>(noMenuAtAll ? "info" : "calendar");
  const prevTab = useRef(tab);
  const [direction, setDirection] = useState(1); // 1: right, -1: left
  const searchParams = useSearchParams();

  useEffect(() => {
    if (tab !== prevTab.current) {
      // If switching to info, slide left; if to calendar, slide right
      setDirection(tab === "info" ? -1 : 1);
      prevTab.current = tab;
    }
  }, [tab]);

  useEffect(() => {
    if (noMenuAtAll) {
      setTab("info");
    }
  }, [noMenuAtAll]);

  // On mount, if date param is in the past, open history and set date
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      log.info(["Found date param in URL:", dateParam], "dev");
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        log.info(["Parsed date from URL:", parsedDate], "dev");
        const now = new Date();
        if (parsedDate < now) {
          setShowHistory(true);
          setHistorySelectedDate(parsedDate);
        } else {
          setSelectedDate(parsedDate);
        }
      }
    }
  }, []);

  // Scroll to #history only after menu is loaded and showHistory is true
  useEffect(() => {
    if (showHistory && !menuLoading) {
      const el = document.getElementById("history");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [showHistory, menuLoading]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={restaurant.code}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center flex-wrap justify-center md:justify-start">
          <h1 className="font-bold text-3xl text-center">{restaurant.nom}</h1>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full ml-4 mt-2 md:mt-0"
            onClick={() => {
              addOrRemoveFromfavourites(restaurant.code, restaurant.nom);
              umami.event("Restaurant.Favorite", {
                restaurant: restaurant.code,
              });
            }}
          >
            {isFavourite ? (
              <Heart className="text-red-500 fill-red-500" />
            ) : (
              <Heart />
            )}
          </Button>
          <QrCodeDialog
            dialogTrigger={
              <Button
                size="icon"
                className="ml-4 mt-2 md:mt-0"
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
              const u = new URL(window.location.href);
              return u.toString();
            })()}
          />
        </div>

        {menuLoading && datesLoading ? (
          <RestaurantPageSkeleton />
        ) : (
          <>
            {/* Menu Display Section */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MenuDisplaySection
                menuLoading={menuLoading}
                datesLoading={datesLoading}
                selectedDate={selectedDate}
                selectedDateMeals={selectedDateMeals}
                selectedDateBreakfast={selectedDateBreakfast}
                selectedDateLunch={selectedDateLunch}
                selectedDateDinner={selectedDateDinner}
                noMenuAtAll={noMenuAtAll}
                rightPanel={
                  <Tabs
                    defaultValue={noMenuAtAll ? "info" : "calendar"}
                    value={tab}
                    onValueChange={(value) =>
                      noMenuAtAll ? null : setTab(value)
                    }
                    className="w-full lg:mt-2"
                  >
                    <TabsList className="w-full">
                      <TabsTrigger
                        className={
                          "flex-1" + (noMenuAtAll ? " cursor-not-allowed" : "")
                        }
                        value="calendar"
                      >
                        {t("calendar")}
                      </TabsTrigger>
                      <TabsTrigger className="flex-1" value="info">
                        {t("information")}
                      </TabsTrigger>
                    </TabsList>
                    <div
                      style={{
                        position: "relative",
                        minHeight: 200,
                        overflow: "hidden",
                      }}
                    >
                      <AnimatePresence
                        mode="wait"
                        initial={false}
                        custom={direction}
                      >
                        {tab === "calendar" && (
                          <TabsContent
                            key="calendar"
                            value="calendar"
                            forceMount={true}
                            asChild
                          >
                            <motion.fieldset
                              key="calendar"
                              initial={{
                                opacity: 0,
                                x: -80,
                                position: "absolute",
                                width: "100%",
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                position: "relative",
                                width: "100%",
                              }}
                              exit={{
                                opacity: 0,
                                x: -80,
                                position: "absolute",
                                width: "100%",
                              }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit"
                            >
                              <legend className="-ml-1 px-1 text-sm font-medium">
                                {t("nextDaysMenu")}
                              </legend>
                              {dates.length > 0 && (
                                <>
                                  <DatePicker
                                    onDateChange={setSelectedDate}
                                    maxDate={formatToISODate(
                                      dates[dates.length - 1].date
                                    )}
                                    current={selectedDate}
                                  />
                                  <RestaurantCalendar
                                    availableDates={dates}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                  />
                                </>
                              )}
                            </motion.fieldset>
                          </TabsContent>
                        )}
                        {tab === "info" && (
                          <TabsContent
                            key="info"
                            value="info"
                            forceMount={true}
                            asChild
                          >
                            <motion.div
                              key="info"
                              initial={{
                                opacity: 0,
                                x: 80,
                                position: "absolute",
                                width: "100%",
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                position: "relative",
                                width: "100%",
                              }}
                              exit={{
                                opacity: 0,
                                x: 80,
                                position: "absolute",
                                width: "100%",
                              }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                            >
                              <RestaurantInfo restaurant={restaurant} />
                            </motion.div>
                          </TabsContent>
                        )}
                      </AnimatePresence>
                    </div>
                  </Tabs>
                }
              />
            </motion.div>

            {/* Menu History */}
            {!noHistoryAtAll && (
              <MenuHistorySection
                restaurantCode={restaurant.code}
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                initialSelectedDate={historySelectedDate}
              />
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
