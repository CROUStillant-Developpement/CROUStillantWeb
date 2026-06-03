import ErrorPage from "@/components/error";
import StatsPage from "@/components/stats/stats-page";
import { getTaches, getGlobalStats } from "@/services/stats-services";
import { getStats } from "@/services/umami-service";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("StatsPage");
  const locale = await getLocale();

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    alternates: {
      canonical: `/${locale}/stats`,
      languages: {
        fr: "/fr/stats",
        en: "/en/stats",
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

export default async function Stats() {
  const taches = await getTaches();
  const stats = await getGlobalStats();
  const umamiStats = await getStats();

  if (!taches.success || !stats.success) {
    return <ErrorPage statusCode={500} />;
  }

  if (umamiStats.success) {
    stats.data.visites = umamiStats.data.visitors;
    stats.data.pagesVues = Math.max(0, Math.floor(Number(umamiStats.data.pageviews) || 0));
  }

  return <StatsPage taches={taches.data} stats={stats.data} />;
}
