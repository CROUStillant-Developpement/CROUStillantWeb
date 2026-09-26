import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/json-ld";
import ErrorPage from "@/components/error";
import { getRegions } from "@/services/region-service";
import { getRestaurants } from "@/services/restaurant-service";
import { Region, Restaurant } from "@/services/types";
import { SITE_URL, buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumb } from "@/lib/site-jsonld";
import { buildRestaurantSlug } from "@/lib/restaurant-slug";
import {
  buildRegionSlug,
  findRegionBySlug,
  groupRestaurantsByCity,
} from "@/lib/region-slug";
import { truncateForSnippet } from "@/lib/restaurant-seo";

// No loading.tsx for this segment: it would stream a 200 before the
// notFound()/permanentRedirect() below get a chance to set the status.

async function loadRegion(slug: string): Promise<
  | { status: "ok"; region: Region; regions: Region[]; restaurants: Restaurant[] }
  | { status: "missing" }
  | { status: "error" }
> {
  const [regions, restaurants] = await Promise.all([
    getRegions(),
    getRestaurants(),
  ]);

  if (!regions.success || !restaurants.success) {
    return { status: "error" };
  }

  const region = findRegionBySlug(regions.data, slug);
  if (!region) {
    return { status: "missing" };
  }

  return {
    status: "ok",
    region,
    regions: regions.data,
    restaurants: restaurants.data.filter((r) => r.region.code === region.code),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region: slug } = await params;
  const t = await getTranslations("RegionPage");
  const locale = await getLocale();
  const data = await loadRegion(slug);

  if (data.status !== "ok") {
    return {
      title: t("seo.notFound.title"),
      description: t("seo.notFound.description"),
      robots: { index: false, follow: false },
    };
  }

  const name = data.region.libelle;
  const cities = groupRestaurantsByCity(data.restaurants)
    .slice(0, 3)
    .map((group) => group.city);

  return buildPageMetadata({
    locale,
    path: `/crous/${buildRegionSlug(data.region)}`,
    title: t("seo.title", { region: name }),
    description: truncateForSnippet(
      t("seo.description", {
        region: name,
        count: data.restaurants.length,
        cities: cities.join(", "),
      })
    ),
    keywords: t("seo.keywords", { region: name }),
  });
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const data = await loadRegion(slug);

  if (data.status === "error") {
    return <ErrorPage statusCode={500} />;
  }

  if (data.status === "missing") {
    return notFound();
  }

  const locale = await getLocale();
  const { region, regions, restaurants } = data;
  const canonicalSlug = buildRegionSlug(region);

  if (slug !== canonicalSlug) {
    permanentRedirect(`/${locale}/crous/${canonicalSlug}`);
  }

  const t = await getTranslations("RegionPage");
  const tRestaurants = await getTranslations("RestaurantsPage");
  const groups = groupRestaurantsByCity(restaurants);
  const pageUrl = `${SITE_URL}/${locale}/crous/${canonicalSlug}`;

  const breadcrumb = buildBreadcrumb(locale, [
    { name: tRestaurants("seo.title"), path: "/restaurants" },
    { name: t("breadcrumb", { region: region.libelle }), path: `/crous/${canonicalSlug}` },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: t("title", { region: region.libelle }),
    inLanguage: locale === "en" ? "en-GB" : "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: restaurants.length,
      itemListElement: groups
        .flatMap((group) => group.restaurants)
        .map((restaurant, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: restaurant.nom,
          url: `${SITE_URL}/${locale}/restaurants/${buildRestaurantSlug(restaurant)}`,
        })),
    },
  };

  return (
    <div className="w-full mt-4 px-4 flex flex-col gap-8">
      <JsonLd data={breadcrumb} />
      <JsonLd data={itemList} />

      <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word">
          {t("title", { region: region.libelle })}
        </h1>
        <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t("intro", {
            region: region.libelle,
            count: restaurants.length,
            cityCount: groups.length,
          })}
        </p>
        <Link
          href={`/restaurants?region=${region.code}`}
          className="mt-6 inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/20"
        >
          {t("map")}
        </Link>
      </header>

      {groups.map((group) => (
        <section key={group.city} className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t("cityHeading", { city: group.city })}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.restaurants.map((restaurant) => (
              <li key={restaurant.code}>
                <Link
                  href={`/restaurants/${buildRestaurantSlug(restaurant)}`}
                  className="flex h-full flex-col gap-1 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-foreground">{restaurant.nom}</span>
                    <span
                      className={
                        restaurant.ouvert
                          ? "shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
                          : "shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {restaurant.ouvert ? t("openNow") : t("closedNow")}
                    </span>
                  </span>
                  {restaurant.adresse && (
                    <span className="text-sm text-muted-foreground">{restaurant.adresse}</span>
                  )}
                  {restaurant.horaires?.[0] && (
                    <span className="text-sm text-muted-foreground">{restaurant.horaires[0]}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="flex flex-col gap-4 border-t border-border/40 pt-8">
        <h2 className="text-xl font-bold tracking-tight">{t("otherRegions")}</h2>
        <ul className="flex flex-wrap gap-2">
          {regions
            .filter((other) => other.code !== region.code)
            .sort((a, b) => a.libelle.localeCompare(b.libelle, "fr"))
            .map((other) => (
              <li key={other.code}>
                <Link
                  href={`/crous/${buildRegionSlug(other)}`}
                  className="inline-flex rounded-full border border-border/60 px-3 py-1 text-sm hover:border-primary/40 hover:text-primary"
                >
                  {t("breadcrumb", { region: other.libelle })}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
