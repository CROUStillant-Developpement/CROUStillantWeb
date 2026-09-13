/**
 * Renders a JSON-LD block.
 *
 * `<` is escaped so a value coming from the API — a dish label, a restaurant
 * name — cannot close the script tag early and inject markup into the page.
 *
 * @param data - The object to serialise. Must be JSON-serialisable.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
