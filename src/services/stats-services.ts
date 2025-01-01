import { Tache, GlobalStats, ApiResult } from "./types";
import { apiRequest } from "./api-requets";

/**
 * Fetches a list of taches from the API.
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

// Cache object
let githubStarsCache: {
  stars: number;
  timestamp: number;
} | null = null;

export const getGithubStarCount = async (): Promise<number> => {
  // Cache expiration time (2 hours in milliseconds)
  const cacheExpirationTime = 2 * 60 * 60 * 1000;

  let stars = 0;
  const repos = [
    "CROUStillant-Developpement/CROUStillant",
    "CROUStillant-Developpement/CROUStillantWeb",
    "CROUStillant-Developpement/CROUStillantAPI",
  ];

  for (const repo of repos) {
    const response = await apiRequest<any>({
      endpoint: `https://api.github.com/repos/${repo}`,
      method: "GET",
      cacheDuration: cacheExpirationTime,
    });

    if (!response.success) {
      console.error(`Failed to fetch for: ${repo}`);
      continue;
    }

    stars += response.data.stargazers_count;
  }

  return stars;
};
