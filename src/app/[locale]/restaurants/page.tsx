import RestaurantsPage from "@/components/restaurants/restaurants-page";
import { getRestaurants } from "@/services/restaurant-service";
import { getRegions } from "@/services/region-service";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import ErrorPage from "@/components/error";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RestaurantsPage");
  const locale = await getLocale();

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    alternates: {
      canonical: `/${locale}/restaurants`,
      languages: {
        fr: "/fr/restaurants",
        en: "/en/restaurants",
      },
    },
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
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
