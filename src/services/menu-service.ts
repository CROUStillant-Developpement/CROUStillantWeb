"use server";

import { Menu, DateMenu, ApiResult } from "./types";
import { apiRequest } from "./api-request";
import { invalidArgument, isApiDate, isRestaurantId } from "./validation";

interface MenuRequestOptions {
  /**
   * Ignores a cached response older than a few seconds. Used when the API has
   * just reported a change.
   */
  fresh?: boolean;
}

// A refresh follows an event every open page receives at the same moment:
// accepting a response cached a few seconds ago lets them share one API call.
// The value is set here, not by the caller: callers are browsers, and letting
// them pick it would let them bypass the cache on every request.
const FRESH_MAX_AGE = 10 * 1000; // 10 seconds in milliseconds

const maxAge = (options: MenuRequestOptions) =>
  options?.fresh === true ? FRESH_MAX_AGE : undefined;

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
  if (!isRestaurantId(restaurantId)) return invalidArgument("restaurantId");

  return apiRequest<Menu[]>({
    endpoint: `restaurants/${restaurantId}/menu`,
    method: "GET",
    cacheDuration: 300000, // 5 minutes in milliseconds
    maxAge: maxAge(options),
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
  if (!isRestaurantId(restaurantId)) return invalidArgument("restaurantId");

  return apiRequest<DateMenu[]>({
    endpoint: `restaurants/${restaurantId}/menu/dates/all`,
    method: "GET",
    cacheDuration: 1800000, // 30 minutes in milliseconds
    maxAge: maxAge(options),
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
  if (!isRestaurantId(restaurantId)) return invalidArgument("restaurantId");

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
  if (!isRestaurantId(restaurantId)) return invalidArgument("restaurantId");
  if (!isApiDate(date)) return invalidArgument("date");

  return apiRequest<Menu | null>({
    endpoint: `restaurants/${restaurantId}/menu/${date}`,
    method: "GET",
    cacheDuration: 1800000, // 30 minutes in milliseconds
    maxAge: maxAge(options),
  });
}
