import { RegionGeoJSON } from "@/services/types";

export type TerritoryKey =
  | "mainland"
  | "guadeloupe"
  | "martinique"
  | "guyane"
  | "reunion"
  | "mayotte";

/**
 * The territories drawn as separate maps, each with the window
 * ([west, south, east, north], in degrees) its polygons fall in.
 *
 * France cannot be drawn to scale on one map: Réunion is 9,000 km from Paris.
 * A CROUS can also span several territories (Antilles-Guyane covers
 * Guadeloupe, Martinique and Guyane), which is why the split is made on where
 * a polygon is rather than on which region it belongs to.
 */
const TERRITORIES: { key: TerritoryKey; bounds: [number, number, number, number] }[] = [
  { key: "mainland", bounds: [-6, 41, 10, 52] },
  { key: "guadeloupe", bounds: [-62, 15.7, -60.9, 16.6] },
  { key: "martinique", bounds: [-61.3, 14.3, -60.7, 15] },
  { key: "guyane", bounds: [-55, 2, -51, 6] },
  { key: "reunion", bounds: [55, -21.5, 56, -20.8] },
  { key: "mayotte", bounds: [44.9, -13.1, 45.4, -12.5] },
];

// Longest side of each map, in SVG user units.
const MAP_SIZE = 400;

export interface TerritoryRegion {
  /** `crous_id`, which matches `Region.code`. */
  id: number;
  name: string;
  /** SVG path data, to be filled with the even-odd rule. */
  path: string;
}

export interface TerritoryMap {
  key: TerritoryKey;
  width: number;
  height: number;
  regions: TerritoryRegion[];
}

type Polygon = GeoJSON.Position[][];

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * Turns the regions GeoJSON into one small SVG map per territory.
 *
 * Each map is projected on its own (equirectangular, corrected for its
 * latitude) and scaled to fill `MAP_SIZE`, so Mayotte ends up as legible as the
 * mainland. Territories with no polygon are left out.
 */
export function buildTerritoryMaps(geojson: RegionGeoJSON): TerritoryMap[] {
  return TERRITORIES.flatMap(({ key, bounds: [west, south, east, north] }) => {
    const regions = geojson.features.flatMap((feature) => {
      const polygons: Polygon[] =
        feature.geometry.type === "Polygon"
          ? [feature.geometry.coordinates]
          : feature.geometry.coordinates;

      const inside = polygons.filter((polygon) => {
        const [lng, lat] = polygon[0][0];
        return lng >= west && lng <= east && lat >= south && lat <= north;
      });

      return inside.length > 0 ? [{ feature, polygons: inside }] : [];
    });

    if (regions.length === 0) return [];

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;
    for (const { polygons } of regions) {
      for (const polygon of polygons) {
        for (const [lng, lat] of polygon[0]) {
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      }
    }

    // A degree of longitude shrinks with latitude; without this the mainland
    // would come out nearly half as wide again as it should.
    const lngRatio = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
    const spanX = (maxLng - minLng) * lngRatio;
    const spanY = maxLat - minLat;
    const scale = MAP_SIZE / Math.max(spanX, spanY);

    const project = ([lng, lat]: GeoJSON.Position) =>
      `${round((lng - minLng) * lngRatio * scale)},${round((maxLat - lat) * scale)}`;

    return [
      {
        key,
        width: round(spanX * scale),
        height: round(spanY * scale),
        regions: regions.map(({ feature, polygons }) => ({
          id: feature.properties.crous_id,
          name: feature.properties.crous_libelle,
          path: polygons
            .flatMap((polygon) =>
              polygon.map((ring) => `M${ring.map(project).join("L")}Z`)
            )
            .join(""),
        })),
      },
    ];
  });
}
