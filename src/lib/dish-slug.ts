import { slugify } from "@/lib/utils";

/**
 * Reads the canonical dish id out of a URL slug: `<name>-d<id>`, or the bare
 * id. Only the trailing `-d<id>` is load-bearing, like restaurant slugs.
 */
export function extractDishId(slug: unknown): number | null {
  if (typeof slug !== "string") return null;

  const match = slug.match(/-d(\d+)$/) || slug.match(/^(\d+)$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  return isNaN(id) ? null : id;
}

/**
 * The one slug a canonical dish is served under (others redirect to it).
 */
export function buildDishSlug(dish: { libelle: string; code: number | string }): string {
  const name = slugify(dish.libelle);
  return name ? `${name}-d${dish.code}` : String(dish.code);
}
