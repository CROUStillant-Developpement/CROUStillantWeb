import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const SITE_URL = process.env.WEB_URL || "https://croustillant.menu";
export const SITE_NAME = "CROUStillant";

/**
 * Open Graph wants a full locale code (language + territory), not the bare
 * language tag used in the URL.
 */
const OG_LOCALES: Record<string, string> = {
  fr: "fr_FR",
  en: "en_GB",
};

export interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Site-wide social preview. Declaring width and height lets crawlers lay the
 * card out before the image is downloaded, and stops them guessing wrong.
 *
 * The `alt` here is a last-resort fallback; `buildPageMetadata` replaces it with
 * the localised `Metadata.bannerAlt` string.
 */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: `${SITE_URL}/banner.png`,
  width: 690,
  height: 250,
  alt: SITE_NAME,
};

/**
 * Builds the `alternates` block for a page.
 *
 * Every page exists once per locale, so each one must point at its own
 * canonical URL and list its siblings through hreflang. `x-default` is what
 * search engines serve to users whose language matches none of the listed
 * ones — it points at the default locale.
 *
 * @param locale - The locale the page is being rendered for.
 * @param path - Path after the locale prefix, e.g. "/restaurants" ("" for home).
 */
export function buildAlternates(locale: string, path: string = "") {
  const languages: Record<string, string> = {};

  for (const supported of routing.locales) {
    languages[supported] = `/${supported}${path}`;
  }

  languages["x-default"] = `/${routing.defaultLocale}${path}`;

  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}

interface PageMetadataOptions {
  /** The locale the page is being rendered for. */
  locale: string;
  /** Path after the locale prefix, e.g. "/restaurants" ("" for home). */
  path?: string;
  title: string;
  description: string;
  keywords?: string | string[];
  /** Defaults to the site banner. */
  images?: OgImage[];
  /** Open Graph type; "website" unless the page is really an article. */
  type?: "website" | "article";
  /** Set on pages that should stay out of search results. */
  robots?: Metadata["robots"];
}

/**
 * Builds the full metadata object for a page.
 *
 * Every page used to repeat the same ~28 lines with only the translation
 * namespace and the path changing, which is how `x-default`, `og:url` and
 * `og:locale` came to be missing everywhere. Centralising it means a field
 * added here lands on every page at once.
 */
export async function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  keywords,
  images,
  type = "website",
  robots,
}: PageMetadataOptions): Promise<Metadata> {
  const url = `${SITE_URL}/${locale}${path}`;

  // Resolved here rather than in the constant so the alt text follows the page's
  // locale instead of being frozen in one language.
  const t = await getTranslations("Metadata");
  const resolvedImages = images ?? [{ ...DEFAULT_OG_IMAGE, alt: t("bannerAlt") }];

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: buildAlternates(locale, path),
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: resolvedImages,
      locale: OG_LOCALES[locale] ?? locale,
      alternateLocale: routing.locales
        .filter((supported) => supported !== locale)
        .map((supported) => OG_LOCALES[supported] ?? supported),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolvedImages,
    },
    ...(robots ? { robots } : {}),
  };
}
