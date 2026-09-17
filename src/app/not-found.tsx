import { routing } from "@/i18n/routing";

/**
 * Root 404 — the fallback for requests that never reach the `[locale]` tree.
 *
 * It is deliberately self-contained. `<html>`, `<body>` and
 * `NextIntlClientProvider` all live in `[locale]/layout.tsx` — the root layout
 * is a passthrough — so the localized `<ErrorPage>` cannot render here.
 *
 * Little should reach this now that `proxy.ts` redirects unprefixed page URLs
 * into the default locale; what is left is mostly missing static assets.
 */
export default function NotFoundPage() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100svh",
          gap: "1rem",
          margin: 0,
          padding: "1rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>404</h1>
        <p style={{ margin: 0 }}>Cette page n&apos;existe pas.</p>
        <a href={`/${routing.defaultLocale}`}>Retour à l&apos;accueil</a>
      </body>
    </html>
  );
}
