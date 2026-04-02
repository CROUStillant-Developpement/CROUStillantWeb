"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Restaurant, Menu, Repas, CategorieTriee } from "@/services/types";
import { fetchTodayMenuForScreen } from "@/actions/screen-actions";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, RefreshCw, Monitor } from "lucide-react";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SCROLL_SPEED = 0.5; // px per frame (~36px/s at 60fps)
const SCROLL_PAUSE_MS = 2500; // pause at bottom before looping

interface ScreenPageProps {
  restaurant: Restaurant;
  initialMenu: Menu | null;
}

function MealColumn({
  repas,
  title,
  emoji,
}: {
  repas: Repas;
  title: string;
  emoji: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame: number;
    let paused = false;
    let pauseTimeout: ReturnType<typeof setTimeout>;
    // Accumulate sub-pixel scroll so fractional speeds aren't lost to integer rounding
    let remainder = 0;

    const tick = () => {
      if (!paused && el.clientHeight > 0 && el.scrollHeight > el.clientHeight) {
        remainder += SCROLL_SPEED;
        const step = Math.floor(remainder);
        if (step >= 1) {
          el.scrollTop += step;
          remainder -= step;
        }

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
          paused = true;
          remainder = 0;
          pauseTimeout = setTimeout(() => {
            el.scrollTop = 0;
            paused = false;
          }, SCROLL_PAUSE_MS);
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(pauseTimeout);
    };
  }, []);

  const sortedCategories = [...repas.categories].sort(
    (a, b) =>
      ((a as CategorieTriee).ordre ?? 0) - ((b as CategorieTriee).ordre ?? 0)
  );

  return (
    <div className="flex flex-col min-h-0 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200 shadow-xs">
      <div className="px-8 py-5 bg-white border-b border-zinc-200 shrink-0">
        <h2 className="text-4xl font-bold flex items-center gap-4 text-zinc-800">
          <span className="text-5xl">{emoji}</span>
          <span>{title}</span>
        </h2>
      </div>
      {/* Wrapper gives the scroll container an explicit height via absolute positioning */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-8 py-6"
        >
          <div className="space-y-6">
            {sortedCategories.map((category) => {
              const sortedPlats = [...category.plats].sort(
                (a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)
              );
              return (
                <div key={category.code}>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-3 px-1">
                    {category.libelle}
                  </h3>
                  <ul className="space-y-3">
                    {sortedPlats.map((plat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-2xl capitalize leading-snug text-zinc-700"
                      >
                        <ArrowRight className="h-6 w-6 mt-1 shrink-0 text-zinc-400" />
                        <span>{plat.libelle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        {/* Gradient sibling — outside the scroll container so it doesn't affect scrollHeight */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-zinc-50 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}

export default function ScreenPage({
  restaurant,
  initialMenu,
}: ScreenPageProps) {
  const t = useTranslations("ScreenPage");
  const locale = useLocale();

  const [menu, setMenu] = useState<Menu | null>(initialMenu);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsTooSmall(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Live clock — tick every second
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Refresh menu data every 5 minutes
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fresh = await fetchTodayMenuForScreen(restaurant.code);
      setMenu(fresh);
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [restaurant.code]);

  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  const breakfast = menu?.repas.find((r) => r.type === "matin") ?? null;
  const lunch = menu?.repas.find((r) => r.type === "midi") ?? null;
  const dinner = menu?.repas.find((r) => r.type === "soir") ?? null;

  const meals = [
    breakfast && { repas: breakfast, title: t("breakfast"), emoji: "🥞" },
    lunch && { repas: lunch, title: t("lunch"), emoji: "🍽" },
    dinner && { repas: dinner, title: t("dinner"), emoji: "🍲" },
  ].filter(Boolean) as { repas: Repas; title: string; emoji: string }[];

  const timeStr = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateStr = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const lastUpdatedStr = lastUpdated.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    // fixed inset-0 z-50 takes over the full viewport, bypassing the locale layout's header/footer
    <div className="fixed inset-0 z-50 bg-white text-zinc-900 flex flex-col overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none">
      {/* ── Too-small overlay ── */}
      {isTooSmall && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-zinc-950/95 text-white text-center px-8">
          <Monitor className="h-16 w-16 text-zinc-400" />
          <p className="text-2xl font-bold">{t("tooSmall.title")}</p>
          <p className="text-base text-zinc-400 max-w-xs leading-relaxed">{t("tooSmall.description")}</p>
        </div>
      )}
      {/* ── Header ── */}
      <header className="shrink-0 px-10 py-6 flex items-center justify-between border-b border-zinc-200 bg-zinc-50">
        <div className="min-w-0 mr-10">
          <h1 className="text-5xl font-extrabold tracking-tight leading-none truncate text-zinc-900">
            {restaurant.nom}
          </h1>
          <p className="text-2xl text-zinc-400 mt-2 flex items-center gap-4">
            <span className="truncate">{restaurant.zone}</span>
            <span className="text-zinc-300 shrink-0">·</span>
            <span
              className={`shrink-0 font-semibold ${
                restaurant.ouvert ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {restaurant.ouvert ? t("open") : t("closed")}
            </span>
          </p>
        </div>

        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <div className="text-7xl font-mono font-bold tabular-nums leading-none text-zinc-900">
            {timeStr}
          </div>
          <div className="text-xl text-zinc-400 capitalize mt-2">{dateStr}</div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`h-3 w-3 rounded-full shrink-0 ${
                isRefreshing
                  ? "bg-amber-400 animate-pulse"
                  : "bg-emerald-400 animate-pulse"
              }`}
            />
            <span className="text-base text-zinc-400">{t("live")}</span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 min-h-0 p-5 bg-zinc-100">
        {meals.length > 0 ? (
          <div
            className="h-full grid gap-4"
            style={{ gridTemplateColumns: `repeat(${meals.length}, 1fr)` }}
          >
            {meals.map((meal) => (
              <MealColumn key={meal.repas.type} {...meal} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-6 text-zinc-400">
            <span className="text-9xl">🍽</span>
            <p className="text-4xl font-semibold">{t("noMenuToday")}</p>
            <p className="text-2xl opacity-70">{t("noMenuDescription")}</p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 px-10 py-4 flex items-center justify-between border-t border-zinc-200 bg-zinc-50">
        <span className="text-lg font-semibold text-zinc-400">
          CROUStillant.menu
        </span>
        <div className="flex items-center gap-2 text-zinc-400 text-lg">
          <RefreshCw
            className={`h-5 w-5 shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>{t("lastUpdated", { time: lastUpdatedStr })}</span>
        </div>
      </footer>
    </div>
  );
}
