import { Metadata } from "next";
import RestaurantPage from "@/components/restaurants/slug/restaurant-page";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getRestaurant } from "@/services/restaurant-service";
import {
  getDatesMenuAvailable,
  getMenuByRestaurantId,
} from "@/services/menu-service";
import { buildRestaurantJsonLd } from "@/lib/restaurant-jsonld";
import { buildRestaurantBreadcrumb } from "@/lib/site-jsonld";
import JsonLd from "@/components/json-ld";
import { DEFAULT_OG_IMAGE, SITE_URL, buildPageMetadata } from "@/lib/metadata";
import {
  buildRestaurantSlug,
  extractRestaurantId,
} from "@/lib/restaurant-slug";
import { DateMenu, Menu } from "@/services/types";


// Server-side fetch for this route — routed through the shared API
// helper so it picks up the API key and the 5-minute response cache.
async function fetchRestaurantDetailsServer(slug: string) {
  try {
    const restaurantId = extractRestaurantId(slug);

    if (restaurantId === null) {
      return notFound();
    }

    const result = await getRestaurant(String(restaurantId));
    return result.success ? result.data : null;
  } catch {
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
  const locale = await getLocale();

  if (!restaurant) {
    // The page renders notFound() below, so keep it out of the index. No
    // canonical or hreflang either: there is no page here to point at.
    return {
      title: t("seo.notFound.title"),
      description: t("seo.notFound.description"),
      robots: { index: false, follow: false },
    };
  }

  const tMeta = await getTranslations("Metadata");

  // The API generates restaurant previews at 1920x1080; the fallback banner is
  // the only image whose real size differs.
  const image = restaurant.image_url
    ? {
        url: restaurant.image_url,
        width: 1920,
        height: 1080,
        alt: tMeta("restaurantImageAlt", { name: restaurant.nom }),
      }
    : { ...DEFAULT_OG_IMAGE, alt: tMeta("bannerAlt") };

  return buildPageMetadata({
    locale,
    // The canonical slug, never the requested one: an alias URL must advertise
    // the URL it redirects to, not itself. See `buildRestaurantSlug`.
    path: `/restaurants/${buildRestaurantSlug(restaurant)}`,
    title: t("seo.title", { name: restaurant.nom }),
    description: t("seo.description", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
    }),
    keywords: t("seo.keywords", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
    }),
    images: [image],
  });
}

/**
 * Fetches the menus and the available dates server-side.
 *
 * Without this the menu is only requested after hydration, so the HTML served to
 * crawlers (Googlebot, GPTBot, ClaudeBot, PerplexityBot — none of them run JS)
 * contains no dish at all. It is also what feeds the JSON-LD.
 */
async function fetchMenuServer(
  restaurantCode: number
): Promise<{ menu: Menu[]; dates: DateMenu[] }> {
  const [menuResult, datesResult] = await Promise.all([
    getMenuByRestaurantId(restaurantCode),
    getDatesMenuAvailable(restaurantCode),
  ]);

  return {
    menu: menuResult.success ? menuResult.data : [],
    dates: datesResult.success ? datesResult.data : [],
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

  const locale = await getLocale();

  // Aliases (a bare id, or a name the CROUS has since changed) resolve to the
  // same restaurant and used to render a 200 that canonicalised to itself,
  // which is how the same restaurant ended up indexed under several URLs.
  // Redirecting permanently leaves exactly one indexable URL per locale.
  const canonicalSlug = buildRestaurantSlug(restaurant);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/${locale}/restaurants/${canonicalSlug}`);
  }

  const { menu, dates } = await fetchMenuServer(restaurant.code);

  const jsonLd = buildRestaurantJsonLd(
    restaurant,
    menu,
    `${SITE_URL}/${locale}/restaurants/${canonicalSlug}`
  );

  const tRestaurants = await getTranslations("RestaurantsPage");
  const breadcrumbJsonLd = buildRestaurantBreadcrumb(
    locale,
    tRestaurants("seo.title"),
    restaurant.nom,
    canonicalSlug
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <RestaurantPage
        restaurant={restaurant}
        initialMenu={menu}
        initialDates={dates}
      />
    </>
  );
}
