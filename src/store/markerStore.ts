// store/markerStore.ts
import { create } from 'zustand';
import { Restaurant } from '@/services/types';

// position is [latitude, longitude]
export interface Marker {
    id: number;
    position: [number, number];
    title?: string;
    restaurant?: Restaurant;
}

interface MarkerStore {
    markers: Marker[];
    setMarkers: (markers: Marker[]) => void;
    addMarker: (id: number, position: [number, number], title?: string, restaurant?: Restaurant) => void;
    clearMarkers: () => void;
    // Bridges the "crous" region filter (owned by the sidebar filters) to the map,
    // so the region overlay can highlight the selected CROUS. -1 means "all regions".
    selectedCrous: number;
    setSelectedCrous: (crousId: number) => void;
    // Set by the sidebar filters so a click on a region polygon on the map can
    // update `filters.crous` there without lifting all the filter state up.
    onRegionClick: ((crousId: number) => void) | null;
    setOnRegionClick: (handler: ((crousId: number) => void) | null) => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],
    setMarkers: (markers) => set({ markers }),
    addMarker: (id, position, title, restaurant) => set((state) => ({ markers: [...state.markers, { id, position, title, restaurant }] })),
    clearMarkers: () => set({ markers: [] }),
    selectedCrous: -1,
    setSelectedCrous: (crousId) => set({ selectedCrous: crousId }),
    onRegionClick: null,
    setOnRegionClick: (handler) => set({ onRegionClick: handler }),
}));

export default useMarkerStore;
