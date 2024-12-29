import { Metadata } from "next";
import RestaurantPage from "@/components/restaurants/slug/restaurant-page";
import { notFound } from "next/navigation";
import { Restaurant as Resto } from "@/services/types";

// Server-side fetch for this route
async function fetchRestaurantDetailsServer(slug: string) {
  try {
    const restaurantId = slug.toString().split("-").pop()?.replace("r", "");

    // Redirect to 404 if restaurantId is not a number or is not provided
    if (!restaurantId || isNaN(parseInt(restaurantId))) {
      return notFound();
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurantId}`,
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

  if (!restaurant) {
    return {
      title: "Restaurant Not Found - CROUStillant",
      description: "The restaurant details could not be found.",
      openGraph: {
        title: "Restaurant Not Found - CROUStillant",
        description: "The restaurant details could not be found.",
        images: [{ url: "/default-ru.png" }],
      },
    };
  }

  return {
    title: `Menu of ${restaurant.nom} - CROUStillant`,
    description: `Discover the details of ${restaurant.nom}, located in ${restaurant.region.libelle}. Perfect for your next meal!`,
    openGraph: {
      title: `Menu of ${restaurant.nom} - CROUStillant`,
      description: `Discover the details of ${restaurant.nom}, located in ${restaurant.region.libelle}. Perfect for your next meal!`,
      images: [{ url: restaurant.image_url ?? "/default-ru.png" }],
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
