import { Changelog, ApiResult } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Get all changelog items
 *
 * @returns {Promise<Changelog>} A promise that resolves with the changelog items
 * @throws {Error} An error if the request fails
 */
export async function getChangelog(): Promise<ApiResult<Changelog>> {
  return apiRequest<Changelog>({
    endpoint: "interne/changelog",
    method: "GET",
    cacheDuration: 300000, // 5 minutes in milliseconds
  });
}
