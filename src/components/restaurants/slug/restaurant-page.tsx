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

interface RestaurantPageProps {
  restaurant: Restaurant;
}

export default function RestaurantPage({ restaurant }: RestaurantPageProps) {
  const {
    loading,
    dates,
    selectedDate,
    setSelectedDate,
    selectedDateMeals,
    selectedDateBreakfast,
    selectedDateLunch,
    selectedDateDinner,
  } = useRestaurantMenu({ restaurantCode: restaurant.code, mode: "future" });

  const t = useTranslations("RestaurantPage");
  const umami = useUmami();
  const { addOrRemoveFromfavourites, favourites } = useUserPreferences();
  const isFavourite = favourites.some((f) => f.code === restaurant.code);

  if (loading) return <RestaurantPageSkeleton />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center flex-wrap justify-center md:justify-start">
        <h1 className="font-bold text-3xl text-center">{restaurant.nom}</h1>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full ml-4 mt-2 md:mt-0"
          onClick={() => {
            addOrRemoveFromfavourites(restaurant.code, restaurant.nom);
            umami.event("Restaurant.Favorite", { restaurant: restaurant.code });
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
          url={`${window.location.href}?qr=true`}
        />
      </div>

      {/* Menu Display Section */}
      <MenuDisplaySection
        loading={loading}
        selectedDate={selectedDate}
        selectedDateMeals={selectedDateMeals}
        selectedDateBreakfast={selectedDateBreakfast}
        selectedDateLunch={selectedDateLunch}
        selectedDateDinner={selectedDateDinner}
        rightPanel={
          <Tabs defaultValue="calendar" className="w-full lg:mt-2">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="calendar">
                {t("calendar")}
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="info">
                {t("information")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
              <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  {t("nextDaysMenu")}
                </legend>
                {dates.length > 0 && (
                  <>
                    <DatePicker
                      onDateChange={setSelectedDate}
                      maxDate={formatToISODate(dates[dates.length - 1].date)}
                      current={selectedDate}
                    />
                    <RestaurantCalendar
                      availableDates={dates}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </>
                )}
              </fieldset>
            </TabsContent>
            <TabsContent value="info">
              <RestaurantInfo restaurant={restaurant} />
            </TabsContent>
          </Tabs>
        }
      />

      {/* Menu History */}
      <MenuHistorySection restaurantCode={restaurant.code} />
    </div>
  );
}
