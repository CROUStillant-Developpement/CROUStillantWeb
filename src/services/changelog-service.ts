import { Changelog, ChangelogEntry, ChangelogEntryType, GitHubCommit, ApiResult } from "./types";
import { apiRequest } from "./api-request";
import { CHANGELOG_SERVICES } from "@/data/changelog-services";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_ORGANISATION = "CROUStillant-Developpement";

const COMMITS_FETCHED_PER_SERVICE = 100;
const MAX_ENTRIES_PER_SERVICE = 8;

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
// When GitHub could not be reached for some services, try again sooner — but
// not on every page view, which would burn through the rate limit.
const INCOMPLETE_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Only user-facing conventional commits are kept: dependency bumps, CI, docs
// and refactors would drown the changes visitors actually care about.
const CONVENTIONAL_COMMIT = /^(feat|fix|perf)(?:\(([^)]*)\))?!?:\s*(.+)$/;
const PULL_REQUEST_SUFFIX = /\s*\(#\d+\)$/;

// Shared by every visitor: this app runs as a single long-lived process.
let cached: { result: ApiResult<Changelog>; expiry: number } | null = null;

/**
 * Converts a GitHub commit into a changelog entry.
 *
 * @param {GitHubCommit} commit - The commit returned by the GitHub API.
 * @returns {ChangelogEntry | null} The entry, or `null` if the commit is a merge or is not user-facing.
 */
function toChangelogEntry(commit: GitHubCommit): ChangelogEntry | null {
  if (commit.parents.length > 1) return null;

  const subject = commit.commit.message.split("\n")[0].trim();
  const match = subject.match(CONVENTIONAL_COMMIT);
  if (!match) return null;

  const message = match[3].replace(PULL_REQUEST_SUFFIX, "");

  return {
    sha: commit.sha,
    type: match[1] as ChangelogEntryType,
    message: message.charAt(0).toUpperCase() + message.slice(1),
    date: commit.commit.committer.date,
    url: commit.html_url,
  };
}

/**
 * Get the latest user-facing commits of each service from GitHub
 *
 * The result is cached in memory for 12 hours and shared by all visitors.
 *
 * @returns {Promise<ApiResult<Changelog>>} A promise that resolves with the changelog entries of each service.
 * Services whose commits could not be fetched are left out; the result only fails if every service failed.
 */
export async function getChangelog(): Promise<ApiResult<Changelog>> {
  if (cached && Date.now() < cached.expiry) {
    return cached.result;
  }

  const results = await Promise.all(
    CHANGELOG_SERVICES.map((service) =>
      apiRequest<GitHubCommit[]>({
        endpoint: `repos/${GITHUB_ORGANISATION}/${service.name}/commits?per_page=${COMMITS_FETCHED_PER_SERVICE}`,
        method: "GET",
        api_url: GITHUB_API_URL,
        check_success: false,
        token: process.env.GITHUB_TOKEN || null,
      })
    )
  );

  const changelog: Changelog = {};

  results.forEach((result, index) => {
    if (!result.success) return;

    changelog[CHANGELOG_SERVICES[index].name] = result.data
      .map(toChangelogEntry)
      .filter((entry): entry is ChangelogEntry => entry !== null)
      .slice(0, MAX_ENTRIES_PER_SERVICE);
  });

  const firstFailure = results.find((result) => !result.success);
  const result: ApiResult<Changelog> =
    firstFailure && Object.keys(changelog).length === 0
      ? (firstFailure as ApiResult<Changelog>)
      : { success: true, data: changelog };

  // A 404 is a private or missing repository: retrying sooner will not help.
  const hasTransientFailure = results.some((result) => !result.success && result.status !== 404);

  cached = {
    result,
    expiry: Date.now() + (hasTransientFailure ? INCOMPLETE_CACHE_DURATION : CACHE_DURATION),
  };

  return result;
}
