import { Tache, GlobalStats, ApiResult, Plat } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Fetches a list of tasks from the API.
 *
 * @returns {Promise<ApiResult<Tache[]>>} A promise that resolves to an ApiResult containing an array of Tache objects.
 */
export async function getTaches(): Promise<ApiResult<Tache[]>> {
  return await apiRequest<Tache[]>({
    endpoint: "taches",
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
 * Fetches the top 100 dishes from the API.
 *
 * @returns {Promise<ApiResult<Plat[]>>} A promise that resolves to an ApiResult containing an array of Plat objects.
 */
export const getTop100Dishes = async (): Promise<ApiResult<Plat[]>> => {
  return await apiRequest<Plat[]>({
    endpoint: "plats/top",
    method: "GET",
  });
};

/**
 * Fetches the last 100 dishes from the API.
 *
 * @returns {Promise<ApiResult<Plat[]>>} A promise that resolves to an ApiResult containing an array of Plat objects.
 */
export const getLast100Dishes = async (): Promise<ApiResult<Plat[]>> => {
  return await apiRequest<Plat[]>({
    endpoint: "plats",
    method: "GET",
  });
};



