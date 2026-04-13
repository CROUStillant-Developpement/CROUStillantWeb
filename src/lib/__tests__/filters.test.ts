import { describe, it, expect, vi } from "vitest";
import { filterRestaurants, sortRestaurants, buildQueryString } from "@/lib/filters";
import type { Filters } from "@/lib/filters";
import { makeRestaurant } from "@/test/fixtures";

// Silence the fire-and-forget dynamic import of @/lib/log inside sortRestaurants
vi.mock("@/lib/log", () => ({
  default: { debug: vi.fn(), info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

const defaultFilters: Filters = {
  search: "",
  isPmr: false,
  isOpen: false,
  crous: -1,
  restaurantCityAsc: false,
  restaurantCityDesc: false,
  restaurantNameAsc: false,
  restaurantNameDesc: false,
  restaurantType: -1,
  nearMe: false,
};

// ---------------------------------------------------------------------------
// filterRestaurants
// ---------------------------------------------------------------------------
describe("filterRestaurants", () => {
  it("returns all restaurants when no filters are active", () => {
    const list = [makeRestaurant({ code: 1 }), makeRestaurant({ code: 2 })];
    expect(filterRestaurants(list, defaultFilters)).toHaveLength(2);
  });

  describe("search", () => {
    it("matches by name (case-insensitive)", () => {
      const list = [
        makeRestaurant({ nom: "Cafétéria Centrale" }),
        makeRestaurant({ nom: "Resto Nord" }),
      ];
      const result = filterRestaurants(list, { ...defaultFilters, search: "centrale" });
      expect(result).toHaveLength(1);
      expect(result[0].nom).toBe("Cafétéria Centrale");
    });

    it("matches by zone", () => {
      const list = [makeRestaurant({ zone: "Bordeaux" }), makeRestaurant({ zone: "Lyon" })];
      const result = filterRestaurants(list, { ...defaultFilters, search: "bord" });
      expect(result).toHaveLength(1);
    });

    it("matches by address", () => {
      const r = makeRestaurant({ adresse: "12 avenue de la Gare" });
      const result = filterRestaurants([r], { ...defaultFilters, search: "gare" });
      expect(result).toHaveLength(1);
    });

    it("matches by code (numeric string)", () => {
      const r = makeRestaurant({ code: 42 });
      const result = filterRestaurants([r], { ...defaultFilters, search: "42" });
      expect(result).toHaveLength(1);
    });

    it("returns empty when no match", () => {
      const r = makeRestaurant({ nom: "Cafétéria Sud" });
      expect(filterRestaurants([r], { ...defaultFilters, search: "nord" })).toHaveLength(0);
    });
  });

  describe("isPmr", () => {
    it("keeps only PMR-accessible restaurants", () => {
      const list = [makeRestaurant({ ispmr: true }), makeRestaurant({ ispmr: false })];
      const result = filterRestaurants(list, { ...defaultFilters, isPmr: true });
      expect(result).toHaveLength(1);
      expect(result[0].ispmr).toBe(true);
    });
  });

  describe("isOpen", () => {
    it("keeps only open restaurants", () => {
      const list = [makeRestaurant({ ouvert: true }), makeRestaurant({ ouvert: false })];
      const result = filterRestaurants(list, { ...defaultFilters, isOpen: true });
      expect(result).toHaveLength(1);
      expect(result[0].ouvert).toBe(true);
    });
  });

  describe("crous (region)", () => {
    it("filters by region code", () => {
      const list = [
        makeRestaurant({ region: { code: 10, libelle: "IDF" } }),
        makeRestaurant({ region: { code: 20, libelle: "Bretagne" } }),
      ];
      const result = filterRestaurants(list, { ...defaultFilters, crous: 10 });
      expect(result).toHaveLength(1);
      expect(result[0].region.code).toBe(10);
    });

    it("returns all when crous is -1 (all regions)", () => {
      const list = [
        makeRestaurant({ region: { code: 10, libelle: "IDF" } }),
        makeRestaurant({ region: { code: 20, libelle: "Bretagne" } }),
      ];
      expect(filterRestaurants(list, defaultFilters)).toHaveLength(2);
    });
  });

  describe("restaurantType", () => {
    it("filters by type code", () => {
      const list = [
        makeRestaurant({ type: { code: 1, libelle: "Cafétéria" } }),
        makeRestaurant({ type: { code: 2, libelle: "Brasserie" } }),
      ];
      const result = filterRestaurants(list, { ...defaultFilters, restaurantType: 1 });
      expect(result).toHaveLength(1);
    });
  });

  describe("nearMe", () => {
    it("keeps restaurants within 10 km when userPosition is provided", () => {
      const paris = { latitude: 48.8566, longitude: 2.3522 };
      const nearby = makeRestaurant({ code: 1, latitude: 48.86, longitude: 2.35 });
      const farAway = makeRestaurant({ code: 2, latitude: 43.296, longitude: 5.37 }); // Marseille
      const result = filterRestaurants(
        [nearby, farAway],
        { ...defaultFilters, nearMe: true },
        paris
      );
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe(1);
    });

    it("passes all through when userPosition is null", () => {
      const list = [makeRestaurant({ code: 1 }), makeRestaurant({ code: 2 })];
      const result = filterRestaurants(list, { ...defaultFilters, nearMe: true }, null);
      expect(result).toHaveLength(2);
    });
  });

  it("combines multiple filters", () => {
    const list = [
      makeRestaurant({ code: 1, ouvert: true, ispmr: true, nom: "Cafétéria" }),
      makeRestaurant({ code: 2, ouvert: false, ispmr: true, nom: "Cafétéria" }),
      makeRestaurant({ code: 3, ouvert: true, ispmr: false, nom: "Cafétéria" }),
    ];
    const result = filterRestaurants(list, {
      ...defaultFilters,
      isOpen: true,
      isPmr: true,
    });
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// buildQueryString
// ---------------------------------------------------------------------------
describe("buildQueryString", () => {
  it("returns empty string for default filters", () => {
    expect(buildQueryString(defaultFilters)).toBe("");
  });

  it("includes only active filters", () => {
    const qs = buildQueryString({ ...defaultFilters, search: "pizza", isPmr: true });
    const params = new URLSearchParams(qs);
    expect(params.get("search")).toBe("pizza");
    expect(params.get("ispmr")).toBe("true");
    expect(params.has("open")).toBe(false);
  });

  it("encodes region when not -1", () => {
    const qs = buildQueryString({ ...defaultFilters, crous: 23 });
    expect(new URLSearchParams(qs).get("region")).toBe("23");
  });

  it("omits region when -1", () => {
    const qs = buildQueryString(defaultFilters);
    expect(new URLSearchParams(qs).has("region")).toBe(false);
  });

  it("encodes all sort flags", () => {
    const qs = buildQueryString({ ...defaultFilters, restaurantNameAsc: true });
    expect(new URLSearchParams(qs).get("restaurantNameAsc")).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// sortRestaurants
// ---------------------------------------------------------------------------
describe("sortRestaurants", () => {
  const a = makeRestaurant({ code: 1, nom: "Alfa", zone: "Amiens" });
  const b = makeRestaurant({ code: 2, nom: "Bravo", zone: "Bordeaux" });
  const c = makeRestaurant({ code: 3, nom: "Charlie", zone: "Caen" });

  it("does not mutate the original array", () => {
    const original = [c, a, b];
    sortRestaurants(original, defaultFilters, "fr");
    expect(original[0].code).toBe(3);
  });

  it("sorts by city ascending by default", () => {
    const result = sortRestaurants([c, a, b], defaultFilters, "fr");
    expect(result.map((r) => r.zone)).toEqual(["Amiens", "Bordeaux", "Caen"]);
  });

  it("sorts by city descending", () => {
    const result = sortRestaurants([a, b, c], { ...defaultFilters, restaurantCityDesc: true }, "fr");
    expect(result.map((r) => r.zone)).toEqual(["Caen", "Bordeaux", "Amiens"]);
  });

  it("sorts by name ascending", () => {
    const result = sortRestaurants([c, a, b], { ...defaultFilters, restaurantNameAsc: true }, "fr");
    expect(result.map((r) => r.nom)).toEqual(["Alfa", "Bravo", "Charlie"]);
  });

  it("sorts by name descending", () => {
    const result = sortRestaurants([a, b, c], { ...defaultFilters, restaurantNameDesc: true }, "fr");
    expect(result.map((r) => r.nom)).toEqual(["Charlie", "Bravo", "Alfa"]);
  });
});

// ---------------------------------------------------------------------------
// filterRestaurants — additional edge cases
// ---------------------------------------------------------------------------
describe("filterRestaurants — edge cases", () => {
  describe("missing type field", () => {
    it("excludes restaurant without type when restaurantType filter is set", () => {
      const r = makeRestaurant({ type: undefined });
      expect(filterRestaurants([r], { ...defaultFilters, restaurantType: 1 })).toHaveLength(0);
    });

    it("includes restaurant without type when restaurantType is -1 (all)", () => {
      const r = makeRestaurant({ type: undefined });
      expect(filterRestaurants([r], defaultFilters)).toHaveLength(1);
    });
  });

  describe("nearMe with missing userPosition", () => {
    it("passes all through when nearMe=true and userPosition is undefined", () => {
      const list = [makeRestaurant({ code: 1 }), makeRestaurant({ code: 2 })];
      expect(filterRestaurants(list, { ...defaultFilters, nearMe: true }, undefined)).toHaveLength(2);
    });
  });

  describe("empty input list", () => {
    it("returns empty array for empty input", () => {
      expect(filterRestaurants([], { ...defaultFilters, search: "anything" })).toHaveLength(0);
    });
  });

  describe("search by code", () => {
    it("matches partial code string", () => {
      const r = makeRestaurant({ code: 1234 });
      expect(filterRestaurants([r], { ...defaultFilters, search: "123" })).toHaveLength(1);
    });
  });
});

// ---------------------------------------------------------------------------
// buildQueryString — additional cases
// ---------------------------------------------------------------------------
describe("buildQueryString — additional cases", () => {
  it("encodes restaurantType when not -1", () => {
    const qs = buildQueryString({ ...defaultFilters, restaurantType: 5 });
    expect(new URLSearchParams(qs).get("restaurantType")).toBe("5");
  });

  it("omits restaurantType when -1", () => {
    expect(new URLSearchParams(buildQueryString(defaultFilters)).has("restaurantType")).toBe(false);
  });



  it("nearMe flag is NOT serialized to the query string", () => {
    const qs = buildQueryString({ ...defaultFilters, nearMe: true });
    expect(new URLSearchParams(qs).has("nearMe")).toBe(false);
  });

  it("encodes restaurantCityAsc flag", () => {
    const qs = buildQueryString({ ...defaultFilters, restaurantCityAsc: true });
    expect(new URLSearchParams(qs).get("restaurantCityAsc")).toBe("true");
  });

  it("encodes restaurantCityDesc flag", () => {
    const qs = buildQueryString({ ...defaultFilters, restaurantCityDesc: true });
    expect(new URLSearchParams(qs).get("restaurantCityDesc")).toBe("true");
  });
});
