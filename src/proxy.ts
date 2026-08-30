import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Proxy files always run on the Node.js runtime (unlike the old Middleware
// convention, which defaulted to Edge), and this app runs as a single
// long-lived process (see Dockerfile: `node server.js`), not multi-instance
// serverless — so the in-memory state below is safe and persists for the
// lifetime of the container.
const intlMiddleware = createMiddleware(routing);

// ---------------------------------------------------------------------------
// Per-IP rate limiting — a backstop against crawl/scrape bursts (see the
// beta unauthenticated-API-calls incident). Fixed window, in-memory.
// ---------------------------------------------------------------------------
const WINDOW_MS = 30_000;
const MAX_REQUESTS_PER_WINDOW = 300; // ~3 req/s sustained average per IP

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

let lastCleanup = Date.now();
function cleanupExpiredBuckets(now: number) {
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;
  for (const [ip, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(ip);
  }
}

function getClientIp(request: NextRequest): string {
  // Matches the identity the API itself rate-limits on (CF-Connecting-IP).
  const cloudflareIp = request.headers.get("cf-connecting-ip");
  if (cloudflareIp) return cloudflareIp;

  if (process.env.NODE_ENV !== "production") {
    return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  }

  return "unknown";
}

// Locale negotiation applies to page routes only. Asset routes are matched
// purely so they count against the rate limit, and must not be rewritten.
function isPageRequest(pathname: string): boolean {
  return pathname === "/" || /^\/(fr|en)(\/|$)/.test(pathname);
}

function checkRateLimit(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  let bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(ip, bucket);
  }

  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }
  return { limited: false, retryAfterSeconds: 0 };
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPage = isPageRequest(pathname);

  const ip = getClientIp(request);
  const { limited, retryAfterSeconds } = checkRateLimit(ip);

  if (limited) {
    if (!isPage) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      });
    }

    const localeMatch = pathname.match(/^\/(fr|en)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

    const rewriteUrl = new URL(`/too-many-requests/${locale}`, request.url);
    rewriteUrl.searchParams.set("retryAfter", String(retryAfterSeconds));

    const response = NextResponse.rewrite(rewriteUrl, { status: 429 });
    response.headers.set("Retry-After", String(retryAfterSeconds));
    return response;
  }

  if (!isPage) return NextResponse.next();

  return intlMiddleware(request);
}

export const config = {
  // Internationalized pathnames, plus the image optimizer — the most expensive
  // endpoint the app exposes, and the one a scrape burst would hit hardest.
  matcher: ["/", "/(fr|en)/:path*", "/_next/image"],
};
