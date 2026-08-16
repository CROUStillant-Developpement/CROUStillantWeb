// Matches the restaurant list's own cache window (see restaurant-service.ts)
// so a crawl burst doesn't force a full sitemap rebuild on every request.
// force-static is required alongside revalidate: apiRequest() always fetches
// with cache: "no-store" (see api-request.ts), which would otherwise make
// Next.js treat this whole route as fully dynamic.
export const dynamic = "force-static";
export const revalidate = 300;

import type { MetadataRoute } from "next";
import { getRestaurants } from "@/services/restaurant-service";
import { slugify } from "@/lib/utils";

const BASE = process.env.WEB_URL || "https://croustillant.menu";
const LOCALES = ["fr", "en"] as const;

type ChangeFreq = MetadataRoute.Sitemap[0]["changeFrequency"];

function localeEntry(
  path: string,
  changeFrequency: ChangeFreq,
  priority: number,
  lastModified?: Date
): MetadataRoute.Sitemap[0][] {
  return LOCALES.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE}/${l}${path}`])
      ),
    },
  }));
}

const STATIC_ENTRIES: MetadataRoute.Sitemap = [
  // Homepage — one entry per locale
  ...localeEntry("", "monthly", 1.0),

  // High-traffic listing pages
  ...localeEntry("/restaurants", "daily", 0.9),
  ...localeEntry("/dishes", "daily", 0.8),
  ...localeEntry("/stats", "daily", 0.7),

  // Feature pages
  ...localeEntry("/iframe-builder", "monthly", 0.7),
  ...localeEntry("/mobile", "monthly", 0.7),
  ...localeEntry("/mobile/android", "monthly", 0.6),
  ...localeEntry("/mobile/ios", "monthly", 0.6),

  // Informational pages
  ...localeEntry("/about", "monthly", 0.7),
  ...localeEntry("/contact", "monthly", 0.6),
  ...localeEntry("/changelog", "monthly", 0.5),
  ...localeEntry("/legal", "yearly", 0.4),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const restaurants = await getRestaurants();

  if (!restaurants.success) {
    return STATIC_ENTRIES;
  }

  const restaurantEntries: MetadataRoute.Sitemap = restaurants.data.flatMap(
    (restaurant) => {
      const slug = `${slugify(restaurant.nom)}-r${restaurant.code}`;
      return localeEntry(`/restaurants/${slug}`, "daily", 0.9, now);
    }
  );

  return [...STATIC_ENTRIES, ...restaurantEntries];
}
