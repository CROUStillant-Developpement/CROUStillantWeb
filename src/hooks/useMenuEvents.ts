"use client";

import { useEffect, useRef, useState } from "react";
import { buildEventsUrl, MENU_EVENT_TYPES, MenuEvent, MenuEventType } from "@/lib/events";

interface UseMenuEventsOptions {
  /** Restaurants to follow. No connection is opened while the list is empty. */
  codes: number[];
  types?: readonly MenuEventType[];
  enabled?: boolean;
  onEvent: (event: MenuEvent) => void;
}

/**
 * Subscribes to the API's real-time menu events (Server-Sent Events).
 *
 * The browser reconnects by itself after a network drop and resumes from the
 * last event it received, so no event is lost in between.
 *
 * @param codes - The restaurants to follow.
 * @param types - The event types to receive (every menu event by default).
 * @param enabled - Set to `false` to stay disconnected.
 * @param onEvent - Called for each event received.
 * @returns Whether the stream is currently connected.
 */
export function useMenuEvents({
  codes,
  types = MENU_EVENT_TYPES,
  enabled = true,
  onEvent,
}: UseMenuEventsOptions) {
  const [connected, setConnected] = useState(false);

  // Kept in a ref so a new callback identity does not reopen the connection.
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  // Arrays are compared by content: callers pass a fresh one on every render.
  const codesKey = [...codes].sort((a, b) => a - b).join(",");
  const typesKey = types.join(",");

  useEffect(() => {
    if (!enabled || codesKey === "" || typeof EventSource === "undefined") return;

    const eventTypes = typesKey.split(",") as MenuEventType[];
    const source = new EventSource(buildEventsUrl(codesKey.split(",").map(Number), eventTypes));

    const handleEvent = (message: MessageEvent<string>) => {
      try {
        onEventRef.current(JSON.parse(message.data) as MenuEvent);
      } catch {
        // A malformed event is not worth breaking the page for
      }
    };

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    eventTypes.forEach((type) => source.addEventListener(type, handleEvent));

    return () => {
      source.close();
      setConnected(false);
    };
  }, [enabled, codesKey, typesKey]);

  return { connected };
}
