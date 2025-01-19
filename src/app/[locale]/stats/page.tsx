"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tache, GlobalStats } from "@/services/types";
import { getTaches, getGlobalStats } from "@/services/stats-services";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { formatToISODate } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Stat, StatDescription, StatTitle } from "@/components/ui/stat";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StatsPage() {
  const [taches, setTaches] = useState<Tache[]>([]);
  const [stats, setStats] = useState<GlobalStats>();

  const t = useTranslations("StatsPage");

  useEffect(() => {
    getTaches().then((result) => {
      if (result.success) {
        setTaches(result.data);
      }
    });

    getGlobalStats().then((result) => {
      if (result.success) {
        setStats(result.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6 mt-6 lg:mt-12">
      <Alert>
        <AlertTitle>{t("title")}</AlertTitle>
        <AlertDescription>{t("description")}</AlertDescription>
      </Alert>
      <div className="flex gap-6 w-full justify-center flex-wrap flex-row items-center">
        <Stat variant="default">
          <StatTitle>{(t("stats.menus"))}</StatTitle>
          <StatDescription>
            {(stats?.menus ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{(t("stats.compositions"))}</StatTitle>
          <StatDescription>
            {(stats?.compositions ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{(t("stats.categories"))}</StatTitle>
          <StatDescription>
            {(stats?.categories ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{(t("stats.repas"))}</StatTitle>
          <StatDescription>
            {(stats?.repas ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{(t("stats.plats"))}</StatTitle>
          <StatDescription>
            {(stats?.plats ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{(t("stats.restaurants"))}</StatTitle>
          <StatDescription>
            {(stats?.restaurants ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{(t("stats.regions"))}</StatTitle>
          <StatDescription>
            {(stats?.regions ?? 0).toLocaleString('fr')}
          </StatDescription>
        </Stat>
      </div>
      <TacheCharts data={taches} />
    </div>
  );
}

const chartConfig = {
  menuAdded: {
    label: "Menus Added",
  },
  compositionAdded: {
    label: "Compositions Added",
  },
  categoryAdded: {
    label: "Categories Added",
  },
  repasAdded: {
    label: "Repas Added",
  },
  platAdded: {
    label: "Plats Added",
  },
  requests: {
    label: "Requests",
  },
} satisfies ChartConfig;

const TacheCharts = ({ data }: { data: Tache[] }) => {
  const processedData = useMemo(() => {
    return data
      .filter(
        (tache) =>
          tache.fin_plats !== null ||
          tache.fin_categories !== null ||
          tache.fin_repas !== null ||
          tache.fin_menus !== null ||
          tache.fin_compositions !== null
      )
      .map((tache) => ({
        id: tache.id,
        date: formatToISODate(tache.debut.split(" ")[0]),
        deltaMenus: tache.fin_menus - tache.debut_menus,
        deltaRepas: tache.fin_repas - tache.debut_repas,
        deltaCategories: tache.fin_categories - tache.debut_categories,
        deltaPlats: tache.fin_plats - tache.debut_plats,
        deltaCompositions: tache.fin_compositions - tache.debut_compositions,
        requetes: tache.requetes,
      }))
      .reverse();
  }, [data]);

  const locale = useLocale();

  const t = useTranslations("StatsPage");

  return (
    <div className="space-y-6">
      {/* Chart for the menus added over time */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{(t("charts.menuAdded.title"))}</CardTitle>
            <CardDescription>{(t("charts.menuAdded.description"))}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                accessibilityLayer
                data={processedData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deltaMenus" fill="#8884d8" name={t("charts.labels.menus")} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart for the categories and compositions added over time */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{(t("charts.overTime.title"))}</CardTitle>
          <CardDescription>{(t("charts.overTime.description"))}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                accessibilityLayer
                data={processedData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deltaCompositions"
                  stroke="#82ca9d"
                  name={t("charts.labels.compositions")}
                />
                <Line
                  type="monotone"
                  dataKey="deltaCategories"
                  stroke="#ffc658"
                  name={t("charts.labels.categories")}
                />
                <Line
                  type="monotone"
                  dataKey="deltaRepas"
                  stroke="#ff0000"
                  name={t("charts.labels.repas")}
                />
                <Line
                  type="monotone"
                  dataKey="deltaPlats"
                  stroke="#8884d8"
                  name={t("charts.labels.plats")}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart for the requests over time */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{(t("charts.requests.title"))}</CardTitle>
          <CardDescription>{(t("charts.requests.description"))}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                accessibilityLayer
                data={processedData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requetes"
                  stroke="#ee82ee"
                  name={t("charts.labels.requetes")}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
