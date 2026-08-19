"use client";

import { useEffect } from "react";
import { useUserPreferences } from "@/store/userPreferencesStore";

/**
 * Syncs accessibility preferences (high contrast, reduced motion, reading
 * spacing, text size) from the user preferences store onto <html>, so the
 * matching CSS in globals.css can apply site-wide.
 */
export default function AccessibilityProvider() {
  const { highContrast, reducedMotion, readingSpacing, textSize } =
    useUserPreferences();

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.classList.toggle("reading-spacing", readingSpacing);
  }, [readingSpacing]);

  useEffect(() => {
    document.documentElement.setAttribute("data-text-size", textSize);
  }, [textSize]);

  return null;
}
