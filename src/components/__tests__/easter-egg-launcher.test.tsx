import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EasterEggLauncher from "@/components/easter-egg/easter-egg-launcher";
import { KONAMI_CODE } from "@/lib/dish-duel";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// Stands in for the real game: importing it is what we assert on, since the
// whole point of the launcher is that the game stays out of a normal page load.
const gameLoaded = vi.fn();
vi.mock("@/components/easter-egg/dish-duel", () => ({
  default: ({ onClose }: { onClose: () => void }) => {
    gameLoaded();
    return (
      <div data-testid="dish-duel">
        <button onClick={onClose}>close</button>
      </div>
    );
  },
}));

beforeEach(() => {
  gameLoaded.mockReset();
});

/** Fires a full Konami sequence on the document. */
function enterKonamiCode(keys: readonly string[] = KONAMI_CODE) {
  keys.forEach((key) => fireEvent.keyDown(document, { key }));
}

// ---------------------------------------------------------------------------
// Idle behaviour
// ---------------------------------------------------------------------------
describe("EasterEggLauncher — idle", () => {
  it("renders nothing and loads no game code", () => {
    const { container } = render(<EasterEggLauncher />);

    expect(container).toBeEmptyDOMElement();
    expect(gameLoaded).not.toHaveBeenCalled();
  });

  it("stays hidden for an incomplete sequence", () => {
    render(<EasterEggLauncher />);
    enterKonamiCode(KONAMI_CODE.slice(0, -1));

    expect(screen.queryByTestId("dish-duel")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Konami code
// ---------------------------------------------------------------------------
describe("EasterEggLauncher — Konami code", () => {
  it("unlocks the game on the full sequence", async () => {
    render(<EasterEggLauncher />);
    enterKonamiCode();

    expect(await screen.findByTestId("dish-duel")).toBeInTheDocument();
  });

  it("accepts the letters in either case", async () => {
    render(<EasterEggLauncher />);
    enterKonamiCode([...KONAMI_CODE.slice(0, -2), "B", "A"]);

    expect(await screen.findByTestId("dish-duel")).toBeInTheDocument();
  });

  it("restarts the sequence after a wrong key", async () => {
    render(<EasterEggLauncher />);
    fireEvent.keyDown(document, { key: "ArrowUp" });
    fireEvent.keyDown(document, { key: "x" });
    enterKonamiCode();

    expect(await screen.findByTestId("dish-duel")).toBeInTheDocument();
  });

  it("ignores keystrokes typed into a form field", async () => {
    render(
      <>
        <input data-testid="search" />
        <EasterEggLauncher />
      </>
    );
    const input = screen.getByTestId("search");
    KONAMI_CODE.forEach((key) => fireEvent.keyDown(input, { key }));

    await waitFor(() => expect(gameLoaded).not.toHaveBeenCalled());
    expect(screen.queryByTestId("dish-duel")).not.toBeInTheDocument();
  });

  it("ignores sequences typed with a modifier held", async () => {
    render(<EasterEggLauncher />);
    KONAMI_CODE.forEach((key) => fireEvent.keyDown(document, { key, ctrlKey: true }));

    await waitFor(() => expect(gameLoaded).not.toHaveBeenCalled());
  });
});

// ---------------------------------------------------------------------------
// Tap trigger (the only route on touch devices)
// ---------------------------------------------------------------------------
describe("EasterEggLauncher — tap trigger", () => {
  // The window between taps is measured against the wall clock, so the test
  // drives it rather than relying on how fast the assertions happen to run.
  let now = 0;

  beforeEach(() => {
    now = 1_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderWithTarget() {
    return render(
      <>
        <h1 data-easter-egg>Restaurants</h1>
        <p data-testid="elsewhere">Not a trigger</p>
        <EasterEggLauncher />
      </>
    );
  }

  /** Taps `times` times, 100ms apart on the (mocked) clock. */
  function tap(element: Element, times: number) {
    for (let i = 0; i < times; i += 1) {
      now += 100;
      fireEvent.pointerDown(element);
    }
  }

  it("unlocks after seven quick taps on a marked element", async () => {
    renderWithTarget();
    tap(screen.getByText("Restaurants"), 7);

    expect(await screen.findByTestId("dish-duel")).toBeInTheDocument();
  });

  it("does not unlock on fewer taps", async () => {
    renderWithTarget();
    tap(screen.getByText("Restaurants"), 6);

    await waitFor(() => expect(gameLoaded).not.toHaveBeenCalled());
  });

  it("resets the count when taps are too far apart", async () => {
    renderWithTarget();
    const target = screen.getByText("Restaurants");
    tap(target, 6);
    // Well past the 1.2s window: this is a first tap again, not a seventh.
    now += 5_000;
    fireEvent.pointerDown(target);

    await waitFor(() => expect(gameLoaded).not.toHaveBeenCalled());
  });

  it("ignores taps outside the marked element", async () => {
    renderWithTarget();
    tap(screen.getByTestId("elsewhere"), 10);

    await waitFor(() => expect(gameLoaded).not.toHaveBeenCalled());
  });
});

// ---------------------------------------------------------------------------
// Closing
// ---------------------------------------------------------------------------
describe("EasterEggLauncher — closing", () => {
  it("unmounts the game and can be unlocked again", async () => {
    render(<EasterEggLauncher />);
    enterKonamiCode();

    fireEvent.click(await screen.findByText("close"));
    await waitFor(() =>
      expect(screen.queryByTestId("dish-duel")).not.toBeInTheDocument()
    );

    enterKonamiCode();
    expect(await screen.findByTestId("dish-duel")).toBeInTheDocument();
  });
});
