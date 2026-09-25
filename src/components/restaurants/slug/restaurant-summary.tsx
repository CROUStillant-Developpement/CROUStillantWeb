import { getTranslations } from "next-intl/server";
import { Restaurant } from "@/services/types";
import { getRestaurantCity } from "@/lib/restaurant-seo";

// API days are French, capitalised ("Lundi"). 2024-01-01 was a Monday, so
// offset n gives a date whose weekday Intl can name in any locale.
const DAY_OFFSETS: Record<string, number> = {
  lundi: 0,
  mardi: 1,
  mercredi: 2,
  jeudi: 3,
  vendredi: 4,
  samedi: 5,
  dimanche: 6,
};

function openDays(restaurant: Restaurant, locale: string): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  });

  return (restaurant.jours_ouvert ?? [])
    .filter((j) => j.ouverture.matin || j.ouverture.midi || j.ouverture.soir)
    .map((j) =>
      DAY_OFFSETS[
        j.jour
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .toLowerCase()
          .trim()
      ]
    )
    .filter((offset): offset is number => offset !== undefined)
    .map((offset) => format.format(Date.UTC(2024, 0, 1 + offset)));
}

/**
 * A plain-text description of the restaurant, rendered on the server.
 *
 * Everything else on the page is widgets; this is the one paragraph a crawler
 * or an LLM can quote verbatim to answer "where is it, when is it open, how do
 * I pay" — the questions the official CROUS page currently answers for them.
 */
export default async function RestaurantSummary({
  restaurant,
  locale,
}: {
  restaurant: Restaurant;
  locale: string;
}) {
  const t = await getTranslations("RestaurantPage.seo");
  const tMeals = await getTranslations("ScreenPage");
  const list = new Intl.ListFormat(locale, { type: "conjunction" });

  const days = openDays(restaurant, locale);
  const services = restaurant.jours_ouvert ?? [];
  const meals = [
    services.some((j) => j.ouverture.matin) && tMeals("breakfast"),
    services.some((j) => j.ouverture.midi) && tMeals("lunch"),
    services.some((j) => j.ouverture.soir) && tMeals("dinner"),
  ]
    .filter((meal): meal is string => Boolean(meal))
    .map((meal) => meal.toLowerCase());

  const hours = (restaurant.horaires ?? [])
    .map((line) => line.trim().replace(/[.\s]+$/, ""))
    .filter(Boolean);

  const sentences = [
    t("summary", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
      address: restaurant.adresse || getRestaurantCity(restaurant),
    }),
    days.length > 0 &&
      meals.length > 0 &&
      t("summaryDays", { days: list.format(days), meals: list.format(meals) }),
    hours.length > 0 && t("summaryHours", { hours: hours.join(" ; ") }),
    restaurant.paiement?.length &&
      t("summaryPayment", { payment: list.format(restaurant.paiement) }),
    t("summaryMenu"),
  ].filter(Boolean);

  return (
    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 max-w-4xl">
      {sentences.join(" ")}
    </p>
  );
}
