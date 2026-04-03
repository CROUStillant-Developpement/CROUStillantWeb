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
  Area,
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
import { motion } from "@/lib/motion";
import { Activity, Menu, Utensils, Hash, MapPin, MousePointer2, Eye, LayoutGrid } from "lucide-react";

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
  cx?: number;
  cy?: number;
  stroke?: string;
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
              {`${entry.value.toLocaleString(localeString)} ${tooltipMapping[entry.dataKey] || entry.dataKey
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

  if (cx === undefined || cy === undefined) {
    return null;
  }

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 px-4 mt-4"
    >
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
              {t("description")}
            </span>
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Menu className="w-5 h-5" />}
          title={t("stats.menus")}
          value={stats?.menus ?? 0}
          locale={localeString}
        />
        <StatCard
          icon={<LayoutGrid className="w-5 h-5" />}
          title={t("stats.compositions")}
          value={stats?.compositions ?? 0}
          locale={localeString}
        />
        <StatCard
          icon={<Hash className="w-5 h-5" />}
          title={t("stats.categories")}
          value={stats?.categories ?? 0}
          locale={localeString}
        />
        <StatCard
          icon={<Utensils className="w-5 h-5" />}
          title={t("stats.repas")}
          value={stats?.repas ?? 0}
          locale={localeString}
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          title={t("stats.plats")}
          value={stats?.plats ?? 0}
          locale={localeString}
        />
        <StatCard
          icon={<LayoutGrid className="w-5 h-5" />}
          title={t("stats.restaurants")}
          value={stats?.restaurants_actifs ?? 0}
          locale={localeString}
        />
        <StatCard
          icon={<MapPin className="w-5 h-5" />}
          title={t("stats.regions")}
          value={stats?.regions ?? 0}
          locale={localeString}
        />
        {stats?.visites && (
          <StatCard
            icon={<MousePointer2 className="w-5 h-5" />}
            title={t("stats.visits")}
            value={stats?.visites}
            locale={localeString}
          />
        )}
        {stats?.pagesVues && (
          <StatCard
            icon={<Eye className="w-5 h-5" />}
            title={t("stats.views")}
            value={stats?.pagesVues}
            locale={localeString}
          />
        )}
      </div>

      <TacheCharts data={taches} />
    </motion.div>
  );
}

const StatCard = ({
  icon,
  title,
  value,
  locale,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  locale: string;
}) => (
  <Stat className="w-full h-full flex flex-row items-center justify-start gap-4 p-6 rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
    <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
      {icon}
    </div>
    <div className="flex flex-col items-start gap-0.5">
      <StatTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-tight mb-0">
        {title}
      </StatTitle>
      <StatDescription className="text-3xl font-black tracking-tight">
        {value.toLocaleString(locale)}
      </StatDescription>
    </div>
  </Stat>
);

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
    <div className="space-y-8">
      {/* Chart for the menus added over time */}
      <Card className="rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-primary/5 p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-8 py-6">
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">
              {t("charts.menuAdded.title")}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {t("charts.menuAdded.description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                accessibilityLayer
                data={groupedDataArray}
                margin={{
                  left: 0,
                  right: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorMenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={32}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 500, fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  hide
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--primary) / 0.05)" }}
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
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar
                  dataKey="deltaMenus"
                  fill="url(#colorMenus)"
                  radius={[6, 6, 0, 0]}
                  name={t("charts.labels.menus")}
                  maxBarSize={40}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart for the categories and compositions added over time */}
      <Card className="rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-primary/5 p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-8 py-6">
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">
              {t("charts.overTime.title")}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {t("charts.overTime.description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                accessibilityLayer
                data={groupedDataArray}
                margin={{
                  left: 0,
                  right: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={32}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 500, fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--primary) / 0.2)", strokeWidth: 2 }}
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
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="deltaCompositions"
                  stroke="#10b981"
                  strokeWidth={3}
                  name={t("charts.labels.compositions")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="deltaCategories"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name={t("charts.labels.categories")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="deltaRepas"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name={t("charts.labels.repas")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="deltaPlats"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name={t("charts.labels.plats")}
                  dot={(props: DotProps) => <CustomDot {...props} />}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Chart for the requests over time */}
      <Card className="rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-primary/5 p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-8 py-6">
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">
              {t("charts.requests.title")}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {t("charts.requests.description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                accessibilityLayer
                data={groupedDataArray}
                margin={{
                  left: 0,
                  right: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  minTickGap={32}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontWeight: 500, fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ stroke: "#d946ef", strokeWidth: 2 }}
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
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="requetes"
                  stroke="#d946ef"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRequests)"
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
