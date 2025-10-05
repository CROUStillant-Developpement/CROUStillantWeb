"use client";

import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MealsDisplay from "./meals-display";
import { Repas } from "@/services/types";
import { useLocale, useTranslations } from "next-intl";

interface MenuDisplaySectionProps {
  menuLoading: boolean;
  datesLoading: boolean;
  selectedDate: Date;
  selectedDateMeals: Repas[];
  selectedDateBreakfast: Repas | null;
  selectedDateLunch: Repas | null;
  selectedDateDinner: Repas | null;
  rightPanel?: ReactNode; // optional right side (calendar, info, etc.)
  noMenuAtAll?: boolean;
  bordered?: boolean;
}

export default function MenuDisplaySection({
  menuLoading,
  datesLoading,
  selectedDate,
  selectedDateMeals,
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
  rightPanel,
  noMenuAtAll = false,
  bordered = true,
}: MenuDisplaySectionProps) {
  const t = useTranslations("RestaurantPage");
  const locale = useLocale();

  return (
    <div className={`grid gap-4 ${rightPanel ? "lg:grid-cols-3" : ""} mt-8`}>
      {menuLoading ? (
        <fieldset
          className={`grid gap-6 ${
            rightPanel ? "lg:col-span-2" : ""
          } rounded-lg border p-4 mb-4 md:mb-8 h-fit`}
        >
          <legend className="-ml-1 px-1 text-sm font-medium">
            <Skeleton className="w-36 h-4" />
          </legend>
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="w-full h-40 rounded-xl" />
          </div>
        </fieldset>
      ) : (
        <fieldset
          className={`grid gap-6 ${rightPanel ? "lg:col-span-2" : ""} ${
            bordered ? "rounded-lg border" : ""
          } p-4 mb-4 md:mb-8 h-fit`}
        >
          <legend className="-ml-1 px-1 text-sm font-medium">
            {t("menuOfTheDay", {
              date: selectedDate.toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            })}
          </legend>
          <div className="flex flex-col gap-4">
            {noMenuAtAll ? (
              <Alert className="md:text-3xl" variant={"warning"}>
                <AlertTitle>{t("noMealAvailable")}</AlertTitle>
                <AlertDescription>
                  {t("noMealAvailableDescription")}
                </AlertDescription>
                <AlertDescription className="mt-2">
                  {t("noMealAvailableDescription2")}
                </AlertDescription>
              </Alert>
            ) : selectedDateMeals.length === 0 ? (
              <Alert className="md:text-3xl" variant={"warning"}>
                <AlertTitle>{t("noMenuAvailable")}</AlertTitle>
              </Alert>
            ) : (
              <MealsDisplay
                selectedDateBreakfast={selectedDateBreakfast}
                selectedDateLunch={selectedDateLunch}
                selectedDateDinner={selectedDateDinner}
              />
            )}
          </div>
        </fieldset>
      )}
      {datesLoading && rightPanel ? (
        <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit">
          <legend className="-ml-1 px-1 text-sm font-medium">
            <Skeleton className="w-36 h-4" />
          </legend>
          <Skeleton className="w-full h-10" />
          <div className="flex flex-wrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1/2 p-1">
                <Skeleton className="h-48 rounded-xl" />
              </div>
            ))}
          </div>
        </fieldset>
      ) : (
        rightPanel
      )}
    </div>
  );
}
