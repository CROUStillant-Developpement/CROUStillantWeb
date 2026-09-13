import { getRestaurants } from "@/services/restaurant-service";
import BuilderPage from "@/components/iframe-builder/builder-page";
import ErrorPage from "@/components/error";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("IframeBuilderPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/iframe-builder",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function IframeBuilder() {
  const restaurants = await getRestaurants();

  if (!restaurants.success) {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <BuilderPage
      restaurants={restaurants.data}
      apiUrl={process.env.API_URL ?? "https://api.croustillant.menu/v1"}
    />
  );
}
