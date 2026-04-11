import { describe, it, expect, beforeEach } from "vitest";
import useMarkerStore from "@/store/markerStore";
import { makeRestaurant } from "@/test/fixtures";

beforeEach(() => {
  useMarkerStore.setState({ markers: [] });
});

describe("markerStore", () => {
  describe("initial state", () => {
    it("starts with an empty markers array", () => {
      expect(useMarkerStore.getState().markers).toEqual([]);
    });
  });

  describe("setMarkers", () => {
    it("replaces the markers array", () => {
      const markers = [
        { id: 1, position: [48.8566, 2.3522] as [number, number], title: "Paris" },
      ];
      useMarkerStore.getState().setMarkers(markers);
      expect(useMarkerStore.getState().markers).toEqual(markers);
    });

    it("replaces existing markers entirely", () => {
      useMarkerStore.getState().setMarkers([
        { id: 1, position: [0, 0] as [number, number] },
      ]);
      useMarkerStore.getState().setMarkers([
        { id: 2, position: [1, 1] as [number, number] },
      ]);
      expect(useMarkerStore.getState().markers).toHaveLength(1);
      expect(useMarkerStore.getState().markers[0].id).toBe(2);
    });
  });

  describe("addMarker", () => {
    it("appends a marker to the array", () => {
      useMarkerStore.getState().addMarker(1, [48.8566, 2.3522], "Paris");
      expect(useMarkerStore.getState().markers).toHaveLength(1);
    });

    it("stores position, title, and optional restaurant", () => {
      const restaurant = makeRestaurant({ code: 99 });
      useMarkerStore.getState().addMarker(99, [48.8566, 2.3522], "Test", restaurant);
      const marker = useMarkerStore.getState().markers[0];
      expect(marker.id).toBe(99);
      expect(marker.position).toEqual([48.8566, 2.3522]);
      expect(marker.title).toBe("Test");
      expect(marker.restaurant?.code).toBe(99);
    });

    it("accumulates multiple markers", () => {
      useMarkerStore.getState().addMarker(1, [0, 0]);
      useMarkerStore.getState().addMarker(2, [1, 1]);
      useMarkerStore.getState().addMarker(3, [2, 2]);
      expect(useMarkerStore.getState().markers).toHaveLength(3);
    });
  });

  describe("clearMarkers", () => {
    it("empties the markers array", () => {
      useMarkerStore.getState().addMarker(1, [0, 0]);
      useMarkerStore.getState().addMarker(2, [1, 1]);
      useMarkerStore.getState().clearMarkers();
      expect(useMarkerStore.getState().markers).toEqual([]);
    });

    it("is safe to call on an already-empty store", () => {
      useMarkerStore.getState().clearMarkers();
      expect(useMarkerStore.getState().markers).toEqual([]);
    });
  });
});

// ---------------------------------------------------------------------------
// Additional edge cases
// ---------------------------------------------------------------------------
describe("markerStore — edge cases", () => {
  beforeEach(() => {
    useMarkerStore.setState({ markers: [] });
  });

  it("addMarker without optional title or restaurant stores undefined for those fields", () => {
    useMarkerStore.getState().addMarker(5, [10, 20]);
    const marker = useMarkerStore.getState().markers[0];
    expect(marker.id).toBe(5);
    expect(marker.position).toEqual([10, 20]);
    expect(marker.title).toBeUndefined();
    expect(marker.restaurant).toBeUndefined();
  });

  it("setMarkers with empty array clears existing markers", () => {
    useMarkerStore.getState().addMarker(1, [0, 0]);
    useMarkerStore.getState().setMarkers([]);
    expect(useMarkerStore.getState().markers).toHaveLength(0);
  });

  it("markers preserve insertion order", () => {
    useMarkerStore.getState().addMarker(10, [1, 1]);
    useMarkerStore.getState().addMarker(20, [2, 2]);
    useMarkerStore.getState().addMarker(30, [3, 3]);
    const ids = useMarkerStore.getState().markers.map((m) => m.id);
    expect(ids).toEqual([10, 20, 30]);
  });

  it("setMarkers replaces markers set via addMarker", () => {
    useMarkerStore.getState().addMarker(1, [0, 0]);
    useMarkerStore.getState().addMarker(2, [1, 1]);
    useMarkerStore.getState().setMarkers([{ id: 99, position: [9, 9] }]);
    expect(useMarkerStore.getState().markers).toHaveLength(1);
    expect(useMarkerStore.getState().markers[0].id).toBe(99);
  });
});
