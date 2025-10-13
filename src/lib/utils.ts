import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Restaurant, Position } from "@/services/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts one or more input strings into a URL-friendly slug.
 *
 * - Joins all arguments with a space.
 * - Normalizes accented characters to their base letters.
 * - Removes diacritical marks (accents).
 * - Converts to lowercase.
 * - Trims leading and trailing whitespace.
 * - Removes all non-alphanumeric characters except spaces.
 * - Replaces spaces with hyphens.
 *
 * @param args - One or more strings to be slugified.
 * @returns The slugified string.
 */
export const slugify = (...args: string[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

/**
 * Generates an array of `Date` objects representing each day between the given start and stop dates, excluding Saturdays and Sundays.
 *
 * @param startDate - The starting date of the range (inclusive).
 * @param stopDate - The ending date of the range (inclusive).
 * @returns An array of `Date` objects for each weekday in the specified range.
 */
export const getDates = (startDate: Date, stopDate: Date): Date[] => {
  const dateArray = [];
  let currentDate = startDate;

  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  // remove sunday and saturday
  return dateArray.filter((date) => date.getDay() !== 0 && date.getDay() !== 6);
};

/**
 * Retrieves the current geographic location of the user using the browser's Geolocation API.
 *
 * @returns A promise that resolves to a `Position` object containing the user's location,
 * or `null` if geolocation is not supported by the browser.
 *
 * @remarks
 * If geolocation is supported, the promise will resolve with the user's position or reject if
 * the location cannot be obtained (e.g., permission denied, timeout, or error).
 * If geolocation is not supported, the function returns `null`.
 */
export const getGeoLocation = async (): Promise<Position | null> => {
  if ("geolocation" in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    return null;
  }
};

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * specified by their latitude and longitude using the Haversine formula.
 *
 * @param lat1 - Latitude of the first point in decimal degrees.
 * @param lon1 - Longitude of the first point in decimal degrees.
 * @param lat2 - Latitude of the second point in decimal degrees.
 * @param lon2 - Longitude of the second point in decimal degrees.
 * @returns The distance between the two points in kilometers.
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Finds and returns a list of restaurants within a specified maximum distance from a given position.
 * 
 * The function filters the provided array of restaurants to include only those that have valid latitude and longitude
 * values and are within the `maxDistance` (in kilometers, regarding the implementation of `calculateDistance`)
 * from the specified position. The resulting list is sorted in ascending order of distance from the position.
 * 
 * @param restaurants - An array of `Restaurant` objects to search through.
 * @param position - The user's current position, containing latitude and longitude coordinates.
 * @param maxDistance - The maximum distance (in the same unit as used by `calculateDistance`) to consider for nearby restaurants.
 * @returns An array of `Restaurant` objects that are within the specified distance, sorted by proximity.
 */
export function findRestaurantsAroundPosition(
  restaurants: Restaurant[],
  position: Position,
  maxDistance: number
): Restaurant[] {
  const nearbyRestaurants: Restaurant[] = [];
  for (const restaurant of restaurants) {
    if (
      restaurant.latitude !== undefined &&
      restaurant.longitude !== undefined
    ) {
      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        restaurant.latitude!,
        restaurant.longitude!
      );
      if (distance <= maxDistance) {
        nearbyRestaurants.push(restaurant);
      }
    }
  }
  // Sort nearby restaurants based on distance
  nearbyRestaurants.sort((a, b) => {
    const distanceA = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      a.latitude!,
      a.longitude!
    );
    const distanceB = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      b.latitude!,
      b.longitude!
    );
    return distanceA - distanceB;
  });
  return nearbyRestaurants;
}


/**
 * Converts a date string in "DD-MM-YYYY" format to a JavaScript `Date` object in ISO format.
 *
 * @param dateString - The date string to convert, expected in "DD-MM-YYYY" format.
 * @returns A `Date` object representing the parsed date in UTC.
 *
 * @example
 * ```typescript
 * const date = formatToISODate("30-12-2024");
 * // date => new Date("2024-12-30T00:00:00Z")
 * ```
 */
export const formatToISODate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-");
  const isoDateString = `${year}-${month}-${day}T00:00:00Z`; // Convert to "2024-12-30"
  return new Date(isoDateString);
};

/**
 * Normalizes a given Date object by removing the time components (hours, minutes, seconds, milliseconds).
 * Returns a new Date instance set to midnight (00:00:00.000) of the same year, month, and day.
 *
 * @param date - The Date object to normalize.
 * @returns A new Date object representing the same year, month, and day at midnight.
 */
export const normalizeToDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};