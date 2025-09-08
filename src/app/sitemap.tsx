import type { MetadataRoute } from "next";
import { getRestaurants } from "@/services/restaurant-service";
import { slugify } from "@/lib/utils";

const links = [
  {
    url: `${process.env.WEB_URL}`,
    changeFrequency: "yearly" as const,
    priority: 1,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr`,
        en: `${process.env.WEB_URL}/en`,
      },
    },
  },
  {
    url: `${process.env.API_URL}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    url: `${process.env.WEB_URL}/fr/restaurants`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr/restaurants`,
        en: `${process.env.WEB_URL}/en/restaurants`,
      },
    },
  },
  {
    url: `${process.env.WEB_URL}/fr/dishes`,
    changeFrequency: "daily" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr/dishes`,
        en: `${process.env.WEB_URL}/en/dishes`,
      },
    },
  },
  {
    url: `${process.env.WEB_URL}/fr/stats`,
    changeFrequency: "daily" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr/stats`,
        en: `${process.env.WEB_URL}/en/stats`,
      },
    },
  },
  {
    url: `${process.env.WEB_URL}/fr/about`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr/about`,
        en: `${process.env.WEB_URL}/en/about`,
      },
    },
  },
  {
    url: `${process.env.WEB_URL}/fr/legal`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr/legal`,
        en: `${process.env.WEB_URL}/en/legal`,
      },
    },
  },
  {
    url: `${process.env.WEB_URL}/fr/changelog`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
    alternates: {
      languages: {
        fr: `${process.env.WEB_URL}/fr/changelog`,
        en: `${process.env.WEB_URL}/en/changelog`,
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
      url: `${process.env.WEB_URL}/fr/restaurants/${slugify(restaurant.nom)}-r${restaurant.code}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${process.env.WEB_URL}/fr/restaurants/${slugify(restaurant.nom)}-r${restaurant.code}`,
          en: `${process.env.WEB_URL}/en/restaurants/${slugify(restaurant.nom)}-r${restaurant.code}`
        },
      },
    });
  });

  return links;
}
