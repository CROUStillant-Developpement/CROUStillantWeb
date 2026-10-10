import { describe, it, expect } from "vitest";
import { findFollowedDishes } from "@/lib/followed-dishes";
import type { Menu, Repas } from "@/services/types";

function repas(type: Repas["type"], ...dishes: [string | number, string][]): Repas {
  return {
    code: `repas-${type}`,
    type,
    categories: [
      {
        code: "cat-1",
        libelle: "Plats du jour",
        ordre: 1,
        // The API serialises dish codes as numbers, whatever the type says.
        plats: dishes.map(([code, libelle]) => ({ code: code as string, libelle })),
      },
    ],
  };
}

function menu(date: string, ...meals: Repas[]): Menu {
  return { code: `menu-${date}`, date, repas: meals };
}

const TARTIFLETTE = { code: "12", libelle: "Tartiflette" };
const BURGER = { code: "34", libelle: "Burger" };

describe("findFollowedDishes", () => {
  it("returns nothing when no dish is followed", () => {
    const menus = [menu("12-10-2026", repas("midi", ["12", "Tartiflette"]))];
    expect(findFollowedDishes(menus, [])).toEqual([]);
  });

  it("returns nothing when no followed dish is served", () => {
    const menus = [menu("12-10-2026", repas("midi", ["99", "Frites"]))];
    expect(findFollowedDishes(menus, [TARTIFLETTE])).toEqual([]);
  });

  it("finds a followed dish with its date and meal", () => {
    const menus = [menu("12-10-2026", repas("midi", ["99", "Frites"], ["12", "Tartiflette"]))];
    expect(findFollowedDishes(menus, [TARTIFLETTE])).toEqual([
      { dish: TARTIFLETTE, date: "12-10-2026", meal: "midi" },
    ]);
  });

  it("matches dish codes sent as numbers", () => {
    const menus = [menu("12-10-2026", repas("midi", [12, "Tartiflette"]))];
    expect(findFollowedDishes(menus, [TARTIFLETTE])).toHaveLength(1);
  });

  it("matches on the code, not on the label", () => {
    const menus = [menu("12-10-2026", repas("midi", ["77", "Tartiflette"]))];
    expect(findFollowedDishes(menus, [TARTIFLETTE])).toEqual([]);
  });

  it("reports a dish once per meal even when it is listed twice", () => {
    const menus = [
      menu("12-10-2026", repas("midi", ["12", "Tartiflette"], ["12", "Tartiflette"])),
    ];
    expect(findFollowedDishes(menus, [TARTIFLETTE])).toHaveLength(1);
  });

  it("reports the same dish for each meal and each day it is served", () => {
    const menus = [
      menu("12-10-2026", repas("midi", ["12", "Tartiflette"]), repas("soir", ["12", "Tartiflette"])),
      menu("13-10-2026", repas("midi", ["12", "Tartiflette"])),
    ];
    expect(findFollowedDishes(menus, [TARTIFLETTE])).toHaveLength(3);
  });

  it("sorts by date, then by meal", () => {
    const menus = [
      menu("02-11-2026", repas("midi", ["12", "Tartiflette"])),
      menu("30-10-2026", repas("soir", ["34", "Burger"]), repas("midi", ["12", "Tartiflette"])),
    ];
    expect(
      findFollowedDishes(menus, [TARTIFLETTE, BURGER]).map((match) => [match.date, match.meal])
    ).toEqual([
      ["30-10-2026", "midi"],
      ["30-10-2026", "soir"],
      ["02-11-2026", "midi"],
    ]);
  });
});
