import { SITE_NAME, SITE_URL } from "@/lib/metadata";

/** Stable @id values so the graph nodes can reference each other. */
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Builds the site-wide JSON-LD graph: who publishes the site, and what the site
 * itself is.
 *
 * `Organization` is what feeds a knowledge panel and lets search engines tie the
 * project to its GitHub and Discord presence. `WebSite` carries the name shown
 * in results and a `SearchAction`, which is what a sitelinks search box is built
 * from.
 *
 * @param locale - The locale the page is rendered for; sets `inLanguage`.
 * @param description - The localised site description.
 */
export function buildSiteJsonLd(locale: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 128,
          height: 128,
        },
        description,
        email: "croustillant@bayfield.dev",
        foundingDate: "2022",
        sameAs: [
          "https://github.com/CROUStillant-Developpement",
          "https://discord.gg/yG6FjqbWtk",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description,
        inLanguage: locale === "en" ? "en-GB" : "fr-FR",
        publisher: { "@id": ORGANIZATION_ID },
        // Lets search engines offer a search box straight in the results.
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${locale}/restaurants?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/**
 * Builds a `BreadcrumbList` for a restaurant page.
 *
 * Search engines render this as the path shown above the result title, in place
 * of the bare URL.
 *
 * @param locale - The locale the page is rendered for.
 * @param restaurantsLabel - Localised label of the restaurant list page.
 * @param restaurantName - Name of the restaurant.
 * @param slug - The restaurant page slug.
 */
export function buildRestaurantBreadcrumb(
  locale: string,
  restaurantsLabel: string,
  restaurantName: string,
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: restaurantsLabel,
        item: `${SITE_URL}/${locale}/restaurants`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: restaurantName,
        item: `${SITE_URL}/${locale}/restaurants/${slug}`,
      },
    ],
  };
}
