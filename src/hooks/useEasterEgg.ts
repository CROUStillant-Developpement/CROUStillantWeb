"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KONAMI_CODE } from "@/lib/dish-duel";

/** Elements carrying this attribute unlock the game when tapped repeatedly. */
export const EASTER_EGG_TRIGGER_ATTRIBUTE = "data-easter-egg";

const TAPS_TO_UNLOCK = 7;
const TAP_WINDOW_MS = 1200;

/** Typing in one of these means the keystroke belongs to the user, not to us. */
const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable='true']";

/**
 * Detects the two hidden ways of unlocking the dish duel: the Konami code on a
 * keyboard, and repeated quick taps on any element marked with
 * `data-easter-egg` (the only route available on touch devices).
 *
 * Progress is kept in refs and the listeners are removed once unlocked, so an
 * idle page pays for two early-returning document listeners and nothing else —
 * no re-render happens until the game is actually opened.
 *
 * @returns Whether the game is unlocked, and a callback to close it again.
 */
export function useEasterEgg() {
  const [unlocked, setUnlocked] = useState(false);
  const konamiProgress = useRef(0);
  const taps = useRef({ count: 0, last: 0 });

  useEffect(() => {
    if (unlocked) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (target instanceof Element && target.closest(EDITABLE_SELECTOR)) return;

      // Single characters are compared case-insensitively ("B" is still "b"),
      // named keys such as "ArrowUp" are already normalised.
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === KONAMI_CODE[konamiProgress.current]) {
        konamiProgress.current += 1;

        if (konamiProgress.current === KONAMI_CODE.length) {
          konamiProgress.current = 0;
          setUnlocked(true);
        }
        return;
      }

      // A wrong key may still be the first key of a fresh attempt.
      konamiProgress.current = key === KONAMI_CODE[0] ? 1 : 0;
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(`[${EASTER_EGG_TRIGGER_ATTRIBUTE}]`)
      ) {
        return;
      }

      const now = Date.now();
      const count = now - taps.current.last <= TAP_WINDOW_MS ? taps.current.count + 1 : 1;
      taps.current = { count, last: now };

      if (count >= TAPS_TO_UNLOCK) {
        taps.current = { count: 0, last: 0 };
        setUnlocked(true);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [unlocked]);

  const close = useCallback(() => setUnlocked(false), []);

  return { unlocked, close };
}
