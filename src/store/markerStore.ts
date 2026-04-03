// store/markerStore.ts
import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';
import { ReactNode } from 'react';
import { Restaurant } from '@/services/types';

export interface Marker {
    id: number;
    position: LatLngExpression;
    title?: string;
    description?: ReactNode;
    restaurant?: Restaurant;
}

interface MarkerStore {
    markers: Marker[];
    addMarker: (id: number, position: LatLngExpression, title?: string, description?: ReactNode, restaurant?: Restaurant) => void;
    clearMarkers: () => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],
    addMarker: (id, position, title, description, restaurant) => set((state) => ({ markers: [...state.markers, { id, position, title, description, restaurant }] })),
    clearMarkers: () => set({ markers: [] }),
}));

export default useMarkerStore;
