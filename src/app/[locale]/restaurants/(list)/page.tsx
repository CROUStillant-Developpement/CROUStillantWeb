import RestaurantsPage from "@/components/restaurants/restaurants-page";
import { getRestaurants } from "@/services/restaurant-service";
import { getRegions, getRegionsGeoJSON } from "@/services/region-service";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import ErrorPage from "@/components/error";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RestaurantsPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/restaurants",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function Restaurants() {
  const restaurants = await getRestaurants();
  const regions = await getRegions();
  // Overlay/filter on the map only — degrade gracefully instead of failing the whole page.
  const regionsGeoJson = await getRegionsGeoJSON();

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
      regionsGeoJson={regionsGeoJson.success ? regionsGeoJson.data : null}
    />
  );
}
