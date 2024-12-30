"use client";

import { Menu, Restaurant, DateMenu, Repas } from "@/services/types";
import {
  getMenuByRestaurantId,
  getFutureDatesMenuAvailable,
} from "@/services/menu-service";
import { useEffect, useState } from "react";
import { formatToISODate } from "@/lib/utils";
import MealsDisplay from "./meals-display";
import RestaurantCalendar from "./calendar";
import DatePicker from "./date-picker";
import RestaurantInfo from "./restaurant-info";
import { Button } from "@/components/ui/button";
import { Heart, QrCode } from "lucide-react";
import QrCodeDialog from "@/components/qr-code-dialog";
import { useTranslations, useLocale } from "next-intl";
import RestaurantPageSkeleton from "./restaurant-page-skeleton";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RestaurantPageProps {
  restaurant: Restaurant;
}

export default function RestaurantPage({ restaurant }: RestaurantPageProps) {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [dates, setDates] = useState<DateMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateMeals, setSelectedDateMeals] = useState<Repas[]>([]);
  const [noMeal, setNoMeal] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [selectedDateBreakfast, setSelectedDateBreakfast] =
    useState<Repas | null>(null);
  const [selectedDateLunch, setSelectedDateLunch] = useState<Repas | null>(
    null
  );
  const [selectedDateDinner, setSelectedDateDinner] = useState<Repas | null>(
    null
  );

  const t = useTranslations("RestaurantPage");
  const locale = useLocale();

  useEffect(() => {
    setLoading(true);

    getMenuByRestaurantId(restaurant.code)
      .then((result) => {
        if (result.success) {
          setMenu(result.data);
          setSelectedDate(formatToISODate(result.data[0].date));
          setSelectedDateMeals(result.data[0].repas);
        } else {
          setNoMeal(true);
        }
      })
      .then(() => {
        getFutureDatesMenuAvailable(restaurant.code)
          .then((result) => {
            if (result.success) {
              // remove duplicates
              const uniqueDates = result.data.filter(
                (date, index, self) =>
                  index === self.findIndex((t) => t.date === date.date)
              );
              setDates(uniqueDates);
            }
          })
          .finally(() => {
            setPageUrl(window.location.href);
            setLoading(false);
          });
      });
  }, [restaurant]);

  useEffect(() => {
    const selectedDateMenu = menu.find(
      (menu) => formatToISODate(menu.date).getTime() === selectedDate.getTime()
    );

    if (selectedDateMenu) {
      setSelectedDateMeals(selectedDateMenu.repas);
      setSelectedDateBreakfast(
        selectedDateMenu.repas.find((repas) => repas.type === "matin") ?? null
      );
      setSelectedDateLunch(
        selectedDateMenu.repas.find((repas) => repas.type === "midi") ?? null
      );
      setSelectedDateDinner(
        selectedDateMenu.repas.find((repas) => repas.type === "soir") ?? null
      );
    } else {
      setSelectedDateMeals([]);
      setSelectedDateBreakfast(null);
      setSelectedDateLunch(null);
      setSelectedDateDinner(null);
    }
  }, [selectedDate, menu]);

  const { addOrRemoveFromFavorites, favorites } = useUserPreferences();

  return (
    <div>
      <div>
        <div className="flex items-center flex-wrap justify-center md:justify-start">
          <h1 className="font-bold text-3xl text-center">{restaurant?.nom}</h1>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full ml-4 mt-2 md:mt-0"
            onClick={() =>
              addOrRemoveFromFavorites(restaurant.code, restaurant.nom)
            }
          >
            {favorites.some((f) => f.code === restaurant.code) ? (
              <Heart className="text-red-500 fill-red-500" />
            ) : (
              <Heart />
            )}
          </Button>
          <QrCodeDialog
            dialogTrigger={
              <Button size="icon" className="ml-4 mt-2 md:mt-0">
                <QrCode />
              </Button>
            }
            title={restaurant.nom + " - CROUStillant"}
            description={t("qrCodeDescription")}
            url={pageUrl}
          />
        </div>
      </div>
      {noMeal ? (
        <div className="w-full flex flex-wrap items-center justify-center min-h-56 border mt-4 rounded-lg shadow-sm font-bold p-2">
          <p className="text-center text-2xl mt-4 underline">
            {t("noMealAvailable")}
          </p>
          <RestaurantInfo restaurant={restaurant} numberOfMeals={12} />
        </div>
      ) : loading ? (
        <RestaurantPageSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <fieldset className="grid gap-6 md:col-span-2 rounded-lg border p-4 mb-4 md:mb-8">
            <legend className="-ml-1 px-1 text-sm font-medium">
              {t("menuOfTheDay", {
                date: selectedDate.toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }),
              })}
            </legend>
            <div className="flex flex-col gap-4">
              {selectedDateMeals.length === 0 ? (
                <p className="text-center">{t("noMenuAvailable")}</p>
              ) : (
                <MealsDisplay
                  selectedDateBreakfast={selectedDateBreakfast}
                  selectedDateLunch={selectedDateLunch}
                  selectedDateDinner={selectedDateDinner}
                />
              )}
            </div>
          </fieldset>
          <Tabs defaultValue="calendar" className="w-full md:mt-2">
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
              </fieldset>
            </TabsContent>
            <TabsContent value="info">
              <RestaurantInfo restaurant={restaurant} numberOfMeals={12} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
