import { Tache, ApiResult } from "./types";
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
