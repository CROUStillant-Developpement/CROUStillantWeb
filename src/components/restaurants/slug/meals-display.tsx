import QrCodeDialog from "@/components/qr-code-dialog";
import CalendarSubscribeDialog from "@/components/restaurants/slug/calendar-subscribe-dialog";
import MealCard from "@/components/restaurants/slug/meal-card";
import { DishTagsInfo } from "@/components/restaurants/slug/dish-feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repas } from "@/services/types";
import { CalendarPlus, Share2 } from "lucide-react";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { toLocalISODateString } from "@/lib/utils";
import { CalendarMeal } from "@/lib/calendar";

interface MealsDisplayProps {
  selectedDateBreakfast: Repas | null;
  selectedDateLunch: Repas | null;
  selectedDateDinner: Repas | null;
  date: Date;
  /** Enables the "add to calendar" shortcut on each meal card. */
  restaurant?: { code: number; nom: string };
}

// Always visible on touch screens (no hover there); revealed on hover from `sm` up
const HOVER_ACTION_CLASS =
  "p-2 rounded-full bg-secondary/50 hover:bg-secondary cursor-pointer transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100";

function MealSection({
  repas,
  mealType,
  title,
  emoji,
  date,
  qrTitle,
  qrDescription,
  restaurant,
}: {
  repas: Repas;
  mealType: CalendarMeal;
  title: string;
  emoji: string;
  date: Date;
  qrTitle: string;
  qrDescription: string;
  restaurant?: { code: number; nom: string };
}) {
  const tCard = useTranslations("RestaurantCard");
  const umami = useUmami();
  const sortedCategories = useMemo(
    () => [...repas.categories].sort((a, b) => a.ordre - b.ordre),
    [repas.categories]
  );
  return (
    <Card className="group rounded-2xl border border-primary/5 bg-card/50 hover:border-primary/20 transition-all duration-300 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
        <CardTitle className="flex min-w-0 items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">{emoji}</span>
          <span className="font-extrabold tracking-tight truncate">{title}</span>
        </CardTitle>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <DishTagsInfo className={HOVER_ACTION_CLASS} />
        {restaurant && (
          <CalendarSubscribeDialog
            restaurantCode={restaurant.code}
            restaurantName={restaurant.nom}
            initialMeals={[mealType]}
            dialogTrigger={
              <button
                type="button"
                aria-label={tCard("addToCalendar")}
                title={tCard("addToCalendar")}
                className={HOVER_ACTION_CLASS}
                onClick={() =>
                  umami.event("Restaurant.Meal.Calendar", {
                    restaurant: restaurant.code,
                    repas: mealType,
                  })
                }
              >
                <CalendarPlus className="w-5 h-5 opacity-70" />
              </button>
            }
          />
        )}
        <QrCodeDialog
          dialogTrigger={
            <button
              type="button"
              aria-label={tCard("viewQrCode")}
              title={tCard("viewQrCode")}
              className={HOVER_ACTION_CLASS}
            >
              <Share2 className="w-5 h-5 opacity-70" />
            </button>
          }
          title={qrTitle}
          url={(() => {
            if (typeof window === "undefined") {
              return "";
            }
            const u = new URL(window.location.href);
            u.searchParams.set("date", toLocalISODateString(date));
            // if past date, add #history to URL
            if (date < new Date()) {
              u.hash = "history";
            }
            return u.toString();
          })()}
          description={qrDescription}
        />
      </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 sm:px-6 sm:pb-6">
        <div className="grid gap-2 sm:gap-3">
          {sortedCategories.map((meal) => (
            <MealCard key={meal.code} meal={meal} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MealsDisplay({
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
  date,
  restaurant,
}: MealsDisplayProps) {
  const t = useTranslations("RestaurantInformation");
  const locale = useLocale();

  const formattedDate = date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {selectedDateBreakfast && (
        <MealSection
          repas={selectedDateBreakfast}
          mealType="matin"
          title={t("breakfast")}
          emoji="🥞"
          date={date}
          restaurant={restaurant}
          qrTitle={t("qrCode.breakfastTitle", { date: formattedDate })}
          qrDescription={t("qrCode.breakfastDescription", {
            date: formattedDate,
          })}
        />
      )}
      {selectedDateLunch && (
        <MealSection
          repas={selectedDateLunch}
          mealType="midi"
          title={t("lunch")}
          emoji="🍽"
          date={date}
          restaurant={restaurant}
          qrTitle={t("qrCode.lunchTitle", { date: formattedDate })}
          qrDescription={t("qrCode.lunchDescription", {
            date: formattedDate,
          })}
        />
      )}
      {selectedDateDinner && (
        <MealSection
          repas={selectedDateDinner}
          mealType="soir"
          title={t("dinner")}
          emoji="🍲"
          date={date}
          restaurant={restaurant}
          qrTitle={t("qrCode.dinnerTitle", { date: formattedDate })}
          qrDescription={t("qrCode.dinnerDescription", {
            date: formattedDate,
          })}
        />
      )}
    </>
  );
}
