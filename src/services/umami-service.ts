import { apiRequest } from "./api-requets";
import { ApiResult, UmamiGetToken, UmamiActiveUsers, UmamiDateRange, UmamiStats } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localCache = new Map<string, { data: any; expiry: number }>();

/**
 * Retrieves an authentication token from the Umami API.
 *
 * @returns {Promise<ApiResult<UmamiGetToken>>} A promise that resolves to an ApiResult containing the Umami token.
 *
 * The function sends a POST request to the Umami API's login endpoint with the username and password
 * provided in the environment variables. If the request is successful, the token is stored in the local cache
 * with an expiry time of one hour. If the request fails, an error message is appended to the result.
 */
const getToken = async (): Promise<ApiResult<UmamiGetToken>> => {
  const res = await apiRequest<UmamiGetToken>({
    endpoint: "api/auth/login",
    method: "POST",
    body: {
      username: process.env.UMAMI_API_USERNAME,
      password: process.env.UMAMI_API_PASSWORD,
    },
    api_url: process.env.UMAMI_API_URL,
    check_success: false,
  });

  if (res.success) {
    localCache.set("umami.token", { data: res.data.token, expiry: Date.now() + 1000 * 60 * 60 });
  } else {
    res.error += " | Failed to get token";
  }

  return res;
};

/**
 * Handles API requests to the specified endpoint using the given HTTP method.
 * If the request is unauthorized (status 401), it attempts to obtain a new token and retries the request.
 *
 * @template T - The type of the response data.
 * @param {string} endpoint - The API endpoint to send the request to.
 * @param {string} method - The HTTP method to use for the request (e.g., 'GET', 'POST').
 * @returns {Promise<ApiResult<T>>} - A promise that resolves to the result of the API request.
 */
const requestHandler = async <T>(endpoint: string, method: string, cache: number = 0): Promise<ApiResult<T>> => {
  const res = await apiRequest<T>({
    endpoint,
    method,
    api_url: process.env.UMAMI_API_URL,
    token: localCache.get("umami.token")?.data,
    check_success: false,
    cacheDuration: cache,
  });

  // if getting not authorized, try to get a new token
  if (!res.success && res.status === 401) {
    const res = await getToken();
    if (!res.success) {
      return res;
    }

    return await apiRequest<T>({
      endpoint,
      method,
      api_url: process.env.UMAMI_API_URL,
      token: localCache.get("umami.token")?.data,
      check_success: false,
      cacheDuration: cache,
    });
  }

  return res;
}

/**
 * Fetches the date range for the specified Umami website.
 *
 * @returns {Promise<ApiResult<UmamiDateRange>>} A promise that resolves to the API result containing the Umami date range.
 */
const getDateRange = (): Promise<ApiResult<UmamiDateRange>> => {
  return requestHandler<UmamiDateRange>(
    `api/websites/${process.env.UMAMI_WEBSITE_ID}/daterange`,
    "GET",
    1000 * 60 * 60 * 24, // cache for 24 hours
  );
}

export const getStats = async (minDate: Date | null = null, maxDate: Date | null = null): Promise<ApiResult<UmamiStats>> => {
  if (!minDate || !maxDate) {
    const dateRange = await getDateRange();
    if (!dateRange.success) {
      return dateRange;
    }

    minDate = new Date(dateRange.data.startDate);
    maxDate = new Date(dateRange.data.endDate);
  }

  return requestHandler<UmamiStats>(
    `api/websites/${process.env.UMAMI_WEBSITE_ID}/stats?startAt=${minDate.getTime()}&endAt=${maxDate.getTime()}&unit=day&timezone=Europe%2FParis&compare=false`, // &host=${process.env.UMAMI_HOSTNAME}
    "GET",
    1000 * 60 * 60 * 24, // cache for 24 hours
  );
}

/**
 * Fetches the number of active users from the Umami analytics service.
 * 
 * This function makes an API request to the Umami service to retrieve the 
 * active users for a specific website. If the request is unauthorized (status 401),
 * it attempts to obtain a new token and retries the request.
 * 
 * @returns {Promise<ApiResult<UmamiActiveUsers>>} A promise that resolves to an ApiResult containing the active users data.
 * 
 * @throws {Error} If the request fails or if a new token cannot be obtained.
 */
export const getActiveUsers = async (): Promise<ApiResult<UmamiActiveUsers>> => {
  return await requestHandler<UmamiActiveUsers>(
    `api/websites/${process.env.UMAMI_WEBSITE_ID}/active`,
    "GET",
  );
}
