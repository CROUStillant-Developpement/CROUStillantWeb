// Base URL of the API as seen from the browser. Everything else reaches the API
// through server actions; the event stream is the one thing the browser opens
// itself, since a long-lived connection cannot go through a server action.
export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.croustillant.menu/v1";

export const MENU_EVENT_TYPES = ["menu.created", "menu.updated", "menu.deleted"] as const;

export type MenuEventType = (typeof MENU_EVENT_TYPES)[number];

// Event sent by GET /evenements (Server-Sent Events).
export interface MenuEvent {
  id: number;
  type: MenuEventType;
  code: number; // Restaurant identifier
  date: string | null; // Menu date, "DD-MM-YYYY"
  menu: number | null; // Menu identifier
  creation: string; // "DD-MM-YYYY HH:MM:SS"
}

/**
 * Builds the URL of the event stream for the given restaurants.
 *
 * @param codes - The restaurants to follow.
 * @param types - The event types to receive.
 * @returns The stream URL.
 */
export function buildEventsUrl(
  codes: number[],
  types: readonly MenuEventType[] = MENU_EVENT_TYPES
): string {
  const params = new URLSearchParams({
    code: codes.join(","),
    types: types.join(","),
  });

  return `${PUBLIC_API_URL}/evenements?${params.toString()}`;
}
