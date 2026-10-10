// Service worker of the installable app. Registered by
// src/components/pwa-provider.tsx, in production only.
//
// - Pages are network-first: a menu is only ever served from the cache when
//   the network is unreachable, so nobody sees yesterday's menu while online.
// - /_next/static is content-hashed, hence cache-first.
// - Other images and fonts are stale-while-revalidate.
// Everything else (server actions, RSC payloads, /version, the API) is left to
// the network untouched.

const PREFIX = "croustillant-";
const PAGE_CACHE = `${PREFIX}pages-v1`;
const STATIC_CACHE = `${PREFIX}static-v1`;
const ASSET_CACHE = `${PREFIX}assets-v1`;
const CACHES = [PAGE_CACHE, STATIC_CACHE, ASSET_CACHE];

// The caches are not tied to a build, so they are bounded by size instead:
// the oldest entries go first.
const MAX_ENTRIES = {
  [PAGE_CACHE]: 50,
  [STATIC_CACHE]: 400,
  [ASSET_CACHE]: 150,
};

const OFFLINE_URL = "/offline.html";
const LOCALE_HOME = /^\/[a-z]{2}$/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith(PREFIX) && !CACHES.includes(name))
          .map((name) => caches.delete(name))
      );
      // Lets the browser start the page request while the worker boots.
      await self.registration.navigationPreload?.enable();
      await self.clients.claim();
    })()
  );
});

async function store(cacheName, request, response) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  const overflow = keys.length - MAX_ENTRIES[cacheName];
  if (overflow > 0) {
    await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)));
  }
}

async function handleNavigation(event) {
  const { request } = event;
  try {
    const response = (await event.preloadResponse) || (await fetch(request));
    if (response.ok) {
      event.waitUntil(store(PAGE_CACHE, request, response.clone()));
    }
    return response;
  } catch {
    const pages = await caches.open(PAGE_CACHE);
    const cached = await pages.match(request, { ignoreVary: true });
    if (cached) return cached;

    // "/" only ever answers with a redirect to a locale, which is never
    // cached. It is also the app's start_url, so send an offline launch to the
    // locale home visited last rather than to the offline page.
    if (new URL(request.url).pathname === "/") {
      const keys = await pages.keys();
      const home = keys
        .reverse()
        .find((key) => LOCALE_HOME.test(new URL(key.url).pathname));
      if (home) return Response.redirect(home.url, 302);
    }

    return (await caches.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(event) {
  const { request } = event;
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    event.waitUntil(store(STATIC_CACHE, request, response.clone()));
  }
  return response;
}

async function staleWhileRevalidate(event) {
  const { request } = event;
  const cached = await caches.match(request, { ignoreVary: true });
  const fresh = fetch(request).then((response) => {
    if (response.ok) {
      event.waitUntil(store(ASSET_CACHE, request, response.clone()));
    }
    return response;
  });

  if (!cached) return fresh;
  // The refresh is best-effort once there is something to show.
  event.waitUntil(fresh.catch(() => {}));
  return cached;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event));
  } else if (request.destination === "image" || request.destination === "font") {
    event.respondWith(staleWhileRevalidate(event));
  }
});

// The page that installs the worker was loaded before the worker could see
// its requests, so it reports them once the worker is active. Without this,
// the first page visited would not open offline until it was visited again.
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS") return;

  const { page, assets = [] } = event.data;
  const sameOrigin = (href) => new URL(href).origin === self.location.origin;

  event.waitUntil(
    (async () => {
      const requests = [];
      if (typeof page === "string" && sameOrigin(page)) {
        requests.push([PAGE_CACHE, page]);
      }
      for (const asset of assets) {
        if (
          typeof asset === "string" &&
          sameOrigin(asset) &&
          new URL(asset).pathname.startsWith("/_next/static/")
        ) {
          requests.push([STATIC_CACHE, asset]);
        }
      }

      await Promise.allSettled(
        requests.map(async ([cacheName, href]) => {
          const response = await fetch(href);
          if (response.ok && !response.redirected) {
            await store(cacheName, href, response);
          }
        })
      );
    })()
  );
});

// A followed-dish notification (src/lib/dish-notifications.ts) was clicked:
// bring an open tab to the restaurant's page, or open one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url;
  if (typeof url !== "string") return;

  const target = new URL(url, self.location.origin);
  if (target.origin !== self.location.origin) return;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const client = windows[0];

      if (client) {
        await client.focus();
        await client.navigate(target.href).catch(() => self.clients.openWindow(target.href));
      } else {
        await self.clients.openWindow(target.href);
      }
    })()
  );
});
