import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import JsonLd from "@/components/json-ld";
import ErrorPage from "@/components/error";
import RegionMap from "@/components/crous/region-map";
import RestaurantLinkCard from "@/components/restaurants/restaurant-link-card";
import RegionsPagesMap from "@/components/crous/regions-pages-map";
import {
  getRegions,
  getRegionsGeoJSONOptimised,
} from "@/services/region-service";
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
import { buildTerritoryMaps, restaurantCardId } from "@/lib/regions-map";
import { slugify } from "@/lib/utils";

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
  const { region, restaurants } = data;
  const canonicalSlug = buildRegionSlug(region);

  if (slug !== canonicalSlug) {
    permanentRedirect(`/${locale}/crous/${canonicalSlug}`);
  }

  const t = await getTranslations("RegionPage");
  const tRestaurants = await getTranslations("RestaurantsPage");
  const tTerritories = await getTranslations("HomePage.regionsMap.territories");
  const groups = groupRestaurantsByCity(restaurants);
  const pageUrl = `${SITE_URL}/${locale}/crous/${canonicalSlug}`;

  // A single region's outline is a few kilobytes, so unlike the map of France
  // it is drawn on the server and is there on first paint. The map is an
  // extra: the page renders without it when the outlines are unavailable.
  const geojson = await getRegionsGeoJSONOptimised();
  const regionMaps = geojson.success
    ? buildTerritoryMaps(geojson.data, {
        regionId: region.code,
        places: restaurants
          .filter((restaurant) => restaurant.latitude && restaurant.longitude)
          .map((restaurant) => ({
            id: restaurant.code,
            name: restaurant.nom,
            href: `/${locale}/restaurants/${buildRestaurantSlug(restaurant)}`,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
          })),
      })
    : [];

  const stats = [
    { value: restaurants.length, label: t("stats.restaurants", { count: restaurants.length }) },
    { value: groups.length, label: t("stats.cities", { count: groups.length }) },
    (() => {
      const open = restaurants.filter((restaurant) => restaurant.ouvert).length;
      return { value: open, label: t("stats.open", { count: open }) };
    })(),
  ];

  // Several cities can slugify to the same anchor ("St-Denis", "St Denis"):
  // the index keeps the ids unique.
  const sections = groups.map((group, index) => ({
    ...group,
    id: `${slugify(group.city) || "city"}-${index + 1}`,
  }));

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
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
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

            <dl className="mt-6 flex flex-wrap gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse rounded-2xl border border-primary/10 bg-background/60 px-5 py-3"
                >
                  <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
                  <dd className="text-2xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/restaurants?region=${region.code}&display=map`}
              className="group/map mt-6 inline-flex font-semibold items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/20"
            >
              {t("map")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/map:translate-x-1" />
            </Link>
          </div>

          {regionMaps.length > 0 && (
            <RegionMap
              maps={regionMaps}
              label={t("mapLabel", { region: region.libelle })}
              territoryNames={{
                mainland: tTerritories("mainland"),
                guadeloupe: tTerritories("guadeloupe"),
                martinique: tTerritories("martinique"),
                guyane: tTerritories("guyane"),
                reunion: tTerritories("reunion"),
                mayotte: tTerritories("mayotte"),
              }}
            />
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      </header>

      {sections.length > 1 && (
        <nav aria-label={t("cityNav")}>
          <ul className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-sm font-medium hover:border-primary/40 hover:text-primary"
                >
                  {section.city}
                  <span className="text-xs text-muted-foreground">
                    {section.restaurants.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="flex flex-col gap-4 scroll-mt-24"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t("cityHeading", { city: section.city })}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {section.restaurants.map((restaurant) => (
              <li key={restaurant.code}>
                <RestaurantLinkCard
                  restaurant={restaurant}
                  id={restaurantCardId(restaurant.code)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <RegionsPagesMap title={t("otherRegions")} activeRegionId={region.code} />
    </div>
  );
}
