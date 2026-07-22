import { RestaurantActivity, ApiResult } from "./types";
import { apiRequest } from "./api-request";

/**
 * Gets activity (last updated, ingestion history) for a restaurant
 * @param restaurantId - Restaurant ID
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getRestaurantActivity(
  restaurantId: number
): Promise<ApiResult<RestaurantActivity>> {
  return apiRequest<RestaurantActivity>({
    endpoint: `restaurants/${restaurantId}/activity`,
    method: "GET",
    cacheDuration: 900000, // 15 minutes in milliseconds, matches the API's cache TTL
  });
}
