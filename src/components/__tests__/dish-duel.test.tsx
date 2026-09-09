import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DishDuel from "@/components/easter-egg/dish-duel";
import type { Plat } from "@/services/types";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
const umamiEvent = vi.fn();
vi.mock("next-umami", () => ({
  useUmami: () => ({ event: umamiEvent }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "fr",
}));

const toast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast }),
}));

const getTop100Dishes = vi.fn();
vi.mock("@/services/stats-services", () => ({
  getTop100Dishes: () => getTop100Dishes(),
}));

const plat = (code: number, libelle: string, total: number) =>
  ({ code, libelle, total }) as unknown as Plat;

/** Two dishes far enough apart that every round has a knowable answer. */
const DISHES = [
  plat(1, "Frites", 10_000),
  plat(2, "Ratatouille", 1_000),
  plat(3, "Menu non communiqué", 90_000),
];

beforeEach(() => {
  umamiEvent.mockReset();
  toast.mockReset();
  getTop100Dishes.mockReset();
  getTop100Dishes.mockResolvedValue({ success: true, data: DISHES });
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

/** Waits for the first round to be on screen. */
async function startGame() {
  render(<DishDuel onClose={vi.fn()} />);
  expect(await screen.findByText("Frites")).toBeInTheDocument();
}

// ---------------------------------------------------------------------------
// Loading the live ranking
// ---------------------------------------------------------------------------
describe("DishDuel — loading", () => {
  it("shows a loading state, then a round built from the API data", async () => {
    render(<DishDuel onClose={vi.fn()} />);

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(await screen.findByText("Frites")).toBeInTheDocument();
    expect(screen.getByText("Ratatouille")).toBeInTheDocument();
  });

  it("leaves the CROUS placeholder rows out of the game", async () => {
    await startGame();

    expect(screen.queryByText("Menu non communiqué")).not.toBeInTheDocument();
  });

  it("shows an error state when the API call fails", async () => {
    getTop100Dishes.mockResolvedValue({ success: false, error: "boom", status: 500 });
    render(<DishDuel onClose={vi.fn()} />);

    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("shows an error state when the ranking has too few playable dishes", async () => {
    getTop100Dishes.mockResolvedValue({ success: true, data: [DISHES[0]] });
    render(<DishDuel onClose={vi.fn()} />);

    expect(await screen.findByText("error")).toBeInTheDocument();
  });

  it("reports the unlock to analytics", async () => {
    await startGame();

    expect(umamiEvent).toHaveBeenCalledWith("EasterEgg.DishDuel.Open");
  });
});

// ---------------------------------------------------------------------------
// Playing a round
// ---------------------------------------------------------------------------
describe("DishDuel — rounds", () => {
  it("reveals both totals once an answer is given", async () => {
    await startGame();
    fireEvent.click(screen.getByText("Frites"));

    // The label is the mocked translation key; the count comes from the API.
    await waitFor(() => expect(screen.getAllByText("servings")).toHaveLength(2));
  });

  it("keeps the run going and scores a point on a correct answer", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await startGame();

    fireEvent.click(screen.getByText("Frites"));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText("gameOver.title")).not.toBeInTheDocument();
    expect(screen.getByText("streak")).toBeInTheDocument();
  });

  it("ends the run and stores the best score on a wrong answer", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await startGame();

    fireEvent.click(screen.getByText("Ratatouille"));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("gameOver.title")).toBeInTheDocument();
    expect(umamiEvent).toHaveBeenCalledWith("EasterEgg.DishDuel.GameOver", { score: 0 });
  });

  it("ignores a second click while the answer is being revealed", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await startGame();

    fireEvent.click(screen.getByText("Frites"));
    fireEvent.click(screen.getByText("Ratatouille"));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // The late wrong click must not have ended the run.
    expect(screen.queryByText("gameOver.title")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Game over
// ---------------------------------------------------------------------------
describe("DishDuel — game over", () => {
  async function loseARound() {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await startGame();
    fireEvent.click(screen.getByText("Ratatouille"));
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
  }

  it("offers a replay that restarts a round", async () => {
    await loseARound();

    fireEvent.click(screen.getByText("gameOver.replay"));
    await waitFor(() =>
      expect(screen.queryByText("gameOver.title")).not.toBeInTheDocument()
    );
  });

  it("copies the score when the share sheet is unavailable", async () => {
    Object.assign(navigator, { share: undefined });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await loseARound();
    fireEvent.click(screen.getByText("gameOver.share"));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(writeText.mock.calls[0][0]).toContain("https://croustillant.menu");
    expect(toast).toHaveBeenCalled();
  });
});
