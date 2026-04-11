import { describe, it, expect } from "vitest";
import {
  cn,
  slugify,
  getDates,
  formatToISODate,
  normalizeToDate,
  getNormalizedISODate,
  findRestaurantsAroundPosition,
} from "@/lib/utils";
import { makeRestaurant } from "@/test/fixtures";

// ---------------------------------------------------------------------------
// cn
// ---------------------------------------------------------------------------
describe("cn", () => {
  it("joins class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false && "bar", undefined, null, "baz")).toBe("foo baz");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    // twMerge should keep p-4 over p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles conditional objects", () => {
    expect(cn({ "font-bold": true, "text-red-500": false })).toBe("font-bold");
  });
});

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------
describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips accented characters", () => {
    expect(slugify("Café Léa")).toBe("cafe-lea");
  });

  it("removes special characters", () => {
    expect(slugify("foo & bar!")).toBe("foo-bar");
  });

  it("joins multiple arguments with a hyphen", () => {
    expect(slugify("Resto", "du", "Midi")).toBe("resto-du-midi");
  });

  it("trims surrounding whitespace", () => {
    expect(slugify("  spaces  ")).toBe("spaces");
  });

  it("collapses multiple spaces into one hyphen", () => {
    expect(slugify("a   b")).toBe("a-b");
  });
});

// ---------------------------------------------------------------------------
// getDates
// ---------------------------------------------------------------------------
describe("getDates", () => {
  it("returns weekdays only in range", () => {
    // Monday 2024-01-01 → Sunday 2024-01-07
    const dates = getDates(new Date(2024, 0, 1), new Date(2024, 0, 7));
    expect(dates).toHaveLength(5); // Mon–Fri
    dates.forEach((d) => {
      expect(d.getDay()).not.toBe(0); // not Sunday
      expect(d.getDay()).not.toBe(6); // not Saturday
    });
  });

  it("returns a single day when start === stop and it is a weekday", () => {
    // Use two separate Date objects (same value) to avoid the mutation in getDates
    const start = new Date(2024, 0, 1); // Monday
    const stop = new Date(2024, 0, 1);
    expect(getDates(start, stop)).toHaveLength(1);
  });

  it("returns empty array when range is a weekend only", () => {
    // Saturday + Sunday 2024-01-06/07
    const dates = getDates(new Date(2024, 0, 6), new Date(2024, 0, 7));
    expect(dates).toHaveLength(0);
  });

  it("returns dates in chronological order", () => {
    const dates = getDates(new Date(2024, 0, 1), new Date(2024, 0, 5));
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime());
    }
  });
});

// ---------------------------------------------------------------------------
// formatToISODate
// ---------------------------------------------------------------------------
describe("formatToISODate", () => {
  it("parses DD-MM-YYYY correctly", () => {
    const d = formatToISODate("25-12-2024");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(11); // 0-indexed
    expect(d.getDate()).toBe(25);
  });

  it("handles single-digit day and month", () => {
    const d = formatToISODate("01-03-2023");
    expect(d.getFullYear()).toBe(2023);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// normalizeToDate
// ---------------------------------------------------------------------------
describe("normalizeToDate", () => {
  it("strips time components, returning midnight", () => {
    const input = new Date(2024, 5, 15, 14, 30, 59, 999);
    const result = normalizeToDate(input);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("preserves year, month, day", () => {
    const input = new Date(2024, 5, 15, 14, 30);
    const result = normalizeToDate(input);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it("returns a new Date instance", () => {
    const input = new Date(2024, 0, 1);
    expect(normalizeToDate(input)).not.toBe(input);
  });
});

// ---------------------------------------------------------------------------
// getNormalizedISODate
// ---------------------------------------------------------------------------
describe("getNormalizedISODate", () => {
  it("parses and normalizes in one step", () => {
    const result = getNormalizedISODate("15-06-2024");
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// findRestaurantsAroundPosition
// ---------------------------------------------------------------------------
describe("findRestaurantsAroundPosition", () => {
  const paris: Parameters<typeof findRestaurantsAroundPosition>[1] = {
    coords: { latitude: 48.8566, longitude: 2.3522 },
  };

  it("returns only restaurants within maxDistance", () => {
    // Lyon ~400 km from Paris
    const lyon = makeRestaurant({ code: 2, nom: "Lyon RU", latitude: 45.748, longitude: 4.846 });
    // Nearby restaurant in Paris
    const nearby = makeRestaurant({ code: 1, nom: "Paris RU", latitude: 48.86, longitude: 2.35 });

    const result = findRestaurantsAroundPosition([nearby, lyon], paris, 10);
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(1);
  });

  it("returns empty array when no restaurant is within range", () => {
    const farAway = makeRestaurant({ latitude: 43.296, longitude: 5.37 }); // Marseille
    expect(findRestaurantsAroundPosition([farAway], paris, 10)).toHaveLength(0);
  });

  it("sorts results nearest-first", () => {
    const close = makeRestaurant({ code: 1, latitude: 48.857, longitude: 2.352 }); // ~0.1 km
    const medium = makeRestaurant({ code: 2, latitude: 48.87, longitude: 2.36 }); // ~2 km
    const result = findRestaurantsAroundPosition([medium, close], paris, 10);
    expect(result[0].code).toBe(1);
    expect(result[1].code).toBe(2);
  });

  it("skips restaurants with missing coordinates", () => {
    const noCoords = makeRestaurant({ latitude: undefined as unknown as number, longitude: undefined as unknown as number });
    expect(findRestaurantsAroundPosition([noCoords], paris, 10000)).toHaveLength(0);
  });

  it("returns empty array when input list is empty", () => {
    expect(findRestaurantsAroundPosition([], paris, 100)).toHaveLength(0);
  });

  it("includes a restaurant exactly at the position (distance 0)", () => {
    const atParis = makeRestaurant({ code: 1, latitude: 48.8566, longitude: 2.3522 });
    const result = findRestaurantsAroundPosition([atParis], paris, 0.1);
    expect(result).toHaveLength(1);
  });

  it("includes all restaurants when maxDistance is very large", () => {
    const restaurants = [
      makeRestaurant({ code: 1, latitude: 48.8566, longitude: 2.3522 }),  // Paris
      makeRestaurant({ code: 2, latitude: 43.296, longitude: 5.37 }),     // Marseille
      makeRestaurant({ code: 3, latitude: 45.748, longitude: 4.846 }),    // Lyon
    ];
    expect(findRestaurantsAroundPosition(restaurants, paris, 10000)).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// getDates — additional edge cases
// ---------------------------------------------------------------------------
describe("getDates — additional cases", () => {
  it("returns empty array when start is after stop", () => {
    const start = new Date(2024, 0, 7); // Sunday
    const stop = new Date(2024, 0, 1);  // Monday (earlier)
    expect(getDates(start, stop)).toHaveLength(0);
  });

  it("includes both start and end day when both are weekdays", () => {
    // Monday 2024-01-08 → Wednesday 2024-01-10
    const dates = getDates(new Date(2024, 0, 8), new Date(2024, 0, 10));
    expect(dates).toHaveLength(3);
    expect(dates[0].getDate()).toBe(8);
    expect(dates[2].getDate()).toBe(10);
  });

  it("spans two weeks correctly (10 weekdays)", () => {
    // Monday 2024-01-01 → Friday 2024-01-12 (2 full weeks)
    const dates = getDates(new Date(2024, 0, 1), new Date(2024, 0, 12));
    expect(dates).toHaveLength(10);
  });
});

// ---------------------------------------------------------------------------
// slugify — additional edge cases
// ---------------------------------------------------------------------------
describe("slugify — additional cases", () => {
  it("preserves numbers", () => {
    expect(slugify("Menu 42")).toBe("menu-42");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("strips hyphens from input (only spaces become hyphens)", () => {
    // slugify removes all non-alphanumeric chars except spaces first,
    // then turns spaces into hyphens — so input hyphens are removed
    expect(slugify("hello-world")).toBe("helloworld");
  });

  it("handles string with only special characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
