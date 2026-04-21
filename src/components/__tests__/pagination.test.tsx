import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationComponent from "@/components/pagination";

// t(key) → key
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// ---------------------------------------------------------------------------
// Query helpers
// PaginationLink renders <a> elements WITHOUT href, so they are not "link"
// role elements per ARIA spec. Query by text or aria-label instead.
// ---------------------------------------------------------------------------
const getPrev = () => screen.getByLabelText("Go to previous page");
const getNext = () => screen.getByLabelText("Go to next page");
/** Find a page-number <a> by its visible digit(s). */
const getPage = (n: number) =>
  screen.getByText(String(n), { selector: "a" });
const queryPage = (n: number) =>
  screen.queryByText(String(n), { selector: "a" });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderPagination(
  props: Partial<{
    currentPage: number;
    totalRecords: number;
    pageSize: number;
    loading: boolean;
    onPageChange: (p: number) => void;
  }> = {}
) {
  const defaults = {
    currentPage: 1,
    totalRecords: 50,
    pageSize: 10,
    loading: false,
    onPageChange: vi.fn(),
  };
  return { ...render(<PaginationComponent {...defaults} {...props} />), ...defaults, ...props };
}

// ---------------------------------------------------------------------------
// Give jsdom a wide viewport so delta = 3 (innerWidth >= 1024)
// ---------------------------------------------------------------------------
beforeEach(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1280,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe("PaginationComponent — rendering", () => {
  it("renders a navigation landmark", () => {
    renderPagination();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("shows all pages when total fits without ellipsis (5 pages, currentPage=3)", () => {
    // delta=3 → all pages [1..5] visible without ellipsis
    renderPagination({ totalRecords: 50, pageSize: 10, currentPage: 3 });
    for (let p = 1; p <= 5; p++) {
      expect(getPage(p)).toBeInTheDocument();
    }
  });

  it("marks the current page <a> with aria-current='page'", () => {
    renderPagination({ totalRecords: 50, pageSize: 10, currentPage: 3 });
    expect(getPage(3)).toHaveAttribute("aria-current", "page");
  });

  it("non-active page links do NOT carry aria-current", () => {
    renderPagination({ totalRecords: 50, pageSize: 10, currentPage: 3 });
    expect(getPage(1)).not.toHaveAttribute("aria-current");
    expect(getPage(2)).not.toHaveAttribute("aria-current");
    expect(getPage(4)).not.toHaveAttribute("aria-current");
    expect(getPage(5)).not.toHaveAttribute("aria-current");
  });

  it("always shows page 1 and the last page", () => {
    // 10 pages, current = 5 → ellipsis appears; pages 1 and 10 must still be visible
    renderPagination({ totalRecords: 100, pageSize: 10, currentPage: 5 });
    expect(getPage(1)).toBeInTheDocument();
    expect(getPage(10)).toBeInTheDocument();
  });

  it("renders ellipsis for a large page set (page 5 of 20)", () => {
    renderPagination({ totalRecords: 200, pageSize: 10, currentPage: 5 });
    const ellipses = screen.getAllByText("More pages");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("does NOT show ellipsis when all pages fit in the window", () => {
    // 5 pages with delta=3 → all fit without ellipsis
    renderPagination({ totalRecords: 50, pageSize: 10, currentPage: 3 });
    expect(screen.queryByText("More pages")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
describe("PaginationComponent — loading state", () => {
  it("hides page number links while loading", () => {
    renderPagination({ loading: true, currentPage: 1 });
    // In loading state the pages are replaced by Skeleton elements
    expect(queryPage(1)).toBeNull();
  });

  it("prev nav link is present even while loading", () => {
    renderPagination({ loading: true, currentPage: 3, totalRecords: 50, pageSize: 10 });
    expect(getPrev()).toBeInTheDocument();
  });

  it("prev link has opacity-50 class while loading (disabled appearance)", () => {
    renderPagination({ loading: true, currentPage: 3, totalRecords: 50, pageSize: 10 });
    expect(getPrev().className).toContain("opacity-50");
  });
});

// ---------------------------------------------------------------------------
// Previous / Next navigation
// ---------------------------------------------------------------------------
describe("PaginationComponent — previous / next buttons", () => {
  it("prev element has aria-label 'Go to previous page'", () => {
    renderPagination({ currentPage: 2 });
    expect(getPrev()).toBeInTheDocument();
  });

  it("next element has aria-label 'Go to next page'", () => {
    renderPagination({ currentPage: 1, totalRecords: 50, pageSize: 10 });
    expect(getNext()).toBeInTheDocument();
  });

  it("clicking prev calls onPageChange(currentPage - 1)", () => {
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 3, totalRecords: 50, pageSize: 10, onPageChange });
    fireEvent.click(getPrev());
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("clicking next calls onPageChange(currentPage + 1)", () => {
    const onPageChange = vi.fn();
    renderPagination({
      currentPage: 1,
      totalRecords: 50,
      pageSize: 10,
      onPageChange,
    });
    fireEvent.click(getNext());
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("prev link has cursor-not-allowed class on first page", () => {
    renderPagination({ currentPage: 1, totalRecords: 50, pageSize: 10 });
    expect(getPrev().className).toContain("cursor-not-allowed");
  });

  it("next link has cursor-not-allowed class on last page", () => {
    renderPagination({ currentPage: 5, totalRecords: 50, pageSize: 10 });
    expect(getNext().className).toContain("cursor-not-allowed");
  });

  it("clicking prev on page 1 does NOT call onPageChange", () => {
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 1, totalRecords: 50, pageSize: 10, onPageChange });
    fireEvent.click(getPrev());
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("clicking next on last page does NOT call onPageChange", () => {
    const onPageChange = vi.fn();
    renderPagination({
      currentPage: 5,
      totalRecords: 50,
      pageSize: 10,
      onPageChange,
    });
    fireEvent.click(getNext());
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Clicking a page number
// ---------------------------------------------------------------------------
describe("PaginationComponent — clicking a page number", () => {
  it("calls onPageChange with the clicked page number", () => {
    const onPageChange = vi.fn();
    renderPagination({
      currentPage: 1,
      totalRecords: 50,
      pageSize: 10,
      onPageChange,
    });
    fireEvent.click(getPage(3));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("clicking the already active page still calls onPageChange", () => {
    const onPageChange = vi.fn();
    renderPagination({
      currentPage: 2,
      totalRecords: 50,
      pageSize: 10,
      onPageChange,
    });
    fireEvent.click(getPage(2));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

// ---------------------------------------------------------------------------
// Out-of-bounds guard (useEffect clamp)
// ---------------------------------------------------------------------------
describe("PaginationComponent — out-of-bounds guard", () => {
  it("calls onPageChange(totalPages) when currentPage > totalPages on mount", () => {
    const onPageChange = vi.fn();
    renderPagination({
      currentPage: 99,
      totalRecords: 50,
      pageSize: 10,
      onPageChange,
    });
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("calls onPageChange(1) when currentPage < 1 on mount", () => {
    const onPageChange = vi.fn();
    renderPagination({ currentPage: 0, totalRecords: 50, pageSize: 10, onPageChange });
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});

// ---------------------------------------------------------------------------
// Single-page edge case
// ---------------------------------------------------------------------------
describe("PaginationComponent — single page", () => {
  it("shows only page 1 when totalRecords <= pageSize", () => {
    renderPagination({ totalRecords: 5, pageSize: 10, currentPage: 1 });
    expect(getPage(1)).toBeInTheDocument();
    expect(queryPage(2)).toBeNull();
  });
});
