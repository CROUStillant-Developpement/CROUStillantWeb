import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { useRestaurantMenu } from "@/hooks/useRestaurantMenu";
import type { Menu } from "@/services/types";

// The hook imports server actions; they are never called during a server render
// (no effect runs), but the import still has to resolve.
vi.mock("@/services/menu-service", () => ({
  getMenuByRestaurantId: vi.fn(),
  getMenuByRestaurantIdAndDate: vi.fn(),
  getFutureDatesMenuAvailable: vi.fn(),
  getDatesMenuAvailable: vi.fn(),
}));

function apiDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function makeMenu(date: Date, dish: string): Menu {
  return {
    code: "menu-1",
    date: apiDate(date),
    repas: [
      {
        code: "repas-1",
        type: "midi",
        categories: [
          {
            code: "cat-1",
            libelle: "Plats du jour",
            ordre: 1,
            plats: [{ code: "plat-1", libelle: dish }],
          },
        ],
      },
    ],
  };
}

/** Renders the dishes the hook exposes, to inspect the server-produced HTML. */
function MenuProbe({ initialMenu }: { initialMenu?: Menu[] }) {
  const { selectedDateMeals, selectedDateLunch } = useRestaurantMenu({
    restaurantCode: 1,
    mode: "all",
    initialMenu,
  });

  return (
    <ul>
      {selectedDateMeals.flatMap((repas) =>
        repas.categories.flatMap((categorie) =>
          categorie.plats.map((plat) => <li key={plat.code}>{plat.libelle}</li>)
        )
      )}
      <li data-testid="lunch">{selectedDateLunch ? "midi" : "aucun"}</li>
    </ul>
  );
}

describe("useRestaurantMenu — rendu serveur", () => {
  it("expose les plats du jour dès le rendu serveur quand initialMenu est fourni", () => {
    const html = renderToString(
      <MenuProbe initialMenu={[makeMenu(new Date(), "Gratin dauphinois")]} />
    );

    // This is the assertion that matters for SEO: without it the HTML served to
    // crawlers contains no dish at all (they do not run JS).
    expect(html).toContain("Gratin dauphinois");
    expect(html).toContain("midi");
  });

  it("ne rend aucun plat sans initialMenu (cas où le fetch n'a pas encore eu lieu)", () => {
    const html = renderToString(<MenuProbe />);

    expect(html).toContain("aucun");
    expect(html).not.toContain("Gratin dauphinois");
  });

  it("n'expose pas un menu daté d'un autre jour que la date sélectionnée", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const html = renderToString(
      <MenuProbe initialMenu={[makeMenu(tomorrow, "Gratin dauphinois")]} />
    );

    // The default selected date is today: tomorrow's menu must not be shown in
    // its place.
    expect(html).not.toContain("Gratin dauphinois");
    expect(html).toContain("aucun");
  });
});
