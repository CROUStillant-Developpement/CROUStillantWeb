import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import BetaBanner from "@/components/beta-banner";

// Mock next-intl: t(key) returns the key itself
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the i18n Link as a plain anchor
vi.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

const STORAGE_KEY = "beta-banner-dismissed";

function getWrapper(container: HTMLElement) {
  return container.firstChild as HTMLElement;
}

describe("BetaBanner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe("on production domain", () => {
    it("stays hidden after the timer fires", async () => {
      vi.stubGlobal("location", { hostname: "croustillant.menu" });
      const { container } = render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });
      expect(getWrapper(container)).toHaveClass("opacity-0");
    });
  });

  describe("on beta domain", () => {
    beforeEach(() => {
      vi.stubGlobal("location", { hostname: "beta.croustillant.menu" });
    });

    it("is initially hidden", () => {
      const { container } = render(<BetaBanner />);
      expect(getWrapper(container)).toHaveClass("opacity-0");
    });

    it("becomes visible after the 800 ms delay", async () => {
      const { container } = render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });
      expect(getWrapper(container)).toHaveClass("opacity-100");
    });

    it("renders the title and message text", async () => {
      render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });
      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByText(/message/)).toBeInTheDocument();
    });

    it("dismiss button hides the banner", async () => {
      const { container } = render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });

      act(() => { fireEvent.click(screen.getByRole("button", { name: "dismiss" })); });

      expect(getWrapper(container)).toHaveClass("opacity-0");
    });

    it("dismiss button persists dismissal in sessionStorage", async () => {
      render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });

      act(() => { fireEvent.click(screen.getByRole("button", { name: "dismiss" })); });

      expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1");
    });

    it("stays hidden when already dismissed this session", async () => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      const { container } = render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });
      expect(getWrapper(container)).toHaveClass("opacity-0");
    });

    it("contact link points to /contact", async () => {
      render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });
      const link = screen.getByRole("link", { name: "contact" });
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  describe("on localhost", () => {
    it("becomes visible after the 800 ms delay", async () => {
      vi.stubGlobal("location", { hostname: "localhost" });
      const { container } = render(<BetaBanner />);
      await act(() => { vi.runAllTimers(); });
      expect(getWrapper(container)).toHaveClass("opacity-100");
    });
  });
});

// ---------------------------------------------------------------------------
// Additional tests
// ---------------------------------------------------------------------------
describe("BetaBanner — additional behaviour", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    vi.stubGlobal("location", { hostname: "beta.croustillant.menu" });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("wrapper has pointer-events-none while hidden", () => {
    const { container } = render(<BetaBanner />);
    expect(getWrapper(container)).toHaveClass("pointer-events-none");
  });

  it("wrapper gains pointer-events-auto when visible", async () => {
    const { container } = render(<BetaBanner />);
    await act(() => { vi.runAllTimers(); });
    expect(getWrapper(container)).toHaveClass("pointer-events-auto");
  });

  it("dismiss button has accessible aria-label", async () => {
    render(<BetaBanner />);
    await act(() => { vi.runAllTimers(); });
    const btn = screen.getByRole("button", { name: "dismiss" });
    expect(btn).toHaveAttribute("aria-label", "dismiss");
  });

  it("clicking the contact link also dismisses the banner", async () => {
    const { container } = render(<BetaBanner />);
    await act(() => { vi.runAllTimers(); });

    act(() => { fireEvent.click(screen.getByRole("link", { name: "contact" })); });

    expect(getWrapper(container)).toHaveClass("opacity-0");
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1");
  });

  it("banner does not appear before the 800 ms delay", () => {
    const { container } = render(<BetaBanner />);
    // Advance only partially
    act(() => { vi.advanceTimersByTime(400); });
    expect(getWrapper(container)).toHaveClass("opacity-0");
  });

  it("banner appears exactly after the 800 ms delay", async () => {
    const { container } = render(<BetaBanner />);
    await act(() => { vi.advanceTimersByTime(800); });
    expect(getWrapper(container)).toHaveClass("opacity-100");
  });

  it("wrapper has translate-y-4 class while hidden", () => {
    const { container } = render(<BetaBanner />);
    expect(getWrapper(container)).toHaveClass("translate-y-4");
  });

  it("wrapper has translate-y-0 class when visible", async () => {
    const { container } = render(<BetaBanner />);
    await act(() => { vi.runAllTimers(); });
    expect(getWrapper(container)).toHaveClass("translate-y-0");
  });
});
