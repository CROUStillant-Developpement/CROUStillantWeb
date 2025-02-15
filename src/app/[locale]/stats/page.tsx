import ErrorPage from "@/components/error";
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
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function Stats() {
  const taches = await getTaches();
  const stats = await getGlobalStats();

  if (!taches.success || !stats.success) {
    return <ErrorPage statusCode={500} />;
  }

  return <StatsPage taches={taches.data} stats={stats.data} />;
}
