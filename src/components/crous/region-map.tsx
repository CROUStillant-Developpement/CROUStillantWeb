"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restaurantCardId, TerritoryKey, TerritoryMap } from "@/lib/regions-map";

// Pointing at a dot lights up the matching card in the list, which is rendered
// by the server: it is reached through the DOM rather than through state.
function highlightCard(code: number, highlighted: boolean) {
  const card = document.getElementById(restaurantCardId(code));
  if (!card) return;
  if (highlighted) card.dataset.highlighted = "true";
  else delete card.dataset.highlighted;
}

/**
 * Outline of a region with one dot per restaurant, each linking to it.
 *
 * A region spread over several territories (Antilles-Guyane) gets one outline
 * per territory, since they cannot share a scale.
 */
export default function RegionMap({
  maps,
  territoryNames,
  label,
}: {
  maps: TerritoryMap[];
  territoryNames: Record<TerritoryKey, string>;
  /** Accessible name of the map. */
  label: string;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const isSplit = maps.length > 1;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full items-end justify-center gap-4">
        {maps.map((map) => (
          <figure
            key={map.key}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
            style={{ maxWidth: isSplit ? "11rem" : "20rem" }}
          >
            <svg
              viewBox={`0 0 ${map.width} ${map.height}`}
              role="group"
              aria-label={isSplit ? territoryNames[map.key] : label}
              className="aspect-square w-full overflow-visible"
            >
              {map.regions.map((region) => (
                <path
                  key={region.id}
                  d={region.path}
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className="fill-primary/10 stroke-foreground/40"
                />
              ))}
              {map.points.map((point) => (
                <a
                  key={point.id}
                  href={point.href}
                  aria-label={point.name}
                  className="group/dot outline-none"
                  onClick={(event) => {
                    if (!point.href) return;
                    event.preventDefault();
                    router.push(point.href);
                  }}
                  onMouseEnter={() => {
                    setHovered(point.name);
                    highlightCard(point.id, true);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    highlightCard(point.id, false);
                  }}
                  onFocus={() => {
                    setHovered(point.name);
                    highlightCard(point.id, true);
                  }}
                  onBlur={() => {
                    setHovered(null);
                    highlightCard(point.id, false);
                  }}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    // In map units: the split outlines are drawn smaller, so
                    // their dots need a larger radius to stay visible.
                    r={isSplit ? 16 : 7}
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer fill-primary stroke-background transition-transform [transform-box:fill-box] origin-center group-hover/dot:scale-[1.8] group-focus-visible/dot:scale-[1.8]"
                  />
                </a>
              ))}
            </svg>
            {isSplit && (
              <figcaption className="text-xs font-semibold text-muted-foreground">
                {territoryNames[map.key]}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {/* Reserves its line so the header does not jump when a dot is hovered. */}
      <p
        className="h-5 max-w-full truncate text-center text-sm font-bold"
        aria-live="polite"
      >
        {hovered}
      </p>
    </div>
  );
}
