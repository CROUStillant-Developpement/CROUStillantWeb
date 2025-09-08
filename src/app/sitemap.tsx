import type { MetadataRoute } from "next";
import { getRestaurants } from "@/services/restaurant-service";
import { slugify } from "@/lib/utils";

const SITE_URL = "https://croustillant.menu";
const API_URL = "https://api.croustillant.menu";

let links = [
  {
    url: SITE_URL,
    changeFrequency: "yearly" as const,
    priority: 1,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
      },
    },
  },
  {
    url: API_URL,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/fr/restaurants`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/restaurants`,
        en: `${SITE_URL}/en/restaurants`,
      },
    },
  },
  {
    url: `${SITE_URL}/fr/dishes`,
    changeFrequency: "daily" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/dishes`,
        en: `${SITE_URL}/en/dishes`,
      },
    },
  },
  {
    url: `${SITE_URL}/fr/stats`,
    changeFrequency: "daily" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/stats`,
        en: `${SITE_URL}/en/stats`,
      },
    },
  },
  {
    url: `${SITE_URL}/fr/about`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/about`,
        en: `${SITE_URL}/en/about`,
      },
    },
  },
  {
    url: `${SITE_URL}/fr/legal`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/legal`,
        en: `${SITE_URL}/en/legal`,
      },
    },
  },
  {
    url: `${SITE_URL}/fr/changelog`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr/changelog`,
        en: `${SITE_URL}/en/changelog`,
      },
    },
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurants = await getRestaurants();

  if (!restaurants.success) {
    return links;
  }

  restaurants.data.forEach((restaurant) => {
    links.push({
      url: `${SITE_URL}/fr/restaurant/${slugify(restaurant.nom)}-r${restaurant.code}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${SITE_URL}/fr/restaurant/${slugify(restaurant.nom)}-r${restaurant.code}`,
          en: `${SITE_URL}/en/restaurant/${slugify(restaurant.nom)}-r${restaurant.code}`
        },
      },
    });
  });

  return links;
}
