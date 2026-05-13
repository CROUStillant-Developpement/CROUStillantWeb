export type SeasonalTheme =
  | "auto"
  | "none"
  | "christmas"
  | "halloween"
  | "valentines"
  | "aprilfools"
  | "easter";

export interface SeasonConfig {
  id: Exclude<SeasonalTheme, "auto" | "none">;
  emoji: string;
  /** [startMonth (1-12), startDay, endMonth, endDay] */
  range: [number, number, number, number];
}

export const SEASON_CONFIGS: SeasonConfig[] = [
  { id: "christmas",  emoji: "❄️", range: [12, 1,  12, 31] },
  { id: "halloween",  emoji: "🎃", range: [10, 15, 10, 31] },
  { id: "valentines", emoji: "💕", range: [2,  10, 2,  16] },
  { id: "aprilfools", emoji: "🃏", range: [4,  1,  4,  1]  },
  { id: "easter",     emoji: "🐣", range: [3,  20, 4,  25] },
];

export function detectSeasonFromDate(date: Date): Exclude<SeasonalTheme, "auto"> {
  const override = process.env.NEXT_PUBLIC_SEASONAL_OVERRIDE;
  if (override && SEASON_CONFIGS.some((s) => s.id === override)) {
    return override as Exclude<SeasonalTheme, "auto" | "none">;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const num = month * 100 + day;

  for (const season of SEASON_CONFIGS) {
    const [sm, sd, em, ed] = season.range;
    if (num >= sm * 100 + sd && num <= em * 100 + ed) {
      return season.id;
    }
  }
  return "none";
}

/** Deterministic particle style for a given index and count (avoids SSR/CSR mismatch). */
export function getParticleStyle(i: number, total: number) {
  const t  = i / total;
  const t2 = ((i * 7  + 3) % total) / total;
  const t3 = ((i * 13 + 5) % total) / total;
  return {
    left:              `${t  * 95 + 2}%`,
    animationDelay:    `${t2 * 12}s`,
    animationDuration: `${10 + t3 * 14}s`,
    fontSize:          `${0.9 + t * 1.1}rem`,
    opacity:           0.45 + t2 * 0.45,
  } as const;
}
