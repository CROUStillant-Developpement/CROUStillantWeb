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
}

const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],
    setMarkers: (markers) => set({ markers }),
    addMarker: (id, position, title, restaurant) => set((state) => ({ markers: [...state.markers, { id, position, title, restaurant }] })),
    clearMarkers: () => set({ markers: [] }),
}));

export default useMarkerStore;
