// The feed URL is stored by the user's calendar app and polled for as long as
// the subscription lives, so it points at the API's unversioned alias rather
// than /v1: it has to outlive future API versions. Change it here only.
export const CALENDAR_API_URL = "https://api.croustillant.menu/calendar";

export const CALENDAR_MEALS = ["matin", "midi", "soir"] as const;

export type CalendarMeal = (typeof CALENDAR_MEALS)[number];

export interface CalendarFeedOptions {
  /** Meals to include. Every meal when empty or complete. */
  meals?: CalendarMeal[];
  /** Short fixed 15-minute events instead of the restaurant's opening hours. */
  minimal?: boolean;
}

export interface CalendarSubscribeLinks {
  /** Plain feed URL, to paste into any calendar app. */
  https: string;
  /** Same feed with the webcal:// scheme, opened natively by Apple Calendar and Outlook desktop. */
  webcal: string;
  google: string;
  outlook: string;
}

/** Builds the iCalendar feed URL of a restaurant's menus. */
export function getCalendarFeedUrl(
  code: number,
  { meals = [], minimal = false }: CalendarFeedOptions = {}
): string {
  const params = new URLSearchParams();

  const selectedMeals = CALENDAR_MEALS.filter((meal) => meals.includes(meal));
  if (selectedMeals.length > 0 && selectedMeals.length < CALENDAR_MEALS.length) {
    params.set("repas", selectedMeals.join(","));
  }
  if (minimal) params.set("minimal", "true");

  const query = params.toString();
  return `${CALENDAR_API_URL}/${code}.ics${query ? `?${query}` : ""}`;
}

/** Builds the one-click subscription links for the main calendar apps. */
export function getCalendarSubscribeLinks(
  code: number,
  name: string,
  options: CalendarFeedOptions = {}
): CalendarSubscribeLinks {
  const https = getCalendarFeedUrl(code, options);
  const webcal = https.replace(/^https?:\/\//, "webcal://");

  return {
    https,
    webcal,
    google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
    outlook: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent(`${name} - CROUStillant`)}`,
  };
}
