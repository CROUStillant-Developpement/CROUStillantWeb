"use client";

import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFollowedDishesWeek } from "@/hooks/useFollowedDishesWeek";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";
import { getNormalizedISODate, toLocalISODateString } from "@/lib/utils";

/**
 * "This week for you": the followed dishes that the user's favourite
 * restaurants serve in the coming days.
 *
 * Renders nothing for visitors who do not follow any dish.
 */
export default function FollowedDishesWeek() {
  const t = useTranslations("FollowedDishes");
  const locale = useLocale();
  const umami = useUmami();
  const { matches, hasFollowedDishes, hasFavourites } = useFollowedDishesWeek();

  if (!hasFollowedDishes) return null;

  const mealLabels = { matin: t("breakfast"), midi: t("lunch"), soir: t("dinner") };

  return (
    <Card className="rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs" id="for-you">
      <CardHeader className="border-b border-primary/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
            <Star className="w-6 h-6 fill-current" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary wrap-break-word">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium">
              {t("description")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!hasFavourites ? (
          <p className="text-muted-foreground">
            {t.rich("noFavourites", {
              restaurants: (chunks) => (
                <Link
                  href="/restaurants"
                  className="font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        ) : matches === null ? (
          <p className="text-muted-foreground">{t("loading")}</p>
        ) : matches.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => {
              const date = getNormalizedISODate(match.date);

              return (
                <li key={`${match.restaurant.code}:${match.date}:${match.meal}:${match.dish.code}`}>
                  <Link
                    href={`/restaurants/${buildRestaurantSlug(match.restaurant)}?date=${toLocalISODateString(date)}`}
                    className="flex flex-col gap-1 h-full rounded-2xl border border-primary/5 bg-background/60 p-4 hover:border-primary/20 hover:bg-primary/5 transition-colors"
                    onClick={() => umami.event("Dishes.FollowedDish")}
                  >
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                      {date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
                      {" · "}
                      {mealLabels[match.meal]}
                    </span>
                    <span className="font-bold text-lg text-foreground capitalize wrap-break-word">
                      {match.dish.libelle}
                    </span>
                    <span className="text-sm text-muted-foreground wrap-break-word">
                      {match.restaurant.nom}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
