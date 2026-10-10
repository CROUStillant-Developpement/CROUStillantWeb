export type ChangelogServiceCategory = "public" | "internal" | "libraries";

export interface ChangelogService {
  /** Repository name in the CROUStillant-Developpement GitHub organisation. */
  name: string;
  category: ChangelogServiceCategory;
  technologies: string[];
}

export const CHANGELOG_CATEGORIES: ChangelogServiceCategory[] = ["public", "internal", "libraries"];

/**
 * Services listed on the changelog page, in display order.
 *
 * To add a service:
 * 1. Add an entry below
 * 2. Add its description in messages/fr.json and messages/en.json under ChangelogPage.services.<name>
 */
export const CHANGELOG_SERVICES: ChangelogService[] = [
  { name: "CROUStillantWeb", category: "public", technologies: ["Next.js 16", "TypeScript", "Tailwind CSS"] },
  { name: "CROUStillantAPI", category: "public", technologies: ["Python"] },
  { name: "CROUStillantBot", category: "public", technologies: ["Python", "discord.py"] },
  { name: "CROUStillantApp", category: "public", technologies: ["React Native", "Expo"] },
  { name: "CROUStillant", category: "internal", technologies: ["Python", "Docker"] },
  { name: "CROUStillantData", category: "internal", technologies: ["Python", "Docker"] },
  { name: "CROUStillantListener", category: "internal", technologies: ["Python", "Docker"] },
  { name: "CROUStillantBackup", category: "internal", technologies: ["Python", "Docker"] },
  { name: "CROUStillantDatasets", category: "internal", technologies: ["Python", "Docker"] },
  { name: "CrousPy", category: "libraries", technologies: ["Python", "aiohttp"] },
  { name: "DataGouvPy", category: "libraries", technologies: ["Python", "aiohttp"] },
];
