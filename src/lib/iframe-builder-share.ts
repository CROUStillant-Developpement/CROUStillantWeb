import { FONTS, INITIAL_BLOCKS, type BlockConfig, type PersistedBuilderState } from "@/store/iframeBuilderStore";

const MEAL_IDS = ["matin", "midi", "soir"];

export function formatDateParam(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${date.getFullYear()}`;
}

function parseDateParam(value: string): Date | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return Number.isNaN(date.getTime()) ? null : date;
}

export interface ShareableBuilderState extends PersistedBuilderState {
  date: Date | null;
}

/** Builds the query string used to share a builder configuration (distinct from the API iframe URL params). */
export function buildShareParams(state: ShareableBuilderState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.restaurantCode) params.set("r", String(state.restaurantCode));
  params.set("blocks", state.blocks.map((b) => (b.enabled ? b.id : `-${b.id}`)).join(","));
  params.set("theme", state.theme);
  params.set("color", state.color);
  params.set("font", state.font);
  params.set("meals", state.meals.join(","));
  params.set("w", String(state.width));
  params.set("h", String(state.height));
  params.set("lang", state.lang);
  if (state.date) params.set("date", formatDateParam(state.date));
  return params;
}

/** Returns null when the URL carries no shareable builder data. */
export function parseShareParams(
  params: URLSearchParams
): (Partial<PersistedBuilderState> & { date?: Date }) | null {
  if (!params.has("blocks") && !params.has("r")) return null;

  const result: Partial<PersistedBuilderState> & { date?: Date } = {};

  const r = params.get("r");
  if (r) {
    const n = Number(r);
    if (Number.isFinite(n) && n > 0) result.restaurantCode = n;
  }

  const blocksParam = params.get("blocks");
  if (blocksParam) {
    const knownIds = new Set(INITIAL_BLOCKS.map((b) => b.id));
    const parsed: BlockConfig[] = blocksParam
      .split(",")
      .filter(Boolean)
      .map((token) => {
        const enabled = !token.startsWith("-");
        const id = enabled ? token : token.slice(1);
        return { id, enabled };
      })
      .filter((b) => knownIds.has(b.id));
    if (parsed.length > 0) {
      const seen = new Set(parsed.map((b) => b.id));
      const missing = INITIAL_BLOCKS.filter((b) => !seen.has(b.id));
      result.blocks = [...parsed, ...missing];
    }
  }

  const theme = params.get("theme");
  if (theme === "light" || theme === "dark") result.theme = theme;

  const color = params.get("color");
  if (color && /^[0-9a-fA-F]{6}$/.test(color)) result.color = color.toLowerCase();

  const font = params.get("font");
  if (font && (FONTS as readonly string[]).includes(font)) result.font = font;

  const meals = params.get("meals");
  if (meals) {
    const list = meals.split(",").filter((m) => MEAL_IDS.includes(m));
    if (list.length > 0) result.meals = list;
  }

  const w = params.get("w");
  if (w) {
    const n = Number(w);
    if (Number.isFinite(n) && n >= 200 && n <= 1200) result.width = n;
  }

  const h = params.get("h");
  if (h) {
    const n = Number(h);
    if (Number.isFinite(n) && n >= 200 && n <= 1200) result.height = n;
  }

  const lang = params.get("lang");
  if (lang === "fr" || lang === "en") result.lang = lang;

  const date = params.get("date");
  if (date) {
    const parsedDate = parseDateParam(date);
    if (parsedDate) result.date = parsedDate;
  }

  return result;
}
