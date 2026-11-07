import type { AllergeneDeclare, Plat, TypePlat } from "@/services/types";

/**
 * Quality labels shown as tags. The API returns the labels as written in the
 * menus ("bio", "rouge", "bleu-blanc-cœur"...): only the ones below are real
 * quality or dietary labels, the rest ("plat complet", "supplement",
 * "selon disponibilité"...) are notes and are not shown.
 */
const QUALITY_LABELS = {
  bio: "bio",
  maison: "maison",
  rouge: "labelRouge",
  "rouge loire atlantique": "labelRouge",
  "bleu-blanc-cœur": "bleuBlancCoeur",
  msc: "msc",
  asc: "asc",
  aop: "aop",
  igp: "igp",
  halal: "halal",
  "sans porc": "sansPorc",
} as const;

export type QualityLabel = (typeof QUALITY_LABELS)[keyof typeof QUALITY_LABELS];

/**
 * Origins shown as tags, as region codes (CLDR: ISO 3166 plus "EU"), so that
 * `Intl.DisplayNames` names them in the user's language. The API returns the
 * origins as extracted from the menus, with noise ("Ine", "An", "S France",
 * "Polgne"): only the values below are shown, the rest is ignored.
 * Keys are folded (lower case, no accents).
 */
const ORIGINS: Record<string, string> = {
  france: "FR",
  reunion: "RE",
  "la reunion": "RE",
  "union europeenne": "EU",
  ue: "EU",
  europe: "EU",
  pologne: "PL",
  espagne: "ES",
  irlande: "IE",
  allemagne: "DE",
  italie: "IT",
  hongrie: "HU",
  chine: "CN",
  ukraine: "UA",
  "republique tcheque": "CZ",
  belgique: "BE",
  portugal: "PT",
  bulgarie: "BG",
  "pays-bas": "NL",
  "pays bas": "NL",
  "royaume uni": "GB",
  "royaume-uni": "GB",
  argentine: "AR",
  chili: "CL",
  "nouvelle zelande": "NZ",
  "nouvelle-zelande": "NZ",
};

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

/**
 * The origins of a dish as region codes, without duplicates and in the order
 * they were announced. "Union Europeenne & Royaume Uni" gives EU and GB; a
 * leading "Du porc", "Du poulet" or "Ou provenance" (extraction leftovers) is
 * dropped; unknown values are ignored.
 *
 * @param origines - The origins returned by the API.
 * @returns The region codes.
 */
export function getOriginCodes(origines: string[] | undefined | null): string[] {
  const codes = new Set<string>();
  for (const raw of origines ?? []) {
    for (const part of fold(raw).split(/\s*(?:&|\/|,|\bet\b)\s*/)) {
      const name = part
        .replace(/^[:\s-]+/, "")
        .replace(/^(?:ou\s+provenance|du\s+(?:porc|poulet|boeuf|veau|canard))\s+/, "")
        .trim();
      const code = ORIGINS[name];
      if (code) codes.add(code);
    }
  }
  return [...codes];
}

export type DishTag =
  | { kind: "type"; type: Exclude<TypePlat, "AUTRE"> }
  | { kind: "vegetarian" }
  | { kind: "label"; label: QualityLabel }
  | { kind: "origin"; origins: string[] }
  | { kind: "allergens"; allergens: AllergeneDeclare[] }
  | { kind: "points"; points: number };

/**
 * The label to display: the clean label from the analysis (without points,
 * prices or allergen codes, which become tags), or the raw label when the dish
 * has not been analysed.
 *
 * @param plat - The dish.
 * @returns The label to display.
 */
export function getDishName(plat: Plat): string {
  return plat.analyse?.libelle?.trim() || plat.libelle;
}

/**
 * Whether the row is an information line ("Fermé", "Menu non communiqué",
 * an announcement...) rather than a dish.
 *
 * @param plat - The row returned in a menu category.
 * @returns `true` for an information line.
 */
export function isInfoLine(plat: Plat): boolean {
  const nature = plat.analyse?.nature;
  return nature === "INFO" || nature === "ALLERGENS" || nature === "PRICE";
}

/**
 * Whether the row is noise (separator, punctuation...) that should not be shown.
 *
 * @param plat - The row returned in a menu category.
 * @returns `true` when the row carries no information.
 */
export function isNoise(plat: Plat): boolean {
  return plat.analyse?.nature === "JUNK";
}

/**
 * The type to filter or tag a dish with: the type where it is served (menus) or
 * the default type of the canonical dish (/plats, /plats/top).
 *
 * @param plat - The dish.
 * @returns The type, or `null` when unknown.
 */
export function getDishType(plat: Plat): TypePlat | null {
  if (plat.analyse) return plat.analyse.nature === "DISH" ? plat.analyse.type : null;
  return plat.type ?? null;
}

/**
 * The tags of a dish, in display order: type first, then vegetarian, quality
 * labels, origin, declared allergens and points.
 *
 * A canonical dish (/plats, /plats/top) only carries its type and whether it is
 * vegetarian; a dish served in a menu carries the full analysis.
 *
 * @param plat - The dish.
 * @returns The tags (empty when the dish has not been analysed or is not a dish).
 */
export function getDishTags(plat: Plat): DishTag[] {
  const analyse = plat.analyse;
  if (!analyse) {
    const tags: DishTag[] = [];
    if (plat.type && plat.type !== "AUTRE") tags.push({ kind: "type", type: plat.type });
    if (plat.vegetarien) tags.push({ kind: "vegetarian" });
    return tags;
  }
  if (analyse.nature !== "DISH") return [];

  const tags: DishTag[] = [];

  if (analyse.type && analyse.type !== "AUTRE") {
    tags.push({ kind: "type", type: analyse.type });
  }

  if (analyse.vegetarien) {
    tags.push({ kind: "vegetarian" });
  }

  const labels = new Set<QualityLabel>();
  for (const raw of analyse.labels ?? []) {
    const label = QUALITY_LABELS[raw.trim().toLowerCase() as keyof typeof QUALITY_LABELS];
    if (label) labels.add(label);
  }
  for (const label of labels) {
    tags.push({ kind: "label", label });
  }

  const origins = getOriginCodes(analyse.origines);
  if (origins.length) {
    tags.push({ kind: "origin", origins });
  }

  if (analyse.allergenes_declares?.length) {
    tags.push({ kind: "allergens", allergens: analyse.allergenes_declares });
  }

  if (typeof analyse.points === "number" && Number.isFinite(analyse.points)) {
    tags.push({ kind: "points", points: analyse.points });
  }

  return tags;
}
