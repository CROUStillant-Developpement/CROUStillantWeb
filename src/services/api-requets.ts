"use server";

import { ApiResult } from "@/services/types";
import log from "@/lib/log";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache = new Map<string, { data: any; expiry: number }>();

// Derive allowed API origins from environment; expand here if more are needed.
const ALLOWED_API_ORIGINS: Set<string> = (() => {
  const origins = new Set<string>();
  if (process.env.API_URL) {
    try {
      const url = new URL(process.env.API_URL);
      origins.add(url.origin);
    } catch {
      // If API_URL is misconfigured, we don't add it to the allow-list.
      log.error?.(["Invalid API_URL in environment; SSRF protection allow-list is empty"], "all");
    }
  }
  return origins;
})();

function buildSafeApiUrl(api_url: string | undefined, endpoint: string): URL {
  const baseUrlString = api_url ?? process.env.API_URL;
  if (!baseUrlString) {
    throw new Error("API base URL is not configured.");
  }

  let base: URL;
  try {
    base = new URL(baseUrlString);
  } catch (e) {
    throw new Error("Invalid API base URL.");
  }

  if (ALLOWED_API_ORIGINS.size > 0 && !ALLOWED_API_ORIGINS.has(base.origin)) {
    throw new Error("API base URL is not allowed.");
  }

  const trimmedEndpoint = endpoint.trim();
  // Disallow full URLs or scheme-relative URLs in endpoint.
  if (/^\s*https?:\/\//i.test(trimmedEndpoint) || trimmedEndpoint.startsWith("//")) {
    throw new Error("Endpoint must be a relative path, not a full URL.");
  }

  // Basic control-character check to avoid header injection / malformed URLs.
  if (/[\r\n]/.test(trimmedEndpoint)) {
    throw new Error("Endpoint contains invalid characters.");
  }

  const finalUrl = new URL(trimmedEndpoint.replace(/^\/+/, ""), base);

  // Ensure the origin (scheme + host + port) cannot be changed via the endpoint.
  if (finalUrl.origin !== base.origin) {
    throw new Error("Endpoint attempts to change request origin and is not allowed.");
  }

  return finalUrl;
}

/**
 * Makes an API request with caching and error handling.
 *
 * @template T - The expected response data type.
 * @param {Object} params - The parameters for the API request.
 * @param {string} params.endpoint - The API endpoint to request.
 * @param {string} [params.method="GET"] - The HTTP method to use for the request.
 * @param {any} [params.body] - The request body, if any.
 * @param {number} [params.cacheDuration=0] - The duration (in milliseconds) to cache the response.
 * @param {string} [params.api_url=process.env.API_URL] - The base URL for the API.
 * @param {boolean} [params.check_success=true] - Whether to check for a success flag in the response data.
 * @returns {Promise<ApiResult<T>>} A promise that resolves to the API result.
 * @throws {Error} Throws an error if the request fails due to network issues or server errors.
 */
export async function apiRequest<T>({
  endpoint,
  method = "GET",
  body,
  cacheDuration = 0,
  api_url = process.env.API_URL,
  check_success = true,
  token = null,
}: {
  endpoint: string;
  method?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  cacheDuration?: number;
  api_url?: string;
  check_success?: boolean;
  token?: string | null;
}): Promise<ApiResult<T>> {
  const safeUrl = buildSafeApiUrl(api_url, endpoint);
  const url = safeUrl.toString();
  const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;

  // Check if response exists in cache and is valid
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() < cached.expiry) {
      log.debug([`Cache hit for ${method} ${endpoint}`], "all");

      return {
        success: true,
        data: cached.data as T,
      };
    } else {
      log.debug([`Cache expired for ${method} ${endpoint}`], "all");
      cache.delete(cacheKey);
    }
  }

  log.info([`Making ${method} request to ${url}`], "all");

  const headers: HeadersInit = {};

  if (process.env.API_KEY && api_url === process.env.API_URL) {
    headers["X-Api-Key"] = process.env.API_KEY as string;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const inFlightRequests = (globalThis as any).inFlightRequests || new Map<string, Promise<any>>();
  if (!(globalThis as any).inFlightRequests) {
    (globalThis as any).inFlightRequests = inFlightRequests;
  }

  // Deduplicate identical in-flight requests
  if (inFlightRequests.has(cacheKey)) {
    log.debug([`Deduplicating request for ${method} ${endpoint}`], "all");
    return inFlightRequests.get(cacheKey) as Promise<ApiResult<T>>;
  }

  const requestPromise: Promise<ApiResult<T>> = (async () => {
    try {
      let bodyContent = undefined;

      if (body) {
        bodyContent = body instanceof FormData ? body : JSON.stringify(body);
      }

      if (!(body instanceof FormData) && body) {
        headers["Content-Type"] = "application/json";
      }

      const fetchOptions: RequestInit = {
        method,
        headers: headers,
        body: bodyContent,
      };

      // Use Next.js fetch cache if cacheDuration is provided
      if (cacheDuration > 0 && method === "GET") {
        fetchOptions.next = {
          revalidate: Math.floor(cacheDuration / 1000), // Next.js expects seconds
        };
      } else if (method === "GET") {
        fetchOptions.cache = "no-store";
      }

      const response = await fetch(url, fetchOptions);

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

        if (check_success && !data.success) {
          return {
            success: false,
            error: data.message,
            status: response.status,
          };
        }

        // Cache the response if caching is enabled
        if (cacheDuration > 0) {
          if (check_success) {
            cache.set(cacheKey, {
              data: data.data,
              expiry: Date.now() + cacheDuration,
            });
          } else {
            cache.set(cacheKey, {
              data: data,
              expiry: Date.now() + cacheDuration,
            });
          }

          log.debug([`Cached response for ${method} ${endpoint}`], "all");
        }

        if (check_success) {
          return {
            success: true,
            data: data.data as T,
          };
        } else {
          return {
            success: true,
            data: data as T,
          };
        }
      }

      // If the response is not OK, return an error
      return {
        success: false,
        error: `Error ${method} ${endpoint}: ${response.statusText}`,
        status: response.status,
      };
    } catch (err) {
      log.error([`Failed to ${method} ${endpoint}:`, err], "all");

      // Handle network errors or unexpected issues
      return {
        success: false,
        error: `Network or server error: ${
          err instanceof Error ? err.message : String(err)
        }`,
        status: 500, // Generic status for network failures
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}
