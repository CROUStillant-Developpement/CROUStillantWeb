import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DishTags from "@/components/restaurants/slug/dish-tags";
import { Link } from "@/i18n/routing";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";
import { formatToISODate } from "@/lib/utils";
import type { PlatCanonique, PlatCanoniqueStats, TypeRepas } from "@/services/types";
import { CalendarClock, CalendarDays, Store, Utensils } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ComponentType, ReactNode } from "react";

const CARD_CLASS = "rounded-2xl border border-primary/5 bg-card/50 shadow-xs";
const MEALS: TypeRepas[] = ["matin", "midi", "soir"];
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;

type DishPageProps = {
  dish: PlatCanonique;
  stats: PlatCanoniqueStats;
};

/**
 * Where and when a canonical dish is served: totals, usual weekday, meals,
 * the restaurants serving it most and its next published servings.
 */
export default function DishPage({ dish, stats }: DishPageProps) {
  const t = useTranslations("DishPage");
  const format = useFormatter();

  const weekday = (day: number) =>
    // 1 January 2024 was a Monday: ISO weekday `day` is 2024-01-`day`
    format.dateTime(new Date(Date.UTC(2024, 0, day)), { weekday: "long", timeZone: "UTC" });
  const date = (value: string | null) =>
    value ? format.dateTime(formatToISODate(value), { day: "numeric", month: "long", year: "numeric" }) : "—";

  const weekdayMax = Math.max(1, ...WEEKDAYS.map((d) => stats.jours[String(d) as keyof typeof stats.jours] ?? 0));
  const mealTotal = MEALS.reduce((sum, meal) => sum + (stats.repas[meal] ?? 0), 0);

  return (
    <div className="space-y-6">
      <DishTags plat={{ code: String(dish.code), libelle: dish.libelle, type: dish.type, vegetarien: dish.vegetarien }} />

      {stats.total === 0 ? (
        <p className="text-muted-foreground">{t("neverServed")}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={Utensils} label={t("total")} value={format.number(stats.total)} />
            <Stat icon={Store} label={t("restaurants")} value={format.number(stats.nb_restaurants)} />
            <Stat icon={CalendarDays} label={t("first")} value={date(stats.premier)} />
            <Stat icon={CalendarClock} label={t("last")} value={date(stats.dernier)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={CARD_CLASS}>
              <CardHeader>
                <CardTitle className="text-lg font-bold">{t("weekdays")}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {stats.jour_habituel
                    ? t("usualDay", { day: weekday(stats.jour_habituel) })
                    : t("noUsualDay")}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {WEEKDAYS.map((day) => {
                    const count = stats.jours[String(day) as keyof typeof stats.jours] ?? 0;
                    return (
                      <li key={day} className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3 text-sm">
                        <span className="capitalize">{weekday(day)}</span>
                        <span className="h-2.5 rounded-full bg-primary/10 overflow-hidden" aria-hidden="true">
                          <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${(count / weekdayMax) * 100}%` }}
                          />
                        </span>
                        <span className="text-right tabular-nums text-muted-foreground">{format.number(count)}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card className={CARD_CLASS}>
              <CardHeader>
                <CardTitle className="text-lg font-bold">{t("meals")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {MEALS.filter((meal) => (stats.repas[meal] ?? 0) > 0).map((meal) => (
                    <li key={meal} className="flex items-center justify-between text-sm">
                      <span>{t(`meal.${meal}`)}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {format.number((stats.repas[meal] ?? 0) / Math.max(mealTotal, 1), { style: "percent" })}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title={t("upcoming")} empty={t("noUpcoming")}>
          {stats.prochains.map((p) => (
            <li key={`${p.date}-${p.repas}-${p.restaurant.code}`} className="flex items-baseline justify-between gap-3">
              <RestaurantLink code={p.restaurant.code} nom={p.restaurant.nom} />
              <span className="shrink-0 text-sm text-muted-foreground">
                {date(p.date)} · {t(`meal.${p.repas}`)}
              </span>
            </li>
          ))}
        </Section>

        <Section title={t("topRestaurants")} empty={t("noRestaurants")}>
          {stats.restaurants.map((r) => (
            <li key={r.code} className="flex items-baseline justify-between gap-3">
              <RestaurantLink code={r.code} nom={r.nom} />
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {t("servings", { count: r.total })}
              </span>
            </li>
          ))}
        </Section>
      </div>

      {dish.libelles.length > 0 && (
        <Section title={t("spellings", { count: dish.nb_libelles })}>
          {dish.libelles.map((l) => (
            <li key={l.code} className="text-sm text-muted-foreground wrap-break-word">
              {l.libelle}
            </li>
          ))}
        </Section>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className={CARD_CLASS}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
          <p className="font-bold wrap-break-word">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, empty, children }: { title: string; empty?: string; children: ReactNode[] }) {
  return (
    <Card className={CARD_CLASS}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children.length > 0 ? (
          <ul className="space-y-2">{children}</ul>
        ) : (
          <p className="text-sm text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}

function RestaurantLink({ code, nom }: { code: number; nom: string }) {
  return (
    <Link
      href={`/restaurants/${buildRestaurantSlug({ code, nom })}`}
      className="min-w-0 font-medium text-primary hover:underline wrap-break-word"
    >
      {nom}
    </Link>
  );
}
