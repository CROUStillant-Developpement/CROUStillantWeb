import { DisplayType } from "@/services/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface StoreState {
  favorites: number[]; // We store the code of the restaurant
  display: DisplayType;
  toggleDisplay: () => void;
  addOrRemoveFromFavorites: (code: number) => void;
}

export const useUserPreferences = create<StoreState>()(
  persist(
    (set) => ({
      display: "list",
      favorites: [],

      toggleDisplay: () =>
        set((state) => ({
          display: state.display === "list" ? "map" : "list",
        })),

      addOrRemoveFromFavorites: (code: number) =>
        set((state) => {
          if (state.favorites.includes(code)) {
            return {
              favorites: state.favorites.filter((fav) => fav !== code),
            };
          } else {
            return {
              favorites: [...state.favorites, code],
            };
          }
        }),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => localStorage), // Automatically uses localStorage
    }
  )
);
