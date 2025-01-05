export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status: number };

export type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

export type DisplayType = "list" | "map";

// Types for Regions
export interface Region {
  code: number; // Identifiant de la région
  libelle: string; // Libellé de la région
}

// Types for Restaurant
export interface Restaurant {
  isOpen: boolean;
  acces?: string[]; // Informations sur l'accès au restaurant
  adresse: string; // Adresse du restaurant
  code: number; // Identifiant du restaurant
  email?: string | null; // Adresse email du restaurant
  horaires?: string[]; // Horaires d'ouverture du restaurant
  image_url?: string | null; // URL de l'image du restaurant
  ispmr: boolean; // Le restaurant est-il accessible aux PMR ?
  jours_ouvert?: Jours[]; // Jours d'ouverture du restaurant
  latitude: number; // Latitude du restaurant
  longitude: number; // Longitude du restaurant
  nom: string; // Nom du restaurant
  paiement?: string[]; // Moyens de paiement acceptés par le restaurant
  region: Region; // Région du restaurant
  telephone?: string | null; // Numéro de téléphone du restaurant
  type_restaurant: TypeRestaurant; // Type de restauration
  zone: string; // Zone du restaurant
  ouvert: boolean; // Le restaurant est-il ouvert ?
  type?: TypeRestaurant; // Type de restauration
  actif: boolean; // Le restaurant est-il actif ?
}

// Types for TypeRestaurant
export interface TypeRestaurant {
  code: number; // Identifiant du type de restauration
  libelle: string; // Libellé du type de restauration
}

// Types for Jours
export interface Jours {
  jour: string; // Jours de la semaine
  ouverture: Ouverture; // Informations sur les ouvertures (matin, midi, soir)
}

// Types for Ouverture
export interface Ouverture {
  matin: boolean; // Ouverture le matin
  midi: boolean; // Ouverture le midi
  soir: boolean; // Ouverture le soir
}

// Types for Plat
export interface Plat {
  code: string; // Identifiant du plat
  libelle: string; // Libellé du plat
  ordre?: number; // Ordre du plat dans la catégorie
}

// Types for Categorie
export interface Categorie {
  code: string; // Identifiant de la catégorie
  libelle: string; // Libellé de la catégorie
  plats: Plat[]; // Liste des plats de la catégorie
}

// Types for CategorieTriee
export interface CategorieTriee extends Categorie {
  ordre: number; // Ordre de la catégorie dans le menu
}

// Types for Repas
export interface Repas {
  categories: CategorieTriee[]; // Liste des catégories du repas
  code: string; // Identifiant du repas
  type: "matin" | "midi" | "soir"; // Type du repas
}

// Types for Menu
export interface Menu {
  code: string; // Identifiant du menu
  date: string; // Date du menu
  repas: Repas[]; // Liste des repas du menu
}

// Types for Date
export interface DateMenu {
  code: string; // Identifiant du menu
  date: string; // Date du menu
}

// Types for Tache
export interface Tache {
  debut: string; // Date de début de la tâche
  debut_categories: number; // Nombre de catégories récupérées au début de la tâche
  debut_compositions: number; // Nombre de compositions récupérées au début de la tâche
  debut_menus: number; // Nombre de menus récupérés au début de la tâche
  debut_plats: number; // Nombre de plats récupérés au début de la tâche
  debut_regions: number; // Nombre de régions récupérées au début de la tâche
  debut_repas: number; // Nombre de repas récupérés au début de la tâche
  debut_restaurants: number; // Nombre de restaurants récupérés au début de la tâche
  debut_types_restaurants: number; // Nombre de types de restaurants récupérés au début de la tâche
  fin: string; // Date de fin de la tâche
  fin_categories: number; // Nombre de catégories récupérées à la fin de la tâche
  fin_compositions: number; // Nombre de compositions récupérées à la fin de la tâche
  fin_menus: number; // Nombre de menus récupérés à la fin de la tâche
  fin_plats: number; // Nombre de plats récupérés à la fin de la tâche
  fin_regions: number; // Nombre de régions récupérées à la fin de la tâche
  fin_repas: number; // Nombre de repas récupérés à la fin de la tâche
  fin_restaurants: number; // Nombre de restaurants récupérés à la fin de la tâche
  fin_types_restaurants: number; // Nombre de types de restaurants récupérés à la fin de la tâche
  id: string; // Identifiant de la tâche
  requetes: number; // Nombre de requêtes effectuées
}

// Types for GlobalStats
export interface GlobalStats {
  categories: number; // Nombre de catégories
  compositions: number; // Nombre de compositions
  menus: number; // Nombre de menus
  plats: number; // Nombre de plats
  regions: number; // Nombre de régions
  repas: number; // Nombre de repas
  restaurants: number; // Nombre de restaurants
  types_restaurants: number; // Nombre de types de restaurants
}

// Types for GithubRepo Stats
export interface GithubRepo {
  id: number; // Identifiant du dépôt
  name: string; // Nom du dépôt
  stargazers_count: number; // Nombre d'étoiles du dépôt
}
