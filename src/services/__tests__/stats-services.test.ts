import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTaches,
  getGlobalStats,
  getTop100Dishes,
  getLast100Dishes,
} from "@/services/stats-services";
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
// getTaches
// ---------------------------------------------------------------------------
describe("getTaches", () => {
  it("calls apiRequest with correct endpoint and method (no cache)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getTaches();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "taches",
      method: "GET",
    });
  });

  it("does not set cacheDuration (live data)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getTaches();
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBeUndefined();
  });

  it("returns the list of tasks on success", async () => {
    const tasks = [{ id: "t1", debut: "2026-01-01", fin: "2026-01-02", requetes: 5 }];
    mockApiRequest.mockResolvedValueOnce(ok(tasks));
    const result = await getTaches();
    expect(result).toEqual(ok(tasks));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Unauthorized", 401));
    const result = await getTaches();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// getGlobalStats
// ---------------------------------------------------------------------------
describe("getGlobalStats", () => {
  it("calls apiRequest with correct endpoint and method (no cache)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getGlobalStats();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "stats",
      method: "GET",
    });
  });

  it("does not set cacheDuration (live data)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getGlobalStats();
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBeUndefined();
  });

  it("returns global stats on success", async () => {
    const stats = {
      categories: 10,
      compositions: 500,
      menus: 2000,
      plats: 1000,
      regions: 13,
      repas: 6000,
      restaurants: 800,
      restaurants_actifs: 750,
      types_restaurants: 5,
    };
    mockApiRequest.mockResolvedValueOnce(ok(stats));
    const result = await getGlobalStats();
    expect(result).toEqual(ok(stats));
  });

  it("returns stats including optional visites and pagesVues", async () => {
    const stats = {
      categories: 1,
      compositions: 1,
      menus: 1,
      plats: 1,
      regions: 1,
      repas: 1,
      restaurants: 1,
      restaurants_actifs: 1,
      types_restaurants: 1,
      visites: 12345,
      pagesVues: 67890,
    };
    mockApiRequest.mockResolvedValueOnce(ok(stats));
    const result = await getGlobalStats();
    if (result.success) {
      expect(result.data.visites).toBe(12345);
      expect(result.data.pagesVues).toBe(67890);
    }
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Internal error", 500));
    const result = await getGlobalStats();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Internal error");
  });
});

// ---------------------------------------------------------------------------
// getTop100Dishes
// ---------------------------------------------------------------------------
describe("getTop100Dishes", () => {
  it("calls apiRequest with correct endpoint and method", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getTop100Dishes();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "plats/top",
      method: "GET",
    });
  });

  it("does not set cacheDuration", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getTop100Dishes();
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBeUndefined();
  });

  it("returns the list of top dishes on success", async () => {
    const dishes = [
      { code: "d1", libelle: "Boeuf Bourguignon", total: 842 },
      { code: "d2", libelle: "Ratatouille", total: 720 },
    ];
    mockApiRequest.mockResolvedValueOnce(ok(dishes));
    const result = await getTop100Dishes();
    expect(result).toEqual(ok(dishes));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Bad gateway", 502));
    const result = await getTop100Dishes();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(502);
  });
});

// ---------------------------------------------------------------------------
// getLast100Dishes
// ---------------------------------------------------------------------------
describe("getLast100Dishes", () => {
  it("calls apiRequest with correct endpoint and method", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getLast100Dishes();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "plats",
      method: "GET",
    });
  });

  it("does not set cacheDuration", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getLast100Dishes();
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBeUndefined();
  });

  it("returns the list of recent dishes on success", async () => {
    const dishes = [{ code: "d99", libelle: "Quiche Lorraine" }];
    mockApiRequest.mockResolvedValueOnce(ok(dishes));
    const result = await getLast100Dishes();
    expect(result).toEqual(ok(dishes));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Not found", 404));
    const result = await getLast100Dishes();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(404);
  });

  it("calls apiRequest exactly once", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getLast100Dishes();
    expect(mockApiRequest).toHaveBeenCalledTimes(1);
  });
});
