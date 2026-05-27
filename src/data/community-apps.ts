export type Platform = "android" | "ios";

export interface CommunityApp {
  key: string;
  github: string;
  screenshots: string[];
  platforms: Platform[];
  androidUrl?: string;
  iosUrl?: string;
  webUrl?: string;
}

/**
 * To add a new community app:
 * 1. Add an entry here with its key, GitHub URL, platforms, and optional store links
 * 2. Add the screenshots to /public/apps/<key>/
 * 3. Add translations in messages/fr.json and messages/en.json under CommunityApps.apps.<key>
 */
export const COMMUNITY_APPS: CommunityApp[] = [
  {
    key: "croustillapp",
    github: "https://github.com/Toum404/Croustillapp",
    screenshots: [
      "/apps/croustillapp/croustillantapp_home_screen_day.jpg",
      "/apps/croustillapp/croustillantapp_home_screen_night.jpg",
      "/apps/croustillapp/croustillantapp_bottom_sheet_day.jpg",
      "/apps/croustillapp/croustillantapp_bottom_sheet_night.jpg",
    ],
    platforms: ["android"],
  },
];
