import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DEPLOYMENT, SITE_URL } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments (beta) must stay out of the index entirely — they
  // duplicate production page for page. See `IS_PRODUCTION_DEPLOYMENT`.
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/restaurants/*/screen",
        "/*?ref=",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
