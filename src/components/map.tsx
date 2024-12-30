// components/Map.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, LatLngBounds, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import useMarkerStore from "@/store/markerStore";

const defaultIcon = new Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="iso-8859-1"?>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="white" fill-opacity="1"/>
        <path d="M11 26V16.85C10.15 16.6167 9.43767 16.15 8.863 15.45C8.28833 14.75 8.00067 13.9333 8 13V6H10V13H11V6H13V13H14V6H16V13C16 13.9333 15.7127 14.75 15.138 15.45C14.5633 16.15 13.8507 16.6167 13 16.85V26H11ZM21 26V18H18V11C18 9.61667 18.4877 8.43767 19.463 7.463C20.4383 6.48833 21.6173 6.00067 23 6V26H21Z" fill="#B52606"/>
      </svg>
    `)}`,
  iconSize: [25, 25],
  iconAnchor: [25 / 2, 25],
  popupAnchor: [0, -25],
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
