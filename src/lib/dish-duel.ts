import { Plat } from "@/services/types";

/**
 * A dish that can be used in a duel: the `total` (number of times it has been
 * served) is what players compare, so it has to be present and positive.
 */
export interface DuelDish {
  code: Plat["code"];
  libelle: string;
  total: number;
}

/** Keyboard sequence that unlocks the game (the Konami code). */
export const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/**
 * Rows the CROUS feed publishes when a restaurant has no menu to announce.
 * They are not dishes, and they dwarf every real dish in the rankings, so a
 * duel involving one would be both unfair and confusing.
 */
const NON_DISH_PATTERNS = [
  /non\s+communiqu/i,
  /^ferm[ée]/i,
  /^pas\s+de\s+service/i,
  /^service\s+non\s+assur/i,
];

/**
 * Two dishes only make a fair duel if their totals are far enough apart for
 * the answer to be knowable — a 4 100 vs 4 108 round is a coin flip.
 */
const MAX_FAIR_RATIO = 0.9;

/**
 * Whether a row from `plats/top` is a real dish players can be asked about.
 *
 * @param plat - The dish returned by the API.
 * @returns `true` when the row is a dish with a usable occurrence count.
 */
export function isPlayableDish(plat: Plat): boolean {
  if (typeof plat.total !== "number" || !Number.isFinite(plat.total) || plat.total <= 0) {
    return false;
  }

  const libelle = plat.libelle?.trim();
  if (!libelle) return false;

  return !NON_DISH_PATTERNS.some((pattern) => pattern.test(libelle));
}

/**
 * Turns the API's top-dishes ranking into the deck the duel draws from.
 *
 * @param plats - The dishes returned by `plats/top`.
 * @returns The playable dishes, de-duplicated by code.
 */
export function buildDeck(plats: Plat[]): DuelDish[] {
  const byCode = new Map<Plat["code"], DuelDish>();

  for (const plat of plats) {
    if (!isPlayableDish(plat)) continue;
    if (byCode.has(plat.code)) continue;

    byCode.set(plat.code, {
      code: plat.code,
      libelle: plat.libelle.trim(),
      total: plat.total!,
    });
  }

  return Array.from(byCode.values());
}

/**
 * Whether two dishes are far enough apart in occurrences to make a fair round.
 *
 * @param a - First dish.
 * @param b - Second dish.
 * @returns `true` when the smaller total is at most 90% of the larger one.
 */
export function isFairMatch(a: DuelDish, b: DuelDish): boolean {
  const smallest = Math.min(a.total, b.total);
  const largest = Math.max(a.total, b.total);

  return largest > 0 && smallest / largest <= MAX_FAIR_RATIO;
}

/**
 * Draws the two dishes for the next round.
 *
 * Dishes seen in the last few rounds are skipped so a short session doesn't
 * keep showing the same pair, and the pair is shuffled so the bigger total is
 * not always on the same side.
 *
 * @param deck - The playable dishes.
 * @param random - Random source, injectable so rounds can be tested.
 * @param recentCodes - Codes drawn recently, avoided when possible.
 * @returns The two dishes of the round, or `null` if the deck is too small.
 */
export function pickDuel(
  deck: DuelDish[],
  random: () => number = Math.random,
  recentCodes: readonly Plat["code"][] = []
): [DuelDish, DuelDish] | null {
  if (deck.length < 2) return null;

  const recent = new Set(recentCodes);
  let pool = deck.filter((dish) => !recent.has(dish.code));
  if (pool.length < 2) pool = deck;

  const first = pool[Math.floor(random() * pool.length)];
  const others = pool.filter((dish) => dish.code !== first.code);
  const fair = others.filter((dish) => isFairMatch(first, dish));
  const candidates = fair.length > 0 ? fair : others;
  const second = candidates[Math.floor(random() * candidates.length)];

  return random() < 0.5 ? [first, second] : [second, first];
}

/**
 * The winner of a round.
 *
 * @param a - First dish.
 * @param b - Second dish.
 * @returns The dish served the most often, or `null` on a perfect tie.
 */
export function duelWinner(a: DuelDish, b: DuelDish): DuelDish | null {
  if (a.total === b.total) return null;

  return a.total > b.total ? a : b;
}
