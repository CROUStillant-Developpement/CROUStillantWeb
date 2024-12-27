import { Restaurant, ApiResult } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Fetches a list of restaurants from the API.
 *
 * @returns {Promise<ApiResult<Restaurant[]>>} A promise that resolves to an ApiResult containing an array of Restaurant objects.
 */
export async function getRestaurants(): Promise<ApiResult<Restaurant[]>> {
  return await apiRequest<Restaurant[]>({
    endpoint: "restaurants",
    method: "GET",
  });
}

/**
 * Fetches a single restaurant from the API.
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
  });
}
