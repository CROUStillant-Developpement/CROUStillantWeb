import { DisplayType, Region } from "@/services/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LocalStorageFavorite {
  code: number;
  name: string;
}

/**
 * Represents the state of the user preferences store.
 */
interface StoreState {
  /**
   * List of favorite items stored in local storage.
   */
  favorites: LocalStorageFavorite[];

  /**
   * The favorite item that is starred.
   */
  starredFav: LocalStorageFavorite | null;

  /**
   * The display type setting.
   */
  display: DisplayType;

  /**
   * The region selected as favorite.
   */
  favoriteRegion: Region | null;

  /**
   * Indicates whether the dyslexic font is enabled.
   */
  dislexicFont: boolean;

  /**
   * Toggles the display type.
   */
  toggleDisplay: () => void;

  /**
   * Toggles the dyslexic font setting.
   */
  toggleDislexicFont: () => void;

  /**
   * Adds or removes an item from the favorites list.
   * 
   * @param code - The code of the item.
   * @param name - The name of the item (optional).
   */
  addOrRemoveFromFavorites: (code: number, name?: string, qr?: boolean) => void;

  /**
   * Sets the starred favorite item.
   * 
   * @param favorite - The favorite item to be starred.
   */
  setStarredFav: (favorite: LocalStorageFavorite) => void;

  /**
   * Sets the favorite region.
   * 
   * @param region - The region to be set as favorite.
   */
  setFavoriteRegion: (region: Region) => void;

  /**
   * Clears all user preferences.
   */
  clearUserPreferences: () => void;
}


/**
 * Custom hook to manage user preferences using Zustand for state management and localStorage for persistence.
 *
 * @returns {StoreState} The state and actions to manage user preferences.
 *
 * @property {string} display - The current display mode, either "list" or "map".
 * @property {Array<{code: number, name: string}>} favorites - The list of favorite items.
 * @property {null | {code: number, name: string}} starredFav - The starred favorite item.
 * @property {{code: number, libelle: string}} favoriteRegion - The user's favorite region.
 * @property {boolean} dislexicFont - Whether the dyslexic font is enabled.
 *
 * @method toggleDisplay - Toggles the display mode between "list" and "map".
 * @method toggleDislexicFont - Toggles the dyslexic font setting.
 * @method addOrRemoveFromFavorites - Adds or removes an item from the favorites list.
 * @param {number} code - The code of the item to add or remove.
 * @param {string} [name] - The name of the item to add (optional).
 * @param {number} code - The code of the item to add.
 * @param {string} name - The name of the item to add.
 * @method setStarredFav - Sets the starred favorite item.
 * @param {LocalStorageFavorite} favorite - The favorite item to set as starred.
 * @method setFavoriteRegion - Sets the user's favorite region.
 * @param {Region} region - The region to set as favorite.
 * @method clearUserPreferences - Clears all user preferences, resetting to default values.
 */
export const useUserPreferences = create<StoreState>()(
  persist(
    (set) => ({
      display: "list",
      favorites: [],
      starredFav: null,
      favoriteRegion: { code: -1, libelle: "All Regions" },
      dislexicFont: false,

      toggleDisplay: () =>
        set((state) => ({
          display: state.display === "list" ? "map" : "list",
        })),

      toggleDislexicFont: () =>
        set((state) => ({
          dislexicFont: !state.dislexicFont,
        })),

      addOrRemoveFromFavorites: (code: number, name?: string, qr: boolean = false) =>
        set((state) => {
          const index = state.favorites.findIndex((f) => f.code === code);

          // if index is -1, the item is not in the favorites list
          if (index === -1) {
            if (!state.starredFav) {
              return {
                starredFav: { code, name: name ?? "Unknown" },
                favorites: [
                  ...state.favorites,
                  { code, name: name ?? "Unknown" },
                ],
              };
            }
            return {
              favorites: [
                ...state.favorites,
                { code, name: name ?? "Unknown" },
              ],
            };
          }

          // if qr is true, we don't want to remove the item from the list (if called 2 times in a row)
          if (qr) {
            return {
              favorites: state.favorites,
            };
          }

          const newFavorites = [...state.favorites];
          newFavorites.splice(index, 1);

          if (!state.starredFav && newFavorites.length > 0) {
            return { starredFav: newFavorites[0], favorites: newFavorites };
          } else if (state.starredFav?.code === code) {
            return { starredFav: null, favorites: newFavorites };
          } else {
            return { favorites: newFavorites };
          }
        }),

      setStarredFav: (favorite: LocalStorageFavorite) =>
        set(() => ({
          starredFav: favorite,
        })),

      setFavoriteRegion: (region: Region) =>
        set(() => ({
          favoriteRegion: region,
        })),

      clearUserPreferences: () =>
        set(() => ({
          favorites: [],
          starredFav: null,
          display: "list",
          favoriteRegion: { code: -1, libelle: "All Regions" },
        })),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage), // Automatically uses localStorage
    }
  )
);
