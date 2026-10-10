import { ApiResult } from "./types";

// Services marked "use server" are server actions: the browser can call them
// with any arguments it likes, whatever their TypeScript types say. Anything
// that ends up in a URL is checked with these first.

/**
 * Checks that a value is a restaurant identifier (a positive integer).
 */
export function isRestaurantId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

/**
 * Checks that a value is a date in the API's "DD-MM-YYYY" format.
 */
export function isApiDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{2}-\d{2}-\d{4}$/.test(value);
}

/**
 * Result returned instead of calling the API with an invalid argument.
 */
export function invalidArgument(name: string): ApiResult<never> {
  return { success: false, error: `Invalid ${name}`, status: 400 };
}
