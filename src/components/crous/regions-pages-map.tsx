"use client";

import { useLocale } from "next-intl";
import RegionsMapCards, {
  useLazyTerritoryMaps,
} from "@/components/regions-map-cards";
import { buildRegionSlug } from "@/lib/region-slug";

/**
 * The map of France with every region linking to its own page, shown at the
 * bottom of the restaurants page and of the region pages, where the region
 * being viewed is highlighted.
 *
 * The whole section, heading included, is dropped when the outlines cannot be
 * fetched: there would be nothing under the heading.
 */
export default function RegionsPagesMap({
  title,
  activeRegionId,
}: {
  title: string;
  /** The region whose page this is, if any. */
  activeRegionId?: number;
}) {
  const locale = useLocale();
  const { ref, maps } = useLazyTerritoryMaps();

  if (maps === null) return null;

  return (
    <section className="flex flex-col gap-6 border-t border-border/40 pt-8">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <RegionsMapCards
        containerRef={ref}
        maps={maps}
        activeRegionId={activeRegionId}
        // The outlines carry the same id and label as the regions API.
        hrefFor={(region) =>
          `/${locale}/crous/${buildRegionSlug({ code: region.id, libelle: region.name })}`
        }
      />
    </section>
  );
}
