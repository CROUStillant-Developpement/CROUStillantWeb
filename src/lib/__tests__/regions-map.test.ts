import { describe, expect, it } from "vitest";
import { buildTerritoryMaps } from "@/lib/regions-map";
import { RegionGeoJSON } from "@/services/types";

type Ring = [number, number][];

const square = (west: number, south: number, size: number): Ring => [
  [west, south],
  [west + size, south],
  [west + size, south + size],
  [west, south + size],
  [west, south],
];

const feature = (crous_id: number, crous_libelle: string, polygons: Ring[][]) => ({
  type: "Feature" as const,
  properties: {
    crous_id,
    crous_libelle,
    crous_slug: crous_libelle.toLowerCase(),
    crous_nom: crous_libelle,
    departements: [],
    credit: "",
  },
  geometry: { type: "MultiPolygon" as const, coordinates: polygons },
});

const geojson = (...features: ReturnType<typeof feature>[]): RegionGeoJSON => ({
  type: "FeatureCollection",
  features,
});

describe("buildTerritoryMaps", () => {
  it("draws a region spanning several territories on each of them", () => {
    const maps = buildTerritoryMaps(
      geojson(
        feature(1, "Lyon", [[square(4, 45, 1)]]),
        feature(8, "Antilles-Guyane", [
          [square(-61.5, 16, 0.2)], // Guadeloupe
          [square(-61, 14.5, 0.2)], // Martinique
          [square(-54, 3, 2)], // Guyane
        ])
      )
    );

    expect(maps.map((map) => [map.key, map.regions.map((r) => r.id)])).toEqual([
      ["mainland", [1]],
      ["guadeloupe", [8]],
      ["martinique", [8]],
      ["guyane", [8]],
    ]);
  });

  it("scales every territory to the same size, whatever its real extent", () => {
    const [mainland, mayotte] = buildTerritoryMaps(
      geojson(
        feature(1, "Lyon", [[square(0, 43, 6)]]),
        feature(29, "La Réunion", [[square(45.1, -12.9, 0.2)]])
      )
    );

    expect(mainland.key).toBe("mainland");
    expect(mayotte.key).toBe("mayotte");
    expect(mainland.height).toBe(400);
    expect(mayotte.height).toBe(400);
  });

  it("corrects longitudes for the latitude and puts north at the top", () => {
    const [map] = buildTerritoryMaps(geojson(feature(1, "Lyon", [[square(2, 46, 2)]])));

    // 2° of longitude at 47°N is about 0.68 times 2° of latitude.
    expect(map.height).toBe(400);
    expect(map.width).toBeCloseTo(400 * Math.cos((47 * Math.PI) / 180), 0);
    // The first point is the south-west corner: left edge, bottom of the map.
    expect(map.regions[0].path.startsWith("M0,400L")).toBe(true);
    expect(map.regions[0].path.endsWith("Z")).toBe(true);
  });

  it("keeps holes as extra subpaths and skips territories without polygons", () => {
    const maps = buildTerritoryMaps(
      geojson(feature(1, "Lyon", [[square(2, 46, 2), square(2.5, 46.5, 1)]]))
    );

    expect(maps).toHaveLength(1);
    expect(maps[0].regions[0].path.match(/M/g)).toHaveLength(2);
  });
});
