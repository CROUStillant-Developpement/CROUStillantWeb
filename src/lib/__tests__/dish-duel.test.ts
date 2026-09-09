import { describe, it, expect } from "vitest";
import {
  KONAMI_CODE,
  buildDeck,
  duelWinner,
  isFairMatch,
  isPlayableDish,
  pickDuel,
  type DuelDish,
} from "@/lib/dish-duel";
import type { Plat } from "@/services/types";

function makePlat(overrides: Partial<Plat> = {}): Plat {
  return {
    code: "1" as unknown as Plat["code"],
    libelle: "Frites",
    total: 100,
    ...overrides,
  };
}

function makeDish(total: number, code: string = String(total)): DuelDish {
  return { code: code as unknown as DuelDish["code"], libelle: `Plat ${code}`, total };
}

/** Random source returning the given values in order, then cycling. */
function seededRandom(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

// ---------------------------------------------------------------------------
// isPlayableDish
// ---------------------------------------------------------------------------
describe("isPlayableDish", () => {
  it("accepts a normal dish", () => {
    expect(isPlayableDish(makePlat())).toBe(true);
  });

  it("rejects the CROUS placeholder rows", () => {
    expect(isPlayableDish(makePlat({ libelle: "Menu non communiqué" }))).toBe(false);
    expect(isPlayableDish(makePlat({ libelle: "Fermé" }))).toBe(false);
    expect(isPlayableDish(makePlat({ libelle: "Repas non communiqué" }))).toBe(false);
    expect(isPlayableDish(makePlat({ libelle: "Pas de service ce jour" }))).toBe(false);
  });

  it("rejects dishes without a usable occurrence count", () => {
    expect(isPlayableDish(makePlat({ total: undefined }))).toBe(false);
    expect(isPlayableDish(makePlat({ total: 0 }))).toBe(false);
    expect(isPlayableDish(makePlat({ total: -3 }))).toBe(false);
    expect(isPlayableDish(makePlat({ total: NaN }))).toBe(false);
  });

  it("rejects dishes without a label", () => {
    expect(isPlayableDish(makePlat({ libelle: "   " }))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildDeck
// ---------------------------------------------------------------------------
describe("buildDeck", () => {
  it("keeps only playable dishes", () => {
    const deck = buildDeck([
      makePlat({ code: "1" as unknown as Plat["code"], libelle: "Frites", total: 500 }),
      makePlat({ code: "2" as unknown as Plat["code"], libelle: "Menu non communiqué", total: 9000 }),
      makePlat({ code: "3" as unknown as Plat["code"], libelle: "Riz", total: 300 }),
    ]);

    expect(deck.map((d) => d.libelle)).toEqual(["Frites", "Riz"]);
  });

  it("trims labels and de-duplicates by code", () => {
    const deck = buildDeck([
      makePlat({ code: "1" as unknown as Plat["code"], libelle: "  Frites  ", total: 500 }),
      makePlat({ code: "1" as unknown as Plat["code"], libelle: "Frites bis", total: 400 }),
    ]);

    expect(deck).toEqual([{ code: "1", libelle: "Frites", total: 500 }]);
  });

  it("returns an empty deck for an empty ranking", () => {
    expect(buildDeck([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// isFairMatch
// ---------------------------------------------------------------------------
describe("isFairMatch", () => {
  it("accepts totals more than 10% apart", () => {
    expect(isFairMatch(makeDish(100), makeDish(50))).toBe(true);
  });

  it("rejects totals that are too close to call", () => {
    expect(isFairMatch(makeDish(100), makeDish(95))).toBe(false);
    expect(isFairMatch(makeDish(100), makeDish(100))).toBe(false);
  });

  it("is symmetric", () => {
    const a = makeDish(4000);
    const b = makeDish(1000);
    expect(isFairMatch(a, b)).toBe(isFairMatch(b, a));
  });
});

// ---------------------------------------------------------------------------
// duelWinner
// ---------------------------------------------------------------------------
describe("duelWinner", () => {
  it("returns the most served dish", () => {
    const a = makeDish(300, "a");
    const b = makeDish(100, "b");
    expect(duelWinner(a, b)).toBe(a);
    expect(duelWinner(b, a)).toBe(a);
  });

  it("returns null on a perfect tie", () => {
    expect(duelWinner(makeDish(100, "a"), makeDish(100, "b"))).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// pickDuel
// ---------------------------------------------------------------------------
describe("pickDuel", () => {
  const deck = [makeDish(1000, "a"), makeDish(500, "b"), makeDish(100, "c")];

  it("returns null when the deck is too small", () => {
    expect(pickDuel([], seededRandom([0]))).toBeNull();
    expect(pickDuel([makeDish(100)], seededRandom([0]))).toBeNull();
  });

  it("returns two distinct dishes from the deck", () => {
    const duel = pickDuel(deck, seededRandom([0, 0, 0.9]))!;

    expect(duel).toHaveLength(2);
    expect(duel[0].code).not.toBe(duel[1].code);
    duel.forEach((dish) => expect(deck).toContain(dish));
  });

  it("shuffles the sides so the winner isn't always first", () => {
    const draws = seededRandom([0, 0, 0.9]);
    const [left] = pickDuel(deck, draws)!;
    const swapped = seededRandom([0, 0, 0.1]);
    const [otherLeft] = pickDuel(deck, swapped)!;

    expect(left.code).not.toBe(otherLeft.code);
  });

  it("prefers a pair whose totals are far enough apart", () => {
    const close = [makeDish(1000, "a"), makeDish(990, "b"), makeDish(100, "c")];
    // First draw picks "a"; the fair-match filter should leave only "c".
    const duel = pickDuel(close, seededRandom([0, 0, 0.9]))!;

    expect(duel.map((d) => d.code).sort()).toEqual(["a", "c"]);
  });

  it("falls back to any opponent when no pair is fair", () => {
    const close = [makeDish(1000, "a"), makeDish(990, "b")];
    const duel = pickDuel(close, seededRandom([0, 0, 0.9]))!;

    expect(duel.map((d) => d.code).sort()).toEqual(["a", "b"]);
  });

  it("avoids dishes drawn recently", () => {
    const duel = pickDuel(deck, seededRandom([0, 0, 0.9]), [
      "a" as unknown as DuelDish["code"],
    ])!;

    expect(duel.map((d) => d.code)).not.toContain("a");
  });

  it("ignores the recent list when it would leave too few dishes", () => {
    const duel = pickDuel(
      deck,
      seededRandom([0, 0, 0.9]),
      deck.map((d) => d.code)
    );

    expect(duel).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// KONAMI_CODE
// ---------------------------------------------------------------------------
describe("KONAMI_CODE", () => {
  it("is the canonical sequence", () => {
    expect([...KONAMI_CODE]).toEqual([
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ]);
  });
});
