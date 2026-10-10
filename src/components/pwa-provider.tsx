"use client";

import { useEffect } from "react";
import usePwaStore, { BeforeInstallPromptEvent } from "@/store/pwaStore";

/**
 * Registers the service worker (public/sw.js) and captures the browser's
 * install prompt for the settings page.
 */
export default function PwaProvider() {
  const setInstallPrompt = usePwaStore((state) => state.setInstallPrompt);

  useEffect(() => {
    // Not in development: cached bundles would fight with hot reloading.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const wasControlled = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        // This page loaded before the worker existed, so the worker saw none
        // of its requests: report them, or the page would not open offline.
        if (wasControlled) return;
        registration.active?.postMessage({
          type: "CACHE_URLS",
          page: window.location.href,
          assets: performance
            .getEntriesByType("resource")
            .map((entry) => entry.name),
        });
      })
      .catch(() => {
        // The site works without it — ignore silently
      });
  }, []);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setInstallPrompt]);

  return null;
}
