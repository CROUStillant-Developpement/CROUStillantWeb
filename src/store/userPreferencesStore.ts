import { DisplayType, Region } from "@/services/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LocalStorageFavorite {
  code: number;
  name: string;
}

interface StoreState {
  favorites: LocalStorageFavorite[];
  starredFav: LocalStorageFavorite | null;
  display: DisplayType;
  favoriteRegion: Region | null;
  toggleDisplay: () => void;
  addOrRemoveFromFavorites: (code: number, name?: string) => void;
  setStarredFav: (favorite: LocalStorageFavorite) => void;
  setFavoriteRegion: (region: Region) => void;
  clearUserPreferences: () => void;
}

/**
 * Custom hook to manage user preferences using Zustand and localStorage.
 *
 * @returns {StoreState} The state and actions for user preferences.
 *
 * @property {string} display - The current display mode, either "list" or "map".
 * @property {Array<{code: number, name: string}>} favorites - The list of favorite items.
 * @property {null | {code: number, name: string}} starredFav - The starred favorite item.
 *
 * @method toggleDisplay - Toggles the display mode between "list" and "map".
 * @method addOrRemoveFromFavorites - Adds or removes an item from the favorites list.
 * @param {number} code - The code of the item to add or remove.
 * @param {string} [name] - The name of the item to add (optional).
 *
 * @method setStarredFav - Sets the starred favorite item.
 * @param {LocalStorageFavorite} favorite - The favorite item to set as starred.
 *
 * @method clearUserPreferences - Clears all user preferences.
 *
 * @example
 * const {
 *   display,
 *   favorites,
 *   starredFav,
 *   toggleDisplay,
 *   addOrRemoveFromFavorites,
 *   setStarredFav,
 *   clearUserPreferences
 * } = useUserPreferences();
 */
export const useUserPreferences = create<StoreState>()(
  persist(
    (set) => ({
      display: "list",
      favorites: [],
      starredFav: null,
      favoriteRegion: null,

      toggleDisplay: () =>
        set((state) => ({
          display: state.display === "list" ? "map" : "list",
        })),

      addOrRemoveFromFavorites: (code: number, name?: string) =>
        set((state) => {
          const index = state.favorites.findIndex((f) => f.code === code);
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
        })),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage), // Automatically uses localStorage
    }
  )
);
