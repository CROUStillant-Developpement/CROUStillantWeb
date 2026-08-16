import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTodayMenuForScreen } from "@/actions/screen-actions";
import ScreenPage from "@/components/restaurants/slug/screen/screen-page";
import { getTranslations } from "next-intl/server";
import { getRestaurant } from "@/services/restaurant-service";


function extractRestaurantId(slug: unknown): number | null {
  if (typeof slug !== "string") return null;

  const match = slug.match(/-r(\d+)$/) || slug.match(/^(\d+)$/);
  if (!match) return null;

  const id = parseInt(match[1], 10);
  return isNaN(id) ? null : id;
}

// Routed through the shared API helper so it picks up the API key
// and the 5-minute response cache.
async function fetchRestaurantDetailsServer(slug: string) {
  try {
    const restaurantId = extractRestaurantId(slug);
    if (restaurantId === null) return null;

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
  const t = await getTranslations("ScreenPage");

  return {
    title: restaurant
      ? t("seo.title", { name: restaurant.nom })
      : t("seo.notFound"),
    robots: { index: false, follow: false },
  };
}

export default async function Screen({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurantId = extractRestaurantId(slug);

  if (restaurantId === null) return notFound();

  const [restaurant, menu] = await Promise.all([
    fetchRestaurantDetailsServer(slug),
    fetchTodayMenuForScreen(restaurantId),
  ]);

  if (!restaurant) return notFound();

  return <ScreenPage restaurant={restaurant} initialMenu={menu} />;
}
