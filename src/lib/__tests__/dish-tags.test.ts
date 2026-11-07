import { describe, it, expect } from "vitest";
import { getDishName, getDishTags, getDishType, isInfoLine, isNoise } from "@/lib/dish-tags";
import type { AnalysePlat, Plat } from "@/services/types";

function makeAnalyse(overrides: Partial<AnalysePlat> = {}): AnalysePlat {
  return {
    nature: "DISH",
    type_info: null,
    libelle: "Curry de légumes",
    type: "PLAT",
    points: null,
    prix: [],
    allergenes_declares: [],
    vegetarien: false,
    origines: [],
    labels: [],
    composants: [],
    ...overrides,
  };
}

function makePlat(analyse?: AnalysePlat | null, libelle = "Curry de légumes (VG) 4 pts (1.7)"): Plat {
  return { code: "1", libelle, analyse };
}

describe("getDishName", () => {
  it("uses the clean label from the analysis", () => {
    expect(getDishName(makePlat(makeAnalyse()))).toBe("Curry de légumes");
  });

  it("falls back to the raw label without analysis", () => {
    expect(getDishName(makePlat(undefined))).toBe("Curry de légumes (VG) 4 pts (1.7)");
    expect(getDishName(makePlat(null))).toBe("Curry de légumes (VG) 4 pts (1.7)");
    expect(getDishName(makePlat(makeAnalyse({ libelle: null })))).toBe("Curry de légumes (VG) 4 pts (1.7)");
    expect(getDishName(makePlat(makeAnalyse({ libelle: "  " })))).toBe("Curry de légumes (VG) 4 pts (1.7)");
  });
});

describe("isInfoLine / isNoise", () => {
  it("detects information lines", () => {
    expect(isInfoLine(makePlat(makeAnalyse({ nature: "INFO", type_info: "CLOSURE" })))).toBe(true);
    expect(isInfoLine(makePlat(makeAnalyse({ nature: "ALLERGENS" })))).toBe(true);
    expect(isInfoLine(makePlat(makeAnalyse()))).toBe(false);
    expect(isInfoLine(makePlat(undefined))).toBe(false);
  });

  it("detects noise", () => {
    expect(isNoise(makePlat(makeAnalyse({ nature: "JUNK" })))).toBe(true);
    expect(isNoise(makePlat(makeAnalyse()))).toBe(false);
    expect(isNoise(makePlat(undefined))).toBe(false);
  });
});

describe("getDishType", () => {
  it("uses the analysis in menus and the canonical type elsewhere", () => {
    expect(getDishType(makePlat(makeAnalyse({ type: "ENTREE" })))).toBe("ENTREE");
    expect(getDishType(makePlat(makeAnalyse({ nature: "INFO", type: "PLAT" })))).toBeNull();
    expect(getDishType({ code: "2", libelle: "Fruits", type: "DESSERT" })).toBe("DESSERT");
    expect(getDishType({ code: "2", libelle: "Fruits" })).toBeNull();
  });
});

describe("getDishTags", () => {
  it("returns the tags in display order: type, vegetarian, labels, allergens, points", () => {
    const allergen = { code: "LAIT", libelle: "Lait", source: "CROUS", verifie: true };
    const tags = getDishTags(
      makePlat(
        makeAnalyse({
          vegetarien: true,
          labels: ["bio", "Maison"],
          allergenes_declares: [allergen],
          points: 4,
        })
      )
    );

    expect(tags).toEqual([
      { kind: "type", type: "PLAT" },
      { kind: "vegetarian" },
      { kind: "label", label: "bio" },
      { kind: "label", label: "maison" },
      { kind: "allergens", allergens: [allergen] },
      { kind: "points", points: 4 },
    ]);
  });

  it("skips the AUTRE type and unknown labels, and merges duplicate labels", () => {
    const tags = getDishTags(
      makePlat(makeAnalyse({ type: "AUTRE", labels: ["plat complet", "rouge", "rouge loire atlantique", "supplement"] }))
    );
    expect(tags).toEqual([{ kind: "label", label: "labelRouge" }]);
  });

  it("returns no tags for information lines or dishes without analysis", () => {
    expect(getDishTags(makePlat(makeAnalyse({ nature: "INFO", vegetarien: true })))).toEqual([]);
    expect(getDishTags(makePlat(undefined))).toEqual([]);
    expect(getDishTags(makePlat(null))).toEqual([]);
  });

  it("tags canonical dishes (/plats, /plats/top) with their type and vegetarian flag", () => {
    expect(getDishTags({ code: "2", libelle: "Fruits", type: "DESSERT", vegetarien: false })).toEqual([
      { kind: "type", type: "DESSERT" },
    ]);
    expect(getDishTags({ code: "3", libelle: "Galette", type: "AUTRE", vegetarien: true })).toEqual([
      { kind: "vegetarian" },
    ]);
  });

  it("keeps half points", () => {
    expect(getDishTags(makePlat(makeAnalyse({ type: null, points: 1.5 })))).toEqual([{ kind: "points", points: 1.5 }]);
  });
});
