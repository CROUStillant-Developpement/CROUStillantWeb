import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { DishActionsMenu, DishReportButton, DishTagsInfo } from "@/components/restaurants/slug/dish-feedback";
import messages from "../../../messages/fr.json";
import type { Plat } from "@/services/types";

const event = vi.fn();
vi.mock("next-umami", () => ({
  useUmami: () => ({ event }),
}));

const plat: Plat = {
  code: "42",
  libelle: "Vg ragout de lentilles 4 pts",
  ordre: 1,
  analyse: {
    nature: "DISH",
    type_info: null,
    libelle: "Ragout de lentilles",
    type: "PLAT",
    points: 4,
    prix: [],
    allergenes_declares: [],
    vegetarien: true,
    origines: [],
    labels: [],
    composants: [],
  },
};

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("DishReportButton", () => {
  beforeEach(() => event.mockClear());

  it("sends a Dish.Report event with the reason and the displayed tags", () => {
    renderWithIntl(<DishReportButton plat={plat} />);

    fireEvent.click(screen.getByRole("button", { name: "Signaler une erreur sur Ragout de lentilles" }));
    expect(screen.getByText("Qu'est-ce qui est faux pour « Ragout de lentilles » ?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "La mention végétarien" }));

    expect(event).toHaveBeenCalledWith("Dish.Report", {
      plat: "42",
      libelle: "Ragout de lentilles",
      raison: "vegetarian",
      type: "PLAT",
      vegetarien: true,
    });
    expect(screen.getByRole("status")).toHaveTextContent("Merci ! Votre signalement a bien été envoyé.");
  });
});

describe("DishActionsMenu", () => {
  beforeEach(() => event.mockClear());

  it("groups the follow button, the recipe search and the report form behind one button", () => {
    const onToggle = vi.fn();
    renderWithIntl(
      <DishActionsMenu
        plat={plat}
        follow={{ label: "Suivre Ragout de lentilles", active: false, onToggle }}
        recipeUrl="https://example.org/recette"
        recipeLabel="Rechercher la recette"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Plus d’actions pour Ragout de lentilles" }));
    fireEvent.click(screen.getByRole("button", { name: "Suivre Ragout de lentilles" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Rechercher la recette" })).toHaveAttribute(
      "href",
      "https://example.org/recette"
    );

    fireEvent.click(screen.getByRole("button", { name: "Signaler une erreur" }));
    fireEvent.click(screen.getByRole("button", { name: "Le type de plat" }));

    expect(event).toHaveBeenCalledWith("Dish.Report", expect.objectContaining({ plat: "42", raison: "type" }));
  });
});

describe("DishTagsInfo", () => {
  it("explains that the tags are indicative", () => {
    renderWithIntl(<DishTagsInfo />);

    fireEvent.click(screen.getByRole("button", { name: "À propos des tags des plats" }));

    expect(screen.getByText("Tags donnés à titre indicatif")).toBeInTheDocument();
    expect(screen.getByText(/générés automatiquement/)).toBeInTheDocument();
  });
});
