// components/Map.tsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, LatLngBounds, Icon, Map as MapType } from "leaflet";
import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'
import useMarkerStore from "@/store/markerStore";
import MarkerClusterGroup from "react-leaflet-markercluster";

const defaultIcon = new Icon({
  iconUrl: unselectedIcon,
  iconAnchor: [25 / 2, 25],
  popupAnchor: [0, -25],
});

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  loading?: boolean;
}

// Component to fit bounds of all markers
/**
 * FitBoundsToMarkersComponent is a React component that adjusts the map view to fit all markers within the visible area.
 * It uses the `useMarkerStore` hook to retrieve the markers and the `useMap` hook to get the map instance.
 *
 * The component uses a `useEffect` hook to update the map bounds whenever the markers change.
 * If there are no markers, the effect does nothing.
 *
 * The markers' positions are converted to LatLng tuples if needed, and then used to create a `LatLngBounds` object.
 * The map's `fitBounds` method is called with the bounds and a padding option to ensure all markers are visible with some padding around the edges.
 *
 * @returns {null} This component does not render any visible elements.
 */
const FitBoundsToMarkersComponent = () => {
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

/**
 * Adjusts the map view to fit all provided markers within the visible area.
 *
 * @param markers - An array of custom marker objects, each containing a position property.
 *                  The position can be either a LatLng object or a tuple of [latitude, longitude].
 * @param map - The map instance to adjust the view on. If null, the function will return without doing anything.
 *
 * @remarks
 * - If the markers array is empty or the map is null, the function will return immediately without making any changes.
 * - The function converts marker positions to LatLng tuples if they are not already in that format.
 * - The map view is adjusted with a padding of 50 pixels on all sides.
 */
const fitBoundsToMarkers = (
  markers: CustomMarkerType[],
  map: MapType | null
) => {
  if (markers.length === 0 || !map) return;

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
};

const DEFAULT_CENTER: LatLngExpression = [46.603354, 1.888334]; // France
const DEFAULT_ZOOM = 6; // to view the whole France

/**
 * Map component that renders a map with markers and a loading state.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.center - The initial center position of the map.
 * @param {number} props.zoom - The initial zoom level of the map.
 * @param {boolean} props.loading - Indicates if the map is in a loading state.
 *
 * @returns {JSX.Element} The rendered Map component.
 *
 * @component
 *
 * @example
 * return (
 *   <Map
 *     center={[51.505, -0.09]}
 *     zoom={13}
 *     loading={false}
 *   />
 * );
 */
const Map = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  loading = false,
}: MapProps) => {
  const { markers, highlightedMarker } = useMarkerStore();

  const mapRef = useRef<MapType | null>(null);

  return (
    <div className="col-span-3 flex-1 h-full relative">
      {loading && (
        <div className="absolute top-0 left-0 inset-0 flex flex-col items-center justify-center rounded-lg bg-transparent z-20 backdrop-blur-sm">
          <div className="rounded-full h-20 w-20 bg-primary animate-ping"></div>
        </div>
      )}
      {mapRef.current && (
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => fitBoundsToMarkers(markers, mapRef.current)}
          >
            <LocateFixed />
          </Button>
          <div className="flex flex-col">
            <Button
              size="icon"
              variant="outline"
              className="rounded-b-none"
              onClick={() => mapRef.current?.zoomIn()}
            >
              <ZoomIn />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-t-none"
              onClick={() => mapRef.current?.zoomOut()}
            >
              <ZoomOut />
            </Button>
          </div>
        </div>
      )}
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        className="flex-1 w-full h-full rounded-lg z-10"
        minZoom={2}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsToMarkers />
        <MarkerClusterGroup showCoverageOnHover={false}>
          {markers.map((marker, idx) => (
            <Marker key={idx} position={marker.position} icon={defaultIcon}>
              {marker.title && (
                <Popup>
                  <span className="text-lg font-bold">{marker.title}</span>
                  <br />
                  {marker.description}
                </Popup>
              )}
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Map;
