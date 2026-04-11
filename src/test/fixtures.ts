import type { Restaurant } from "@/services/types";

/** Minimal valid Restaurant. Override any fields per-test. */
export function makeRestaurant(overrides: Partial<Restaurant> = {}): Restaurant {
  return {
    isOpen: true,
    actif: true,
    adresse: "1 rue de la Paix, Paris",
    code: 1,
    ispmr: false,
    latitude: 48.8566,
    longitude: 2.3522,
    nom: "Restaurant A",
    ouvert: true,
    region: { code: 10, libelle: "Île-de-France" },
    type_restaurant: { code: 1, libelle: "Cafétéria" },
    zone: "Paris",
    ...overrides,
  };
}
