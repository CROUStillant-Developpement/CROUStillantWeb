import { DisplayType, Region } from "@/services/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LocalStoragefavourite {
  code: number;
  name: string;
}

/**
 * Represents the state of the user preferences store.
 */
interface StoreState {
  /**
   * List of favourite items stored in local storage.
   */
  favourites: LocalStoragefavourite[];

  /**
   * The favourite item that is starred.
   */
  starredFav: LocalStoragefavourite | null;

  /**
   * The display type setting.
   */
  display: DisplayType;

  /**
   * The region selected as favourite.
   */
  favouriteRegion: Region | null;

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
   * Adds or removes an item from the favourites list.
   * 
   * @param code - The code of the item.
   * @param name - The name of the item (optional).
   */
  addOrRemoveFromfavourites: (code: number, name?: string, qr?: boolean) => void;

  /**
   * Sets the starred favourite item.
   * 
   * @param favourite - The favourite item to be starred.
   */
  setStarredFav: (favourite: LocalStoragefavourite) => void;

  /**
   * Sets the favourite region.
   * 
   * @param region - The region to be set as favourite.
   */
  setfavouriteRegion: (region: Region) => void;

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
 * @property {Array<{code: number, name: string}>} favourites - The list of favourite items.
 * @property {null | {code: number, name: string}} starredFav - The starred favourite item.
 * @property {{code: number, libelle: string}} favouriteRegion - The user's favourite region.
 * @property {boolean} dislexicFont - Whether the dyslexic font is enabled.
 *
 * @method toggleDisplay - Toggles the display mode between "list" and "map".
 * @method toggleDislexicFont - Toggles the dyslexic font setting.
 * @method addOrRemoveFromfavourites - Adds or removes an item from the favourites list.
 * @param {number} code - The code of the item to add or remove.
 * @param {string} [name] - The name of the item to add (optional).
 * @param {number} code - The code of the item to add.
 * @param {string} name - The name of the item to add.
 * @method setStarredFav - Sets the starred favourite item.
 * @param {LocalStoragefavourite} favourite - The favourite item to set as starred.
 * @method setfavouriteRegion - Sets the user's favourite region.
 * @param {Region} region - The region to set as favourite.
 * @method clearUserPreferences - Clears all user preferences, resetting to default values.
 */
export const useUserPreferences = create<StoreState>()(
  persist(
    (set) => ({
      display: "list",
      favourites: [],
      starredFav: null,
      favouriteRegion: { code: -1, libelle: "All Regions" },
      dislexicFont: false,

      toggleDisplay: () =>
        set((state) => ({
          display: state.display === "list" ? "map" : "list",
        })),

      toggleDislexicFont: () =>
        set((state) => ({
          dislexicFont: !state.dislexicFont,
        })),

      addOrRemoveFromfavourites: (code: number, name?: string, qr: boolean = false) =>
        set((state) => {
          const index = state.favourites.findIndex((f) => f.code === code);

          // if index is -1, the item is not in the favourites list
          if (index === -1) {
            if (!state.starredFav) {
              return {
                starredFav: { code, name: name ?? "Unknown" },
                favourites: [
                  ...state.favourites,
                  { code, name: name ?? "Unknown" },
                ],
              };
            }
            return {
              favourites: [
                ...state.favourites,
                { code, name: name ?? "Unknown" },
              ],
            };
          }

          // if qr is true, we don't want to remove the item from the list (if called 2 times in a row)
          if (qr) {
            return {
              favourites: state.favourites,
            };
          }

          const newfavourites = [...state.favourites];
          newfavourites.splice(index, 1);

          if (!state.starredFav && newfavourites.length > 0) {
            return { starredFav: newfavourites[0], favourites: newfavourites };
          } else if (state.starredFav?.code === code) {
            return { starredFav: null, favourites: newfavourites };
          } else {
            return { favourites: newfavourites };
          }
        }),

      setStarredFav: (favourite: LocalStoragefavourite) =>
        set(() => ({
          starredFav: favourite,
        })),

      setfavouriteRegion: (region: Region) =>
        set(() => ({
          favouriteRegion: region,
        })),

      clearUserPreferences: () =>
        set(() => ({
          favourites: [],
          starredFav: null,
          display: "list",
          favouriteRegion: { code: -1, libelle: "All Regions" },
        })),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage), // Automatically uses localStorage
    }
  )
);
