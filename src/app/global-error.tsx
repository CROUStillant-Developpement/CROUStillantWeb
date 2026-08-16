"use client";

// Catches errors thrown by the root/[locale] layout itself, which
// [locale]/error.tsx can't — those happen above where next-intl's
// providers and messages are available, so this stays self-contained
// and unstyled by design (no site chrome to fall back on here).
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Une erreur est survenue / Something went wrong
        </h1>
        <p style={{ color: "#737373", maxWidth: "28rem", margin: 0 }}>
          Merci de réessayer dans quelques instants.
          <br />
          Please try again in a moment.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: "0.5rem",
            border: "1px solid #737373",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Réessayer / Retry
        </button>
      </body>
    </html>
  );
}
