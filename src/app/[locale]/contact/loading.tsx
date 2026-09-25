// Kept out of `[locale]/`: a loading boundary above a page that calls
// `notFound()` or `redirect()` makes Next stream a 200 before those run, so
// the 404 or 308 turns into a soft 404 or a <meta refresh>. Only segments
// that never do either get one — never `restaurants/[slug]` or `[...rest]`.
export { default } from "@/components/page-loading";
