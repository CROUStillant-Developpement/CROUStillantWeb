"use server";

import {
  Tache,
  GlobalStats,
  ApiResult,
  Plat,
  RegionStats,
  ApiUsageStats,
  ApiUsageDay,
  BotStats,
  BotStatsDay,
  GeoStats,
  DataFreshness,
} from "./types";
import { apiRequest } from "./api-request";

/**
 * Fetches a list of tasks from the API.
 *
 * @returns {Promise<ApiResult<Tache[]>>} A promise that resolves to an ApiResult containing an array of Tache objects.
 */
export async function getTaches(): Promise<ApiResult<Tache[]>> {
  return await apiRequest<Tache[]>({
    endpoint: "taches?jours=30",
    method: "GET",
  });
}

/**
 * Fetches global stats from the API.
 *
 * @returns {Promise<ApiResult<GlobalStats>>} A promise that resolves to an ApiResult containing a GlobalStats object.
 */
export async function getGlobalStats(): Promise<ApiResult<GlobalStats>> {
  return await apiRequest<GlobalStats>({
    endpoint: "stats",
    method: "GET",
  });
}

/**
 * Fetches stats grouped by region from the API.
 *
 * @returns {Promise<ApiResult<RegionStats[]>>} A promise that resolves to an ApiResult containing an array of RegionStats objects.
 */
export async function getRegionStats(): Promise<ApiResult<RegionStats[]>> {
  return await apiRequest<RegionStats[]>({
    endpoint: "stats/regions",
    method: "GET",
  });
}

/**
 * Fetches the top 100 dishes from the API.
 *
 * @returns {Promise<ApiResult<Plat[]>>} A promise that resolves to an ApiResult containing an array of Plat objects.
 */
export async function getTop100Dishes(): Promise<ApiResult<Plat[]>> {
  return await apiRequest<Plat[]>({
    endpoint: "plats/top",
    method: "GET",
  });
}

/**
 * Fetches the last 100 dishes from the API.
 *
 * @returns {Promise<ApiResult<Plat[]>>} A promise that resolves to an ApiResult containing an array of Plat objects.
 */
export async function getLast100Dishes(): Promise<ApiResult<Plat[]>> {
  return await apiRequest<Plat[]>({
    endpoint: "plats",
    method: "GET",
  });
}

/**
 * Fetches how fresh the menus are: the last update task and recent activity.
 */
export async function getDataFreshness(): Promise<ApiResult<DataFreshness>> {
  return await apiRequest<DataFreshness>({
    endpoint: "stats/taches",
    method: "GET",
  });
}

/**
 * Fetches the public API usage since tracking started, with its busiest routes.
 */
export async function getApiUsage(): Promise<ApiResult<ApiUsageStats>> {
  return await apiRequest<ApiUsageStats>({
    endpoint: "stats/api",
    method: "GET",
  });
}

/**
 * Fetches the daily public API usage over the last 30 days.
 */
export async function getApiUsageHistory(): Promise<ApiResult<ApiUsageDay[]>> {
  return await apiRequest<ApiUsageDay[]>({
    endpoint: "stats/api/history?jours=30",
    method: "GET",
  });
}

/**
 * Fetches the Discord bot's status and current figures.
 */
export async function getBotStats(): Promise<ApiResult<BotStats>> {
  return await apiRequest<BotStats>({
    endpoint: "stats/bot",
    method: "GET",
  });
}

/**
 * Fetches the Discord bot's daily figures over the last 30 days.
 */
export async function getBotStatsHistory(): Promise<ApiResult<BotStatsDay[]>> {
  return await apiRequest<BotStatsDay[]>({
    endpoint: "stats/bot/history?jours=30",
    method: "GET",
  });
}

/**
 * Fetches the cities the site is most visited from.
 */
export async function getGeoStats(): Promise<ApiResult<GeoStats>> {
  return await apiRequest<GeoStats>({
    endpoint: "stats/geo",
    method: "GET",
  });
}
