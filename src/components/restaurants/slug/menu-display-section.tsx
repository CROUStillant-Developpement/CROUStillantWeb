"use client";

import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MealsDisplay from "./meals-display";
import { Repas } from "@/services/types";
import { useLocale, useTranslations } from "next-intl";

interface MenuDisplaySectionProps {
  loading: boolean;
  selectedDate: Date;
  selectedDateMeals: Repas[];
  selectedDateBreakfast: Repas | null;
  selectedDateLunch: Repas | null;
  selectedDateDinner: Repas | null;
  rightPanel?: ReactNode; // optional right side (calendar, info, etc.)
  bordered?: boolean;
}

export default function MenuDisplaySection({
  loading,
  selectedDate,
  selectedDateMeals,
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
  rightPanel,
  bordered = true,
}: MenuDisplaySectionProps) {
  const t = useTranslations("RestaurantPage");
  const locale = useLocale();

  if (loading) {
    return (
      <div className={`grid gap-4 ${rightPanel ? "lg:grid-cols-3" : ""} mt-8`}>
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
        {rightPanel && (
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
        )}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${rightPanel ? "lg:grid-cols-3" : ""} mt-8`}>
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
            }),
          })}
        </legend>
        <div className="flex flex-col gap-4">
          {selectedDateMeals.length === 0 ? (
            <Alert className="md:text-3xl" variant={"warning"}>
              <AlertTitle>{t("noMealAvailable")}</AlertTitle>
              <AlertDescription>
                {t("noMealAvailableDescription")}
              </AlertDescription>
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
      {rightPanel}
    </div>
  );
}
