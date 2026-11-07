import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { Trophy } from "lucide-react";
import { DishesTable } from "@/components/dishes/dishes-page";
import messages from "../../../messages/fr.json";
import type { Plat } from "@/services/types";

vi.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));
vi.mock("@/components/dishes/followed-dishes-week", () => ({ default: () => null }));

const dishes: Plat[] = [
  { code: "2", libelle: "Fruits", type: "DESSERT", vegetarien: false, total: 24051 },
  { code: "9", libelle: "Frites", type: "ACCOMPAGNEMENT", vegetarien: false, total: 22698 },
  { code: "4", libelle: "Yaourts", type: "DESSERT", vegetarien: false, total: 16642 },
  { code: "108", libelle: "Ratatouille", type: "PLAT", vegetarien: true, total: 4125 },
];

function renderTable(list: Plat[] = dishes) {
  return render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <DishesTable id="top100" icon={Trophy} title="Top" description="" dishes={list} column="occurrences" />
    </NextIntlClientProvider>
  );
}

const rowTexts = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell").map((cell) => cell.textContent));

describe("DishesTable", () => {
  it("shows the dish tags and the formatted occurrences", () => {
    renderTable();
    expect(rowTexts()[3]).toEqual(["4", "4 125", "RatatouillePlatVégétarien"]);
  });

  it("offers only the types present, in menu order", () => {
    renderTable();
    const filters = within(screen.getByRole("group", { name: "Filtrer par type de plat" })).getAllByRole("button");
    expect(filters.map((b) => b.textContent)).toEqual(["Tous", "Plat", "Accompagnement", "Dessert"]);
  });

  it("filters by type and keeps the overall ranking", () => {
    renderTable();
    fireEvent.click(screen.getByRole("button", { name: "Dessert" }));

    expect(rowTexts().map((cells) => [cells[0], cells[2]])).toEqual([
      ["1", "FruitsDessert"],
      ["3", "YaourtsDessert"],
    ]);
    expect(screen.getByRole("button", { name: "Dessert" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Tous" }));
    expect(rowTexts()).toHaveLength(4);
  });

  it("combines the type filter with the search", () => {
    renderTable();
    fireEvent.click(screen.getByRole("button", { name: "Dessert" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Rechercher un plat..." }), { target: { value: "yao" } });
    expect(rowTexts().map((cells) => cells[0])).toEqual(["3"]);
  });

  it("hides the type filter until the API returns types", () => {
    renderTable(dishes.map(({ code, libelle, total }) => ({ code, libelle, total })));
    expect(screen.queryByRole("group", { name: "Filtrer par type de plat" })).not.toBeInTheDocument();
    expect(rowTexts()).toHaveLength(4);
  });
});
