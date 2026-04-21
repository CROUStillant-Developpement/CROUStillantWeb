import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiRequest } from "@/services/api-request";

// Silence internal logging
vi.mock("@/lib/log", () => ({
  default: { debug: vi.fn(), info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const BASE_URL = "https://api.test.local";

// Unique endpoint counter — prevents cache key collisions across tests
// (the module-level cache Map lives for the lifetime of the test file)
let seq = 0;
const ep = () => `test-endpoint-${++seq}`;

// ---------------------------------------------------------------------------
// Response factory helpers
// ---------------------------------------------------------------------------
function jsonResponse(
  body: unknown,
  ok = true,
  status = 200,
  statusText = "OK"
): Response {
  return {
    ok,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.stubEnv("API_URL", BASE_URL);
  vi.stubEnv("API_KEY", "");
  // Reset in-flight deduplication map between tests
  (
    globalThis as typeof globalThis & {
      inFlightRequests?: Map<string, Promise<unknown>>;
    }
  ).inFlightRequests = new Map();
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Basic GET
// ---------------------------------------------------------------------------
describe("apiRequest — basic GET", () => {
  it("returns success=true with unwrapped data on 200 OK", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: { id: 42 } })
    );
    const result = await apiRequest<{ id: number }>({ endpoint });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ id: 42 });
  });

  it("calls the correct URL: base + endpoint", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: null })
    );
    await apiRequest({ endpoint });
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/${endpoint}`,
      expect.any(Object)
    );
  });

  it("sets cache: no-store for GET without cacheDuration", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: null })
    );
    await apiRequest({ endpoint, cacheDuration: 0 });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.cache).toBe("no-store");
  });

  it("sets revalidate when cacheDuration > 0", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: null })
    );
    await apiRequest({ endpoint, cacheDuration: 60_000 });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit & {
      next?: { revalidate?: number };
    };
    expect(opts.next?.revalidate).toBe(60);
  });
});

// ---------------------------------------------------------------------------
// check_success behaviour
// ---------------------------------------------------------------------------
describe("apiRequest — check_success=true (default)", () => {
  it("returns success=false when API payload has success=false", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: false, message: "Not found" })
    );
    const result = await apiRequest({ endpoint });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Not found");
  });
});

describe("apiRequest — check_success=false", () => {
  it("returns raw response body as data", async () => {
    const endpoint = ep();
    const body = { items: [1, 2, 3] };
    vi.mocked(global.fetch).mockResolvedValueOnce(jsonResponse(body));
    const result = await apiRequest<typeof body>({
      endpoint,
      check_success: false,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(body);
  });
});

// ---------------------------------------------------------------------------
// 204 No Content
// ---------------------------------------------------------------------------
describe("apiRequest — 204 No Content", () => {
  it("returns success=true with undefined data", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: vi.fn(),
    } as unknown as Response);
    const result = await apiRequest({ endpoint });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// HTTP error responses
// ---------------------------------------------------------------------------
describe("apiRequest — HTTP errors", () => {
  it("returns success=false with status 404", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({}, false, 404, "Not Found")
    );
    const result = await apiRequest({ endpoint });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(404);
  });

  it("returns success=false with status 500", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({}, false, 500, "Internal Server Error")
    );
    const result = await apiRequest({ endpoint });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(500);
  });

  it("includes the endpoint name in the error message", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({}, false, 403, "Forbidden")
    );
    const result = await apiRequest({ endpoint });
    if (!result.success) expect(result.error).toContain(endpoint);
  });
});

// ---------------------------------------------------------------------------
// Network errors
// ---------------------------------------------------------------------------
describe("apiRequest — network errors", () => {
  it("returns success=false when fetch throws", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network failure"));
    const result = await apiRequest({ endpoint });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Network failure");
      expect(result.status).toBe(500);
    }
  });

  it("handles non-Error throws (string)", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockRejectedValueOnce("timeout");
    const result = await apiRequest({ endpoint });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain("timeout");
  });
});

// ---------------------------------------------------------------------------
// Caching
// ---------------------------------------------------------------------------
describe("apiRequest — caching", () => {
  it("returns cached result and skips fetch on second identical GET", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: { v: 1 } })
    );
    const r1 = await apiRequest({ endpoint, cacheDuration: 60_000 });
    const r2 = await apiRequest({ endpoint, cacheDuration: 60_000 });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(r1).toEqual(r2);
  });

  it("does NOT cache when cacheDuration=0", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, cacheDuration: 0 });
    await apiRequest({ endpoint, cacheDuration: 0 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("cached data is unwrapped (data.data) when check_success=true", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: { name: "cached" } })
    );
    // First call populates cache
    await apiRequest({ endpoint, cacheDuration: 60_000 });
    // Second call reads from cache
    const result = await apiRequest<{ name: string }>({
      endpoint,
      cacheDuration: 60_000,
    });
    if (result.success) expect(result.data).toEqual({ name: "cached" });
  });
});

// ---------------------------------------------------------------------------
// Request headers
// ---------------------------------------------------------------------------
describe("apiRequest — headers", () => {
  it("adds Authorization header when token is provided", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, token: "my-secret-token" });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect((opts.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer my-secret-token"
    );
  });

  it("adds Content-Type: application/json for POST with JSON body", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, method: "POST", body: { key: "value" } });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect((opts.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json"
    );
  });

  it("does NOT add Content-Type for FormData body", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    const form = new FormData();
    form.append("field", "val");
    await apiRequest({ endpoint, method: "POST", body: form });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(
      (opts.headers as Record<string, string>)["Content-Type"]
    ).toBeUndefined();
  });

  it("adds X-Api-Key when API_KEY env is set and api_url matches API_URL", async () => {
    vi.stubEnv("API_KEY", "super-secret");
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    // No explicit api_url — defaults to process.env.API_URL = BASE_URL
    await apiRequest({ endpoint });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect((opts.headers as Record<string, string>)["X-Api-Key"]).toBe(
      "super-secret"
    );
  });

  it("does NOT add X-Api-Key when api_url differs from API_URL env", async () => {
    vi.stubEnv("API_KEY", "super-secret");
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, api_url: "https://other.example.com" });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(
      (opts.headers as Record<string, string>)["X-Api-Key"]
    ).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// In-flight deduplication
// ---------------------------------------------------------------------------
describe("apiRequest — in-flight deduplication", () => {
  it("returns the same promise for two concurrent identical requests", async () => {
    const endpoint = ep();
    let resolveFetch!: (value: Response) => void;
    const pending = new Promise<Response>((res) => {
      resolveFetch = res;
    });
    vi.mocked(global.fetch).mockReturnValueOnce(pending);

    const p1 = apiRequest({ endpoint });
    const p2 = apiRequest({ endpoint });

    resolveFetch(jsonResponse({ success: true, data: { deduped: true } }));

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    // fetch invoked only once despite two calls
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("clears the in-flight entry after the request completes", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint });
    const g = globalThis as typeof globalThis & {
      inFlightRequests?: Map<string, Promise<unknown>>;
    };
    const cacheKey = `GET:${BASE_URL}/${endpoint}:undefined`;
    expect(g.inFlightRequests?.has(cacheKey)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// HTTP method is forwarded correctly
// ---------------------------------------------------------------------------
describe("apiRequest — HTTP method", () => {
  it("uses GET by default", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.method).toBe("GET");
  });

  it("forwards a custom method (DELETE)", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, method: "DELETE" });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.method).toBe("DELETE");
  });

  it("forwards PUT method", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, method: "PUT", body: { x: 1 } });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.method).toBe("PUT");
  });
});

// ---------------------------------------------------------------------------
// Request body serialization
// ---------------------------------------------------------------------------
describe("apiRequest — body serialization", () => {
  it("sends JSON-stringified body for POST with a plain object", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, method: "POST", body: { name: "test", value: 42 } });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.body).toBe(JSON.stringify({ name: "test", value: 42 }));
  });

  it("passes FormData body directly without stringifying", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    const form = new FormData();
    form.append("key", "val");
    await apiRequest({ endpoint, method: "POST", body: form });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.body).toBe(form);
  });

  it("sends no body for a GET request", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(opts.body).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Cache key isolation
// ---------------------------------------------------------------------------
describe("apiRequest — cache key isolation", () => {
  it("different endpoints do NOT share a cache entry", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );
    const ep1 = ep();
    const ep2 = ep();
    await apiRequest({ endpoint: ep1, cacheDuration: 60_000 });
    await apiRequest({ endpoint: ep2, cacheDuration: 60_000 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("different request bodies produce separate cache entries", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );
    const endpoint = ep();
    await apiRequest({ endpoint, method: "POST", body: { a: 1 }, cacheDuration: 60_000 });
    await apiRequest({ endpoint, method: "POST", body: { a: 2 }, cacheDuration: 60_000 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("GET and POST to the same endpoint use separate cache entries", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );
    const endpoint = ep();
    await apiRequest({ endpoint, method: "GET", cacheDuration: 60_000 });
    await apiRequest({ endpoint, method: "POST", body: {}, cacheDuration: 60_000 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("different api_urls produce separate cache entries", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );
    const endpoint = ep();
    await apiRequest({ endpoint, api_url: BASE_URL, cacheDuration: 60_000 });
    await apiRequest({ endpoint, api_url: "https://other.example.com", cacheDuration: 60_000 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// Expired cache
// ---------------------------------------------------------------------------
describe("apiRequest — expired cache", () => {
  it("re-fetches after the cache TTL has elapsed", async () => {
    vi.useFakeTimers();
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: { v: 1 } })
    );

    // First call — populates cache with a 1-second TTL
    await apiRequest({ endpoint, cacheDuration: 1_000 });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Advance time past the TTL
    vi.advanceTimersByTime(2_000);

    // Second call — cache entry is expired; fetch must be called again
    await apiRequest({ endpoint, cacheDuration: 1_000 });
    expect(global.fetch).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("serves from cache when called before the TTL elapses", async () => {
    vi.useFakeTimers();
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: { v: 2 } })
    );

    await apiRequest({ endpoint, cacheDuration: 5_000 });
    vi.advanceTimersByTime(3_000); // still within TTL
    await apiRequest({ endpoint, cacheDuration: 5_000 });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// check_success=false + caching
// ---------------------------------------------------------------------------
describe("apiRequest — check_success=false with caching", () => {
  it("stores the raw body in cache (not data.data)", async () => {
    const endpoint = ep();
    const rawBody = { items: ["a", "b"], total: 2 };
    vi.mocked(global.fetch).mockResolvedValue(jsonResponse(rawBody));

    // First call — populates cache
    await apiRequest({ endpoint, check_success: false, cacheDuration: 60_000 });
    // Second call — comes from cache
    const result = await apiRequest<typeof rawBody>({
      endpoint,
      check_success: false,
      cacheDuration: 60_000,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    if (result.success) expect(result.data).toEqual(rawBody);
  });
});

// ---------------------------------------------------------------------------
// In-flight deduplication — additional cases
// ---------------------------------------------------------------------------
describe("apiRequest — in-flight deduplication (additional)", () => {
  it("two requests to DIFFERENT endpoints each call fetch once (no cross-dedup)", async () => {
    const ep1 = ep();
    const ep2 = ep();

    let resolve1!: (v: Response) => void;
    let resolve2!: (v: Response) => void;
    vi.mocked(global.fetch)
      .mockReturnValueOnce(new Promise<Response>((r) => { resolve1 = r; }))
      .mockReturnValueOnce(new Promise<Response>((r) => { resolve2 = r; }));

    const p1 = apiRequest({ endpoint: ep1 });
    const p2 = apiRequest({ endpoint: ep2 });

    resolve1(jsonResponse({ success: true, data: { ep: 1 } }));
    resolve2(jsonResponse({ success: true, data: { ep: 2 } }));

    await Promise.all([p1, p2]);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("subsequent request after completion is NOT deduplicated (new fetch)", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValue(
      jsonResponse({ success: true, data: {} })
    );

    // First request completes fully
    await apiRequest({ endpoint });
    // Second request should go through fetch again (no dedup, no cache)
    await apiRequest({ endpoint });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// Headers — additional cases
// ---------------------------------------------------------------------------
describe("apiRequest — headers (additional)", () => {
  it("does NOT add Authorization when token is null", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint, token: null });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(
      (opts.headers as Record<string, string>)["Authorization"]
    ).toBeUndefined();
  });

  it("does NOT add X-Api-Key when API_KEY env is empty", async () => {
    // API_KEY is stubbed to "" in beforeEach
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: {} })
    );
    await apiRequest({ endpoint });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit;
    expect(
      (opts.headers as Record<string, string>)["X-Api-Key"]
    ).toBeUndefined();
  });

  it("includes statusText in the error message for non-OK responses", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({}, false, 422, "Unprocessable Entity")
    );
    const result = await apiRequest({ endpoint });
    if (!result.success) {
      expect(result.error).toContain("Unprocessable Entity");
      expect(result.status).toBe(422);
    }
  });

  it("revalidate value is correctly converted from ms to seconds", async () => {
    const endpoint = ep();
    vi.mocked(global.fetch).mockResolvedValueOnce(
      jsonResponse({ success: true, data: null })
    );
    // 90 000 ms → 90 s
    await apiRequest({ endpoint, cacheDuration: 90_000 });
    const opts = vi.mocked(global.fetch).mock.calls[0][1] as RequestInit & {
      next?: { revalidate?: number };
    };
    expect(opts.next?.revalidate).toBe(90);
  });
});
