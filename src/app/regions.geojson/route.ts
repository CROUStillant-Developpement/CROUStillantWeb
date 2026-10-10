import { NextResponse } from "next/server";
import { getRegionsGeoJSON } from "@/services/region-service";

export const dynamic = "force-dynamic";

/**
 * Boundaries of the CROUS regions, for the maps.
 *
 * The file weighs over 2 MB. It used to be passed to the map components as a
 * prop, which inlined it in the HTML of the home and restaurants pages for
 * every visitor, whether or not they ever looked at a map. The maps now fetch
 * it from here when they are displayed (see `useRegionsGeoJson`).
 */
export async function GET() {
  const result = await getRegionsGeoJSON();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json(result.data, {
    headers: {
      // The boundaries only change when a CROUS is reorganised.
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
