"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useMenuEvents } from "@/hooks/useMenuEvents";
import { useHydrated } from "@/hooks/useHydrated";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { getMenuByRestaurantIdAndDate } from "@/services/menu-service";
import { MenuEvent } from "@/lib/events";
import { findFollowedDishes } from "@/lib/followed-dishes";
import {
  claimUnsentKeys,
  notificationsSupported,
  showDishNotification,
} from "@/lib/dish-notifications";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";
import { getNormalizedISODate, normalizeToDate, toLocalISODateString } from "@/lib/utils";

const NOTIFIED_EVENT_TYPES = ["menu.created", "menu.updated"] as const;

// See REFRESH_MAX_AGE in useRestaurantMenu.
const FRESH_MAX_AGE = 10 * 1000; // 10 seconds in milliseconds

/**
 * Sends a browser notification when a favourite restaurant publishes a menu
 * containing a dish the user follows.
 *
 * It listens to the API's real-time events, so it only works while the site is
 * open in a tab (or installed and running): nothing is stored on a server.
 */
export default function DishNotificationsProvider() {
  const t = useTranslations("DishNotifications");
  const locale = useLocale();
  const hydrated = useHydrated();
  const favourites = useUserPreferences((state) => state.favourites);
  const followedDishes = useUserPreferences((state) => state.followedDishes);
  const dishNotifications = useUserPreferences((state) => state.dishNotifications);

  // Read after hydration: the permission is browser state, unknown to the server.
  const [permitted, setPermitted] = useState(false);
  useEffect(() => {
    setPermitted(notificationsSupported() && Notification.permission === "granted");
  }, [dishNotifications]);

  const handleEvent = useCallback(
    async (event: MenuEvent) => {
      if (!event.date) return;

      const favourite = favourites.find((f) => f.code === event.code);
      if (!favourite) return;

      const date = getNormalizedISODate(event.date);
      if (date.getTime() < normalizeToDate(new Date()).getTime()) return;

      const menu = await getMenuByRestaurantIdAndDate(event.code, event.date, {
        maxAge: FRESH_MAX_AGE,
      });
      if (!menu.success || !menu.data) return;

      const matches = findFollowedDishes([menu.data], followedDishes);
      const unsent = new Set(
        claimUnsentKeys(matches.map((match) => `${event.code}:${event.date}:${match.dish.code}`))
      );
      const dishes = [
        ...new Set(
          matches
            .filter((match) => unsent.has(`${event.code}:${event.date}:${match.dish.code}`))
            .map((match) => match.dish.libelle)
        ),
      ];
      if (dishes.length === 0) return;

      await showDishNotification({
        title: favourite.name,
        body: t("body", {
          dishes: new Intl.ListFormat(locale, { type: "conjunction" }).format(dishes),
          date: date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }),
        }),
        tag: `dish:${event.code}:${event.date}`,
        url: `/${locale}/restaurants/${buildRestaurantSlug({
          nom: favourite.name,
          code: favourite.code,
        })}?date=${toLocalISODateString(date)}`,
      });
    },
    [favourites, followedDishes, locale, t]
  );

  useMenuEvents({
    codes: favourites.map((favourite) => favourite.code),
    types: NOTIFIED_EVENT_TYPES,
    enabled: hydrated && dishNotifications && permitted && followedDishes.length > 0,
    onEvent: handleEvent,
  });

  return null;
}
