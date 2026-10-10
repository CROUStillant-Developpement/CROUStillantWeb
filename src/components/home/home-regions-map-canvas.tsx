"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Map as MapGL, MapRegionLayer, useResolvedTheme } from "@/components/ui/map";
import { RegionGeoJSONProperties } from "@/services/types";
import { useRegionsGeoJson } from "@/hooks/useRegionsGeoJson";

const FRANCE_CENTER: [number, number] = [2.5, 46.6];
const FRANCE_ZOOM = 4.2;

/**
 * Resolves a CSS custom property (e.g. "--foreground") to an `hsl(...)`
 * string, re-read whenever the theme changes so the map overlay always
 * matches the current light/dark palette instead of a hardcoded color.
 */
function useThemeColor(cssVariable: string): string | undefined {
  const resolvedTheme = useResolvedTheme();
  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVariable)
      .trim();
    if (value) setColor(`hsl(${value})`);
  }, [cssVariable, resolvedTheme]);

  return color;
}

/**
 * The map itself, split from `HomeRegionsMap` so that maplibre-gl is only
 * downloaded once the section scrolls into view.
 */
export default function HomeRegionsMapCanvas() {
  const router = useRouter();
  const locale = useLocale();
  const borderColor = useThemeColor("--foreground");
  const regionsGeoJson = useRegionsGeoJson();

  const handleRegionClick = useCallback(
    (properties: RegionGeoJSONProperties) => {
      router.push(`/${locale}/restaurants?region=${properties.crous_id}`);
    },
    [router, locale],
  );

  return (
    <MapGL
      center={FRANCE_CENTER}
      zoom={FRANCE_ZOOM}
      minZoom={3}
      maxZoom={7}
      scrollZoom={false}
      className="rounded-[2rem]"
    >
      {regionsGeoJson && (
        <MapRegionLayer<RegionGeoJSONProperties>
          data={regionsGeoJson}
          idProperty="crous_id"
          color={borderColor}
          fillOpacity={0.05}
          selectedFillOpacity={0.05}
          lineWidth={1.2}
          selectedLineWidth={1.2}
          onFeatureClick={handleRegionClick}
        />
      )}
    </MapGL>
  );
}
