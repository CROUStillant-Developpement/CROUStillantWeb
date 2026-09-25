import { describe, expect, it } from "vitest";
import {
  buildRegionSlug,
  findRegionBySlug,
  groupRestaurantsByCity,
} from "@/lib/region-slug";
import { Restaurant } from "@/services/types";

const regions = [
  { code: 23, libelle: "Reims" },
  { code: 26, libelle: "Aix-Marseille" },
  { code: 21, libelle: "Orléans-Tours" },
];

describe("buildRegionSlug", () => {
  it("strips accents and keeps hyphens", () => {
    expect(buildRegionSlug(regions[1])).toBe("aix-marseille");
    expect(buildRegionSlug(regions[2])).toBe("orleans-tours");
    expect(buildRegionSlug({ code: 30, libelle: "Bourgogne Franche Comte" })).toBe(
      "bourgogne-franche-comte"
    );
  });
});

describe("findRegionBySlug", () => {
  it("resolves slugs and bare ids", () => {
    expect(findRegionBySlug(regions, "reims")?.code).toBe(23);
    expect(findRegionBySlug(regions, "23")?.code).toBe(23);
    expect(findRegionBySlug(regions, "paris")).toBeUndefined();
  });
});

describe("groupRestaurantsByCity", () => {
  it("puts the biggest city first and sorts names", () => {
    const make = (nom: string, adresse: string) =>
      ({ nom, adresse, region: regions[0] }) as unknown as Restaurant;

    const groups = groupRestaurantsByCity([
      make("Resto U Paul Fort", "Rue Paul Fort, 51100 Reims"),
      make("Cafet IUT Troyes", "9 rue de Québec, 10000 Troyes"),
      make("Resto U Moulin de la Housse", "4 chemin des Rouliers, 51100 Reims"),
    ]);

    expect(groups.map((g) => g.city)).toEqual(["Reims", "Troyes"]);
    expect(groups[0].restaurants.map((r) => r.nom)).toEqual([
      "Resto U Moulin de la Housse",
      "Resto U Paul Fort",
    ]);
  });
});
