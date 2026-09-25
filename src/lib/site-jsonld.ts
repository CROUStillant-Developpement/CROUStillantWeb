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

/** One step of a breadcrumb: a label and a path after the locale prefix. */
export interface Crumb {
  name: string;
  path: string;
}

/**
 * Builds a `BreadcrumbList` from the site root down to the current page.
 *
 * Search engines render this as the path shown above the result title, in place
 * of the bare URL.
 *
 * @param locale - The locale the page is rendered for.
 * @param crumbs - The steps after the site root, current page last.
 */
export function buildBreadcrumb(locale: string, crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, path: "" }, ...crumbs].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${SITE_URL}/${locale}${crumb.path}`,
      })
    ),
  };
}
