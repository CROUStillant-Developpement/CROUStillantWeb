"use client";

import { ApiResult } from "@/services/types";

let cachedApiUrl: string | null = null;

async function getApiUrl(): Promise<string> {
  if (cachedApiUrl) return cachedApiUrl;

  try {
    const response = await fetch("/api/env");
    if (response.ok) {
      const data = await response.json();
      cachedApiUrl = data.apiUrl;
      return cachedApiUrl || "";
    } else {
      throw new Error("Failed to fetch API URL");
    }
  } catch (error) {
    console.error("Error fetching API URL:", error);
    return ""; // Fallback or handle error as needed
  }
}

/**
 * Makes an API request
 * @param endpoint - API endpoint (relative URL)
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param body - Request body (optional)
 * @param authRequired - Whether authentication is required
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function apiRequest<T>({
  endpoint,
  method = "GET",
  body,
  authRequired = false,
}: {
  endpoint: string;
  method?: string;
  body?: any;
  authRequired?: boolean;
}): Promise<ApiResult<T>> {
  const apiUrl = await getApiUrl();
  const url = `${apiUrl}/${endpoint}`;
  const headers: HeadersInit = {};

  // Add Authorization header if authRequired is true
  // if (authRequired) {
  //     const session = await getServerSession(options);
  //     if (!session) {
  //         return {
  //             success: false,
  //             error: "Frontend - Unauthorized access: No session found",
  //             status: 401,
  //         };
  //     }
  //     headers.Authorization = `Bearer ${session.user.token}`;
  // }

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
