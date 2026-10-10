import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import InstallAppCard from "@/components/settings/install-app-card";
import usePwaStore, { BeforeInstallPromptEvent } from "@/store/pwaStore";

// Mock next-intl: t(key) returns the key itself
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next-umami", () => ({
  useUmami: () => ({ event: vi.fn() }),
}));

const toast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast }),
}));

function mockDisplayMode(standalone: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: standalone });
}

function fakePrompt(outcome: "accepted" | "dismissed") {
  const event = new Event("beforeinstallprompt") as BeforeInstallPromptEvent;
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome });
  return event;
}

describe("InstallAppCard", () => {
  beforeEach(() => {
    toast.mockClear();
    mockDisplayMode(false);
    usePwaStore.setState({ installPrompt: null });
  });

  it("explains the manual install when the browser offers no prompt", () => {
    render(<InstallAppCard />);

    expect(screen.getByText("install.manualHint")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("says so when the app is already installed", () => {
    mockDisplayMode(true);
    usePwaStore.setState({ installPrompt: fakePrompt("accepted") });

    render(<InstallAppCard />);

    expect(screen.getByText("install.installed")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the browser's prompt and confirms an accepted install", async () => {
    const prompt = fakePrompt("accepted");
    usePwaStore.setState({ installPrompt: prompt });

    render(<InstallAppCard />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "install.button" }));
    });

    expect(prompt.prompt).toHaveBeenCalledOnce();
    expect(toast).toHaveBeenCalledOnce();
    expect(screen.getByText("install.installed")).toBeInTheDocument();
    expect(usePwaStore.getState().installPrompt).toBeNull();
  });

  it("falls back to the manual hint when the prompt is dismissed", async () => {
    usePwaStore.setState({ installPrompt: fakePrompt("dismissed") });

    render(<InstallAppCard />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "install.button" }));
    });

    expect(toast).not.toHaveBeenCalled();
    expect(screen.getByText("install.manualHint")).toBeInTheDocument();
  });
});
