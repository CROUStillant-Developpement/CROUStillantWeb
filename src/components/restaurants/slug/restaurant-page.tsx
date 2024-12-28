"use client";

import { Menu, Restaurant, DateMenu, Repas } from "@/services/types";
import {
  getMenuByRestaurantId,
  getDatesMenuAvailable,
  getFutureDatesMenuAvailable,
} from "@/services/menu-service";
import { useEffect, useState } from "react";
import { formatToISODate } from "@/lib/utils";
import MealsDisplay from "./meals-display";

interface RestaurantPageProps {
  restaurant: Restaurant;
}

export default function RestaurantPage({ restaurant }: RestaurantPageProps) {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [dates, setDates] = useState<DateMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateMeals, setSelectedDateMeals] = useState<Repas[]>([]);

  useEffect(() => {
    setLoading(true);

    getMenuByRestaurantId(restaurant.code)
      .then((result) => {
        if (result.success) {
          setMenu(result.data);
        } else {
          console.error(result.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    setLoading(true);

    getFutureDatesMenuAvailable(restaurant.code)
      .then((result) => {
        if (result.success) {
          setDates(result.data);
          setSelectedDate(formatToISODate(result.data[0].date));
        } else {
          console.error(result.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [restaurant]);

  return (
    <div>
      <h1 className="font-bold text-3xl">{restaurant.nom}</h1>
      <div>
        {JSON.stringify(menu)} <br />
        {JSON.stringify(dates)}
      </div>
      {selectedDate && (
        <div className="grid gap-4 md:grid-cols-3 mt-8">
          <fieldset className="grid gap-6 md:col-span-2 rounded-lg border p-4 mb-4 md:mb-8">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Menu du{" "}
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </legend>
            <div className="flex flex-col gap-4">
              {selectedDateMeals.length === 0 ? (
                <p className="text-center">
                  Aucun menu disponible pour cette date 🥲
                </p>
              ) : (
                <MealsDisplay
                  selectedDateBreakfast={selectedDateMeals}
                  selectedDateLunch={selectedDateMeals}
                  selectedDateDinner={selectedDateMeals}
                />
              )}
            </div>
          </fieldset>
          <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Menu des jours suivants
            </legend>
            {/* <RestaurantCalendar
              availableDates={availableDates}
              meals={meals}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            /> */}
          </fieldset>
        </div>
      )}
    </div>
  );
}
