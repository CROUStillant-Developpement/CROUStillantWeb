"use client";

import { useEffect, useState } from "react";
import { RegionGeoJSON } from "@/services/types";

type Variant = "full" | "optimised";

const URLS: Record<Variant, string> = {
  full: "/regions.geojson",
  optimised: "/regions.geojson?optimised=true",
};

// Shared by every map on the page, and kept across client-side navigations.
const requests: Partial<Record<Variant, Promise<RegionGeoJSON | null>>> = {};

function loadRegionsGeoJson(variant: Variant): Promise<RegionGeoJSON | null> {
  let request = requests[variant];

  if (!request) {
    request = fetch(URLS[variant])
      .then((res) => (res.ok ? (res.json() as Promise<RegionGeoJSON>) : null))
      .catch(() => null);
    requests[variant] = request;
    // A failure must not stick for the whole session.
    request.then((data) => {
      if (!data) delete requests[variant];
    });
  }

  return request;
}

/**
 * Custom React hook to fetch the boundaries of the CROUS regions (GeoJSON).
 *
 * The boundaries are a decoration on the maps, so a failure is reported as a
 * value for the caller to degrade on instead of being thrown.
 *
 * @param options.optimised - Fetch the simplified outlines (about 80 kB instead of 2.4 MB). Enough for an overview, too coarse for a map that zooms in.
 * @param options.enabled - Set to false to hold the request back, e.g. until the map scrolls into view.
 * @returns The regions FeatureCollection, `undefined` while loading, or `null` if it could not be fetched.
 */
export function useRegionsGeoJson({
  optimised = false,
  enabled = true,
}: { optimised?: boolean; enabled?: boolean } = {}): RegionGeoJSON | null | undefined {
  const [regionsGeoJson, setRegionsGeoJson] = useState<RegionGeoJSON | null>();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    loadRegionsGeoJson(optimised ? "optimised" : "full").then((data) => {
      if (!cancelled) setRegionsGeoJson(data);
    });

    return () => {
      cancelled = true;
    };
  }, [optimised, enabled]);

  return regionsGeoJson;
}
