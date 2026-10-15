"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  Eye,
  Gauge,
  Globe2,
  Hash,
  Layers,
  MapPin,
  MessageSquare,
  MousePointer2,
  RefreshCw,
  Server,
  Timer,
  Users,
  Utensils,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stat, StatDescription, StatTitle } from "@/components/ui/stat";
import { Separator } from "@/components/ui/separator";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn, formatToISODate } from "@/lib/utils";
import type {
  ApiUsageDay,
  ApiUsageStats,
  BotStats,
  BotStatsDay,
  DataFreshness,
  GeoStats,
} from "@/services/types";

const surfaceCard =
  "rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs";

const chartConfig = {} satisfies ChartConfig;

function useNumberLocale() {
  return useLocale() === "en" ? "en-GB" : "fr-FR";
}

/** The API's timestamps are UTC; they are shown in French time. */
const DISPLAY_TIME_ZONE = "Europe/Paris";

/**
 * Turns an API "DD-MM-YYYY HH:MM:SS" (UTC) or "DD-MM-YYYY" string into a
 * readable date and time. The time zone is fixed rather than the visitor's, so
 * the server render and the hydration always agree.
 */
function useApiDateTime() {
  const locale = useNumberLocale();
  return (value: string) => {
    const [datePart, timePart] = value.split(" ");

    // A bare day has no time zone to convert. It is a start date ("since…"),
    // possibly years back, so it keeps its year.
    if (!timePart) {
      return {
        date: formatToISODate(datePart).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        time: "",
      };
    }

    const [day, month, year] = datePart.split("-").map(Number);
    const [hours, minutes, seconds = 0] = timePart.split(":").map(Number);
    const instant = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
    return {
      date: instant.toLocaleDateString(locale, { day: "numeric", month: "long", timeZone: DISPLAY_TIME_ZONE }),
      time: instant.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: DISPLAY_TIME_ZONE }),
    };
  };
}

/** A figure tile: same look as the global stats tiles at the top of the page. */
export function StatTile({
  icon,
  title,
  value,
  hint,
}: {
  icon: ReactNode;
  title: string;
  value: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <Stat className={cn(surfaceCard, "w-full h-full flex flex-row items-center justify-start gap-4 p-6 group")}>
      <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        {icon}
      </div>
      <div className="flex flex-col items-start gap-0.5 min-w-0">
        <StatTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-tight mb-0">
          {title}
        </StatTitle>
        <StatDescription className="text-3xl font-black tracking-tight wrap-break-word">
          {value}
        </StatDescription>
        {hint && <p className="text-xs font-medium text-muted-foreground">{hint}</p>}
      </div>
    </Stat>
  );
}

/**
 * A titled block of the stats page. Same heading as the changelog categories:
 * icon tile, black title, then a rule running to the edge.
 */
export function StatsSection({
  icon,
  title,
  description,
  aside,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0" aria-hidden="true">
            {icon}
          </span>
          <h2 className="font-black text-xl sm:text-3xl tracking-tight wrap-break-word">{title}</h2>
          <Separator className="flex-1 opacity-20" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground font-medium">{description}</p>
          {aside}
        </div>
      </div>
      {children}
    </section>
  );
}

function DataCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className={surfaceCard}>
      <CardHeader className="border-b border-primary/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">{icon}</div>
          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary wrap-break-word">
              {title}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">{children}</CardContent>
    </Card>
  );
}

/** Tooltip for the single-series charts: date, then the value in text ink. */
function ChartTooltip({
  active,
  payload,
  label,
  valueLabel,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: Date;
  valueLabel: string;
}) {
  const locale = useNumberLocale();
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      <p className="font-bold">
        {label.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
      </p>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">{payload[0].value.toLocaleString(locale)}</span> {valueLabel}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- Freshness */

export function FreshnessSection({ data, children }: { data: DataFreshness | null; children: ReactNode }) {
  const t = useTranslations("StatsPage");
  const locale = useNumberLocale();
  const formatDateTime = useApiDateTime();
  const last = data?.derniere_terminee ?? null;
  const lastAt = last ? formatDateTime(last.fin) : null;

  return (
    <StatsSection icon={<RefreshCw className="w-5 h-5" />} title={t("freshness.title")} description={t("freshness.description")}>
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lastAt && (
            <StatTile
              icon={<RefreshCw className="w-5 h-5" />}
              title={t("freshness.lastUpdate")}
              value={lastAt.time}
              hint={lastAt.date}
            />
          )}
          <StatTile
            icon={<Activity className="w-5 h-5" />}
            title={t("freshness.tasks24h")}
            value={data.taches_24h.toLocaleString(locale)}
          />
          <StatTile
            icon={<Timer className="w-5 h-5" />}
            title={t("freshness.avgDuration")}
            value={t("units.seconds", { value: data.duree_moyenne_7j.toLocaleString(locale) })}
          />
          {last && (
            <>
              <StatTile
                icon={<CalendarClock className="w-5 h-5" />}
                title={t("freshness.newMenus")}
                value={last.nouveaux_menus.toLocaleString(locale)}
                hint={t("freshness.lastTask")}
              />
              <StatTile
                icon={<Layers className="w-5 h-5" />}
                title={t("freshness.newMeals")}
                value={last.nouveaux_repas.toLocaleString(locale)}
                hint={t("freshness.lastTask")}
              />
              <StatTile
                icon={<Utensils className="w-5 h-5" />}
                title={t("freshness.newDishes")}
                value={last.nouveaux_plats.toLocaleString(locale)}
                hint={t("freshness.lastTask")}
              />
            </>
          )}
        </div>
      )}
      {children}
    </StatsSection>
  );
}

/* ---------------------------------------------------------------------- API */

export function ApiSection({ usage, history }: { usage: ApiUsageStats | null; history: ApiUsageDay[] }) {
  const t = useTranslations("StatsPage");
  const locale = useNumberLocale();
  const formatDateTime = useApiDateTime();

  const days = history.map((day) => ({ ...day, date: formatToISODate(day.jour) }));
  const lastDay = days.at(-1);
  const errors = days.reduce((sum, day) => sum + day.erreurs_serveur, 0);
  const maxRouteRequests = Math.max(1, ...(usage?.routes ?? []).map((route) => route.requetes));

  return (
    <StatsSection icon={<Server className="w-5 h-5" />} title={t("api.title")} description={t("api.description")}>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {usage && (
          <>
            <StatTile
              icon={<Server className="w-5 h-5" />}
              title={t("api.requests")}
              value={usage.requetes.toLocaleString(locale)}
              hint={t("api.since", { date: formatDateTime(usage.depuis).date })}
            />
            <StatTile
              icon={<Users className="w-5 h-5" />}
              title={t("api.visitors")}
              value={usage.visiteurs_uniques.toLocaleString(locale)}
              hint={t("api.since", { date: formatDateTime(usage.depuis).date })}
            />
          </>
        )}
        {lastDay && (
          <>
            <StatTile
              icon={<Gauge className="w-5 h-5" />}
              title={t("api.p95")}
              value={t("units.ms", { value: lastDay.temps_reponse_p95_ms.toLocaleString(locale) })}
              hint={t("api.p95Hint")}
            />
            <StatTile
              icon={<AlertTriangle className="w-5 h-5" />}
              title={t("api.errors")}
              value={errors.toLocaleString(locale)}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {days.length > 0 && (
          <DataCard
            icon={<Activity className="w-6 h-6" />}
            title={t("api.chartTitle")}
            description={t("api.chartDescription")}
          >
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart accessibilityLayer data={days} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="colorApiRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                    tickFormatter={(value: Date) =>
                      value.toLocaleDateString(locale, { day: "numeric", month: "short" })
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value: number) =>
                      new Intl.NumberFormat(locale, { notation: "compact" }).format(value)
                    }
                  />
                  <Tooltip
                    cursor={{ stroke: "hsl(var(--primary) / 0.3)", strokeWidth: 2 }}
                    content={<ChartTooltip valueLabel={t("api.requests").toLowerCase()} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="requetes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorApiRequests)"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </DataCard>
        )}

        {usage && usage.routes.length > 0 && (
          <DataCard
            icon={<Hash className="w-6 h-6" />}
            title={t("api.routes.title")}
            description={t("api.routes.description")}
          >
            <div className="rounded-2xl border border-primary/5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-bold">{t("api.routes.route")}</th>
                    <th className="px-4 py-3 font-bold text-right">{t("api.routes.requests")}</th>
                    <th className="px-4 py-3 font-bold text-right whitespace-nowrap">{t("api.routes.avgTime")}</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.routes.map((route) => (
                    <tr key={route.route} className="border-t border-primary/5 hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs break-all">{route.route}</code>
                        {/* Share of the busiest route, for a quick comparison. */}
                        <div className="mt-1.5 h-1.5 rounded-full bg-primary/10" aria-hidden="true">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(route.requetes / maxRouteRequests) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {route.requetes.toLocaleString(locale)}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground tabular-nums whitespace-nowrap">
                        {t("units.ms", { value: route.temps_moyen_ms.toLocaleString(locale) })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DataCard>
        )}
      </div>
    </StatsSection>
  );
}

/* ---------------------------------------------------------------------- Bot */

/** Uptime buckets: their colours are always explained by the legend below the strip. */
const UPTIME_BUCKETS = [
  { min: 99.5, symbol: "≥", value: 99.5, className: "bg-green-500", Icon: CheckCircle2 },
  { min: 95, symbol: "≥", value: 95, className: "bg-amber-500", Icon: AlertTriangle },
  { min: -Infinity, symbol: "<", value: 95, className: "bg-destructive", Icon: XCircle },
];

const uptimeStatus = (value: number) => UPTIME_BUCKETS.find((bucket) => value >= bucket.min)!;

export function BotSection({ bot, history }: { bot: BotStats | null; history: BotStatsDay[] }) {
  const t = useTranslations("StatsPage");
  const locale = useNumberLocale();
  const formatDateTime = useApiDateTime();

  const online = bot?.statut === "online";
  const checkedAt = bot ? formatDateTime(bot.date) : null;
  const percent = (value: number) =>
    t("units.percent", { value: value.toLocaleString(locale, { maximumFractionDigits: 2 }) });

  return (
    <StatsSection
      icon={<Bot className="w-5 h-5" />}
      title={t("bot.title")}
      description={t("bot.description")}
      aside={
        bot && (
          <span
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ring-1 ring-inset",
              online
                ? "bg-green-500/10 text-green-700 dark:text-green-400 ring-green-500/20"
                : "bg-destructive/10 text-destructive ring-destructive/20"
            )}
          >
            {online ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {online ? t("bot.online") : t("bot.offline")}
            {checkedAt && (
              <span className="font-medium text-muted-foreground">
                · {t("bot.checkedAt", checkedAt)}
              </span>
            )}
          </span>
        )
      }
    >

      {bot && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatTile icon={<Bot className="w-5 h-5" />} title={t("bot.servers")} value={bot.serveurs.toLocaleString(locale)} />
          <StatTile icon={<Users className="w-5 h-5" />} title={t("bot.users")} value={bot.utilisateurs.toLocaleString(locale)} />
          <StatTile icon={<MessageSquare className="w-5 h-5" />} title={t("bot.channels")} value={bot.salons.toLocaleString(locale)} />
          <StatTile
            icon={<Clock className="w-5 h-5" />}
            title={t("bot.latency")}
            value={t("units.ms", { value: Math.round(bot.latence_ms).toLocaleString(locale) })}
          />
          <StatTile icon={<Activity className="w-5 h-5" />} title={t("bot.uptime24h")} value={percent(bot.disponibilite_24h)} />
          <StatTile icon={<Activity className="w-5 h-5" />} title={t("bot.uptime30d")} value={percent(bot.disponibilite_30j)} />
        </div>
      )}

      {history.length > 0 && (
        <DataCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title={t("bot.uptime30d")}
          description={t("bot.uptimeDescription")}
        >
          <ol className="flex gap-1 h-10" aria-label={t("bot.uptime30d")}>
            {history.map((day) => {
              const status = uptimeStatus(day.disponibilite);
              const label = `${formatToISODate(day.jour).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
              })} : ${percent(day.disponibilite)}`;
              return (
                <li
                  key={day.jour}
                  title={label}
                  aria-label={label}
                  className={cn("flex-1 min-w-1 rounded-sm transition-opacity hover:opacity-70", status.className)}
                />
              );
            })}
          </ol>
          <div className="mt-3 flex justify-between text-xs font-medium text-muted-foreground">
            <span>
              {formatToISODate(history[0].jour).toLocaleDateString(locale, { day: "numeric", month: "short" })}
            </span>
            <span>
              {formatToISODate(history[history.length - 1].jour).toLocaleDateString(locale, {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
            {UPTIME_BUCKETS.map(({ symbol, value, className, Icon }) => (
              <li key={`${symbol}${value}`} className="inline-flex items-center gap-1.5">
                <span className={cn("size-3 rounded-sm", className)} aria-hidden="true" />
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {symbol} {percent(value)}
              </li>
            ))}
          </ul>
        </DataCard>
      )}
    </StatsSection>
  );
}

/* ---------------------------------------------------------------------- Geo */

const GEO_TOP = 10;

export function GeoSection({
  data,
  visits,
  views,
}: {
  data: GeoStats;
  /** Site visits and page views (Umami), shown beside the cities. */
  visits?: number;
  views?: number;
}) {
  const t = useTranslations("StatsPage");
  const locale = useNumberLocale();
  const top = data.top.slice(0, GEO_TOP);
  const max = Math.max(1, ...top.map((city) => city.sessions));

  return (
    <StatsSection icon={<Globe2 className="w-5 h-5" />} title={t("geo.title")} description={t("geo.description")}>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {visits ? (
            <StatTile icon={<MousePointer2 className="w-5 h-5" />} title={t("stats.visits")} value={visits.toLocaleString(locale)} />
          ) : null}
          {views ? (
            <StatTile icon={<Eye className="w-5 h-5" />} title={t("stats.views")} value={views.toLocaleString(locale)} />
          ) : null}
          <StatTile icon={<MapPin className="w-5 h-5" />} title={t("geo.cities")} value={data.villes.toLocaleString(locale)} />
        </div>

        <div className="lg:col-span-2">
          <DataCard
            icon={<MapPin className="w-6 h-6" />}
            title={t("geo.topTitle", { count: top.length })}
            description={t("geo.description")}
          >
            <ol className="space-y-4">
              {top.map((city, index) => {
                const share = (city.sessions / data.sessions) * 100;
                return (
                  <li key={`${city.ville}-${city.region}`} className="flex items-center gap-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-xl bg-primary/5 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate font-bold">
                          {city.ville}
                          <span className="ml-2 text-sm font-medium text-muted-foreground">{city.region}</span>
                        </p>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {city.sessions.toLocaleString(locale)}
                        </p>
                      </div>
                      <div
                        className="mt-1.5 h-2 rounded-full bg-primary/10"
                        title={t("geo.share", { value: share.toLocaleString(locale, { maximumFractionDigits: 1 }) })}
                      >
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(city.sessions / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </DataCard>
        </div>
      </div>
    </StatsSection>
  );
}
