import { Region, ApiResult } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Fetches a list of regions from the API.
 *
 * @returns {Promise<ApiResult<Region[]>>} A promise that resolves to an ApiResult containing an array of Region objects.
 */
export async function getRegions(): Promise<ApiResult<Region[]>> {
  return await apiRequest<Region[]>({
    endpoint: "regions",
    method: "GET",
  });
}
