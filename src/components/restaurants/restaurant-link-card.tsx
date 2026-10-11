import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Restaurant } from "@/services/types";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";

/**
 * A restaurant as a compact, server-rendered link: photo, name, open or
 * closed, address and opening hours.
 *
 * Used where restaurants are listed for navigation (region pages, "other
 * restaurants" on a restaurant page) rather than browsed and filtered. It
 * stays a plain link with its text in the HTML, which is what those lists are
 * there for; the richer interactive card is `RestaurantCard`.
 */
export default async function RestaurantLinkCard({
  restaurant,
  id,
}: {
  restaurant: Restaurant;
  /** DOM id, for a map that highlights the card of the place pointed at. */
  id?: string;
}) {
  const t = await getTranslations("RegionPage");

  return (
    <Link
      id={id}
      href={`/restaurants/${buildRestaurantSlug(restaurant)}`}
      className="group flex h-full gap-4 rounded-2xl border border-primary/5 bg-card/50 p-3 shadow-xs transition-all duration-300 hover:border-primary/20 hover:bg-card data-[highlighted=true]:border-primary data-[highlighted=true]:bg-primary/5"
    >
      <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={restaurant.image_url ?? "/default_ru.png"}
          // Decorative: the name is right next to it.
          alt=""
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
        <span className="flex items-start justify-between gap-3">
          <span className="font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {restaurant.nom}
          </span>
          <span
            className={
              restaurant.ouvert
                ? "shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
                : "shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            }
          >
            {restaurant.ouvert ? t("openNow") : t("closedNow")}
          </span>
        </span>
        {/* No icons on these lines: an inline SVG per line, on a hundred
            cards, weighs more than the text it decorates. */}
        {restaurant.adresse && (
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {restaurant.adresse}
          </span>
        )}
        {restaurant.horaires?.[0] && (
          <span className="line-clamp-1 text-sm text-muted-foreground">
            {restaurant.horaires[0]}
          </span>
        )}
      </span>
    </Link>
  );
}
