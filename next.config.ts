import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isProd = process.env.NODE_ENV === "production";

const DEFAULT_API_ORIGIN = "https://api.croustillant.menu";

const apiOrigin = (() => {
  try {
    return new URL(process.env.API_URL ?? "").origin;
  } catch {
    return DEFAULT_API_ORIGIN;
  }
})();

const imageOrigins = Array.from(new Set([apiOrigin, DEFAULT_API_ORIGIN]));

const ANALYTICS_ORIGIN = "https://analytics.bayfield.dev";
const MAP_TILE_ORIGINS = [
  "https://basemaps.cartocdn.com",
  "https://*.basemaps.cartocdn.com",
  "https://tile.openstreetmap.org",
  "https://*.tile.openstreetmap.org",
].join(" ");

const contentSecurityPolicy = (frameAncestors: string) =>
  [
    "default-src 'self'",
    // Next's hydration bootstrap and next-themes' anti-flash snippet are inline
    // scripts. Replacing 'unsafe-inline' with per-request nonces would force
    // every page to render dynamically, so inline scripts stay allowed here.
    `script-src 'self' 'unsafe-inline' ${ANALYTICS_ORIGIN}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${imageOrigins.join(" ")} ${MAP_TILE_ORIGINS}`,
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin} ${ANALYTICS_ORIGIN} ${MAP_TILE_ORIGINS}`,
    // The iframe-builder previews the widget served by the API.
    `frame-src 'self' ${apiOrigin}`,
    // maplibre-gl spawns its workers from blob: URLs.
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    "upgrade-insecure-requests",
  ].join("; ");

const commonHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // geolocation stays enabled for the "restaurants near me" filter.
    value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
  },
  // Only in production: `next dev` (turbopack) relies on eval, and HSTS on a
  // plain-HTTP localhost origin is unhelpful at best.
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

const cspHeader = (frameAncestors: string) =>
  isProd
    ? [
        {
          key: "Content-Security-Policy",
          value: contentSecurityPolicy(frameAncestors),
        },
      ]
    : [];

// The two sources below must stay mutually exclusive: when several header rules
// match one request Next emits every matching Content-Security-Policy, and a
// browser given two CSP headers enforces their intersection — which would put
// the screen view back behind `frame-ancestors 'self'`.
const SCREEN_SOURCE = "/:path*/screen";
const NON_SCREEN_SOURCE = "/((?!.*/screen$).*)";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageOrigins.map((origin) => {
      const { protocol, hostname } = new URL(origin);
      return { protocol: protocol.replace(":", "") as "http" | "https", hostname };
    }),
  },
  output: "standalone",
  async headers() {
    return [
      {
        // The screen view is built to run on third-party digital signage, so it
        // is the one page that may be embedded from anywhere. It is read-only
        // and unauthenticated, so there is no clickjacking target on it.
        source: SCREEN_SOURCE,
        headers: [...commonHeaders, ...cspHeader("*")],
      },
      {
        // Embedding elsewhere is offered through the API's iframe endpoints
        // rather than through these pages.
        source: NON_SCREEN_SOURCE,
        headers: [
          ...commonHeaders,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          ...cspHeader("'self'"),
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
