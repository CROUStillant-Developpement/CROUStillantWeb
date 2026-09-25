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
import { buildBreadcrumb } from "@/lib/site-jsonld";
import { buildRegionSlug } from "@/lib/region-slug";
import { getRestaurants } from "@/services/restaurant-service";
import JsonLd from "@/components/json-ld";
import RestaurantNearby from "@/components/restaurants/slug/restaurant-nearby";
import { DEFAULT_OG_IMAGE, SITE_URL, buildPageMetadata } from "@/lib/metadata";
import {
  buildRestaurantSlug,
  extractRestaurantId,
} from "@/lib/restaurant-slug";
import {
  getRestaurantCity,
  nameContainsCity,
  pickHighlightDishes,
  truncateForSnippet,
} from "@/lib/restaurant-seo";
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

  // Searches are "<restaurant> <city>", so the city goes in the title unless
  // the name already carries it ("Cafet IUT Reims").
  const city = getRestaurantCity(restaurant);
  const title = nameContainsCity(restaurant.nom, city)
    ? t("seo.titleNoCity", { name: restaurant.nom })
    : t("seo.title", { name: restaurant.nom, city });

  // Today's dishes in the snippet answer the query before the click — the one
  // thing the CROUS page and the other aggregators do not put there.
  const menuResult = await getMenuByRestaurantId(restaurant.code);
  const dishes = pickHighlightDishes(menuResult.success ? menuResult.data : []);
  const description = truncateForSnippet(
    dishes.length > 0
      ? t("seo.descriptionWithDishes", {
          name: restaurant.nom,
          city,
          dishes: dishes.join(", "),
        })
      : t("seo.description", { name: restaurant.nom, city })
  );

  return buildPageMetadata({
    locale,
    // The canonical slug, never the requested one: an alias URL must advertise
    // the URL it redirects to, not itself. See `buildRestaurantSlug`.
    path: `/restaurants/${buildRestaurantSlug(restaurant)}`,
    title,
    description,
    keywords: t("seo.keywords", {
      name: restaurant.nom,
      city,
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
  const tRegion = await getTranslations("RegionPage");
  const regionSlug = buildRegionSlug(restaurant.region);
  const breadcrumbJsonLd = buildBreadcrumb(locale, [
    { name: tRestaurants("seo.title"), path: "/restaurants" },
    {
      name: tRegion("breadcrumb", { region: restaurant.region.libelle }),
      path: `/crous/${regionSlug}`,
    },
    { name: restaurant.nom, path: `/restaurants/${canonicalSlug}` },
  ]);

  // The full list is already cached for the sitemap and the list page; reading
  // the region out of it costs nothing extra.
  const allRestaurants = await getRestaurants();
  const regionRestaurants = allRestaurants.success
    ? allRestaurants.data.filter((r) => r.region.code === restaurant.region.code)
    : [];

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <RestaurantPage
        restaurant={restaurant}
        initialMenu={menu}
        initialDates={dates}
        footer={
          <RestaurantNearby
            restaurant={restaurant}
            regionRestaurants={regionRestaurants}
          />
        }
      />
    </>
  );
}
