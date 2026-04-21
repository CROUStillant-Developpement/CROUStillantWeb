import { describe, it, expect, vi, beforeEach } from "vitest";
import { getChangelog } from "@/services/changelog-service";
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
// getChangelog
// ---------------------------------------------------------------------------
describe("getChangelog", () => {
  it("calls apiRequest with correct endpoint, method, and cacheDuration", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getChangelog();
    expect(mockApiRequest).toHaveBeenCalledWith({
      endpoint: "interne/changelog",
      method: "GET",
      cacheDuration: 300000,
    });
  });

  it("uses 5-minute cache (300 000 ms)", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getChangelog();
    const call = mockApiRequest.mock.calls[0][0];
    expect(call.cacheDuration).toBe(300000);
  });

  it("returns changelog data on success", async () => {
    const changelog = {
      "1.0.0": [
        {
          contributors: [{ name: "Alice", role: { fr: "Développeuse", en: "Developer" } }],
          date: "2026-01-01",
          en: { title: "Initial release", shortDescription: "First version", fullDescription: "The first release." },
          fr: { title: "Première version", shortDescription: "Première version", fullDescription: "La première version." },
          version: "1.0.0",
        },
      ],
    };
    mockApiRequest.mockResolvedValueOnce(ok(changelog));
    const result = await getChangelog();
    expect(result).toEqual(ok(changelog));
  });

  it("returns an empty changelog object on success with no entries", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    const result = await getChangelog();
    expect(result).toEqual(ok({}));
  });

  it("propagates a 404 error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Changelog not found", 404));
    const result = await getChangelog();
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Changelog not found");
      expect(result.status).toBe(404);
    }
  });

  it("propagates a network error from apiRequest", async () => {
    mockApiRequest.mockResolvedValueOnce(err("Network failure", 500));
    const result = await getChangelog();
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(500);
  });

  it("calls apiRequest exactly once per invocation", async () => {
    mockApiRequest.mockResolvedValueOnce(ok({}));
    await getChangelog();
    expect(mockApiRequest).toHaveBeenCalledTimes(1);
  });
});
