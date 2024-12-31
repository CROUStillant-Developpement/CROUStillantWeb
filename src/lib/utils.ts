import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Restaurant, Position } from "@/services/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const getGithubStarCount = async () => {
  let stars = 0;
  const repos = [
    "https://api.github.com/repos/CROUStillant-Developpement/CROUStillant",
    "https://api.github.com/repos/CROUStillant-Developpement/CROUStillantWeb",
    "https://api.github.com/repos/CROUStillant-Developpement/CROUStillantAPI",
  ];

  for (const repo of repos) {
    const response = await fetch(repo);

    if (!response.ok) {
      console.error(`Failed to fetch for: ${repo}`);
      continue;
    }

    const data = await response.json();

    stars += data.stargazers_count;
  }

  return stars;
};

export const getGeoLocation = async (): Promise<Position | null> => {
  if ("geolocation" in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } else {
    return null;
  }
};

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

export const formatToISODate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-");
  const isoDateString = `${year}-${month}-${day}T00:00:00Z`; // Convert to "2024-12-30"
  return new Date(isoDateString);
};

export const normalizeToDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};