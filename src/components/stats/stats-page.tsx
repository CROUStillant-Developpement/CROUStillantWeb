"use client";

import React, { useMemo } from "react";
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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatToISODate } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Stat, StatDescription, StatTitle } from "@/components/ui/stat";

interface StatsPageProps {
  taches: Tache[];
  stats: GlobalStats;
}

interface ProcessedTache {
  date: Date;
  deltaMenus: number;
  deltaRepas: number;
  deltaCategories: number;
  deltaPlats: number;
  deltaCompositions: number;
  requetes: number;
}

interface TooltipPayload {
  color: string;
  value: number | string;
  dataKey: string;
}

interface CustomTooltipProps {
  locale: "en" | "fr";
  tooltipMapping: Record<string, string>;
  active: boolean;
  payload?: TooltipPayload[];
  label: string | number;
}

interface DotProps {
  cx: number;
  cy: number;
  stroke: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  locale,
  tooltipMapping,
  active,
  payload,
  label,
}) => {
  const formattedLabel =
    locale === "fr"
      ? new Date(label).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : new Date(label).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

  let localeString = "fr-FR";
  if (locale === "en") {
    localeString = "en-GB";
  }

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{formattedLabel}</p>
        <ul>
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.value.toLocaleString(localeString)} ${
                tooltipMapping[entry.dataKey] || entry.dataKey
              }`}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

const CustomDot = (props: DotProps) => {
  const { cx, cy, stroke } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      fill={stroke}
      className="recharts-dot"
      viewBox="0 0 8 8"
      x={cx - 4}
      y={cy - 4}
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
};

export default function StatsPage({ taches, stats }: StatsPageProps) {
  const t = useTranslations("StatsPage");

  const locale = useLocale();
  let localeString = "fr-FR";
  if (locale === "en") {
    localeString = "en-GB";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl">{t("title")}</h1>
        <p className="opacity-50">{t("description")}</p>
      </div>
      <div className="flex gap-6 w-full justify-center flex-wrap flex-row items-center">
        <Stat variant="default">
          <StatTitle>{t("stats.menus")}</StatTitle>
          <StatDescription>
            {(stats?.menus ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{t("stats.compositions")}</StatTitle>
          <StatDescription>
            {(stats?.compositions ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{t("stats.categories")}</StatTitle>
          <StatDescription>
            {(stats?.categories ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{t("stats.repas")}</StatTitle>
          <StatDescription>
            {(stats?.repas ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{t("stats.plats")}</StatTitle>
          <StatDescription>
            {(stats?.plats ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{t("stats.restaurants")}</StatTitle>
          <StatDescription>
            {(stats?.restaurants_actifs ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        <Stat variant="default">
          <StatTitle>{t("stats.regions")}</StatTitle>
          <StatDescription>
            {(stats?.regions ?? 0).toLocaleString(localeString)}
          </StatDescription>
        </Stat>
        {stats?.visites && (
          <Stat variant="default">
            <StatTitle>{t("stats.visits")}</StatTitle>
            <StatDescription>
              {(stats?.visites ?? 0).toLocaleString(localeString)}
            </StatDescription>
          </Stat>
        )}
        {stats?.pagesVues && (
          <Stat variant="default">
            <StatTitle>{t("stats.views")}</StatTitle>
            <StatDescription>
              {(stats?.pagesVues ?? 0).toLocaleString(localeString)}
            </StatDescription>
          </Stat>
        )}
      </div>
      <TacheCharts data={taches} />
    </div>
  );
}

const chartConfig = {} satisfies ChartConfig;

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

  const groupedData = useMemo(() => {
    return processedData.reduce((acc: Record<string, ProcessedTache>, item) => {
      const dateKey = item.date.toDateString();

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: item.date,
          deltaMenus: 0,
          deltaRepas: 0,
          deltaCategories: 0,
          deltaPlats: 0,
          deltaCompositions: 0,
          requetes: 0,
        };
      }

      acc[dateKey].deltaMenus += item.deltaMenus;
      acc[dateKey].deltaRepas += item.deltaRepas;
      acc[dateKey].deltaCategories += item.deltaCategories;
      acc[dateKey].deltaPlats += item.deltaPlats;
      acc[dateKey].deltaCompositions += item.deltaCompositions;
      acc[dateKey].requetes += item.requetes;

      return acc;
    }, {});
  }, [processedData]);

  const groupedDataArray = Object.values(groupedData);

  const locale = useLocale();

  const t = useTranslations("StatsPage");

  const tooltipMapping = {
    deltaMenus: t("charts.labels.menus"),
    deltaRepas: t("charts.labels.repas"),
    deltaCategories: t("charts.labels.categories"),
    deltaPlats: t("charts.labels.plats"),
    deltaCompositions: t("charts.labels.compositions"),
    requetes: t("charts.labels.requetes"),
  };

  return (
    <div className="space-y-6">
      {/* Chart for the menus added over time */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{t("charts.menuAdded.title")}</CardTitle>
            <CardDescription>
              {t("charts.menuAdded.description")}
            </CardDescription>
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
                data={groupedDataArray}
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
                <Tooltip
                  content={
                    <CustomTooltip
                      locale={locale as "en" | "fr"}
                      tooltipMapping={tooltipMapping}
                      active={false}
                      payload={undefined}
                      label=""
                    />
                  }
                />
                <Legend />
                <Bar
                  dataKey="deltaMenus"
                  fill="#8884d8"
                  name={t("charts.labels.menus")}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart for the categories and compositions added over time */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{t("charts.overTime.title")}</CardTitle>
            <CardDescription>
              {t("charts.overTime.description")}
            </CardDescription>
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
                data={groupedDataArray}
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
                <Tooltip
                  content={
                    <CustomTooltip
                      locale={locale as "en" | "fr"}
                      tooltipMapping={tooltipMapping}
                      active={false}
                      payload={undefined}
                      label=""
                    />
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deltaCompositions"
                  stroke="#82ca9d"
                  name={t("charts.labels.compositions")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                />
                <Line
                  type="monotone"
                  dataKey="deltaCategories"
                  stroke="#ffc658"
                  name={t("charts.labels.categories")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                />
                <Line
                  type="monotone"
                  dataKey="deltaRepas"
                  stroke="#ff0000"
                  name={t("charts.labels.repas")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                />
                <Line
                  type="monotone"
                  dataKey="deltaPlats"
                  stroke="#8884d8"
                  name={t("charts.labels.plats")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
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
            <CardTitle>{t("charts.requests.title")}</CardTitle>
            <CardDescription>
              {t("charts.requests.description")}
            </CardDescription>
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
                data={groupedDataArray}
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
                <Tooltip
                  content={
                    <CustomTooltip
                      locale={locale as "en" | "fr"}
                      tooltipMapping={tooltipMapping}
                      active={false}
                      payload={undefined}
                      label=""
                    />
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requetes"
                  stroke="#ee82ee"
                  name={t("charts.labels.requetes")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
