import { Menu, Restaurant } from "@/services/types";

/**
 * Helpers that turn a restaurant's raw API data into the words people actually
 * type in a search engine: the city ("resto u moulin de la housse reims"), the
 * opening hours and today's dishes.
 */

// "51100 Reims", "21 000 DIJON", "44600, Saint Nazaire"
const POSTCODE_CITY = /\b\d{2}\s?\d{3},?\s+([A-Za-zÀ-ÿ' -]+?)\s*(?:cedex.*)?$/i;
// "18 avenue de Bardanac à Pessac", "2 avenue Poplawski à PAU"
const A_CITY = /\sà\s+([A-Za-zÀ-ÿ' -]+)$/i;

function toTitleCase(value: string): string {
  if (value !== value.toUpperCase()) {
    return value;
  }

  return value
    .toLowerCase()
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase());
}

/**
 * The city a restaurant is in, read from the postcode in its address.
 *
 * About one address in eight carries no postcode; the CROUS region label
 * (named after the academy's main city) is the closest usable fallback.
 */
export function getRestaurantCity(restaurant: Restaurant): string {
  const address = restaurant.adresse?.trim();
  const match = address?.match(POSTCODE_CITY) ?? address?.match(A_CITY);
  const city = match?.[1]?.trim();

  return city ? toTitleCase(city) : restaurant.region.libelle;
}

/** The postcode in a restaurant's address, if there is one. */
export function getRestaurantPostcode(restaurant: Restaurant): string | null {
  const match = restaurant.adresse?.match(/\b(\d{2})\s?(\d{3})\b/);
  return match ? `${match[1]}${match[2]}` : null;
}

/**
 * True when the name already says where the restaurant is ("Cafet IUT Reims"),
 * so titles do not repeat the city.
 */
export function nameContainsCity(name: string, city: string): boolean {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();

  return normalize(name).includes(normalize(city));
}

const HOUR_RANGE =
  /(\d{1,2})\s*h\s*(\d{2})?\s*(?:-|–|à|a)\s*(\d{1,2})\s*h\s*(\d{2})?/gi;

/**
 * The widest opening range found in the free-text hours ("Self: 11h30 - 13h45",
 * "Du lundi au vendredi de 11h15 à 13h30"), as "HH:MM" strings.
 *
 * The hours are not structured API-side, so anything that does not parse is
 * ignored rather than guessed at.
 */
export function parseOpeningRange(
  horaires: string[] | undefined
): { opens: string; closes: string } | null {
  let opens: number | null = null;
  let closes: number | null = null;

  for (const line of horaires ?? []) {
    for (const match of line.matchAll(HOUR_RANGE)) {
      const start = Number(match[1]) * 60 + Number(match[2] ?? 0);
      const end = Number(match[3]) * 60 + Number(match[4] ?? 0);

      if (start >= end || end > 24 * 60) continue;

      opens = opens === null ? start : Math.min(opens, start);
      closes = closes === null ? end : Math.max(closes, end);
    }
  }

  if (opens === null || closes === null) {
    return null;
  }

  const format = (minutes: number) =>
    `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

  return { opens: format(opens), closes: format(closes) };
}

/**
 * A few dishes from the first upcoming menu, main courses first.
 *
 * Used in the meta description: a snippet that already answers "what's for
 * lunch" is what makes a search result worth clicking over the CROUS page.
 */
export function pickHighlightDishes(menus: Menu[], limit = 3): string[] {
  for (const menu of menus) {
    const repas =
      menu.repas.find((r) => r.type === "midi") ??
      menu.repas.find((r) => r.type === "soir") ??
      menu.repas[0];

    if (!repas) continue;

    const categories = [...repas.categories].sort((a, b) => {
      const isMain = (libelle: string) => /plat/i.test(libelle) ? 0 : 1;
      return isMain(a.libelle) - isMain(b.libelle);
    });

    const dishes: string[] = [];

    for (const categorie of categories) {
      for (const plat of categorie.plats) {
        const name = plat.libelle.trim();
        if (
          name &&
          !dishes.some((d) => d.toLowerCase() === name.toLowerCase())
        ) {
          dishes.push(name);
        }
      }
    }

    if (dishes.length > 0) {
      return dishes.slice(0, limit);
    }
  }

  return [];
}

/** Cuts `text` on a word boundary so it fits a search snippet. */
export function truncateForSnippet(text: string, max = 158): string {
  if (text.length <= max) {
    return text;
  }

  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:]+$/, "")}…`;
}
