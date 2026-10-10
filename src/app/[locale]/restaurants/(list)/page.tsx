import RestaurantsPage from "@/components/restaurants/restaurants-page";
import { getRestaurants } from "@/services/restaurant-service";
import { getRegions } from "@/services/region-service";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import ErrorPage from "@/components/error";
import { buildPageMetadata } from "@/lib/metadata";
import { Link } from "@/i18n/routing";
import { buildRegionSlug } from "@/lib/region-slug";

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
  const tRegion = await getTranslations("RegionPage");

  // Plain links to every region page: the list above is filtered client-side,
  // so without these a crawler has no path from here to the region pages.
  const regionsWithRestaurants = new Set(
    restaurants.data.map((restaurant) => restaurant.region.code)
  );
  const regionLinks = regions.data
    .filter((region) => regionsWithRestaurants.has(region.code))
    .sort((a, b) => a.libelle.localeCompare(b.libelle, "fr"));

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
      <nav className="w-full px-4 mt-12 flex flex-col gap-4 border-t border-border/40 pt-8">
        <h2 className="text-xl font-bold tracking-tight">{t("seo.byRegion")}</h2>
        <ul className="flex flex-wrap gap-2">
          {regionLinks.map((region) => (
            <li key={region.code}>
              <Link
                href={`/crous/${buildRegionSlug(region)}`}
                className="inline-flex rounded-full border border-border/60 px-3 py-1 text-sm hover:border-primary/40 hover:text-primary"
              >
                {tRegion("breadcrumb", { region: region.libelle })}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
