import StatsPage from "@/components/stats/stats-page";
import { getTaches, getGlobalStats } from "@/services/stats-services";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("StatsPage");

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function Restaurants() {
  const taches = await getTaches();
  const stats = await getGlobalStats();

  if (!taches.success || !stats.success) {
    return null;
  }

  return <StatsPage taches={taches.data} stats={stats.data} />;
}
