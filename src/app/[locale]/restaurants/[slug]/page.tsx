import { Metadata } from "next";
import RestaurantPage from "@/components/restaurants/slug/restaurant-page";
import { notFound } from "next/navigation";
import { Restaurant as Resto } from "@/services/types";
import { getTranslations } from "next-intl/server";

// Server-side fetch for this route
async function fetchRestaurantDetailsServer(slug: string) {
  try {
    const restaurantId = slug.toString().split("-").pop()?.replace("r", "");

    // Redirect to 404 if restaurantId is not a number or is not provided
    if (!restaurantId || isNaN(parseInt(restaurantId))) {
      return notFound();
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}/restaurants/${restaurantId}`,
      { method: "GET" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch restaurant details.");
    }
    return (await response.json()).data as Resto;
  } catch (error) {
    console.error("Error fetching restaurant details on server:", error);
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
    openGraph: {
      title: t("seo.title", { name: restaurant.nom }),
      description: t("seo.description", {
        name: restaurant.nom,
        area: restaurant.region.libelle,
      }),
      images: [{ url: restaurant.image_url ?? process.env.WEB_URL + "/default-ru.png" }],
      siteName: "CROUStillant",
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
