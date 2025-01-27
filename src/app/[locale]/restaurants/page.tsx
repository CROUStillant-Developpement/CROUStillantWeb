import RestaurantsPage from "@/components/restaurants/restaurants-page";
import { getRestaurants } from "@/services/restaurant-service";
import { getRegions } from "@/services/region-service";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ErrorPage from "@/components/error";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RestaurantsPage");

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function Restaurants() {
  const restaurants = await getRestaurants();
  const regions = await getRegions();

  if (!restaurants.success || !regions.success) {
    return <ErrorPage statusCode={500} />;
  }

  // Collect unique restaurant types based on `code`
  const typesRestaurants = Array.from(
    new Map(
      restaurants.data.map((restaurant) => [
        restaurant.type!.code,
        restaurant.type!,
      ])
    ).values()
  );

  return (
    <RestaurantsPage
      restaurants={restaurants.data}
      regions={regions.data}
      typesRestaurants={typesRestaurants}
    />
  );
}
