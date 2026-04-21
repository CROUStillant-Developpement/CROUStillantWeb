import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMenuByRestaurantId,
  getDatesMenuAvailable,
  getFutureDatesMenuAvailable,
  getMenuByRestaurantIdAndDate,
} from "@/services/menu-service";
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
// getMenuByRestaurantId
// ---------------------------------------------------------------------------
describe("getMenuByRestaurantId", () => {
  it("calls apiRequest with correct endpoint and cacheDuration", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getMenuByRestaurantId(123);
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "restaurants/123/menu",
      method: "GET",
      cacheDuration: 300000,
    });
  });

  it("returns the menu list on success", async () => {
    const menus = [{ code: "m1", date: "21-04-2026", repas: [] }];
    mockApiRequest.mockResolvedValueOnce(ok(menus));
    const result = await getMenuByRestaurantId(1);
    expect(result).toEqual(ok(menus));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Not found", 404));
    const result = await getMenuByRestaurantId(999);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(404);
  });

  it("uses the restaurant id as-is in the endpoint", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getMenuByRestaurantId(42);
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.endpoint).toBe("restaurants/42/menu");
  });
});

// ---------------------------------------------------------------------------
// getDatesMenuAvailable
// ---------------------------------------------------------------------------
describe("getDatesMenuAvailable", () => {
  it("calls apiRequest with correct endpoint and cacheDuration (30 min)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getDatesMenuAvailable(7);
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "restaurants/7/menu/dates/all",
      method: "GET",
      cacheDuration: 1800000,
    });
  });

  it("returns the list of dates on success", async () => {
    const dates = [{ code: "d1", date: "21-04-2026" }];
    mockApiRequest.mockResolvedValueOnce(ok(dates));
    const result = await getDatesMenuAvailable(7);
    expect(result).toEqual(ok(dates));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Server error", 500));
    const result = await getDatesMenuAvailable(7);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Server error");
  });
});

// ---------------------------------------------------------------------------
// getFutureDatesMenuAvailable
// ---------------------------------------------------------------------------
describe("getFutureDatesMenuAvailable", () => {
  it("calls apiRequest with correct endpoint and cacheDuration (5 min)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getFutureDatesMenuAvailable(3);
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "restaurants/3/menu/dates",
      method: "GET",
      cacheDuration: 300000,
    });
  });

  it("returns future dates on success", async () => {
    const dates = [{ code: "d2", date: "22-04-2026" }];
    mockApiRequest.mockResolvedValueOnce(ok(dates));
    const result = await getFutureDatesMenuAvailable(3);
    expect(result).toEqual(ok(dates));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Forbidden", 403));
    const result = await getFutureDatesMenuAvailable(3);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// getMenuByRestaurantIdAndDate
// ---------------------------------------------------------------------------
describe("getMenuByRestaurantIdAndDate", () => {
  it("calls apiRequest with endpoint combining restaurantId and date", async () => {
    mockApiRequest.mockResolvedValueOnce(ok(null));
    await getMenuByRestaurantIdAndDate(10, "21-04-2026");
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "restaurants/10/menu/21-04-2026",
      method: "GET",
      cacheDuration: 1800000,
    });
  });

  it("uses 30-minute cache (1 800 000 ms)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok(null));
    await getMenuByRestaurantIdAndDate(1, "01-01-2026");
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBe(1800000);
  });

  it("returns the menu on success", async () => {
    const menu = { code: "m42", date: "21-04-2026", repas: [] };
    mockApiRequest.mockResolvedValueOnce(ok(menu));
    const result = await getMenuByRestaurantIdAndDate(10, "21-04-2026");
    expect(result).toEqual(ok(menu));
  });

  it("returns null data when no menu exists for that date", async () => {
    mockApiRequest.mockResolvedValueOnce(ok(null));
    const result = await getMenuByRestaurantIdAndDate(10, "01-01-2000");
    expect(result).toEqual(ok(null));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Not found", 404));
    const result = await getMenuByRestaurantIdAndDate(10, "01-01-2026");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(404);
  });
});
