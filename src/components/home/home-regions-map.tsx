"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useIntersectionObserver } from "usehooks-ts";
import { Link } from "@/i18n/routing";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useRegionsGeoJson } from "@/hooks/useRegionsGeoJson";
import { buildTerritoryMaps, TerritoryKey, TerritoryMap } from "@/lib/regions-map";

// Shown as placeholders until the outlines arrive, in display order.
const TERRITORY_KEYS: TerritoryKey[] = [
  "mainland",
  "guadeloupe",
  "martinique",
  "guyane",
  "reunion",
  "mayotte",
];

function TerritoryCard({
  name,
  map,
  className,
}: {
  name: string;
  /** Undefined while the outlines are loading. */
  map?: TerritoryMap;
  className?: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  // The regions carry no label on the map, so the one being pointed at is
  // named in the caption.
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-primary/5 bg-card/50 hover:border-primary/20 transition-all duration-300 shadow-xs p-4",
        className
      )}
    >
      {/* Every card gets the same square, whatever the shape of its territory;
          the map is centred in it. */}
      <div className="relative aspect-square w-full">
        {map ? (
          <svg
            viewBox={`0 0 ${map.width} ${map.height}`}
            role="group"
            aria-label={name}
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            {map.regions.map((region) => {
              const href = `/${locale}/restaurants?region=${region.id}`;

              return (
                <a
                  key={region.id}
                  href={href}
                  aria-label={region.name}
                  className="group/region outline-none"
                  onClick={(event) => {
                    event.preventDefault();
                    router.push(href);
                  }}
                  onMouseEnter={() => setHovered(region.name)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(region.name)}
                  onBlur={() => setHovered(null)}
                >
                  <path
                    d={region.path}
                    fillRule="evenodd"
                    strokeLinejoin="round"
                    // Keeps the outline one pixel wide whatever size the card is.
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer fill-primary/10 stroke-foreground/50 transition-colors group-hover/region:fill-primary/50 group-focus-visible/region:fill-primary/50"
                  />
                </a>
              );
            })}
          </svg>
        ) : (
          <div className="absolute inset-0 animate-pulse rounded-xl bg-muted/50" />
        )}
      </div>
      <p className="truncate text-center text-sm font-bold" aria-live="polite">
        {hovered ?? name}
      </p>
    </div>
  );
}

export default function HomeRegionsMap() {
  const t = useTranslations("HomePage.regionsMap");
  // Well below the fold: the outlines are only fetched once the section is
  // about to be seen.
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: "400px",
    freezeOnceVisible: true,
  });
  const regionsGeoJson = useRegionsGeoJson({
    optimised: true,
    enabled: isIntersecting,
  });

  const maps = useMemo(
    () => (regionsGeoJson ? buildTerritoryMaps(regionsGeoJson) : null),
    [regionsGeoJson]
  );

  // The map is a shortcut to the restaurants page, not content of its own:
  // without the outlines there is nothing worth showing.
  if (regionsGeoJson === null) return null;

  const cards = maps
    ? maps.map((map) => ({ key: map.key, map }))
    : TERRITORY_KEYS.map((key) => ({ key, map: undefined }));
  const [mainland, ...overseas] = cards;

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
          {t("title")}
        </h2>
        <div className="h-1.5 w-24 bg-primary rounded-full mx-auto mb-6" />
        <p className="text-lg text-muted-foreground font-medium">
          {t("description")}
        </p>
      </div>

      <div
        ref={ref}
        className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        <TerritoryCard
          name={t(`territories.${mainland.key}`)}
          map={mainland.map}
          className="rounded-[2rem] p-6 md:p-10"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-2 content-start">
          {overseas.map(({ key, map }) => (
            <TerritoryCard key={key} name={t(`territories.${key}`)} map={map} />
          ))}
          {/* Sixth cell of the grid, laid out like the territory cards so the
              rows stay even: the way to every restaurant, region or not. */}
          <Link
            href="/restaurants"
            className="group/all flex flex-col gap-3 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs p-4"
          >
            <div className="relative aspect-square w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapIcon
                  aria-hidden
                  className="h-1/3 w-1/3 text-primary transition-transform duration-300 group-hover/all:scale-110"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <p className="flex items-center justify-center gap-1 text-center text-sm font-bold">
              {t("cta")}
              <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover/all:translate-x-1" />
            </p>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
