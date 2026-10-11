const SENT_STORAGE_KEY = "dish-notifications-sent";
const MAX_SENT_KEYS = 200;

/**
 * Whether this browser can show notifications at all (iOS Safari, for
 * instance, only can once the site is installed on the home screen).
 */
export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Keeps the keys that have not been notified yet, and records them as sent.
 *
 * The record lives in localStorage, so a dish is announced once even when the
 * site is open in several tabs or the same menu is updated several times.
 *
 * @param keys - One key per notification candidate.
 * @returns The keys that were not sent before.
 */
export function claimUnsentKeys(keys: string[]): string[] {
  let sent: string[] = [];
  try {
    const stored = JSON.parse(localStorage.getItem(SENT_STORAGE_KEY) ?? "[]");
    if (Array.isArray(stored)) sent = stored.filter((key) => typeof key === "string");
  } catch {
    // Unreadable record: start over rather than never notify again
  }

  const alreadySent = new Set(sent);
  const unsent = [...new Set(keys)].filter((key) => !alreadySent.has(key));
  if (unsent.length === 0) return [];

  try {
    localStorage.setItem(
      SENT_STORAGE_KEY,
      JSON.stringify([...sent, ...unsent].slice(-MAX_SENT_KEYS))
    );
  } catch {
    // Storage full or blocked: the notification is still worth showing
  }

  return unsent;
}

interface DishNotification {
  title: string;
  body: string;
  /** Notifications sharing a tag replace each other instead of piling up. */
  tag: string;
  /** Page opened when the notification is clicked. */
  url: string;
}

/**
 * Shows a browser notification.
 *
 * Goes through the service worker when there is one: it is the only way that
 * works on Android, and it lets the click be handled even after this page is
 * gone. Falls back to a plain notification otherwise (in development, or in
 * browsers without service workers).
 */
export async function showDishNotification({ title, body, tag, url }: DishNotification) {
  if (!notificationsSupported() || Notification.permission !== "granted") return;

  const options: NotificationOptions = {
    body,
    tag,
    icon: "/icons/icon-192.png",
    data: { url },
  };

  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
  } catch {
    // Fall through to the plain notification
  }

  try {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      window.location.assign(url);
      notification.close();
    };
  } catch {
    // Some browsers only allow notifications from a service worker
  }
}
