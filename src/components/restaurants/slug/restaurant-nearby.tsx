import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Restaurant } from "@/services/types";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";
import { buildRegionSlug } from "@/lib/region-slug";
import { getCityKey, getRestaurantCity } from "@/lib/restaurant-seo";
import { ListCollapseIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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

  return (
    <nav className="mt-12 flex flex-col gap-4 border-t border-border/40 pt-8">
      {nearby.length > 0 && (
        <>
          <h2 className="text-xl font-bold tracking-tight">
            {sameCity.length > 0
              ? t("nearby", { city })
              : t("regionLink", { region: restaurant.region.libelle })}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {nearby.map((other) => (
              <li key={other.code}>
                <Link
                  href={`/restaurants/${buildRestaurantSlug(other)}`}
                  className="flex h-full flex-col rounded-xl border border-border/60 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-medium">{other.nom}</span>
                  {other.adresse && (
                    <span className="text-sm text-muted-foreground">{other.adresse}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <Link
        href={`/crous/${buildRegionSlug(restaurant.region)}`}
        className="self-start font-semibold hover:underline text-foreground/80"
      >
        <ListCollapseIcon className="mr-2 inline h-4 w-4" />
        {t("regionLink", { region: restaurant.region.libelle })} →
      </Link>
    </nav>
  );
}
