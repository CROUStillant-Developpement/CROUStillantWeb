import ErrorPage from "@/components/error";
import StatsPage from "@/components/stats/stats-page";
import {
  getTaches,
  getGlobalStats,
  getRegionStats,
  getDataFreshness,
  getApiUsage,
  getApiUsageHistory,
  getBotStats,
  getBotStatsHistory,
  getGeoStats,
} from "@/services/stats-services";
import { getStats } from "@/services/umami-service";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("StatsPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/stats",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function Stats() {
  const [
    taches,
    stats,
    regionStats,
    umamiStats,
    freshness,
    apiUsage,
    apiHistory,
    bot,
    botHistory,
    geo,
  ] = await Promise.all([
    getTaches(),
    getGlobalStats(),
    getRegionStats(),
    getStats(),
    getDataFreshness(),
    getApiUsage(),
    getApiUsageHistory(),
    getBotStats(),
    getBotStatsHistory(),
    getGeoStats(),
  ]);

  if (!taches.success || !stats.success) {
    return <ErrorPage statusCode={500} />;
  }

  if (umamiStats.success) {
    stats.data.visites = umamiStats.data.visitors;
    stats.data.pagesVues = Math.max(0, Math.floor(Number(umamiStats.data.pageviews) || 0));
  }

  return (
    <StatsPage
      taches={taches.data}
      stats={stats.data}
      regionStats={regionStats.success ? regionStats.data : []}
      // The service sections are extras: each one is left out on its own
      // when its route fails, instead of failing the whole page.
      freshness={freshness.success ? freshness.data : null}
      apiUsage={apiUsage.success ? apiUsage.data : null}
      apiHistory={apiHistory.success ? apiHistory.data : []}
      bot={bot.success ? bot.data : null}
      botHistory={botHistory.success ? botHistory.data : []}
      geo={geo.success ? geo.data : null}
    />
  );
}
