// store/markerStore.ts
import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';
import { ReactNode } from 'react';

export interface Marker {
    id: number;
    position: LatLngExpression;
    title?: string;
    description?: ReactNode;
}

interface MarkerStore {
    markers: Marker[];
    addMarker: (id: number, position: LatLngExpression, title?: string, description?: ReactNode) => void;
    clearMarkers: () => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],
    addMarker: (id, position, title, description) => set((state) => ({ markers: [...state.markers, { id, position, title, description }] })),
    clearMarkers: () => set({ markers: [] }),
}));

export default useMarkerStore;
