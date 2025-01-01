import { Restaurant, ApiResult } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Fetches a list of restaurants with caching for 5 minutes.
 *
 * @returns {Promise<ApiResult<Restaurant[]>>} A promise that resolves to an ApiResult containing an array of Restaurant objects.
 */
export async function getRestaurants(): Promise<ApiResult<Restaurant[]>> {
  return await apiRequest<Restaurant[]>({
    endpoint: "restaurants",
    method: "GET",
    cacheDuration: 300000, // 5 minutes in milliseconds
  });
}

/**
 * Fetches a single restaurant by its code with caching for 5 minutes.
 *
 * @param {string} code The code of the restaurant to fetch.
 * @returns {Promise<ApiResult<Restaurant>>} A promise that resolves to an ApiResult containing a Restaurant object.
 */
export async function getRestaurant(
  code: string
): Promise<ApiResult<Restaurant>> {
  return await apiRequest<Restaurant>({
    endpoint: `restaurants/${code}`,
    method: "GET",
    cacheDuration: 300000, // 5 minutes in milliseconds
  });
}

/**
 * Fetches a list of restaurants from a region with caching for 1 minute.
 *
 * @param {string} region The region to fetch the restaurants from.
 * @returns {Promise<ApiResult<Restaurant[]>>} A promise that resolves to an ApiResult containing an array of Restaurant objects.
 */
export async function getRestaurantsByRegion(
  region: string
): Promise<ApiResult<Restaurant[]>> {
  return await apiRequest<Restaurant[]>({
    endpoint: `regions/${region}/restaurants`,
    method: "GET",
    cacheDuration: 60000, // 1 minute in milliseconds
  });
}
