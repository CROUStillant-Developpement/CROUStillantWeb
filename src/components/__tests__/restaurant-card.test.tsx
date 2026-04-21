import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RestaurantCard from "@/components/restaurants/restaurant-card";
import { makeRestaurant } from "@/test/fixtures";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

// next/image → plain <img>
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  // eslint-disable-next-line @next/next/no-img-element
  }) => <img src={src} alt={alt} {...rest} />,
}));

// i18n Link → plain <a>
vi.mock("@/i18n/routing", () => ({
  Link: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

// next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// next-umami
const umamiEvent = vi.fn();
vi.mock("next-umami", () => ({
  useUmami: () => ({ event: umamiEvent }),
}));

// userPreferencesStore — mutable so we can control favourites per test
const mockStore = {
  addOrRemoveFromfavourites: vi.fn(),
  favourites: [] as { code: number; name: string }[],
};
vi.mock("@/store/userPreferencesStore", () => ({
  useUserPreferences: () => mockStore,
}));

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockStore.addOrRemoveFromfavourites = vi.fn();
  mockStore.favourites = [];
  umamiEvent.mockReset();
});

// ---------------------------------------------------------------------------
// Rendering — basic content
// ---------------------------------------------------------------------------
describe("RestaurantCard — basic content", () => {
  it("renders the restaurant name", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ nom: "Cafétéria Nord" })} />);
    expect(screen.getByText("Cafétéria Nord")).toBeInTheDocument();
  });

  it("renders the zone / city", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ zone: "Bordeaux" })} />);
    expect(screen.getByText("Bordeaux")).toBeInTheDocument();
  });

  it("shows an image with the restaurant name as alt text", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ nom: "RU Centre" })} />);
    expect(screen.getByAltText("RU Centre")).toBeInTheDocument();
  });

  it("uses image_url when provided", () => {
    render(
      <RestaurantCard
        restaurant={makeRestaurant({ nom: "RU X", image_url: "https://cdn.example.com/ru.jpg" })}
      />
    );
    const img = screen.getByAltText("RU X") as HTMLImageElement;
    expect(img.src).toContain("cdn.example.com");
  });

  it("falls back to /default_ru.png when image_url is null", () => {
    render(
      <RestaurantCard restaurant={makeRestaurant({ nom: "RU Y", image_url: null })} />
    );
    const img = screen.getByAltText("RU Y") as HTMLImageElement;
    expect(img.src).toContain("default_ru.png");
  });
});

// ---------------------------------------------------------------------------
// Open / closed badge
// ---------------------------------------------------------------------------
describe("RestaurantCard — open/closed badge", () => {
  it("shows 'open' badge text when ouvert=true", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ ouvert: true })} />);
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  it("shows 'closed' badge text when ouvert=false", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ ouvert: false })} />);
    expect(screen.getByText("closed")).toBeInTheDocument();
  });

  it("open badge has green background class", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ ouvert: true })} />);
    const badge = screen.getByText("open");
    expect(badge.className).toContain("green");
  });

  it("closed badge has red background class", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ ouvert: false })} />);
    const badge = screen.getByText("closed");
    expect(badge.className).toContain("red");
  });
});

// ---------------------------------------------------------------------------
// PMR accessibility icon
// ---------------------------------------------------------------------------
describe("RestaurantCard — PMR accessibility", () => {
  it("shows the accessibility icon when ispmr=true", () => {
    const { container } = render(
      <RestaurantCard restaurant={makeRestaurant({ ispmr: true })} />
    );
    // The Accessibility icon from lucide renders as SVG; its wrapper has bg-blue-500/10
    expect(container.querySelector(".bg-blue-500\\/10")).not.toBeNull();
  });

  it("does NOT show the accessibility icon when ispmr=false", () => {
    const { container } = render(
      <RestaurantCard restaurant={makeRestaurant({ ispmr: false })} />
    );
    expect(container.querySelector(".bg-blue-500\\/10")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// IZLY payment icon
// ---------------------------------------------------------------------------
describe("RestaurantCard — IZLY payment", () => {
  it("shows the Izly icon when paiement includes 'IZLY'", () => {
    render(
      <RestaurantCard
        restaurant={makeRestaurant({ paiement: ["IZLY", "CB"] })}
      />
    );
    expect(screen.getByAltText("Izly")).toBeInTheDocument();
  });

  it("does NOT show the Izly icon when paiement does not include 'IZLY'", () => {
    render(
      <RestaurantCard restaurant={makeRestaurant({ paiement: ["CB"] })} />
    );
    expect(screen.queryByAltText("Izly")).toBeNull();
  });

  it("does NOT show the Izly icon when paiement is undefined", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ paiement: undefined })} />);
    expect(screen.queryByAltText("Izly")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Favourite button
// ---------------------------------------------------------------------------
describe("RestaurantCard — favourite button", () => {
  it("calls addOrRemoveFromfavourites with restaurant code and name on click", () => {
    render(
      <RestaurantCard
        restaurant={makeRestaurant({ code: 7, nom: "Resto 7" })}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockStore.addOrRemoveFromfavourites).toHaveBeenCalledWith(7, "Resto 7");
  });

  it("heart icon has red fill class when restaurant is in favourites", () => {
    mockStore.favourites = [{ code: 5, name: "Fav Resto" }];
    const { container } = render(
      <RestaurantCard restaurant={makeRestaurant({ code: 5, nom: "Fav Resto" })} />
    );
    const heart = container.querySelector(".fill-red-500");
    expect(heart).not.toBeNull();
  });

  it("heart icon has white text class when restaurant is NOT in favourites", () => {
    mockStore.favourites = [];
    const { container } = render(
      <RestaurantCard restaurant={makeRestaurant({ code: 10, nom: "Other" })} />
    );
    const heart = container.querySelector(".text-white");
    expect(heart).not.toBeNull();
  });

  it("favourite click fires umami event with restaurant code", () => {
    render(<RestaurantCard restaurant={makeRestaurant({ code: 3 })} />);
    fireEvent.click(screen.getByRole("button"));
    expect(umamiEvent).toHaveBeenCalledWith("Restaurant.Favourite", {
      restaurant: 3,
    });
  });
});

// ---------------------------------------------------------------------------
// CTA link
// ---------------------------------------------------------------------------
describe("RestaurantCard — CTA link", () => {
  it("link href contains the restaurant code prefixed by -r", () => {
    render(
      <RestaurantCard restaurant={makeRestaurant({ code: 42, nom: "Resto Test" })} />
    );
    // Multiple links share the same href; check at least one
    const links = screen.getAllByRole("link");
    const hasRestaurantLink = links.some(
      (l) => l.getAttribute("href")?.includes("-r42")
    );
    expect(hasRestaurantLink).toBe(true);
  });

  it("link href uses slugified restaurant name", () => {
    render(
      <RestaurantCard
        restaurant={makeRestaurant({ code: 1, nom: "Cafétéria Centrale" })}
      />
    );
    const links = screen.getAllByRole("link");
    const hasSlug = links.some((l) =>
      l.getAttribute("href")?.includes("cafeteria-centrale")
    );
    expect(hasSlug).toBe(true);
  });
});
