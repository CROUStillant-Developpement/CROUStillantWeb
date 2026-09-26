import { Region, Restaurant } from "@/services/types";
import { getCityKey, getRestaurantCity } from "@/lib/restaurant-seo";

/**
 * The URL slug of a CROUS region page: `/crous/reims`, `/crous/aix-marseille`.
 *
 * Built from the label rather than the id because the label is what people
 * search for; regions are renamed far more rarely than restaurants.
 */
export function buildRegionSlug(region: Region): string {
  // Not the shared `slugify`: it drops hyphens ("aixmarseille"), and region
  // names are exactly what people type — "aix-marseille", "orleans-tours".
  return region.libelle
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Finds the region a slug (or a bare numeric id, for old links) points at. */
export function findRegionBySlug(
  regions: Region[],
  slug: string
): Region | undefined {
  if (/^\d+$/.test(slug)) {
    return regions.find((region) => region.code === Number(slug));
  }

  return regions.find((region) => buildRegionSlug(region) === slug);
}

/**
 * A region's restaurants grouped by city, biggest city first, restaurants in
 * alphabetical order — the order people scan a list of "resto U à <ville>".
 */
export function groupRestaurantsByCity(
  restaurants: Restaurant[]
): { city: string; restaurants: Restaurant[] }[] {
  const groups = new Map<string, { names: string[]; restaurants: Restaurant[] }>();

  for (const restaurant of restaurants) {
    const city = getRestaurantCity(restaurant);
    const key = getCityKey(city);
    const group = groups.get(key) ?? { names: [], restaurants: [] };
    group.names.push(city);
    group.restaurants.push(restaurant);
    groups.set(key, group);
  }

  return [...groups.values()]
    .map(({ names, restaurants: list }) => ({
      city: pickCityName(names),
      restaurants: list.sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
    }))
    .sort(
      (a, b) =>
        b.restaurants.length - a.restaurants.length ||
        a.city.localeCompare(b.city, "fr")
    );
}

/**
 * The spelling to show for a city written several ways: the most carefully
 * written one (accents, hyphens, capitals), then the most common.
 */
function pickCityName(names: string[]): string {
  const counts = new Map<string, number>();
  for (const name of names) {
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const quality = (name: string) =>
    (name.match(/[À-ÿ]/g)?.length ?? 0) +
    (name.match(/-/g)?.length ?? 0) +
    (name.match(/\p{Lu}/gu)?.length ?? 0) +
    (name.includes("'") ? 1 : 0);

  return [...counts.entries()].sort(
    ([a, countA], [b, countB]) =>
      quality(b) - quality(a) || countB - countA || a.localeCompare(b, "fr")
  )[0][0];
}
