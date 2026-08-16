import { Metadata } from "next";
import RestaurantPage from "@/components/restaurants/slug/restaurant-page";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getRestaurant } from "@/services/restaurant-service";


function extractRestaurantId(slug: unknown): number | null {
  if (typeof slug !== "string") return null;

  const match = slug.match(/-r(\d+)$/) || slug.match(/^(\d+)$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  return isNaN(id) ? null : id;
}


// Server-side fetch for this route — routed through the shared API
// helper so it picks up the API key and the 5-minute response cache.
async function fetchRestaurantDetailsServer(slug: string) {
  try {
    const restaurantId = extractRestaurantId(slug);

    if (restaurantId === null) {
      return notFound();
    }

    const result = await getRestaurant(String(restaurantId));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await fetchRestaurantDetailsServer(slug);

  const t = await getTranslations("RestaurantPage");
  const locale = await getLocale();

  if (!restaurant) {
    return {
      title: t("seo.notFound.title"),
      description: t("seo.notFound.description"),
      openGraph: {
        title: t("seo.notFound.title"),
        description: t("seo.notFound.description"),
        images: [{ url: process.env.WEB_URL + "/default-ru.png" }],
      },
    };
  }

  const imageUrl = restaurant.image_url ?? process.env.WEB_URL + "/default-ru.png";

  return {
    title: t("seo.title", { name: restaurant.nom }),
    description: t("seo.description", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
    }),
    keywords: t("seo.keywords", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
    }),
    alternates: {
      canonical: `/${locale}/restaurants/${slug}`,
      languages: {
        fr: `/fr/restaurants/${slug}`,
        en: `/en/restaurants/${slug}`,
      },
    },
    openGraph: {
      title: t("seo.title", { name: restaurant.nom }),
      description: t("seo.description", {
        name: restaurant.nom,
        area: restaurant.region.libelle,
      }),
      images: [{ url: imageUrl }],
      siteName: "CROUStillant",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title", { name: restaurant.nom }),
      description: t("seo.description", {
        name: restaurant.nom,
        area: restaurant.region.libelle,
      }),
      images: [{ url: imageUrl }],
    },
  };
}

export default async function Restaurant({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await fetchRestaurantDetailsServer(slug);

  if (!restaurant) {
    return notFound();
  }

  return <RestaurantPage restaurant={restaurant} />;
}
