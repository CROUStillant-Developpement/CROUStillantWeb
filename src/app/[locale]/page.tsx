import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import HomePage from "@/components/home/home-page";
import HomeHero from "@/components/home/home-hero";
import { getRegionsGeoJSON } from "@/services/region-service";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function Home() {
  // Overlay on the homepage map only — degrade gracefully instead of failing the whole page.
  const regionsGeoJson = await getRegionsGeoJSON();

  return (
    <section className="w-full relative pb-20 px-4 mt-4">
      <HomeHero />
      <HomePage
        regionsGeoJson={regionsGeoJson.success ? regionsGeoJson.data : null}
      />
    </section>
  );
}
