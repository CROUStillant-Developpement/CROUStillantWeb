import { Tache, GlobalStats, ApiResult, GithubRepo } from "./types";
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

export const getGithubStarCount = async (): Promise<number> => {
  // Cache expiration time (2 hours in milliseconds)
  const cacheExpirationTime = 2 * 60 * 60 * 1000;

  let stars = 0;
  const repos = [
    "CROUStillant-Developpement/CROUStillant",
  ];

  for (const repo of repos) {
    const response = await apiRequest<GithubRepo>({
      endpoint: `repos/${repo}`,
      method: "GET",
      cacheDuration: cacheExpirationTime,
      api_url: "https://api.github.com",
      check_success: false,
    });

    console.log("response", response);

    if (!response.success) {
      console.error(`Failed to fetch for: ${repo}`);
      continue;
    }

    console.log(`Fetched ${repo} with ${response.data.stargazers_count} stars`);

    stars += response.data.stargazers_count;
  }

  return stars;
};
