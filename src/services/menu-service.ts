import { Menu, DateMenu, ApiResult } from "./types";
import { apiRequest } from "./api-request";

interface MenuRequestOptions {
  /** Ignores a cached response older than this many milliseconds (see `apiRequest`). */
  maxAge?: number;
}

/**
 * Gets menu by restaurant ID
 * @param restaurantId - Restaurant ID
 * @param options - Request options
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getMenuByRestaurantId(
  restaurantId: number,
  options: MenuRequestOptions = {}
): Promise<ApiResult<Menu[]>> {
  return apiRequest<Menu[]>({
    endpoint: `restaurants/${restaurantId}/menu`,
    method: "GET",
    cacheDuration: 300000, // 5 minutes in milliseconds
    maxAge: options.maxAge,
  });
}

/**
 * Gets dates where a menu is available
 * @param restaurantId - Restaurant ID
 * @param options - Request options
 *
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function getDatesMenuAvailable(
  restaurantId: number,
  options: MenuRequestOptions = {}
): Promise<ApiResult<DateMenu[]>> {
  return apiRequest<DateMenu[]>({
    endpoint: `restaurants/${restaurantId}/menu/dates/all`,
    method: "GET",
    cacheDuration: 1800000, // 30 minutes in milliseconds
    maxAge: options.maxAge,
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
    cacheDuration: 300000, // 5 minutes in milliseconds
  });
}

/**
 * Gets menu by restaurant ID and date
 * @param restaurantId - Restaurant ID
 * @param date - Date in DD-MM-YYYY format
 * @param options - Request options
 * @returns A promise that resolves to ApiResult containing either data or error
 * */
export async function getMenuByRestaurantIdAndDate(
  restaurantId: number,
  date: string,
  options: MenuRequestOptions = {}
): Promise<ApiResult<Menu | null>> {
  return apiRequest<Menu | null>({
    endpoint: `restaurants/${restaurantId}/menu/${date}`,
    method: "GET",
    cacheDuration: 1800000, // 30 minutes in milliseconds
    maxAge: options.maxAge,
  });
}
