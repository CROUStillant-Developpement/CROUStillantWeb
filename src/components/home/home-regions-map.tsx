"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "@/lib/motion";
import RegionsMapCards, {
  useLazyTerritoryMaps,
} from "@/components/regions-map-cards";
import { buildRegionSlug } from "@/lib/region-slug";

export default function HomeRegionsMap() {
  const t = useTranslations("HomePage.regionsMap");
  const locale = useLocale();
  // Well below the fold: the outlines are only fetched once the section is
  // about to be seen.
  const { ref, maps } = useLazyTerritoryMaps();

  // The map is a shortcut to the region pages, not content of its own:
  // without the outlines there is nothing worth showing.
  if (maps === null) return null;

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

      <RegionsMapCards
        containerRef={ref}
        maps={maps}
        // The outlines carry the same id and label as the regions API.
        hrefFor={(region) =>
          `/${locale}/crous/${buildRegionSlug({ code: region.id, libelle: region.name })}`
        }
      />
    </motion.section>
  );
}
