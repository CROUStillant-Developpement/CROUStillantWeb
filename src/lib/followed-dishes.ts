import { Menu, Repas } from "@/services/types";
import { getNormalizedISODate } from "@/lib/utils";

export interface FollowedDish {
  code: string;
  libelle: string;
}

export interface FollowedDishMatch {
  dish: FollowedDish;
  /** Menu date, in the API's "DD-MM-YYYY" format. */
  date: string;
  meal: Repas["type"];
}

const MEAL_ORDER: Record<Repas["type"], number> = { matin: 0, midi: 1, soir: 2 };

/**
 * Finds the followed dishes served in the given menus.
 *
 * A dish served several times during the same meal (in two categories, say) is
 * only reported once.
 *
 * @param menus - The menus to search.
 * @param followed - The dishes the user follows.
 * @returns The matches, sorted by date then by meal.
 */
export function findFollowedDishes(menus: Menu[], followed: FollowedDish[]): FollowedDishMatch[] {
  if (followed.length === 0) return [];

  // The API serialises dish codes as numbers; the store keeps them as strings.
  const followedCodes = new Set(followed.map((dish) => String(dish.code)));
  const seen = new Set<string>();
  const matches: FollowedDishMatch[] = [];

  for (const menu of menus) {
    for (const repas of menu.repas) {
      for (const categorie of repas.categories) {
        for (const plat of categorie.plats) {
          const code = String(plat.code);
          if (!followedCodes.has(code)) continue;

          const key = `${menu.date}:${repas.type}:${code}`;
          if (seen.has(key)) continue;
          seen.add(key);

          matches.push({
            dish: { code, libelle: plat.libelle },
            date: menu.date,
            meal: repas.type,
          });
        }
      }
    }
  }

  return matches.sort(
    (a, b) =>
      getNormalizedISODate(a.date).getTime() - getNormalizedISODate(b.date).getTime() ||
      MEAL_ORDER[a.meal] - MEAL_ORDER[b.meal]
  );
}
