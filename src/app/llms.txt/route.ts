// The content only depends on the restaurant list, which rarely changes. Same
// cache window as the sitemap so a crawl burst doesn't rebuild the file on every
// request. force-static is required because apiRequest() always fetches with
// `cache: "no-store"` (see api-request.ts), which would otherwise make this route
// fully dynamic.
export const dynamic = "force-static";
export const revalidate = 300;

import { getRestaurants } from "@/services/restaurant-service";
import { slugify } from "@/lib/utils";
import { CALENDAR_API_URL } from "@/lib/calendar";

const BASE = process.env.WEB_URL || "https://croustillant.menu";
const API = process.env.API_URL || "https://api.croustillant.menu/v1";

/**
 * Serves `/llms.txt`, the de facto convention LLM crawlers read to understand a
 * site without having to explore it page by page.
 *
 * It spells out what the project covers, the stable URLs, the public API (still
 * the most reliable way to get up-to-date menus) and the attribution terms.
 *
 * Written in English like the rest of the codebase: user-facing copy goes through
 * i18n, infrastructure files (robots, sitemap, this one) stay in English. French
 * proper nouns — restaurant, region and dish names — are kept verbatim.
 */
export async function GET() {
  const restaurants = await getRestaurants();

  // Regions give useful entry points without listing thousands of URLs: the
  // sitemap.xml remains the exhaustive source.
  const regions = restaurants.success
    ? Array.from(
        new Set(restaurants.data.map((restaurant) => restaurant.region.libelle))
      ).sort((a, b) => a.localeCompare(b, "fr"))
    : [];

  const restaurantCount = restaurants.success ? restaurants.data.length : 0;

  // A sample is enough to show the shape of the URLs; the sitemap has them all.
  const sampleRestaurants = restaurants.success
    ? restaurants.data.slice(0, 25).map((restaurant) => {
        const slug = `${slugify(restaurant.nom)}-r${restaurant.code}`;
        return `- [${restaurant.nom} (${restaurant.region.libelle})](${BASE}/en/restaurants/${slug})`;
      })
    : [];

  const body = `# CROUStillant

> Menus of French university restaurants (CROUS) in mainland France and overseas territories.
> Menus are collected several times a day from the official CROUS sources and cover
> ${restaurantCount > 0 ? `${restaurantCount} restaurants` : "every restaurant"} across ${regions.length || "all"} regions.

CROUStillant is built by students, for students. It is 100% open-source and free.
It is not affiliated with the CROUS or the CNOUS.

Restaurant, region and dish names are in French and are not translated.

## What you can find here

- Today's and upcoming menus for every university restaurant (breakfast, lunch, dinner).
- Practical information for each restaurant: address, GPS coordinates, opening hours and days, accepted payment methods, wheelchair accessibility.
- The history of menus already served.
- Statistics about dishes and regions.

## Website

Every page exists in English (\`/en/\`) and French (\`/fr/\`).

- [Home](${BASE}/en)
- [Restaurant list](${BASE}/en/restaurants) — search by region, city or name, plus an interactive map
- [Dishes](${BASE}/en/dishes) — catalogue of dishes served by the CROUS
- [Statistics](${BASE}/en/stats) — menu volumes and region comparison
- [About](${BASE}/en/about)
- [Contact](${BASE}/en/contact)
- [Legal notice](${BASE}/en/legal)
- [Full sitemap](${BASE}/sitemap.xml)

Each restaurant has a page at \`${BASE}/en/restaurants/{slug}-r{code}\`, where
\`{code}\` is its numeric identifier. Today's menu is present in the served HTML,
and the page carries schema.org JSON-LD markup (\`Restaurant\`, including \`hasMenu\`).

## Mobile app

The official CROUStillant app — free, no account needed — to browse menus, locate
restaurants on a map and manage favourites.

- [Overview](${BASE}/en/mobile)
- iOS: https://apps.apple.com/fr/app/croustillantapp/id6754869187
- Android (open beta): https://play.google.com/apps/testing/com.audric.CroustillantApp

## Discord bot

The official bot, to look up menus straight from a Discord server.

- Add the bot: https://discord.com/oauth2/authorize?client_id=1024564077068025867
- Community server: https://discord.gg/yG6FjqbWtk

## Embeddable widgets

A restaurant's menu and information can be embedded on any website through an
iframe, with no API key and no account.

- [Widget builder](${BASE}/en/iframe-builder) — drag-and-drop composition of the blocks (header, status, menu, hours, contact, payment, access), light/dark theme, accent colour, font, language; the embed code is copyable and the configuration shareable through a link.
- Information widget: \`${API}/restaurants/{code}/iframe\`
- Today's menu widget: \`${API}/restaurants/{code}/menu/iframe\`
- Custom widget: \`${API}/restaurants/{code}/iframe/custom\` (parameters \`blocks\`, \`meals\`, \`theme\`, \`color\`, \`font\`, \`height\`, \`lang\`, \`date\`)

## Calendar subscription

Every restaurant's menus are published as an iCalendar feed that Google Calendar,
Apple Calendar and Outlook can subscribe to: one event per meal, refreshed
automatically, with the dishes in the event description. The "add to calendar"
button on each restaurant page generates the one-click subscription links.

- Feed: \`${CALENDAR_API_URL}/{code}.ics\` (stable, unversioned URL — prefer it for subscriptions; also served at \`${API}/restaurants/{code}/menu/calendar.ics\`)
- Optional parameters: \`repas\` (comma-separated among \`matin\`, \`midi\`, \`soir\`) and \`minimal=true\` (fixed 15-minute events at 8:00, 12:00 and 19:00 instead of the opening hours)

## Screen mode

A full-screen display built for TVs and digital signage in university restaurant
halls: \`${BASE}/en/restaurants/{slug}-r{code}/screen\`. It is the only page on the
site that may be embedded from any domain.

## Public API

For up-to-date, structured data, prefer the API over scraping the HTML:

- Documentation: [${API}](${API})
- Restaurant list: \`GET ${API}/restaurants\`
- Restaurant details: \`GET ${API}/restaurants/{code}\`
- Restaurant menu (today and the following days): \`GET ${API}/restaurants/{code}/menu\`
- Menu for a given date: \`GET ${API}/restaurants/{code}/menu/{DD-MM-YYYY}\`
- Available dates: \`GET ${API}/restaurants/{code}/menu/dates/all\`
- Regions: \`GET ${API}/regions\`
- Region boundaries: \`GET ${API}/regions/geojson\`
- Dishes: \`GET ${API}/plats\`

The API requires no authentication. It does require a custom User-Agent
identifying your application along with a way to contact you, and it is limited to
200 requests per minute per IP address.

## Open data

The datasets are uploaded automatically to data.gouv.fr every day:

- [CROUS menus](https://www.data.gouv.fr/fr/datasets/menus-du-crous/)
- [CROUS restaurants](https://www.data.gouv.fr/fr/datasets/points-de-restauration-du-crous/)
- [CROUS regions](https://www.data.gouv.fr/fr/datasets/regions-du-crous/)

## Source code and availability

Every service is open-source under the Apache 2.0 licence:
https://github.com/CROUStillant-Developpement

- Service status: https://uptime.bayfield.dev/status/croustillant
- Public monitoring: https://monitor.croustillant.menu

# All CROUS regions

${regions.length > 0 ? regions.map((region) => `- ${region}`).join("\n") : "- (list temporarily unavailable)"}

## A few restaurants

${sampleRestaurants.length > 0 ? sampleRestaurants.join("\n") : "- (list temporarily unavailable)"}

The complete list is in the [sitemap](${BASE}/sitemap.xml).

## Attribution

Any reuse of the data must credit CROUStillant and link back to ${BASE}.
For example: "Data provided by CROUStillant (${BASE})".
Commercial use is not permitted.

## Contact

- Email: croustillant@bayfield.dev
- GitHub: https://github.com/CROUStillant-Developpement
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
