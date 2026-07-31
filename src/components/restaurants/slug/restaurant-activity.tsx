"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Stat, StatTitle, StatDescription } from "@/components/ui/stat";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarPlus, RefreshCw, History, Clock } from "lucide-react";
import { useRestaurantActivity } from "@/hooks/useRestaurantActivity";
import { parseApiDateTime } from "@/lib/utils";

interface RestaurantActivityProps {
  restaurantCode: number;
}

function formatDateTime(value: string | null, locale: string) {
  if (!value) return null;
  // API dates are formatted as "DD-MM-YYYY HH:MM:SS"
  const parsed = parseApiDateTime(value);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(debut: string | null, fin: string | null) {
  if (!debut || !fin) return null;
  const start = parseApiDateTime(debut).getTime();
  const end = parseApiDateTime(fin).getTime();
  if (isNaN(start) || isNaN(end) || end < start) return null;

  const seconds = Math.round((end - start) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  return `${minutes}min`;
}

export default function RestaurantActivity({ restaurantCode }: RestaurantActivityProps) {
  const t = useTranslations("RestaurantActivity");
  const locale = useLocale();
  const { activity, loading, error } = useRestaurantActivity(restaurantCode);

  if (loading) {
    return <RestaurantActivitySkeleton />;
  }

  if (error || !activity) {
    return (
      <Alert className="rounded-3xl border-warning/20 bg-warning/5 p-8" variant="warning">
        <AlertTitle className="text-xl font-bold mb-2">{t("errorTitle")}</AlertTitle>
        <AlertDescription className="text-base opacity-90">{t("errorDescription")}</AlertDescription>
      </Alert>
    );
  }

  const { ajout, modifie, nb_verifications, dernieres_verifications } = activity;

  const ajoutFormatted = formatDateTime(ajout, locale);
  const modifieFormatted = formatDateTime(modifie, locale);

  return (
    <div className="flex flex-col gap-8 min-w-0 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat className="w-full h-full flex flex-row items-center justify-start gap-4 p-6 rounded-2xl border-primary/5 bg-card/50 shadow-xs">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
            <CalendarPlus className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <StatTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-tight mb-0">
              {t("addedOn")}
            </StatTitle>
            <StatDescription className="text-lg font-black tracking-tight wrap-break-word">
              {ajoutFormatted ?? t("notAvailable")}
            </StatDescription>
          </div>
        </Stat>
        <Stat className="w-full h-full flex flex-row items-center justify-start gap-4 p-6 rounded-2xl border-primary/5 bg-card/50 shadow-xs">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <StatTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-tight mb-0">
              {t("lastUpdated")}
            </StatTitle>
            <StatDescription className="text-lg font-black tracking-tight wrap-break-word">
              {modifieFormatted ?? t("notAvailable")}
            </StatDescription>
          </div>
        </Stat>
        <Stat className="w-full h-full flex flex-row items-center justify-start gap-4 p-6 rounded-2xl border-primary/5 bg-card/50 shadow-xs">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <StatTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-tight mb-0">
              {t("checksCount")}
            </StatTitle>
            <StatDescription className="text-2xl font-black tracking-tight">
              {nb_verifications.toLocaleString()}
            </StatDescription>
          </div>
        </Stat>
      </div>

      <Card className="rounded-2xl border-primary/5 bg-card/50 shadow-xs">
        <CardHeader className="border-b border-primary/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-black uppercase tracking-tight text-primary">
                {t("recentChecksTitle")}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {t("recentChecksDescription")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {dernieres_verifications.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-8">
              {t("noChecks")}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {dernieres_verifications.map((run) => {
                const duration = formatDuration(run.debut, run.fin);
                return (
                  <li
                    key={run.id}
                    className="flex items-center justify-between gap-4 py-3 px-2 border-b border-primary/5 last:border-b-0"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium min-w-0">
                      <span className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                      <span className="truncate">{formatDateTime(run.debut, locale) ?? t("notAvailable")}</span>
                    </span>
                    {duration && (
                      <span className="text-xs font-semibold text-muted-foreground shrink-0">
                        {duration}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RestaurantActivitySkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
}
