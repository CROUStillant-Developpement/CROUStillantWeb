import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

// Deliberately outside the `[locale]` route tree: no Header, no full Footer,
// no Umami script, no theme provider, no web font, no translation payload —
// keeps a 429 response as cheap as possible for a client that's already
// sending too much traffic.
export default async function TooManyRequestsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <meta name="robots" content="noindex" />
        <style>{`
          :root { --bg: 356 0% 95%; --fg: 356 0% 0%; --muted: 356 0% 35%; }
          @media (prefers-color-scheme: dark) {
            :root { --bg: 0 2.44% 8.04%; --fg: 356 0% 90%; --muted: 356 0% 60%; }
          }
          html, body { margin: 0; padding: 0; }
          body {
            min-height: 100svh;
            display: flex;
            flex-direction: column;
            background: hsl(var(--bg));
            color: hsl(var(--fg));
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
