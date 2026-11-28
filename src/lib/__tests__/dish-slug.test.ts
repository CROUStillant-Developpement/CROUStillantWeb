import { describe, it, expect } from "vitest";
import { buildDishSlug, extractDishId } from "@/lib/dish-slug";

describe("dish slugs", () => {
  it("builds <name>-d<id>", () => {
    expect(buildDishSlug({ libelle: "Tortelini à la crème", code: 210996 })).toBe("tortelini-a-la-creme-d210996");
  });

  it("falls back to the id when the name has no letters", () => {
    expect(buildDishSlug({ libelle: "???", code: 7 })).toBe("7");
  });

  it("reads the id back, from the slug or a bare id", () => {
    expect(extractDishId("tortelini-a-la-creme-d210996")).toBe(210996);
    expect(extractDishId("210996")).toBe(210996);
    expect(extractDishId("old-name-d42")).toBe(42);
  });

  it("rejects anything else", () => {
    expect(extractDishId("frites")).toBeNull();
    expect(extractDishId("frites-r12")).toBeNull();
    expect(extractDishId(undefined)).toBeNull();
  });
});
