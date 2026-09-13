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
  code: number; // Region identifier
  libelle: string; // Region label
}

// Properties of a CROUS region GeoJSON feature (GET /regions/geojson)
export interface RegionGeoJSONProperties {
  crous_id: number; // Matches Region.code
  crous_slug: string;
  crous_libelle: string; // Matches Region.libelle
  crous_nom: string; // Full official CROUS name
  departements: string[]; // INSEE codes of the attached departments
  credit: string;
  [key: string]: unknown;
}

export type RegionGeoJSON = GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  RegionGeoJSONProperties
>;

// Types for Restaurant
export interface Restaurant {
  isOpen: boolean;
  acces?: string[]; // Access information for the restaurant
  adresse: string; // Restaurant address
  code: number; // Restaurant identifier
  email?: string | null; // Restaurant email address
  horaires?: string[]; // Restaurant opening hours
  image_url?: string | null; // Restaurant image URL
  ispmr: boolean; // Is the restaurant wheelchair accessible?
  jours_ouvert?: Jours[]; // Days the restaurant is open
  latitude: number; // Restaurant latitude
  longitude: number; // Restaurant longitude
  nom: string; // Restaurant name
  paiement?: string[]; // Payment methods the restaurant accepts
  region: Region; // Restaurant region
  telephone?: string | null; // Restaurant phone number
  type_restaurant: TypeRestaurant; // Catering type
  zone: string; // Restaurant zone
  ouvert: boolean; // Is the restaurant currently open?
  type?: TypeRestaurant; // Catering type
  actif: boolean; // Is the restaurant active?
}

// Types for TypeRestaurant
export interface TypeRestaurant {
  code: number; // Catering type identifier
  libelle: string; // Catering type label
}

// Types for Jours
export interface Jours {
  jour: string; // Day of the week
  ouverture: Ouverture; // Opening information (morning, midday, evening)
}

// Types for Ouverture
export interface Ouverture {
  matin: boolean; // Open in the morning
  midi: boolean; // Open at midday
  soir: boolean; // Open in the evening
}

// Types for Plat
export interface Plat {
  code: string; // Dish identifier
  libelle: string; // Dish label
  ordre?: number; // Position of the dish within the category
  total?: number; // Total number of occurrences of the dish
}

// Types for Categorie
export interface Categorie {
  code: string; // Category identifier
  libelle: string; // Category label
  plats: Plat[]; // Dishes in the category
}

// Types for CategorieTriee
export interface CategorieTriee extends Categorie {
  ordre: number; // Position of the category within the menu
}

// Types for Repas
export interface Repas {
  categories: CategorieTriee[]; // Categories of the meal
  code: string; // Meal identifier
  type: "matin" | "midi" | "soir"; // Meal type
}

// Types for Menu
export interface Menu {
  code: string; // Menu identifier
  date: string; // Menu date
  repas: Repas[]; // Meals of the menu
}

// Types for Date
export interface DateMenu {
  code: string; // Menu identifier
  date: string; // Menu date
}

// Types for Tache
export interface Tache {
  debut: string; // Task start date
  debut_categories: number; // Categories collected when the task started
  debut_compositions: number; // Compositions collected when the task started
  debut_menus: number; // Menus collected when the task started
  debut_plats: number; // Dishes collected when the task started
  debut_regions: number; // Regions collected when the task started
  debut_repas: number; // Meals collected when the task started
  debut_restaurants: number; // Restaurants collected when the task started
  debut_types_restaurants: number; // Restaurant types collected when the task started
  fin: string; // Task end date
  fin_categories: number; // Categories collected when the task ended
  fin_compositions: number; // Compositions collected when the task ended
  fin_menus: number; // Menus collected when the task ended
  fin_plats: number; // Dishes collected when the task ended
  fin_regions: number; // Regions collected when the task ended
  fin_repas: number; // Meals collected when the task ended
  fin_restaurants: number; // Restaurants collected when the task ended
  fin_types_restaurants: number; // Restaurant types collected when the task ended
  id: string; // Task identifier
  requetes: number; // Number of requests made
}

// Types for GlobalStats
// Types for RegionStats
export interface RegionStats {
  code: number; // Region identifier
  libelle: string; // Region label
  nb_restaurants: number; // Restaurants in the region
  nb_restaurants_actifs: number; // Active restaurants in the region
  nb_restaurants_avec_menu: number; // Active restaurants that published a menu during the current school year
  nb_repas: number; // Meals served during the current school year
  nb_categories: number; // Categories during the current school year
  nb_plats: number; // Dishes served during the current school year
  plats_uniques: number; // Distinct dishes served during the current school year
}

export interface GlobalStats {
  categories: number; // Number of categories
  compositions: number; // Number of compositions
  menus: number; // Number of menus
  plats: number; // Number of dishes
  regions: number; // Number of regions
  repas: number; // Number of meals
  restaurants: number; // Number of restaurants
  restaurants_actifs: number; // Number of active restaurants
  types_restaurants: number; // Number of restaurant types
  visites?: number; // Number of visits to the site
  pagesVues?: number; // Number of page views on the site
}

export interface Changelog {
  [key: string]: ChangelogItem[];
}

export interface ChangelogItem {
  contributors: Contributor[];
  date: string;
  en: ChangelogItemLanguage;
  fr: ChangelogItemLanguage;
  version: string;
}

export interface Contributor {
  name: string;
  role: {
    fr: string;
    en: string;
  };
}

export interface ChangelogItemLanguage {
  title: string;
  shortDescription: string;
  fullDescription: string;
}

export interface UmamiGetToken {
  token: string;
  user: {
    id: string;
    username: string;
    createdAt: string;
  };
}

export interface UmamiActiveUsers {
  visitors: number;
}

export interface UmamiDateRange {
  startDate: string;
  endDate: string;
}

// Types for RestaurantInsights
export interface InsightsPeriode {
  debut: string; // Start of the period (DD-MM-YYYY)
  fin: string; // End of the period (DD-MM-YYYY)
}

export interface InsightsCouverture {
  jours_ouvres: number; // Expected opening days over the period
  jours_avec_menu: number; // Days with a published menu
  jours_sans_menu: number; // Days without a published menu
  taux_couverture: number; // Coverage rate, as a percentage
}

export interface InsightsRepartitionRepas {
  matin: number; // Breakfasts served over the period
  midi: number; // Lunches served over the period
  soir: number; // Dinners served over the period
}

export interface InsightsCouvertureJour {
  jour: string; // Day of the week
  jours_ouvres: number; // Occurrences of this weekday on which the restaurant is meant to be open
  jours_avec_menu: number; // Occurrences of this weekday with a published menu
  taux_couverture: number; // Coverage rate for this weekday, as a percentage
}

export interface InsightsSerieActuelle {
  avec_menu: boolean; // Is the current streak one with menus (true) or without (false)?
  jours: number; // Length of the current streak, in opening days
}

export interface InsightsSeries {
  meilleure_serie_avec_menu: number; // Longest run of consecutive opening days with a published menu
  plus_longue_serie_sans_menu: number; // Longest run of consecutive opening days without a published menu
  serie_actuelle: InsightsSerieActuelle;
}

export interface InsightsVariete {
  plats_uniques: number; // Distinct dishes served over the period
  plats_total: number; // Total dishes served over the period (occurrences)
  taux_variete: number; // Variety rate (plats_uniques / plats_total), as a percentage
}

export interface InsightsRichesse {
  moyenne_categories_par_repas: number; // Average number of categories per meal
  moyenne_plats_par_repas: number; // Average number of dishes per meal
}

export interface InsightsDelaiPublication {
  moyenne_jours: number | null; // Average delay, in days, between a menu being ingested and the date it applies to
}

export interface InsightsComparaisonRegionale {
  jours_avec_menu_restaurant: number; // Days with a menu for this restaurant over the period
  moyenne_jours_avec_menu_region: number | null; // Average number of days with a menu for the other active restaurants in the region
  nb_restaurants_compares: number; // Active restaurants in the region that published a menu, used for the comparison
  nb_restaurants_actifs_region: number; // Total active restaurants in the region (with or without a published menu)
}

export interface ActivityRun {
  id: number; // Ingestion task identifier
  debut: string | null; // Task start date and time
  fin: string | null; // Task end date and time
}

export interface RestaurantActivity {
  ajout: string; // Date the restaurant was added to the database
  modifie: string | null; // Date the restaurant was last updated
  nb_verifications: number; // Total ingestion tasks that checked this restaurant
  dernieres_verifications: ActivityRun[]; // The latest ingestion tasks, most recent first
}

export interface RestaurantInsights {
  periode: InsightsPeriode;
  couverture: InsightsCouverture;
  repartition_repas: InsightsRepartitionRepas;
  plats_frequents: Plat[]; // Most frequent dishes over the period (uses total for the occurrence count)
  couverture_par_jour: InsightsCouvertureJour[];
  series: InsightsSeries;
  variete: InsightsVariete;
  richesse: InsightsRichesse;
  delai_publication: InsightsDelaiPublication;
  comparaison_regionale: InsightsComparaisonRegionale;
}

export interface UmamiStats {
  pageviews: string;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: string;
  comparison: {
    pageviews: string;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: string;
  };
}
