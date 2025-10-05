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
    cacheDuration: 300000, // 5 minutes in milliseconds
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

/**
 * Gets menu by restaurant ID and date
 * @param restaurantId - Restaurant ID
 * @param date - Date in ISO format (format: DD-MM-YYYY)
 * @returns A promise that resolves to ApiResult containing either data or error
 * */
export async function getMenuByRestaurantIdAndDate(
  restaurantId: number,
  date: string
): Promise<ApiResult<Menu | null>> {
  return apiRequest<Menu | null>({
    endpoint: `restaurants/${restaurantId}/menu/${date}`,
    method: "GET",
  });
}
