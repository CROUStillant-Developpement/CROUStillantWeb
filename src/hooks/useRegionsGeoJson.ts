"use client";

import { useEffect, useState } from "react";
import { RegionGeoJSON } from "@/services/types";

// Shared by every map on the page, and kept across client-side navigations.
let request: Promise<RegionGeoJSON | null> | null = null;

function loadRegionsGeoJson(): Promise<RegionGeoJSON | null> {
  if (!request) {
    request = fetch("/regions.geojson")
      .then((res) => (res.ok ? (res.json() as Promise<RegionGeoJSON>) : null))
      .catch(() => null);
    // A failure must not stick for the whole session.
    request.then((data) => {
      if (!data) request = null;
    });
  }
  return request;
}

/**
 * Custom React hook to fetch the boundaries of the CROUS regions (GeoJSON).
 *
 * The overlay is a decoration on the maps, so a failure degrades to a map
 * without regions instead of an error.
 *
 * @returns The regions FeatureCollection, or null while loading or on failure.
 */
export function useRegionsGeoJson(): RegionGeoJSON | null {
  const [regionsGeoJson, setRegionsGeoJson] = useState<RegionGeoJSON | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadRegionsGeoJson().then((data) => {
      if (!cancelled) setRegionsGeoJson(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return regionsGeoJson;
}
