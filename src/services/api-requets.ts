"use server";

import { ApiResult } from "@/services/types";

/**
 * Makes an API request to the specified endpoint with the given method and body.
 *
 * @template T - The expected type of the response data.
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.endpoint - The endpoint to which the request is made.
 * @param {string} [params.method="GET"] - The HTTP method to use for the request.
 * @param {any} [params.body] - The body of the request, if any.
 * @returns {Promise<ApiResult<T>>} A promise that resolves to the result of the API request.
 *
 * @example
 * ```typescript
 * const result = await apiRequest<{ user: User }>({
 *   endpoint: 'users/123',
 *   method: 'GET',
 * });
 * if (result.success) {
 *   console.log(result.data.user);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function apiRequest<T>({
  endpoint,
  method = "GET",
  body,
}: {
  endpoint: string;
  method?: string;
  body?: any;
}): Promise<ApiResult<T>> {
  console.log(`Making ${method} request to ${endpoint}`);
  const url = `${process.env.API_URL}/${endpoint}`;
  const headers: HeadersInit = {
    "X-Api-Key": process.env.API_KEY as string,
  };

  try {
    let bodyContent = undefined;

    if (body) {
      bodyContent = body instanceof FormData ? body : JSON.stringify(body);
    }

    if (!(body instanceof FormData) && body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers: headers,
      body: bodyContent,
    });

    // Handle the case of 204 No Content
    if (response.status === 204) {
      return {
        success: true,
        data: undefined as unknown as T, // No data returned, but marked as successful
      };
    }

    // If the response is OK, return the data
    if (response.ok) {
      const data = await response.json();

      if (!data.success) {
        return {
          success: false,
          error: data.message,
          status: response.status,
        };
      }

      return {
        success: true,
        data: data.data as T,
      };
    }

    // If the response is not OK, return an error
    return {
      success: false,
      error: `Error ${method} ${endpoint}: ${response.statusText}`,
      status: response.status,
    };
  } catch (err) {
    // Handle network errors or unexpected issues
    return {
      success: false,
      error: `Network or server error: ${
        err instanceof Error ? err.message : String(err)
      }`,
      status: 500, // Generic status for network failures
    };
  }
}
