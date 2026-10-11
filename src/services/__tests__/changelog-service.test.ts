import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CHANGELOG_SERVICES } from "@/data/changelog-services";
import type { ApiResult, GitHubCommit } from "@/services/types";

// Hoisted so the same mock survives `vi.resetModules()`, which re-runs the
// factory below each time the service is re-imported.
const { mockApiRequest } = vi.hoisted(() => ({ mockApiRequest: vi.fn() }));

vi.mock("@/services/api-request", () => ({
  apiRequest: mockApiRequest,
}));

function ok<T>(data: T): ApiResult<T> {
  return { success: true, data };
}

function err(error = "oops", status = 500): ApiResult<never> {
  return { success: false, error, status };
}

function commit(message: string, overrides: Partial<GitHubCommit> = {}): GitHubCommit {
  return {
    sha: message,
    html_url: `https://github.com/CROUStillant-Developpement/CROUStillantWeb/commit/${message}`,
    commit: { message, committer: { date: "2026-10-10T12:00:00Z" } },
    parents: [{ sha: "parent" }],
    ...overrides,
  };
}

/** Resolves the first service with `commits` and every other one with no commits. */
function mockFirstService(commits: GitHubCommit[]) {
  mockApiRequest.mockResolvedValue(ok([]));
  mockApiRequest.mockResolvedValueOnce(ok(commits));
}

/** Imports the service afresh, so each test starts with an empty cache. */
async function getChangelog() {
  const service = await import("@/services/changelog-service");
  return service.getChangelog();
}

const SERVICE_NAMES = CHANGELOG_SERVICES.map((service) => service.name);
const FIRST_SERVICE = SERVICE_NAMES[0];

beforeEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// getChangelog
// ---------------------------------------------------------------------------
describe("getChangelog", () => {
  it("requests the commits of every service from the GitHub API", async () => {
    mockApiRequest.mockResolvedValue(ok([]));
    await getChangelog();

    expect(mockApiRequest).toHaveBeenCalledTimes(SERVICE_NAMES.length);
    SERVICE_NAMES.forEach((service) => {
      expect(mockApiRequest).toHaveBeenCalledWith({
        endpoint: `repos/CROUStillant-Developpement/${service}/commits?per_page=100`,
        method: "GET",
        api_url: "https://api.github.com",
        check_success: false,
        token: null,
      });
    });
  });

  it("keeps feat, fix and perf commits and drops the others", async () => {
    mockFirstService([
      commit("feat: add map"),
      commit("build(deps): bump next from 16.3.7 to 16.3.8"),
      commit("fix: broken link"),
      commit("docs: update README"),
      commit("perf: faster search"),
      commit("Update README.md"),
    ]);
    const result = await getChangelog();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data[FIRST_SERVICE].map((entry) => entry.type)).toEqual(["feat", "fix", "perf"]);
    }
  });

  it("drops merge commits", async () => {
    mockFirstService([
      commit("feat: merged branch", { parents: [{ sha: "a" }, { sha: "b" }] }),
    ]);
    const result = await getChangelog();

    if (result.success) expect(result.data[FIRST_SERVICE]).toEqual([]);
  });

  it("cleans the message: scope, pull request number and body are removed", async () => {
    mockFirstService([commit("feat(dishes): add Marmiton recipe links (#373)\n\nLong body")]);
    const result = await getChangelog();

    if (result.success) {
      expect(result.data[FIRST_SERVICE][0]).toEqual({
        sha: "feat(dishes): add Marmiton recipe links (#373)\n\nLong body",
        type: "feat",
        message: "Add Marmiton recipe links",
        date: "2026-10-10T12:00:00Z",
        url: expect.stringContaining("https://github.com/"),
      });
    }
  });

  it("keeps at most 8 entries per service", async () => {
    mockFirstService(Array.from({ length: 40 }, (_, index) => commit(`feat: change ${index}`)));
    const result = await getChangelog();

    if (result.success) expect(result.data[FIRST_SERVICE]).toHaveLength(8);
  });

  it("leaves out a service whose request failed", async () => {
    mockApiRequest.mockResolvedValue(ok([commit("feat: add map")]));
    mockApiRequest.mockResolvedValueOnce(err("rate limited", 403));
    const result = await getChangelog();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(Object.keys(result.data)).toEqual(SERVICE_NAMES.slice(1));
    }
  });

  it("fails when every service failed", async () => {
    mockApiRequest.mockResolvedValue(err("rate limited", 403));
    const result = await getChangelog();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("rate limited");
      expect(result.status).toBe(403);
    }
  });

  it("serves every caller from the cache for 12 hours", async () => {
    vi.useFakeTimers();
    mockApiRequest.mockResolvedValue(ok([commit("feat: add map")]));
    const service = await import("@/services/changelog-service");

    await service.getChangelog();
    vi.advanceTimersByTime(12 * 60 * 60 * 1000 - 1);
    await service.getChangelog();
    expect(mockApiRequest).toHaveBeenCalledTimes(SERVICE_NAMES.length);

    vi.advanceTimersByTime(1);
    await service.getChangelog();
    expect(mockApiRequest).toHaveBeenCalledTimes(SERVICE_NAMES.length * 2);
  });

  it("retries after 15 minutes when a service failed", async () => {
    vi.useFakeTimers();
    mockApiRequest.mockResolvedValue(ok([]));
    mockApiRequest.mockResolvedValueOnce(err("rate limited", 403));
    const service = await import("@/services/changelog-service");

    await service.getChangelog();
    vi.advanceTimersByTime(15 * 60 * 1000 - 1);
    await service.getChangelog();
    expect(mockApiRequest).toHaveBeenCalledTimes(SERVICE_NAMES.length);

    vi.advanceTimersByTime(1);
    await service.getChangelog();
    expect(mockApiRequest).toHaveBeenCalledTimes(SERVICE_NAMES.length * 2);
  });

  it("keeps the 12-hour cache when a repository is private or missing (404)", async () => {
    vi.useFakeTimers();
    mockApiRequest.mockResolvedValue(ok([]));
    mockApiRequest.mockResolvedValueOnce(err("Not Found", 404));
    const service = await import("@/services/changelog-service");

    await service.getChangelog();
    vi.advanceTimersByTime(12 * 60 * 60 * 1000 - 1);
    await service.getChangelog();
    expect(mockApiRequest).toHaveBeenCalledTimes(SERVICE_NAMES.length);
  });
});
