import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMenuEvents } from "@/hooks/useMenuEvents";
import type { MenuEvent } from "@/lib/events";

class FakeEventSource {
  static instances: FakeEventSource[] = [];

  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  closed = false;
  private listeners = new Map<string, ((message: MessageEvent<string>) => void)[]>();

  constructor(public url: string) {
    FakeEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (message: MessageEvent<string>) => void) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  close() {
    this.closed = true;
  }

  emit(type: string, data: string) {
    this.listeners.get(type)?.forEach((listener) => listener({ data } as MessageEvent<string>));
  }
}

const EVENT: MenuEvent = {
  id: 1234,
  type: "menu.updated",
  code: 871,
  date: "25-09-2026",
  menu: 1879114,
  creation: "24-09-2026 09:05:07",
};

function lastSource() {
  return FakeEventSource.instances[FakeEventSource.instances.length - 1];
}

beforeEach(() => {
  FakeEventSource.instances = [];
  vi.stubGlobal("EventSource", FakeEventSource);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMenuEvents", () => {
  it("opens the stream for the given restaurants and every menu event type", () => {
    renderHook(() => useMenuEvents({ codes: [871, 870], onEvent: vi.fn() }));

    const url = new URL(lastSource().url);
    expect(url.pathname.endsWith("/evenements")).toBe(true);
    expect(url.searchParams.get("code")).toBe("870,871");
    expect(url.searchParams.get("types")).toBe("menu.created,menu.updated,menu.deleted");
  });

  it("passes received events to onEvent", () => {
    const onEvent = vi.fn();
    renderHook(() => useMenuEvents({ codes: [871], onEvent }));

    act(() => lastSource().emit("menu.updated", JSON.stringify(EVENT)));

    expect(onEvent).toHaveBeenCalledWith(EVENT);
  });

  it("ignores malformed events", () => {
    const onEvent = vi.fn();
    renderHook(() => useMenuEvents({ codes: [871], onEvent }));

    act(() => lastSource().emit("menu.updated", "not json"));

    expect(onEvent).not.toHaveBeenCalled();
  });

  it("only listens to the requested types", () => {
    const onEvent = vi.fn();
    renderHook(() => useMenuEvents({ codes: [871], types: ["menu.created"], onEvent }));

    act(() => lastSource().emit("menu.updated", JSON.stringify(EVENT)));

    expect(new URL(lastSource().url).searchParams.get("types")).toBe("menu.created");
    expect(onEvent).not.toHaveBeenCalled();
  });

  it("reports the connection state", () => {
    const { result } = renderHook(() => useMenuEvents({ codes: [871], onEvent: vi.fn() }));
    expect(result.current.connected).toBe(false);

    act(() => lastSource().onopen?.());
    expect(result.current.connected).toBe(true);

    act(() => lastSource().onerror?.());
    expect(result.current.connected).toBe(false);
  });

  it("does not connect without restaurants or when disabled", () => {
    renderHook(() => useMenuEvents({ codes: [], onEvent: vi.fn() }));
    renderHook(() => useMenuEvents({ codes: [871], enabled: false, onEvent: vi.fn() }));

    expect(FakeEventSource.instances).toHaveLength(0);
  });

  it("keeps the same connection when re-rendered with equal options", () => {
    const { rerender } = renderHook(() => useMenuEvents({ codes: [871], onEvent: vi.fn() }));
    rerender();

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it("closes the stream on unmount", () => {
    const { unmount } = renderHook(() => useMenuEvents({ codes: [871], onEvent: vi.fn() }));
    unmount();

    expect(lastSource().closed).toBe(true);
  });
});
