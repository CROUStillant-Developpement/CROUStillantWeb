import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Restaurant } from "@/services/types";
import { buildRegionSlug } from "@/lib/region-slug";
import { getCityKey, getRestaurantCity } from "@/lib/restaurant-seo";
import RestaurantLinkCard from "@/components/restaurants/restaurant-link-card";

const MAX_NEARBY = 6;

/**
 * Links to the other restaurants of the same city and to the CROUS region page.
 *
 * Restaurant pages used to link nowhere but the site navigation, so a crawler
 * could only reach them through the sitemap. These links are what tie them
 * into the region pages, and pass their weight on to each other.
 */
export default async function RestaurantNearby({
  restaurant,
  regionRestaurants,
}: {
  restaurant: Restaurant;
  /** Every restaurant of the same region, this one included. */
  regionRestaurants: Restaurant[];
}) {
  const t = await getTranslations("RestaurantPage.seo");
  const city = getCityKey(getRestaurantCity(restaurant));

  const others = regionRestaurants.filter((r) => r.code !== restaurant.code);
  const sameCity = others.filter((r) => getCityKey(getRestaurantCity(r)) === city);
  // A city with a single restaurant still gets neighbours from its region.
  const nearby = (sameCity.length > 0 ? sameCity : others)
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))
    .slice(0, MAX_NEARBY);

  const regionLink = (
    <Link
      href={`/crous/${buildRegionSlug(restaurant.region)}`}
      className="group/region inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/20"
    >
      {t("regionLink", { region: restaurant.region.libelle })}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/region:translate-x-1" />
    </Link>
  );

  return (
    <nav className="mt-12 flex flex-col gap-4 border-t border-border/40 pt-8">
      {/* With no neighbour to list, the region link stands alone. */}
      {nearby.length === 0 ? (
        <div>{regionLink}</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <h2 className="text-xl font-bold tracking-tight">
              {sameCity.length > 0
                ? t("nearby", { city })
                : t("regionLink", { region: restaurant.region.libelle })}
            </h2>
            {regionLink}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {nearby.map((other) => (
              <li key={other.code}>
                <RestaurantLinkCard restaurant={other} />
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}
