"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during the server render and the hydration pass, `true` afterwards.
 *
 * Lets a component wait before showing anything read from localStorage, which
 * the server render cannot know about and would otherwise mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
