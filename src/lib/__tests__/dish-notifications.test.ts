import { describe, it, expect, beforeEach } from "vitest";
import { claimUnsentKeys } from "@/lib/dish-notifications";

beforeEach(() => {
  localStorage.clear();
});

describe("claimUnsentKeys", () => {
  it("returns every key the first time", () => {
    expect(claimUnsentKeys(["a", "b"])).toEqual(["a", "b"]);
  });

  it("does not return a key twice", () => {
    claimUnsentKeys(["a", "b"]);
    expect(claimUnsentKeys(["b", "c"])).toEqual(["c"]);
  });

  it("deduplicates keys within one call", () => {
    expect(claimUnsentKeys(["a", "a"])).toEqual(["a"]);
  });

  it("recovers from an unreadable record", () => {
    localStorage.setItem("dish-notifications-sent", "not json");
    expect(claimUnsentKeys(["a"])).toEqual(["a"]);
    expect(claimUnsentKeys(["a"])).toEqual([]);
  });

  it("forgets the oldest keys beyond 200", () => {
    claimUnsentKeys(Array.from({ length: 200 }, (_, index) => `key-${index}`));
    claimUnsentKeys(["newest"]);

    // "key-0" was pushed out, so it counts as unsent again
    expect(claimUnsentKeys(["key-0", "key-199", "newest"])).toEqual(["key-0"]);
  });
});
