import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getRestaurants,
  getRestaurant,
  getRestaurantsByRegion,
} from "@/services/restaurant-service";
import type { ApiResult } from "@/services/types";

vi.mock("@/services/api-request", () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from "@/services/api-request";

const mockApiRequest = vi.mocked(apiRequest);

function ok<T>(data: T): ApiResult<T> {
  return { success: true, data };
}

function err(error = "oops", status = 500): ApiResult<never> {
  return { success: false, error, status };
}

beforeEach(() => {
  vi.resetAllMocks();
});

// ---------------------------------------------------------------------------
// getRestaurants
// ---------------------------------------------------------------------------
describe("getRestaurants", () => {
  it("calls apiRequest with correct endpoint, method, and cacheDuration", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getRestaurants();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "restaurants",
      method: "GET",
      cacheDuration: 300000,
    });
  });

  it("returns the api result on success", async () => {
    const restaurants = [{ code: 1, nom: "RU Test" }];
    mockApiRequest.mockResolvedValueOnce(ok(restaurants));
    const result = await getRestaurants();
    expect(result).toEqual(ok(restaurants));
  });

  it("propagates error result from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Service unavailable", 503));
    const result = await getRestaurants();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Service unavailable");
      expect(result.status).toBe(503);
    }
  });
});

// ---------------------------------------------------------------------------
// getRestaurant
// ---------------------------------------------------------------------------
describe("getRestaurant", () => {
  it("calls apiRequest with the correct endpoint including the code", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getRestaurant("42");
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "restaurants/42",
      method: "GET",
      cacheDuration: 300000,
    });
  });

  it("returns the restaurant data on success", async () => {
    const restaurant = { code: 42, nom: "Cafétéria Nord" };
    mockApiRequest.mockResolvedValueOnce(ok(restaurant));
    const result = await getRestaurant("42");
    expect(result).toEqual(ok(restaurant));
  });

  it("uses the provided code as-is in the endpoint", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getRestaurant("restaurant-abc");
    expect(mockApiRequest).toHaveBeenCalledWith(
      expect.objectContaining({ endpoint: "restaurants/restaurant-abc" })
    );
  });

  it("propagates a 404 error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Not found", 404));
    const result = await getRestaurant("999");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// getRestaurantsByRegion
// ---------------------------------------------------------------------------
describe("getRestaurantsByRegion", () => {
  it("calls apiRequest with the correct endpoint including the region", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getRestaurantsByRegion("10");
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "regions/10/restaurants",
      method: "GET",
      cacheDuration: 60000,
    });
  });

  it("uses 1-minute cache (60 000 ms)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getRestaurantsByRegion("1");
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBe(60000);
  });

  it("returns the list of restaurants on success", async () => {
    const restaurants = [{ code: 5, nom: "RU Région" }];
    mockApiRequest.mockResolvedValueOnce(ok(restaurants));
    const result = await getRestaurantsByRegion("5");
    expect(result).toEqual(ok(restaurants));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Region not found", 404));
    const result = await getRestaurantsByRegion("999");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(404);
  });
});
