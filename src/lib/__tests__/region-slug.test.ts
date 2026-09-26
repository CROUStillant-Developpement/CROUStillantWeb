import { describe, expect, it } from "vitest";
import { groupRestaurantsByCity } from "@/lib/region-slug";
import { Restaurant } from "@/services/types";

const restaurant = (code: number, adresse: string) =>
  ({
    code,
    nom: `Resto ${code}`,
    adresse,
    region: { code: 9, libelle: "Grenoble Alpes" },
  }) as unknown as Restaurant;

describe("groupRestaurantsByCity", () => {
  it("merges spelling variants of the same city", () => {
    const groups = groupRestaurantsByCity([
      restaurant(1, "Domaine universitaire, 38400 Saint-Martin-d'Hères"),
      restaurant(2, "Domaine universitaire, 38400 Saint Martin d'Hères"),
      restaurant(3, "Domaine universitaire, 38400 - Saint-Martin-d'Hères"),
      restaurant(6, "Domaine universitaire, 38400 Saint martin d'heres"),
      restaurant(7, "Domaine universitaire, 38400 Saint martin d'heres"),
      restaurant(8, "Domaine universitaire, 38400 St Martin d'Hères"),
      restaurant(9, "Domaine universitaire, 38400 St Martin Hères"),
      restaurant(4, "Savoie Technolac, 73370 Le Bourget du Lac"),
      restaurant(5, "Savoie Technolac, 73370 le Bourget du Lac"),
    ]);

    expect(groups.map((group) => [group.city, group.restaurants.length])).toEqual([
      ["Saint-Martin-d'Hères", 7],
      ["Le Bourget du Lac", 2],
    ]);
  });
});
