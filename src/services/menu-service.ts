import { Menu, DateMenu, ApiResult } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Gets menu by restaurant ID
 * @param restaurantId - Restaurant ID
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getMenuByRestaurantId(
  restaurantId: number
): Promise<ApiResult<Menu[]>> {
  return apiRequest<Menu[]>({
    endpoint: `restaurants/${restaurantId}/menu`,
    method: "GET",
  });
}

/**
 * Gets dates where a menu is available
 * @param restaurantId - Restaurant ID
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getDatesMenuAvailable(
  restaurantId: number
): Promise<ApiResult<DateMenu[]>> {
  return apiRequest<DateMenu[]>({
    endpoint: `restaurants/${restaurantId}/menu/dates/all`,
    method: "GET",
  });
}

/**
 * Gets future dates where a menu is available
 * @param restaurantId - Restaurant ID
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getFutureDatesMenuAvailable(
  restaurantId: number
): Promise<ApiResult<DateMenu[]>> {
  return apiRequest<DateMenu[]>({
    endpoint: `restaurants/${restaurantId}/menu/dates`,
    method: "GET",
  });
}
