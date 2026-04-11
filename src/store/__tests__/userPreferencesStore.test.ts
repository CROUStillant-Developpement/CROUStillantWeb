import { describe, it, expect, beforeEach } from "vitest";
import { useUserPreferences } from "@/store/userPreferencesStore";

const INITIAL_STATE = {
  display: "list" as const,
  favourites: [],
  starredFav: null,
  favouriteRegion: { code: -1, libelle: "All Regions" },
  dislexicFont: false,
};

beforeEach(() => {
  localStorage.clear();
  // Merge (no replace flag) so action functions are preserved
  useUserPreferences.setState(INITIAL_STATE);
});

describe("userPreferencesStore", () => {
  describe("initial state", () => {
    it("has correct defaults", () => {
      const state = useUserPreferences.getState();
      expect(state.display).toBe("list");
      expect(state.favourites).toEqual([]);
      expect(state.starredFav).toBeNull();
      expect(state.dislexicFont).toBe(false);
    });
  });

  describe("toggleDisplay", () => {
    it("switches from list to map", () => {
      useUserPreferences.getState().toggleDisplay();
      expect(useUserPreferences.getState().display).toBe("map");
    });

    it("switches back from map to list", () => {
      useUserPreferences.getState().toggleDisplay();
      useUserPreferences.getState().toggleDisplay();
      expect(useUserPreferences.getState().display).toBe("list");
    });
  });

  describe("toggleDislexicFont", () => {
    it("enables dyslexic font", () => {
      useUserPreferences.getState().toggleDislexicFont();
      expect(useUserPreferences.getState().dislexicFont).toBe(true);
    });

    it("disables dyslexic font when toggled again", () => {
      useUserPreferences.getState().toggleDislexicFont();
      useUserPreferences.getState().toggleDislexicFont();
      expect(useUserPreferences.getState().dislexicFont).toBe(false);
    });
  });

  describe("addOrRemoveFromfavourites", () => {
    it("adds a new favourite and sets it as starredFav when list is empty", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "Restaurant A");
      const { favourites, starredFav } = useUserPreferences.getState();
      expect(favourites).toHaveLength(1);
      expect(favourites[0]).toEqual({ code: 1, name: "Restaurant A" });
      expect(starredFav).toEqual({ code: 1, name: "Restaurant A" });
    });

    it("adds a second favourite without changing starredFav", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(2, "B");
      const { favourites, starredFav } = useUserPreferences.getState();
      expect(favourites).toHaveLength(2);
      expect(starredFav?.code).toBe(1); // first added stays starred
    });

    it("removes an existing favourite", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(2, "B");
      useUserPreferences.getState().addOrRemoveFromfavourites(2); // remove B
      expect(useUserPreferences.getState().favourites).toHaveLength(1);
      expect(useUserPreferences.getState().favourites[0].code).toBe(1);
    });

    it("sets starredFav to null when the starred favourite is removed and list becomes empty", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(1); // remove the only one
      const { favourites, starredFav } = useUserPreferences.getState();
      expect(favourites).toHaveLength(0);
      expect(starredFav).toBeNull();
    });

    it("sets starredFav to null when the starred item is removed (no auto-promotion)", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(2, "B");
      // #1 is the starred one — remove it
      useUserPreferences.setState({ starredFav: { code: 1, name: "A" } });
      useUserPreferences.getState().addOrRemoveFromfavourites(1);
      // The store sets starredFav to null when the starred item is removed
      expect(useUserPreferences.getState().starredFav).toBeNull();
      // But the remaining favourite #2 is still in the list
      expect(useUserPreferences.getState().favourites[0].code).toBe(2);
    });

    it("does not remove an existing favourite when qr=true", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(1, undefined, true); // qr call
      expect(useUserPreferences.getState().favourites).toHaveLength(1);
    });

    it("uses 'Unknown' as default name", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(5);
      expect(useUserPreferences.getState().favourites[0].name).toBe("Unknown");
    });
  });

  describe("setStarredFav", () => {
    it("updates the starred favourite", () => {
      useUserPreferences.getState().setStarredFav({ code: 42, name: "Special" });
      expect(useUserPreferences.getState().starredFav).toEqual({ code: 42, name: "Special" });
    });
  });

  describe("setfavouriteRegion", () => {
    it("sets the favourite region", () => {
      useUserPreferences.getState().setfavouriteRegion({ code: 10, libelle: "Île-de-France" });
      expect(useUserPreferences.getState().favouriteRegion).toEqual({
        code: 10,
        libelle: "Île-de-France",
      });
    });
  });

  describe("clearUserPreferences", () => {
    it("resets all state to defaults", () => {
      // Set up some non-default state
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().toggleDisplay();
      useUserPreferences.getState().toggleDislexicFont();
      useUserPreferences.getState().setfavouriteRegion({ code: 5, libelle: "Bretagne" });

      useUserPreferences.getState().clearUserPreferences();

      const state = useUserPreferences.getState();
      expect(state.favourites).toEqual([]);
      expect(state.starredFav).toBeNull();
      expect(state.display).toBe("list");
      expect(state.favouriteRegion).toEqual({ code: -1, libelle: "All Regions" });
    });

    it("does NOT reset dislexicFont (documents current behaviour)", () => {
      useUserPreferences.getState().toggleDislexicFont(); // enable
      useUserPreferences.getState().clearUserPreferences();
      // clearUserPreferences currently does not include dislexicFont in its reset
      expect(useUserPreferences.getState().dislexicFont).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// Additional edge cases
// ---------------------------------------------------------------------------
describe("userPreferencesStore — edge cases", () => {
  beforeEach(() => {
    localStorage.clear();
    useUserPreferences.setState({
      display: "list",
      favourites: [],
      starredFav: null,
      favouriteRegion: { code: -1, libelle: "All Regions" },
      dislexicFont: false,
    });
  });

  describe("addOrRemoveFromfavourites — starredFav preservation", () => {
    it("leaves starredFav unchanged when a non-starred item is removed", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(2, "B");
      // #1 is starred; remove #2
      useUserPreferences.getState().addOrRemoveFromfavourites(2);
      expect(useUserPreferences.getState().starredFav?.code).toBe(1);
      expect(useUserPreferences.getState().favourites).toHaveLength(1);
    });

    it("auto-promotes first remaining item when starredFav is null and item is removed", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(2, "B");
      // Force starredFav to null without removing #1
      useUserPreferences.setState({ starredFav: null });
      // Now remove #1 — store should promote the first remaining item
      useUserPreferences.getState().addOrRemoveFromfavourites(1);
      expect(useUserPreferences.getState().starredFav?.code).toBe(2);
    });

    it("adds item with default name 'Unknown' when no name and no existing items", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(99);
      expect(useUserPreferences.getState().favourites[0].name).toBe("Unknown");
      expect(useUserPreferences.getState().starredFav?.name).toBe("Unknown");
    });
  });

  describe("localStorage persistence", () => {
    it("writes state to localStorage under 'user-preferences' key after a change", () => {
      useUserPreferences.getState().toggleDisplay();
      const raw = localStorage.getItem("user-preferences");
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.state.display).toBe("map");
    });

    it("persists favourites to localStorage", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(7, "Resto 7");
      const raw = localStorage.getItem("user-preferences");
      const parsed = JSON.parse(raw!);
      expect(parsed.state.favourites).toHaveLength(1);
      expect(parsed.state.favourites[0].code).toBe(7);
    });

    it("persists dislexicFont toggle to localStorage", () => {
      useUserPreferences.getState().toggleDislexicFont();
      const parsed = JSON.parse(localStorage.getItem("user-preferences")!);
      expect(parsed.state.dislexicFont).toBe(true);
    });
  });

  describe("setStarredFav", () => {
    it("replaces an existing starredFav", () => {
      useUserPreferences.getState().addOrRemoveFromfavourites(1, "A");
      useUserPreferences.getState().addOrRemoveFromfavourites(2, "B");
      useUserPreferences.getState().setStarredFav({ code: 2, name: "B" });
      expect(useUserPreferences.getState().starredFav?.code).toBe(2);
    });
  });

  describe("setfavouriteRegion", () => {
    it("replaces a previously set region", () => {
      useUserPreferences.getState().setfavouriteRegion({ code: 10, libelle: "IDF" });
      useUserPreferences.getState().setfavouriteRegion({ code: 20, libelle: "Bretagne" });
      expect(useUserPreferences.getState().favouriteRegion?.code).toBe(20);
    });
  });
});
