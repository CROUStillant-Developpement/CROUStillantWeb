import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ActiveFilterBadge from "@/components/restaurants/active-filter-badge";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
const umamiEvent = vi.fn();
vi.mock("next-umami", () => ({
  useUmami: () => ({ event: umamiEvent }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

beforeEach(() => {
  umamiEvent.mockReset();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe("ActiveFilterBadge — rendering", () => {
  it("displays the provided text string", () => {
    render(<ActiveFilterBadge text="PMR" />);
    expect(screen.getByText("PMR")).toBeInTheDocument();
  });

  it("displays a ReactNode as text", () => {
    render(<ActiveFilterBadge text={<span data-testid="node">Region: IDF</span>} />);
    expect(screen.getByTestId("node")).toBeInTheDocument();
  });

  it("always renders the remove icon (CircleX)", () => {
    const { container } = render(<ActiveFilterBadge text="open" />);
    // lucide CircleX renders as <svg>
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Remove button (CircleX click)
// ---------------------------------------------------------------------------
describe("ActiveFilterBadge — remove button", () => {
  it("calls onRemove when the X icon is clicked", () => {
    const onRemove = vi.fn();
    const { container } = render(
      <ActiveFilterBadge text="PMR" onRemove={onRemove} />
    );
    const icon = container.querySelector("svg")!;
    fireEvent.click(icon);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("does NOT throw when onRemove is undefined and X is clicked", () => {
    const { container } = render(<ActiveFilterBadge text="open" />);
    const icon = container.querySelector("svg")!;
    expect(() => fireEvent.click(icon)).not.toThrow();
  });

  it("fires a Restaurant.Filter.Remove umami event on X click", () => {
    const { container } = render(
      <ActiveFilterBadge text="PMR" onRemove={vi.fn()} />
    );
    fireEvent.click(container.querySelector("svg")!);
    expect(umamiEvent).toHaveBeenCalledWith("Restaurant.Filter.Remove");
  });
});

// ---------------------------------------------------------------------------
// Text area click (opens filter sheet)
// ---------------------------------------------------------------------------
describe("ActiveFilterBadge — text area click", () => {
  it("calls setSheetOpen(true) when the badge text is clicked", () => {
    const setSheetOpen = vi.fn();
    render(
      <ActiveFilterBadge
        text="Search: pizza"
        setSheetOpen={setSheetOpen}
      />
    );
    fireEvent.click(screen.getByText("Search: pizza"));
    expect(setSheetOpen).toHaveBeenCalledWith(true);
  });

  it("does NOT throw when setSheetOpen is undefined and text is clicked", () => {
    render(<ActiveFilterBadge text="open" />);
    expect(() => fireEvent.click(screen.getByText("open"))).not.toThrow();
  });

  it("clicking the text does NOT trigger onRemove", () => {
    const onRemove = vi.fn();
    const setSheetOpen = vi.fn();
    render(
      <ActiveFilterBadge
        text="open"
        onRemove={onRemove}
        setSheetOpen={setSheetOpen}
      />
    );
    fireEvent.click(screen.getByText("open"));
    expect(onRemove).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Both handlers together
// ---------------------------------------------------------------------------
describe("ActiveFilterBadge — combined usage", () => {
  it("onRemove and setSheetOpen can both be wired up without interference", () => {
    const onRemove = vi.fn();
    const setSheetOpen = vi.fn();
    const { container } = render(
      <ActiveFilterBadge
        text="Région: IDF"
        onRemove={onRemove}
        setSheetOpen={setSheetOpen}
      />
    );

    // Click the text → sheet opens
    fireEvent.click(screen.getByText("Région: IDF"));
    expect(setSheetOpen).toHaveBeenCalledWith(true);
    expect(onRemove).not.toHaveBeenCalled();

    // Click the X → remove fires
    fireEvent.click(container.querySelector("svg")!);
    expect(onRemove).toHaveBeenCalledOnce();
    expect(setSheetOpen).toHaveBeenCalledTimes(1); // no extra call
  });
});
