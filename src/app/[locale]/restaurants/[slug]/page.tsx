import { Metadata } from "next";
import RestaurantPage from "@/components/restaurants/slug/restaurant-page";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getRestaurant } from "@/services/restaurant-service";
import {
  getDatesMenuAvailable,
  getMenuByRestaurantId,
} from "@/services/menu-service";
import { buildRestaurantJsonLd } from "@/lib/restaurant-jsonld";
import { DateMenu, Menu } from "@/services/types";


function extractRestaurantId(slug: unknown): number | null {
  if (typeof slug !== "string") return null;

  const match = slug.match(/-r(\d+)$/) || slug.match(/^(\d+)$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  return isNaN(id) ? null : id;
}


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
    return {
      title: t("seo.notFound.title"),
      description: t("seo.notFound.description"),
      openGraph: {
        title: t("seo.notFound.title"),
        description: t("seo.notFound.description"),
        images: [{ url: process.env.WEB_URL + "/default-ru.png" }],
      },
    };
  }

  const imageUrl = restaurant.image_url ?? process.env.WEB_URL + "/default-ru.png";

  return {
    title: t("seo.title", { name: restaurant.nom }),
    description: t("seo.description", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
    }),
    keywords: t("seo.keywords", {
      name: restaurant.nom,
      area: restaurant.region.libelle,
    }),
    alternates: {
      canonical: `/${locale}/restaurants/${slug}`,
      languages: {
        fr: `/fr/restaurants/${slug}`,
        en: `/en/restaurants/${slug}`,
      },
    },
    openGraph: {
      title: t("seo.title", { name: restaurant.nom }),
      description: t("seo.description", {
        name: restaurant.nom,
        area: restaurant.region.libelle,
      }),
      images: [{ url: imageUrl }],
      siteName: "CROUStillant",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title", { name: restaurant.nom }),
      description: t("seo.description", {
        name: restaurant.nom,
        area: restaurant.region.libelle,
      }),
      images: [{ url: imageUrl }],
    },
  };
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
  const { menu, dates } = await fetchMenuServer(restaurant.code);

  const baseUrl = process.env.WEB_URL || "https://croustillant.menu";
  const jsonLd = buildRestaurantJsonLd(
    restaurant,
    menu,
    `${baseUrl}/${locale}/restaurants/${slug}`
  );

  return (
    <>
      <script
        type="application/ld+json"
        // The JSON-LD comes from our own API and is serialised by JSON.stringify;
        // `<` is escaped so a dish label containing "</script>" cannot close the
        // tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RestaurantPage
        restaurant={restaurant}
        initialMenu={menu}
        initialDates={dates}
      />
    </>
  );
}
