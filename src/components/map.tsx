// components/Map.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression, LatLngBounds, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import useMarkerStore from "@/store/markerStore";
import { Skeleton } from "./ui/skeleton";

const defaultIcon = new Icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  loading?: boolean;
}

// Component to fit bounds of all markers
const FitBoundsToMarkers = () => {
  const { markers } = useMarkerStore();
  const map = useMap();

  // Component to fit bounds of all markers
  useEffect(() => {
    if (markers.length === 0) return;

    // Convert markers to LatLng tuples if needed
    const bounds = new LatLngBounds(
      markers.map((marker) => {
        if (Array.isArray(marker.position)) {
          return marker.position as [number, number]; // Ensure the type is [number, number]
        }
        return [marker.position.lat, marker.position.lng] as [number, number];
      })
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, map]);

  return null;
};

const DEFAULT_CENTER: LatLngExpression = [46.603354, 1.888334]; // France
const DEFAULT_ZOOM = 6; // to view the whole France

const Map = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  loading = false,
}: MapProps) => {
  const { markers } = useMarkerStore();

  return (
    <div className="col-span-3 flex-1 h-screen relative">
      {loading && (
        <div className="absolute top-0 left-0 inset-0 flex items-center justify-center rounded-lg bg-white opacity-75">
          <div className="rounded-full h-20 w-20 bg-primary animate-ping"></div>
          HELLO WORLD
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        className="flex-1 w-full h-full rounded-lg z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors - Powered by <a href="https://www.leafletjs.com">Leaflet</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsToMarkers />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={defaultIcon}>
            {marker.title && (
              <Popup>
                <span className="text-lg font-bold">{marker.title}</span>
                <br />
                <div
                  dangerouslySetInnerHTML={{ __html: marker.description || "" }}
                />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
