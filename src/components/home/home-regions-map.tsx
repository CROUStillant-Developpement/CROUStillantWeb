"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Map as MapGL, MapRegionLayer, useResolvedTheme } from "@/components/ui/map";
import { Link } from "@/i18n/routing";
import { RegionGeoJSON, RegionGeoJSONProperties } from "@/services/types";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { motion } from "@/lib/motion";

const FRANCE_CENTER: [number, number] = [2.5, 46.6];
const FRANCE_ZOOM = 4.2;

/**
 * Resolves a CSS custom property (e.g. "--foreground") to an `hsl(...)`
 * string, re-read whenever the theme changes so the map overlay always
 * matches the current light/dark palette instead of a hardcoded color.
 */
function useThemeColor(cssVariable: string): string | undefined {
  const resolvedTheme = useResolvedTheme();
  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVariable)
      .trim();
    if (value) setColor(`hsl(${value})`);
  }, [cssVariable, resolvedTheme]);

  return color;
}

export default function HomeRegionsMap({
  regionsGeoJson,
}: {
  regionsGeoJson: RegionGeoJSON | null;
}) {
  const t = useTranslations("HomePage.regionsMap");
  const router = useRouter();
  const locale = useLocale();
  const borderColor = useThemeColor("--foreground");

  const handleRegionClick = useCallback(
    (properties: RegionGeoJSONProperties) => {
      router.push(`/${locale}/restaurants?region=${properties.crous_id}`);
    },
    [router, locale],
  );

  if (!regionsGeoJson) return null;

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

      <div className="relative overflow-hidden rounded-[3rem] border border-primary/5 bg-card/50 hover:border-primary/20 transition-all duration-300 shadow-sm p-4 md:p-6">
        <div className="relative z-10 h-[420px] md:h-[560px] rounded-[2rem] overflow-hidden">
          <MapGL
            center={FRANCE_CENTER}
            zoom={FRANCE_ZOOM}
            minZoom={3}
            maxZoom={7}
            scrollZoom={false}
            className="rounded-[2rem]"
          >
            <MapRegionLayer<RegionGeoJSONProperties>
              data={regionsGeoJson}
              idProperty="crous_id"
              color={borderColor}
              fillOpacity={0.05}
              selectedFillOpacity={0.05}
              lineWidth={1.2}
              selectedLineWidth={1.2}
              onFeatureClick={handleRegionClick}
            />
          </MapGL>
        </div>

        <div className="relative z-10 mt-6 flex justify-center">
          <Link
            href="/restaurants"
            className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all group/link"
          >
            <MapIcon className="h-4 w-4" />
            {t("cta")}
            <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      </div>
    </motion.section>
  );
}
