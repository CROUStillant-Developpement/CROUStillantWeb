import { describe, expect, it } from "vitest";
import {
  getRestaurantCity,
  getRestaurantPostcode,
  nameContainsCity,
  parseOpeningRange,
  pickHighlightDishes,
  truncateForSnippet,
} from "@/lib/restaurant-seo";
import { Menu, Restaurant } from "@/services/types";

const restaurant = (adresse: string) =>
  ({ adresse, region: { code: 23, libelle: "Reims" } }) as unknown as Restaurant;

describe("getRestaurantCity", () => {
  it("reads the city after the postcode", () => {
    expect(getRestaurantCity(restaurant("4 chemin des Rouliers, 51100 Reims"))).toBe("Reims");
    expect(getRestaurantCity(restaurant("94 bd Mansart - 21 000 DIJON"))).toBe("Dijon");
    expect(getRestaurantCity(restaurant("62 rue Michel Ange - 44600, Saint Nazaire"))).toBe("Saint Nazaire");
  });

  it("reads a trailing \"à <ville>\"", () => {
    expect(getRestaurantCity(restaurant("18 avenue de Bardanac à Pessac"))).toBe("Pessac");
    expect(getRestaurantCity(restaurant("2 avenue Poplawski à PAU"))).toBe("Pau");
  });

  it("falls back to the CROUS region", () => {
    expect(getRestaurantCity(restaurant("Avenue Jean Monnet"))).toBe("Reims");
    expect(getRestaurantCity(restaurant(null as unknown as string))).toBe("Reims");
  });
});

describe("getRestaurantPostcode", () => {
  it("normalises spaced postcodes", () => {
    expect(getRestaurantPostcode(restaurant("94 bd Mansart - 21 000 DIJON"))).toBe("21000");
    expect(getRestaurantPostcode(restaurant("Avenue Jean Monnet"))).toBeNull();
  });
});

describe("nameContainsCity", () => {
  it("ignores case and accents", () => {
    expect(nameContainsCity("Cafet IUT Reims", "Reims")).toBe(true);
    expect(nameContainsCity("Resto U Moulin de la Housse", "Reims")).toBe(false);
  });
});

describe("parseOpeningRange", () => {
  it("keeps the widest range across lines", () => {
    expect(parseOpeningRange(["Self: 11h30 - 13h45", "Cafétéria : 8h à 16h"])).toEqual({
      opens: "08:00",
      closes: "16:00",
    });
    expect(parseOpeningRange(["Du lundi au vendredi de 11h15 à 13h30"])).toEqual({
      opens: "11:15",
      closes: "13:30",
    });
  });

  it("returns null when nothing parses", () => {
    expect(parseOpeningRange(["Du lundi au vendredi"])).toBeNull();
    expect(parseOpeningRange(undefined)).toBeNull();
  });
});

describe("pickHighlightDishes", () => {
  it("puts main courses first and skips empty menus", () => {
    const menus = [
      { code: "1", date: "25-09-2026", repas: [] },
      {
        code: "2",
        date: "28-09-2026",
        repas: [
          {
            code: "a",
            type: "midi",
            categories: [
              { code: "e", libelle: "Entrées", ordre: 1, plats: [{ code: "1", libelle: "Coleslaw" }] },
              {
                code: "p",
                libelle: "Plat self",
                ordre: 2,
                plats: [
                  { code: "2", libelle: "Gnocchis" },
                  { code: "3", libelle: "Poisson sauce basquaise" },
                ],
              },
            ],
          },
        ],
      },
    ] as unknown as Menu[];

    expect(pickHighlightDishes(menus)).toEqual(["Gnocchis", "Poisson sauce basquaise", "Coleslaw"]);
  });
});

describe("truncateForSnippet", () => {
  it("cuts on a word boundary", () => {
    const text = "mot ".repeat(60).trim();
    const result = truncateForSnippet(text, 50);
    expect(result.length).toBeLessThanOrEqual(50);
    expect(result.endsWith("mot…")).toBe(true);
  });
});
