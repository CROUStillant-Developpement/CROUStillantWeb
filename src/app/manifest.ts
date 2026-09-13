import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * The layout has advertised `appleWebApp.capable` for a while without a
 * manifest ever being served, so the install prompt could never fire and
 * Lighthouse's installability audit failed. Served at /manifest.webmanifest.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CROUStillant",
    short_name: "CROUStillant",
    description:
      "Consultez les menus des restaurants universitaires CROUS de France et d'outre-mer.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "fr",
    dir: "ltr",
    categories: ["food", "education", "lifestyle"],
    icons: [
      {
        src: "/logo.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
