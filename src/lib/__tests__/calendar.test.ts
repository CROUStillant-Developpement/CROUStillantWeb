import { describe, it, expect } from "vitest";
import {
  CALENDAR_API_URL,
  getCalendarFeedUrl,
  getCalendarSubscribeLinks,
} from "@/lib/calendar";

const BASE = `${CALENDAR_API_URL}/11.ics`;

it("points at the unversioned API alias", () => {
  expect(BASE).toBe("https://api.croustillant.menu/calendar/11.ics");
});

describe("getCalendarFeedUrl", () => {
  it("returns the bare feed URL by default", () => {
    expect(getCalendarFeedUrl(11)).toBe(BASE);
  });

  it("omits the meal filter when every meal is selected", () => {
    expect(getCalendarFeedUrl(11, { meals: ["soir", "matin", "midi"] })).toBe(BASE);
  });

  it("adds the selected meals in canonical order", () => {
    expect(getCalendarFeedUrl(11, { meals: ["soir", "midi"] })).toBe(
      `${BASE}?repas=midi%2Csoir`
    );
  });

  it("adds the minimal flag", () => {
    expect(getCalendarFeedUrl(11, { meals: ["midi"], minimal: true })).toBe(
      `${BASE}?repas=midi&minimal=true`
    );
  });
});

describe("getCalendarSubscribeLinks", () => {
  it("builds webcal, Google and Outlook links from the feed URL", () => {
    const links = getCalendarSubscribeLinks(11, "Crous cafet' le 98");

    expect(links.https).toBe(BASE);
    expect(links.webcal).toBe(BASE.replace("https://", "webcal://"));
    expect(links.google).toBe(
      `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(links.webcal)}`
    );
    expect(new URL(links.outlook).searchParams.get("url")).toBe(BASE);
    expect(new URL(links.outlook).searchParams.get("name")).toBe(
      "Crous cafet' le 98 - CROUStillant"
    );
  });
});
