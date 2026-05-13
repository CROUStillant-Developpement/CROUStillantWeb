"use client";

import { useEffect, useState } from "react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import {
  detectSeasonFromDate,
  getParticleStyle,
  SEASON_CONFIGS,
} from "@/lib/seasonal";

const PARTICLE_COUNT = 14;

export default function SeasonalThemeProvider() {
  const { seasonalParticles } = useUserPreferences();
  const [mounted, setMounted] = useState(false);

  const effective = detectSeasonFromDate(new Date());
  const config = SEASON_CONFIGS.find((s) => s.id === effective) ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (effective === "none") {
      document.documentElement.removeAttribute("data-seasonal");
    } else {
      document.documentElement.setAttribute("data-seasonal", effective);
    }
  }, [effective, mounted]);

  if (!mounted || !config || !seasonalParticles) return null;

  return (
    <div
      className="seasonal-particles pointer-events-none fixed inset-0 overflow-hidden z-[9998]"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <span
          key={i}
          className="seasonal-particle absolute top-[-2rem] select-none"
          style={getParticleStyle(i, PARTICLE_COUNT)}
        >
          {config.emoji}
        </span>
      ))}
    </div>
  );
}
