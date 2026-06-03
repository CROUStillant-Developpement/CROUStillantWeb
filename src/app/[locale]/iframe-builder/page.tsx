import { getRestaurants } from "@/services/restaurant-service";
import BuilderPage from "@/components/iframe-builder/builder-page";
import ErrorPage from "@/components/error";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("IframeBuilderPage");
  const locale = await getLocale();

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    alternates: {
      canonical: `/${locale}/iframe-builder`,
      languages: {
        fr: "/fr/iframe-builder",
        en: "/en/iframe-builder",
      },
    },
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
    },
  };
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
