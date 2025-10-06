import { Tache, GlobalStats, ApiResult, GithubRepo, Plat } from "./types";
import { apiRequest } from "./api-requets";
import log from "@/lib/log";

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
 * Fetches the total star count from multiple GitHub repositories.
 *
 * @returns {Promise<number>} A promise that resolves to the total number of stars across the specified repositories.
 *
 * @remarks
 * This function fetches the star count for the following repositories:
 * - CROUStillant-Developpement/CROUStillant
 * - CROUStillant-Developpement/CROUStillantAPI
 * - CROUStillant-Developpement/CROUStillantWeb
 *
 * The results are cached for 2 hours to reduce the number of API requests.
 *
 * @example
 * ```typescript
 * const totalStars = await getGithubStarCount();
 * log.info(`Total stars: ${totalStars}`);
 * ```
 */
export const getGithubStarCount = async (): Promise<number> => {
  // Cache expiration time (2 hours in milliseconds)
  const cacheExpirationTime = 2 * 60 * 60 * 1000;

  let stars = 0;
  const repos = [
    "CROUStillant-Developpement/CROUStillant",
    "CROUStillant-Developpement/CROUStillantAPI",
    "CROUStillant-Developpement/CROUStillantWeb",
  ];

  for (const repo of repos) {
    const response = await apiRequest<GithubRepo>({
      endpoint: `repos/${repo}`,
      method: "GET",
      cacheDuration: cacheExpirationTime,
      api_url: "https://api.github.com",
      check_success: false,
    });

    if (!response.success) {
      log.error([`Failed to fetch for: ${repo}`], "dev");
      continue;
    }

    // only in debug mode
    log.info([`Fetched ${repo} with ${response.data.stargazers_count} stars`], "dev");

    stars += response.data.stargazers_count;
  }

  return stars;
};

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



