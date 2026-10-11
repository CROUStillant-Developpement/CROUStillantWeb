import RestaurantsPage from "@/components/restaurants/restaurants-page";
import { getRestaurants } from "@/services/restaurant-service";
import { getRegions } from "@/services/region-service";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import ErrorPage from "@/components/error";
import { buildPageMetadata } from "@/lib/metadata";
import RegionsPagesMap from "@/components/crous/regions-pages-map";

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
  const [restaurants, regions] = await Promise.all([
    getRestaurants(),
    getRegions(),
  ]);

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

  const t = await getTranslations("RestaurantsPage");

  // Everything passed to the client component below is serialised into the
  // HTML. The list, its filters and the map never read these fields, and they
  // made up most of the megabyte the 900 restaurants weighed.
  const listRestaurants = restaurants.data.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ jours_ouvert, acces, email, telephone, ...restaurant }) => restaurant
  );

  return (
    <>
      <RestaurantsPage
        restaurants={listRestaurants}
        regions={regions.data}
        typesRestaurants={typesRestaurants}
      />
      {/* A way to each region's page. The map is drawn in the browser, so it
          gives crawlers no links: they reach the region pages through the
          sitemap and through every restaurant page. */}
      <div className="w-full px-4 mt-12">
        <RegionsPagesMap title={t("seo.byRegion")} />
      </div>
    </>
  );
}
