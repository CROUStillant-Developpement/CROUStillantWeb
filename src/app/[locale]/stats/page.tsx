"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tache } from "@/services/types";
import { getTaches } from "@/services/stats-services";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatToISODate } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

export default function StatsPage() {
  const [taches, setTaches] = useState<Tache[]>([]);

  useEffect(() => {
    getTaches().then((result) => {
      if (result.success) {
        setTaches(result.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <TacheCharts data={taches} />
    </div>
  );
}

const chartConfig = {
  menuAdded: {
    label: "Menus Added",
  },
} satisfies ChartConfig;

const TacheCharts = ({ data }: { data: Tache[] }) => {
  const processedData = useMemo(() => {
    return data.map((tache) => ({
      id: tache.id,
      date: formatToISODate(tache.debut.split(" ")[0]), // Extract date
      deltaMenus: tache.fin_menus - tache.debut_menus,
      deltaRepas: tache.fin_repas - tache.debut_repas,
      deltaCategories: tache.fin_categories - tache.debut_categories,
      deltaPlats: tache.fin_plats - tache.debut_plats,
      requetes: tache.requetes,
    }));
  }, [data]);

  const locale = useLocale();

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Bar Chart: Menus Added Over Time</CardTitle>
            <CardDescription>
              This chart shows the number of menus added each day.
            </CardDescription>
          </div>
          <div className="flex">
            {/* {["desktop", "mobile"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              );
            })} */}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={processedData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
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
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="menuAdded"
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="deltaMenus" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Line Chart: Requests Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="requetes"
                stroke="#82ca9d"
                name="Requests"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pie Chart: Proportions of Categories Added</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData}
                dataKey="deltaCategories"
                nameKey="id"
                fill="#ffc658"
                label
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Radar Chart: Comparison Across Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={processedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="id" />
              <PolarRadiusAxis />
              <Radar
                name="Menus"
                dataKey="deltaMenus"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Repas"
                dataKey="deltaRepas"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
