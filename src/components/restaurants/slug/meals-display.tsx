import QrCodeDialog from "@/components/qr-code-dialog";
import CalendarSubscribeDialog from "@/components/restaurants/slug/calendar-subscribe-dialog";
import MealCard from "@/components/restaurants/slug/meal-card";
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

const HOVER_ACTION_CLASS =
  "p-2 rounded-full bg-secondary/50 hover:bg-secondary cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300";

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
    <Card className="relative overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group rounded-3xl bg-transparent">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors" />
      <div className="absolute top-6 right-6 flex items-center gap-2">
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
            <div className={HOVER_ACTION_CLASS}>
              <Share2 className="w-5 h-5 opacity-70" />
            </div>
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
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <span className="font-extrabold tracking-tight">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid gap-3">
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
