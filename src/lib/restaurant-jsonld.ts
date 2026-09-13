import { Menu, Restaurant } from "@/services/types";
import { formatToISODate } from "@/lib/utils";

// Days come back from the API capitalised and in French ("Lundi", "Mardi", ...).
// Normalise them (lowercase, unaccented) before mapping to schema.org DayOfWeek.
const DAYS_TO_SCHEMA: Record<string, string> = {
  lundi: "Monday",
  mardi: "Tuesday",
  mercredi: "Wednesday",
  jeudi: "Thursday",
  vendredi: "Friday",
  samedi: "Saturday",
  dimanche: "Sunday",
};

const MEAL_LABELS: Record<string, string> = {
  matin: "Petit-déjeuner",
  midi: "Déjeuner",
  soir: "Dîner",
};

function normalizeDay(jour: string): string | null {
  const key = jour
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  return DAYS_TO_SCHEMA[key] ?? null;
}

/**
 * Formats a "DD-MM-YYYY" date (API format) as "YYYY-MM-DD" (schema.org / ISO 8601).
 * Returns `null` on an unusable date, so invalid JSON-LD is never emitted.
 */
function toIsoDay(apiDate: string): string | null {
  const date = formatToISODate(apiDate);

  if (isNaN(date.getTime())) {
    return null;
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Builds the `openingHoursSpecification` entries from the restaurant's opening days.
 * Exact hours are not structured API-side (free-text field), so this only declares
 * the days on which the restaurant serves at least one meal.
 */
function buildOpeningHours(restaurant: Restaurant) {
  if (!restaurant.jours_ouvert?.length) {
    return undefined;
  }

  const specs = restaurant.jours_ouvert
    .filter(
      (jour) =>
        jour.ouverture.matin || jour.ouverture.midi || jour.ouverture.soir
    )
    .map((jour) => normalizeDay(jour.jour))
    .filter((day): day is string => day !== null)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${day}`,
    }));

  return specs.length > 0 ? specs : undefined;
}

/**
 * Builds the schema.org menu sections from the menus returned by the API.
 *
 * One `MenuSection` is created per (date, meal) pair, holding a sub-section per
 * category ("Entrées", "Plats", ...) with its `MenuItem` entries. That is the shape
 * search engines and LLMs can read back to answer "what is there to eat".
 */
function buildMenuSections(menus: Menu[]) {
  return menus
    .map((menu) => {
      const isoDate = toIsoDay(menu.date);

      const repasSections = menu.repas
        .map((repas) => {
          const categories = repas.categories
            .filter((categorie) => categorie.plats.length > 0)
            .map((categorie) => ({
              "@type": "MenuSection",
              name: categorie.libelle,
              hasMenuItem: categorie.plats.map((plat) => ({
                "@type": "MenuItem",
                name: plat.libelle,
              })),
            }));

          if (categories.length === 0) {
            return null;
          }

          const mealLabel = MEAL_LABELS[repas.type] ?? repas.type;

          return {
            "@type": "MenuSection",
            name: isoDate ? `${mealLabel} — ${isoDate}` : mealLabel,
            ...(isoDate ? { identifier: `${isoDate}-${repas.type}` } : {}),
            hasMenuSection: categories,
          };
        })
        .filter((section) => section !== null);

      return repasSections;
    })
    .flat();
}

/**
 * Builds the schema.org JSON-LD for a restaurant page.
 *
 * Without this markup, crawlers (Googlebot as much as GPTBot, ClaudeBot or
 * PerplexityBot) have to guess the structure of the page. With it, they get the
 * address, coordinates, opening days and today's menu in a usable form.
 *
 * @param restaurant - The restaurant the page describes.
 * @param menus - The known menus (today and the following days). May be empty.
 * @param pageUrl - The absolute canonical URL of the page.
 * @returns The JSON-LD object, to be serialised into an `application/ld+json` tag.
 */
export function buildRestaurantJsonLd(
  restaurant: Restaurant,
  menus: Menu[],
  pageUrl: string
) {
  const openingHours = buildOpeningHours(restaurant);
  const menuSections = buildMenuSections(menus);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": pageUrl,
    name: restaurant.nom,
    url: pageUrl,
    ...(restaurant.image_url ? { image: restaurant.image_url } : {}),
    ...(restaurant.telephone ? { telephone: restaurant.telephone } : {}),
    ...(restaurant.email ? { email: restaurant.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.adresse,
      addressRegion: restaurant.region.libelle,
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    servesCuisine: "Restauration universitaire",
    priceRange: "€",
    ...(restaurant.paiement?.length
      ? { paymentAccepted: restaurant.paiement.join(", ") }
      : {}),
    ...(openingHours ? { openingHoursSpecification: openingHours } : {}),
    amenityFeature: {
      "@type": "LocationFeatureSpecification",
      name: "Accessible aux personnes à mobilité réduite",
      value: restaurant.ispmr,
    },
    ...(menuSections.length > 0
      ? {
          hasMenu: {
            "@type": "Menu",
            name: `Menus de ${restaurant.nom}`,
            inLanguage: "fr",
            hasMenuSection: menuSections,
          },
        }
      : {}),
    isAccessibleForFree: false,
    publicAccess: true,
    provider: {
      "@type": "Organization",
      name: "CROUStillant",
      url: "https://croustillant.menu",
    },
  };
}
