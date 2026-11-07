import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import MealCard from "@/components/restaurants/slug/meal-card";
import messages from "../../../messages/fr.json";
import type { AnalysePlat, Categorie } from "@/services/types";

vi.mock("next-umami", () => ({
  useUmami: () => ({ event: vi.fn() }),
}));

function analyse(overrides: Partial<AnalysePlat>): AnalysePlat {
  return {
    nature: "DISH",
    type_info: null,
    libelle: null,
    type: null,
    points: null,
    prix: [],
    allergenes_declares: [],
    vegetarien: false,
    origines: [],
    labels: [],
    composants: [],
    ...overrides,
  };
}

const meal: Categorie = {
  code: "cat-1",
  libelle: "Plats",
  plats: [
    {
      code: "1",
      libelle: "Curry de légumes (VG) bio 4 pts (1.7)",
      ordre: 1,
      analyse: analyse({
        libelle: "Curry de légumes",
        type: "PLAT",
        vegetarien: true,
        labels: ["bio"],
        points: 4,
        allergenes_declares: [
          { code: "GLUTEN", libelle: "Céréales contenant du gluten", source: "CROUS", verifie: true },
          { code: "LAIT", libelle: "Lait", source: "CROUS", verifie: true },
        ],
      }),
    },
    {
      code: "2",
      libelle: "Restaurant fermé ce soir",
      ordre: 2,
      analyse: analyse({ nature: "INFO", type_info: "CLOSURE", libelle: "Restaurant fermé ce soir" }),
    },
    { code: "3", libelle: "-----", ordre: 3, analyse: analyse({ nature: "JUNK" }) },
    { code: "4", libelle: "Frites", ordre: 4 },
  ],
};

function renderCard() {
  return render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <MealCard meal={meal} />
    </NextIntlClientProvider>
  );
}

describe("MealCard dish tags", () => {
  it("shows the clean label and the tags in order", () => {
    renderCard();

    expect(screen.getByText("Curry de légumes")).toBeInTheDocument();
    expect(screen.queryByText(/4 pts \(1\.7\)/)).not.toBeInTheDocument();

    const tags = screen.getAllByRole("list")[1].querySelectorAll(":scope > li");
    expect(Array.from(tags, (li) => li.textContent)).toEqual([
      "Plat",
      "Végétarien",
      "Bio",
      "2 allergènes",
      "4 pts",
    ]);
  });

  it("lists the declared allergens on demand", () => {
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: /Allergènes déclarés : Céréales contenant du gluten et Lait/ }));
    expect(screen.getByText("Céréales contenant du gluten")).toBeInTheDocument();
    expect(screen.getByText("Lait")).toBeInTheDocument();
  });

  it("renders information lines as notes, without follow or recipe buttons", () => {
    renderCard();

    expect(screen.getByText("Restaurant fermé ce soir")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Suivre Restaurant fermé/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Restaurant fermé/ })).not.toBeInTheDocument();
  });

  it("hides noise and keeps dishes without analysis unchanged", () => {
    renderCard();

    expect(screen.queryByText("-----")).not.toBeInTheDocument();
    expect(screen.getByText("Frites")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Suivre Frites" })).toBeInTheDocument();
  });
});
