import { Region, RegionGeoJSON, ApiResult } from "./types";
import { apiRequest } from "./api-request";

/**
 * Fetches a list of regions from the API.
 *
 * @returns {Promise<ApiResult<Region[]>>} A promise that resolves to an ApiResult containing an array of Region objects.
 */
export async function getRegions(): Promise<ApiResult<Region[]>> {
  return await apiRequest<Region[]>({
    endpoint: "regions",
    method: "GET",
    cacheDuration: 3600000, // 1 hour in milliseconds
  });
}

/**
 * Fetches the geographic boundaries (GeoJSON) of the 26 CROUS regions from the API.
 * The endpoint returns a raw FeatureCollection (no {success, data} envelope), hence check_success: false.
 *
 * @returns {Promise<ApiResult<RegionGeoJSON>>} A promise that resolves to an ApiResult containing the regions FeatureCollection.
 */
export async function getRegionsGeoJSON(): Promise<ApiResult<RegionGeoJSON>> {
  return await apiRequest<RegionGeoJSON>({
    endpoint: "regions/geojson",
    method: "GET",
    cacheDuration: 3600000, // 1 hour in milliseconds — static file server-side
    check_success: false,
  });
}
