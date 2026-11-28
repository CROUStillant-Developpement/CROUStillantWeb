"use server";

import { ApiResult, PlatCanonique, PlatCanoniqueStats } from "./types";
import { apiRequest } from "./api-request";

/**
 * Fetches a canonical dish and a few of the raw labels naming it.
 *
 * @param code - The canonical dish identifier.
 */
export async function getCanonicalDish(code: number): Promise<ApiResult<PlatCanonique>> {
  return await apiRequest<PlatCanonique>({
    endpoint: `plats/canoniques/${code}`,
    method: "GET",
  });
}

/**
 * Fetches where and when a canonical dish is served.
 *
 * @param code - The canonical dish identifier.
 */
export async function getCanonicalDishStats(code: number): Promise<ApiResult<PlatCanoniqueStats>> {
  return await apiRequest<PlatCanoniqueStats>({
    endpoint: `plats/canoniques/${code}/stats`,
    method: "GET",
  });
}
