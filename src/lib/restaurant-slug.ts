import { slugify } from "@/lib/utils";

/**
 * Reads the restaurant id out of a URL slug.
 *
 * Two shapes are accepted: the canonical `<name>-r<id>` and the bare id that
 * older links still use. Any name may therefore precede the id — which is what
 * makes `buildRestaurantSlug` below necessary.
 */
export function extractRestaurantId(slug: unknown): number | null {
  if (typeof slug !== "string") return null;

  const match = slug.match(/-r(\d+)$/) || slug.match(/^(\d+)$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  return isNaN(id) ? null : id;
}

/**
 * The one slug a restaurant is allowed to be served under.
 *
 * Only the trailing `-r<id>` is load-bearing, so every one of these resolves to
 * the same restaurant and used to render a self-canonicalising 200:
 *
 *     /fr/restaurants/446
 *     /fr/restaurants/resto-u-mansart-r446
 *     /fr/restaurants/dijon-resto-u-mansart-r446   (name before a CROUS rename)
 *
 * Must stay in sync with how `sitemap.tsx` builds its restaurant entries.
 */
export function buildRestaurantSlug(restaurant: {
  nom: string;
  code: number;
}): string {
  return `${slugify(restaurant.nom)}-r${restaurant.code}`;
}
