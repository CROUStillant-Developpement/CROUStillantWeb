"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Stat, StatTitle, StatDescription } from "@/components/ui/stat";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  CalendarCheck,
  CalendarX,
  TrendingUp,
  ChefHat,
  Flame,
  CloudOff,
  Activity,
  Clock,
  Shuffle,
  LayoutList,
  MapPin,
} from "lucide-react";
import { useRestaurantInsights } from "@/hooks/useRestaurantInsights";
import { formatToISODate } from "@/lib/utils";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

interface RestaurantInsightsProps {
  restaurantCode: number;
}

export default function RestaurantInsights({ restaurantCode }: RestaurantInsightsProps) {
  const t = useTranslations("RestaurantInsights");
  const tDays = useTranslations("RestaurantInformation");
  const locale = useLocale();

  const { insights, loading, error } = useRestaurantInsights(restaurantCode);

  if (loading) {
    return <RestaurantInsightsSkeleton />;
  }

  if (error || !insights) {
    return (
      <Alert className="rounded-3xl border-warning/20 bg-warning/5 p-8" variant="warning">
        <AlertTitle className="text-xl font-bold mb-2">{t("errorTitle")}</AlertTitle>
        <AlertDescription className="text-base opacity-90">{t("errorDescription")}</AlertDescription>
      </Alert>
    );
  }

  const {
    couverture,
    plats_frequents,
    periode,
    couverture_par_jour,
    series,
    variete,
    richesse,
    delai_publication,
    comparaison_regionale,
  } = insights;

  if (couverture.jours_ouvres === 0) {
    return (
      <Alert className="rounded-3xl border-warning/20 bg-warning/5 p-8" variant="warning">
        <AlertTitle className="text-xl font-bold mb-2">{t("noDataTitle")}</AlertTitle>
        <AlertDescription className="text-base opacity-90">{t("noDataDescription")}</AlertDescription>
      </Alert>
    );
  }

  const pctAvecMenu = couverture.taux_couverture;

  const coverageData = [
    { name: t("daysWithMenu"), value: couverture.jours_avec_menu, fill: "#22c55e" },
    { name: t("daysWithoutMenu"), value: couverture.jours_sans_menu, fill: "#ef4444" },
  ];

  return (
    <div className="flex flex-col gap-8 min-w-0 w-full">
      <p className="text-sm font-medium text-muted-foreground px-1">
        {t("period", {
          debut: formatToISODate(periode.debut).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" }),
          fin: formatToISODate(periode.fin).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" }),
        })}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile
          icon={<CalendarCheck className="w-5 h-5" />}
          title={t("daysWithMenu")}
          value={couverture.jours_avec_menu}
        />
        <StatTile
          icon={<CalendarX className="w-5 h-5" />}
          title={t("daysWithoutMenu")}
          value={couverture.jours_sans_menu}
        />
        <StatTile
          icon={<TrendingUp className="w-5 h-5" />}
          title={t("coverageRate")}
          value={`${couverture.taux_couverture}%`}
        />
      </div>

      <Card className="rounded-2xl border-primary/5 bg-card/50 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-tight text-primary">
            {t("coverageTitle")}
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            {t("coverageDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-[200px] aspect-square shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="72%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  paddingAngle={couverture.jours_avec_menu > 0 && couverture.jours_sans_menu > 0 ? 3 : 0}
                  isAnimationActive={false}
                />
                <Tooltip
                  wrapperStyle={{ zIndex: 50 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const entry = payload[0];
                    return (
                      <div className="custom-tooltip">
                        <p className="label">{entry.name}</p>
                        <p>{entry.value}</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black tracking-tight">{pctAvecMenu}%</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight text-center px-2">
                {t("coverageRate")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
              {t("daysWithMenu")} ({couverture.jours_avec_menu})
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 shrink-0" />
              {t("daysWithoutMenu")} ({couverture.jours_sans_menu})
            </span>
          </div>
        </CardContent>
      </Card>

      {couverture_par_jour.length > 0 && (
        <Card className="rounded-2xl border-primary/5 bg-card/50 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-primary">
              {t("weekdayTitle")}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {t("weekdayDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6 flex flex-col gap-3">
            {couverture_par_jour.map((jour) => (
              <div key={jour.jour} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground">
                  {tDays(jour.jour)}
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-secondary/20 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${jour.taux_couverture}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs font-bold">
                  {jour.taux_couverture}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatTile
          icon={<Flame className="w-5 h-5" />}
          title={t("bestStreak")}
          value={series.meilleure_serie_avec_menu}
        />
        <StatTile
          icon={<CloudOff className="w-5 h-5" />}
          title={t("longestGap")}
          value={series.plus_longue_serie_sans_menu}
        />
        <StatTile
          icon={<Activity className="w-5 h-5" />}
          title={series.serie_actuelle.avec_menu ? t("currentStreakWithMenu") : t("currentStreakWithoutMenu")}
          value={series.serie_actuelle.jours}
        />
        <StatTile
          icon={<Clock className="w-5 h-5" />}
          title={t("publishLag")}
          value={
            delai_publication.moyenne_jours === null
              ? t("notAvailable")
              : t("publishLagValue", { jours: delai_publication.moyenne_jours })
          }
        />
      </div>

      <Card className="rounded-2xl border-primary/5 bg-card/50 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-tight text-primary">
            {t("varietyTitle")}
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            {t("varietyDescription", {
              uniques: variete.plats_uniques,
              total: variete.plats_total,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatTile
            icon={<Shuffle className="w-5 h-5" />}
            title={t("varietyRate")}
            value={`${variete.taux_variete}%`}
          />
          <StatTile
            icon={<LayoutList className="w-5 h-5" />}
            title={t("categoriesPerMeal")}
            value={richesse.moyenne_categories_par_repas}
          />
          <StatTile
            icon={<ChefHat className="w-5 h-5" />}
            title={t("dishesPerMeal")}
            value={richesse.moyenne_plats_par_repas}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-primary/5 bg-card/50 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-tight text-primary flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {t("regionalComparisonTitle")}
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            {t("regionalComparisonDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          {comparaison_regionale.moyenne_jours_avec_menu_region === null ||
          comparaison_regionale.nb_restaurants_compares === 0 ? (
            <p className="text-sm text-muted-foreground italic">{t("regionalComparisonNoData")}</p>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <RegionalComparisonGauge
                value={comparaison_regionale.jours_avec_menu_restaurant}
                average={comparaison_regionale.moyenne_jours_avec_menu_region}
                valueLabel={t("thisRestaurant")}
                averageLabel={t("regionalAverage", { count: comparaison_regionale.nb_restaurants_compares })}
              />
              {comparaison_regionale.nb_restaurants_actifs_region > comparaison_regionale.nb_restaurants_compares && (
                <p className="text-xs text-muted-foreground italic">
                  {t("regionalComparisonCoverageNote", {
                    withMenu: comparaison_regionale.nb_restaurants_compares,
                    total: comparaison_regionale.nb_restaurants_actifs_region,
                  })}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-primary/5 bg-card/50 shadow-xs">
        <CardHeader className="border-b border-primary/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-black uppercase tracking-tight text-primary">
                {t("topDishesTitle")}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {t("topDishesDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-2xl border border-primary/5 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-primary/5">
                  <TableHead className="w-20 text-center font-bold">{t("ranking")}</TableHead>
                  <TableHead className="w-28 text-center font-bold">{t("occurrences")}</TableHead>
                  <TableHead className="font-bold">{t("label")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plats_frequents.map((plat, index) => (
                  <TableRow key={plat.code} className="border-primary/5 hover:bg-primary/5 transition-colors">
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/5 font-bold text-sm text-primary">
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{plat.total?.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{plat.libelle}</TableCell>
                  </TableRow>
                ))}
                {plats_frequents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic">
                      {t("noDishes")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RegionalComparisonGauge({
  value,
  average,
  valueLabel,
  averageLabel,
}: {
  value: number;
  average: number;
  valueLabel: string;
  averageLabel: string;
}) {
  const width = 240;
  const strokeWidth = 16;
  const radius = 88;
  const topPadding = 10;
  const height = radius + strokeWidth + topPadding;
  const cx = width / 2;
  const cy = height - strokeWidth / 2;

  const maxValue = Math.max(value, average, 1) * 1.05;

  const angleForValue = (v: number) => 180 - (Math.min(Math.max(v, 0), maxValue) / maxValue) * 180;

  const polarToCartesian = (angleDeg: number, r: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy - r * Math.sin(angleRad),
    };
  };

  const start = polarToCartesian(180, radius);
  const end = polarToCartesian(0, radius);
  const valuePoint = polarToCartesian(angleForValue(value), radius);

  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${end.x} ${end.y}`;
  const valuePath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${valuePoint.x} ${valuePoint.y}`;

  const markerAngle = angleForValue(average);
  const markerInner = polarToCartesian(markerAngle, radius - strokeWidth / 2 - 5);
  const markerOuter = polarToCartesian(markerAngle, radius + strokeWidth / 2 + 5);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="max-w-full">
        <path
          d={trackPath}
          fill="none"
          stroke="hsl(var(--secondary) / 0.3)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={valuePath}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={markerInner.x}
          y1={markerInner.y}
          x2={markerOuter.x}
          y2={markerOuter.y}
          stroke="hsl(var(--foreground))"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-foreground font-black"
          style={{ fontSize: 30 }}
        >
          {value.toLocaleString()}
        </text>
      </svg>
      <span className="text-xs font-semibold text-primary uppercase tracking-tight text-center">
        {valueLabel}
      </span>
      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground text-center mt-1">
        <span className="w-2.5 h-0.5 rounded-full bg-foreground inline-block shrink-0" />
        {averageLabel} : {average.toLocaleString()}
      </span>
    </div>
  );
}

function StatTile({ icon, title, value }: { icon: React.ReactNode; title: string; value: number | string }) {
  return (
    <Stat className="w-full h-full flex flex-row items-center justify-start gap-4 p-6 rounded-2xl border-primary/5 bg-card/50 shadow-xs">
      <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">{icon}</div>
      <div className="flex flex-col items-start gap-0.5">
        <StatTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-tight mb-0">
          {title}
        </StatTitle>
        <StatDescription className="text-2xl font-black tracking-tight">{value}</StatDescription>
      </div>
    </Stat>
  );
}

function RestaurantInsightsSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <Skeleton className="h-4 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
