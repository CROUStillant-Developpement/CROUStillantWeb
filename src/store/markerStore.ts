// store/markerStore.ts
import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';

export interface Marker {
    id: number;
    position: LatLngExpression;
    title?: string;
    description?: string;
}

interface MarkerStore {
    markers: Marker[];
    addMarker: (id: number, position: LatLngExpression, title?: string, description?: string) => void;
    clearMarkers: () => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],
    addMarker: (id, position, title, description) => set((state) => ({ markers: [...state.markers, { id, position, title, description }] })),
    clearMarkers: () => set({ markers: [] }),
}));

export default useMarkerStore;
