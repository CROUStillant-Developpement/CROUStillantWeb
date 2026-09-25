// Matches the restaurant list's own cache window (see restaurant-service.ts)
// so a crawl burst doesn't force a full sitemap rebuild on every request.
// force-static is required alongside revalidate: apiRequest() always fetches
// with cache: "no-store" (see api-request.ts), which would otherwise make
// Next.js treat this whole route as fully dynamic.
export const dynamic = "force-static";
export const revalidate = 300;

import type { MetadataRoute } from "next";
import { getRestaurants } from "@/services/restaurant-service";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";
import { getRegions } from "@/services/region-service";
import { buildRegionSlug } from "@/lib/region-slug";

const BASE = process.env.WEB_URL || "https://croustillant.menu";
const LOCALES = ["fr", "en"] as const;
const DEFAULT_LOCALE = "fr";

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
  const [restaurants, regions] = await Promise.all([
    getRestaurants(),
    getRegions(),
  ]);

  if (!restaurants.success) {
    return STATIC_ENTRIES;
  }

  // Region pages are the landing pages for "CROUS <ville>" / "resto U <ville>"
  // searches. Same locale policy as the restaurant sheets below.
  const regionsWithRestaurants = new Set(
    restaurants.data.map((restaurant) => restaurant.region.code)
  );
  const regionEntries: MetadataRoute.Sitemap = regions.success
    ? regions.data
        .filter((region) => regionsWithRestaurants.has(region.code))
        .map((region) => {
          const path = `/crous/${buildRegionSlug(region)}`;

          return {
            url: `${BASE}/${DEFAULT_LOCALE}${path}`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.8,
            alternates: {
              languages: Object.fromEntries(
                LOCALES.map((l) => [l, `${BASE}/${l}${path}`])
              ),
            },
          };
        })
    : [];

  // Only the default locale is submitted for restaurant sheets, with the
  // English URL still declared through hreflang.
  const restaurantEntries: MetadataRoute.Sitemap = restaurants.data.map(
    (restaurant) => {
      const path = `/restaurants/${buildRestaurantSlug(restaurant)}`;

      return {
        url: `${BASE}/${DEFAULT_LOCALE}${path}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE}/${l}${path}`])
          ),
        },
      };
    }
  );

  return [...STATIC_ENTRIES, ...regionEntries, ...restaurantEntries];
}
