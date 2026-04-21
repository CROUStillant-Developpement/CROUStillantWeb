import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRegions } from "@/services/region-service";
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
// getRegions
// ---------------------------------------------------------------------------
describe("getRegions", () => {
  it("calls apiRequest with correct endpoint, method, and cacheDuration", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getRegions();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "regions",
      method: "GET",
      cacheDuration: 3600000,
    });
  });

  it("uses 1-hour cache (3 600 000 ms)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getRegions();
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBe(3600000);
  });

  it("returns the list of regions on success", async () => {
    const regions = [
      { code: 10, libelle: "Île-de-France" },
      { code: 20, libelle: "Bretagne" },
    ];
    mockApiRequest.mockResolvedValueOnce(ok(regions));
    const result = await getRegions();
    expect(result).toEqual(ok(regions));
  });

  it("returns an empty list when the API returns no regions", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    const result = await getRegions();
    expect(result).toEqual(ok([]));
  });

  it("propagates error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Service unavailable", 503));
    const result = await getRegions();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Service unavailable");
      expect(result.status).toBe(503);
    }
  });

  it("calls apiRequest exactly once per invocation", async () => {
    mockApiRequest.mockResolvedValueOnce(ok([]));
    await getRegions();
    expect(mockApiRequest).toHaveBeenCalledTimes(1);
  });
});
