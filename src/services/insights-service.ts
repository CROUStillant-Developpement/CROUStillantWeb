import { RestaurantInsights, ApiResult } from "./types";
import { apiRequest } from "./api-request";

/**
 * Gets insights (menu coverage and most frequent dishes) for a restaurant
 * @param restaurantId - Restaurant ID
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getRestaurantInsights(
  restaurantId: number
): Promise<ApiResult<RestaurantInsights>> {
  return apiRequest<RestaurantInsights>({
    endpoint: `restaurants/${restaurantId}/insights`,
    method: "GET",
    cacheDuration: 1800000, // 30 minutes in milliseconds, matches the API's cache TTL
  });
}
