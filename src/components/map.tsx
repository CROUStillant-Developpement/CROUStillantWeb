// components/Map.tsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, LatLngBounds, Icon, Map as MapType } from "leaflet";
import "leaflet/dist/leaflet.css";
import useMarkerStore, {
  Marker as CustomMarkerType,
} from "@/store/markerStore";
import { Button } from "./ui/button";
import { LocateFixed, ZoomIn, ZoomOut } from "lucide-react";

const unselectedIcon = `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="iso-8859-1"?>
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-62.41 -62.41 748.96 748.96" xml:space="preserve">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="124.8276">
<g>
  <g>
    <g>
      <g>
        <path style="fill:#B52606;" d="M312.069,0C203.473,0,115.444,88.029,115.444,196.576c0,108.615,196.625,427.562,196.625,427.562 s196.625-318.947,196.625-427.562C508.693,88.029,420.684,0,312.069,0z M312.069,371.843 c-90.276,0-163.728-73.452-163.728-163.719c-0.01-90.286,73.452-163.719,163.728-163.719 c90.296,0,163.728,73.433,163.728,163.719C475.797,298.391,402.355,371.843,312.069,371.843z"></path>
        <path style="fill:#B52606;" d="M240.493,213.84l2.833-1.768h-40.341c2.364,4.318,9.458,14.694,20.468,10.747 C229.697,220.591,235.207,217.161,240.493,213.84z"></path>
        <path style="fill:#B52606;" d="M308.092,217.924c1.827-0.098,3.146,0.772,3.801,1.632c1.348-0.244,3.449-0.733,6.82-1.573 c7.767-2.042,11.07-4.162,13.629-5.901h-27.464l2.052,3.732L308.092,217.924z"></path>
        <path style="fill:#B52606;" d="M283.159,214.387c2.159,0.137,4.064-0.938,5.843-2.306h-10.884 C279.603,213.634,280.228,214.289,283.159,214.387z"></path>
        <rect x="192.931" y="186.473" style="fill:#B52606;" width="238.265" height="19.501"></rect>
        <path style="fill:#B52606;" d="M327.301,93.5c-2.863-0.205-19.501-0.332-22.413-0.332c-50.736,0-89.641,37.342-109.27,85.626 l231.191-0.664C408.833,130.998,375.379,97.174,327.301,93.5z"></path>
        <polygon style="fill:#B52606;" points="388.344,212.081 380.304,212.081 385.404,213.986 "></polygon>
        <path style="fill:#B52606;" d="M412.858,212.091l10.454,6.243l-3.41,7.005l-19.706-11.763l-14.03,9.145l-17.713-6.644h-23.878 c-4.406,0-5.657,0.86-8.236,2.599c-2.902,1.983-6.82,4.641-16.023,7.035c-9.839,2.589-12.535,2.921-14.362,0.313l-0.469-0.694 c-2.638-1.084-3.898-3.732-4.895-5.755c-0.733-1.475-1.563-3.166-2.902-4.856l-2.247,2.003 c-2.892,2.433-6.966,5.823-12.506,5.598c-5.676-0.195-7.845-2.472-9.76-4.475c-1.612-1.71-3.253-3.42-8.725-4.592 c-6.302-1.387-12.858,2.716-20.459,7.494c-5.364,3.38-11.412,7.171-18.378,9.653c-2.13,0.752-4.143,1.084-6.097,1.202h218.783 v-19.511H412.858L412.858,212.091z"></path>
        <polygon style="fill:#B52606;" points="218.598,231.68 219.555,231.621 217.845,231.621 "></polygon>
        <path style="fill:#B52606;" d="M196.527,240.248c0,0-4.504,26.223,7.191,26.223h217.308c9.565,0,7.171-26.223,7.171-26.223 H196.527z"></path>
        <path style="fill:#B52606;" d="M195.648,213.82l3.205-1.749H185.75v19.54h32.105 C206.483,231.113,198.569,220.542,195.648,213.82z"></path>
      </g>
    </g>
  </g>
</g>
</g>
<g id="SVGRepo_iconCarrier">
<g>
  <g>
    <g>
      <g>
        <path style="fill:#B52606;" d="M312.069,0C203.473,0,115.444,88.029,115.444,196.576c0,108.615,196.625,427.562,196.625,427.562 s196.625-318.947,196.625-427.562C508.693,88.029,420.684,0,312.069,0z M312.069,371.843 c-90.276,0-163.728-73.452-163.728-163.719c-0.01-90.286,73.452-163.719,163.728-163.719 c90.296,0,163.728,73.433,163.728,163.719C475.797,298.391,402.355,371.843,312.069,371.843z"></path>
        <path style="fill:#B52606;" d="M240.493,213.84l2.833-1.768h-40.341c2.364,4.318,9.458,14.694,20.468,10.747 C229.697,220.591,235.207,217.161,240.493,213.84z"></path>
        <path style="fill:#B52606;" d="M308.092,217.924c1.827-0.098,3.146,0.772,3.801,1.632c1.348-0.244,3.449-0.733,6.82-1.573 c7.767-2.042,11.07-4.162,13.629-5.901h-27.464l2.052,3.732L308.092,217.924z"></path>
        <path style="fill:#B52606;" d="M283.159,214.387c2.159,0.137,4.064-0.938,5.843-2.306h-10.884 C279.603,213.634,280.228,214.289,283.159,214.387z"></path>
        <rect x="192.931" y="186.473" style="fill:#B52606;" width="238.265" height="19.501"></rect>
        <path style="fill:#B52606;" d="M327.301,93.5c-2.863-0.205-19.501-0.332-22.413-0.332c-50.736,0-89.641,37.342-109.27,85.626 l231.191-0.664C408.833,130.998,375.379,97.174,327.301,93.5z"></path>
        <polygon style="fill:#B52606;" points="388.344,212.081 380.304,212.081 385.404,213.986 "></polygon>
        <path style="fill:#B52606;" d="M412.858,212.091l10.454,6.243l-3.41,7.005l-19.706-11.763l-14.03,9.145l-17.713-6.644h-23.878 c-4.406,0-5.657,0.86-8.236,2.599c-2.902,1.983-6.82,4.641-16.023,7.035c-9.839,2.589-12.535,2.921-14.362,0.313l-0.469-0.694 c-2.638-1.084-3.898-3.732-4.895-5.755c-0.733-1.475-1.563-3.166-2.902-4.856l-2.247,2.003 c-2.892,2.433-6.966,5.823-12.506,5.598c-5.676-0.195-7.845-2.472-9.76-4.475c-1.612-1.71-3.253-3.42-8.725-4.592 c-6.302-1.387-12.858,2.716-20.459,7.494c-5.364,3.38-11.412,7.171-18.378,9.653c-2.13,0.752-4.143,1.084-6.097,1.202h218.783 v-19.511H412.858L412.858,212.091z"></path>
        <polygon style="fill:#B52606;" points="218.598,231.68 219.555,231.621 217.845,231.621 "></polygon>
        <path style="fill:#B52606;" d="M196.527,240.248c0,0-4.504,26.223,7.191,26.223h217.308c9.565,0,7.171-26.223,7.171-26.223 H196.527z"></path>
        <path style="fill:#B52606;" d="M195.648,213.82l3.205-1.749H185.75v19.54h32.105 C206.483,231.113,198.569,220.542,195.648,213.82z"></path>
      </g>
    </g>
  </g>
</g>
</g>
</svg>



`)}`;

const selectedIcon = `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="iso-8859-1"?>
  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-62.41 -62.41 748.96 748.96" xml:space="preserve">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="124.8276">
<g>
  <g>
    <g>
      <g>
        <path style="fill:#B52606;" d="M312.069,0C203.473,0,115.444,88.029,115.444,196.576c0,108.615,196.625,427.562,196.625,427.562 s196.625-318.947,196.625-427.562C508.693,88.029,420.684,0,312.069,0z M312.069,371.843 c-90.276,0-163.728-73.452-163.728-163.719c-0.01-90.286,73.452-163.719,163.728-163.719 c90.296,0,163.728,73.433,163.728,163.719C475.797,298.391,402.355,371.843,312.069,371.843z"></path>
        <path style="fill:#B52606;" d="M240.493,213.84l2.833-1.768h-40.341c2.364,4.318,9.458,14.694,20.468,10.747 C229.697,220.591,235.207,217.161,240.493,213.84z"></path>
        <path style="fill:#B52606;" d="M308.092,217.924c1.827-0.098,3.146,0.772,3.801,1.632c1.348-0.244,3.449-0.733,6.82-1.573 c7.767-2.042,11.07-4.162,13.629-5.901h-27.464l2.052,3.732L308.092,217.924z"></path>
        <path style="fill:#B52606;" d="M283.159,214.387c2.159,0.137,4.064-0.938,5.843-2.306h-10.884 C279.603,213.634,280.228,214.289,283.159,214.387z"></path>
        <rect x="192.931" y="186.473" style="fill:#B52606;" width="238.265" height="19.501"></rect>
        <path style="fill:#B52606;" d="M327.301,93.5c-2.863-0.205-19.501-0.332-22.413-0.332c-50.736,0-89.641,37.342-109.27,85.626 l231.191-0.664C408.833,130.998,375.379,97.174,327.301,93.5z"></path>
        <polygon style="fill:#B52606;" points="388.344,212.081 380.304,212.081 385.404,213.986 "></polygon>
        <path style="fill:#B52606;" d="M412.858,212.091l10.454,6.243l-3.41,7.005l-19.706-11.763l-14.03,9.145l-17.713-6.644h-23.878 c-4.406,0-5.657,0.86-8.236,2.599c-2.902,1.983-6.82,4.641-16.023,7.035c-9.839,2.589-12.535,2.921-14.362,0.313l-0.469-0.694 c-2.638-1.084-3.898-3.732-4.895-5.755c-0.733-1.475-1.563-3.166-2.902-4.856l-2.247,2.003 c-2.892,2.433-6.966,5.823-12.506,5.598c-5.676-0.195-7.845-2.472-9.76-4.475c-1.612-1.71-3.253-3.42-8.725-4.592 c-6.302-1.387-12.858,2.716-20.459,7.494c-5.364,3.38-11.412,7.171-18.378,9.653c-2.13,0.752-4.143,1.084-6.097,1.202h218.783 v-19.511H412.858L412.858,212.091z"></path>
        <polygon style="fill:#B52606;" points="218.598,231.68 219.555,231.621 217.845,231.621 "></polygon>
        <path style="fill:#B52606;" d="M196.527,240.248c0,0-4.504,26.223,7.191,26.223h217.308c9.565,0,7.171-26.223,7.171-26.223 H196.527z"></path>
        <path style="fill:#B52606;" d="M195.648,213.82l3.205-1.749H185.75v19.54h32.105 C206.483,231.113,198.569,220.542,195.648,213.82z"></path>
      </g>
    </g>
  </g>
</g>
</g>
<g id="SVGRepo_iconCarrier">
<g>
  <g>
    <g>
      <g>
        <path style="fill:#B52606;" d="M312.069,0C203.473,0,115.444,88.029,115.444,196.576c0,108.615,196.625,427.562,196.625,427.562 s196.625-318.947,196.625-427.562C508.693,88.029,420.684,0,312.069,0z M312.069,371.843 c-90.276,0-163.728-73.452-163.728-163.719c-0.01-90.286,73.452-163.719,163.728-163.719 c90.296,0,163.728,73.433,163.728,163.719C475.797,298.391,402.355,371.843,312.069,371.843z"></path>
        <path style="fill:#B52606;" d="M240.493,213.84l2.833-1.768h-40.341c2.364,4.318,9.458,14.694,20.468,10.747 C229.697,220.591,235.207,217.161,240.493,213.84z"></path>
        <path style="fill:#B52606;" d="M308.092,217.924c1.827-0.098,3.146,0.772,3.801,1.632c1.348-0.244,3.449-0.733,6.82-1.573 c7.767-2.042,11.07-4.162,13.629-5.901h-27.464l2.052,3.732L308.092,217.924z"></path>
        <path style="fill:#B52606;" d="M283.159,214.387c2.159,0.137,4.064-0.938,5.843-2.306h-10.884 C279.603,213.634,280.228,214.289,283.159,214.387z"></path>
        <rect x="192.931" y="186.473" style="fill:#B52606;" width="238.265" height="19.501"></rect>
        <path style="fill:#B52606;" d="M327.301,93.5c-2.863-0.205-19.501-0.332-22.413-0.332c-50.736,0-89.641,37.342-109.27,85.626 l231.191-0.664C408.833,130.998,375.379,97.174,327.301,93.5z"></path>
        <polygon style="fill:#B52606;" points="388.344,212.081 380.304,212.081 385.404,213.986 "></polygon>
        <path style="fill:#B52606;" d="M412.858,212.091l10.454,6.243l-3.41,7.005l-19.706-11.763l-14.03,9.145l-17.713-6.644h-23.878 c-4.406,0-5.657,0.86-8.236,2.599c-2.902,1.983-6.82,4.641-16.023,7.035c-9.839,2.589-12.535,2.921-14.362,0.313l-0.469-0.694 c-2.638-1.084-3.898-3.732-4.895-5.755c-0.733-1.475-1.563-3.166-2.902-4.856l-2.247,2.003 c-2.892,2.433-6.966,5.823-12.506,5.598c-5.676-0.195-7.845-2.472-9.76-4.475c-1.612-1.71-3.253-3.42-8.725-4.592 c-6.302-1.387-12.858,2.716-20.459,7.494c-5.364,3.38-11.412,7.171-18.378,9.653c-2.13,0.752-4.143,1.084-6.097,1.202h218.783 v-19.511H412.858L412.858,212.091z"></path>
        <polygon style="fill:#B52606;" points="218.598,231.68 219.555,231.621 217.845,231.621 "></polygon>
        <path style="fill:#B52606;" d="M196.527,240.248c0,0-4.504,26.223,7.191,26.223h217.308c9.565,0,7.171-26.223,7.171-26.223 H196.527z"></path>
        <path style="fill:#B52606;" d="M195.648,213.82l3.205-1.749H185.75v19.54h32.105 C206.483,231.113,198.569,220.542,195.648,213.82z"></path>
      </g>
    </g>
  </g>
</g>
</g>
</svg>
`)}`;

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
        <FitBoundsToMarkersComponent />
        {markers.map((marker, idx) => (
          <Marker
            zIndexOffset={highlightedMarker === marker.id ? 1000 : 0}
            key={idx}
            position={marker.position}
            icon={
              new Icon({
                iconUrl:
                  highlightedMarker === marker.id
                    ? selectedIcon
                    : unselectedIcon,
                iconSize: highlightedMarker === marker.id ? [50, 50] : [25, 25],
                iconAnchor:
                  highlightedMarker === marker.id
                    ? [25 / 2, 50]
                    : defaultIcon.options.iconAnchor,
                popupAnchor:
                  highlightedMarker === marker.id
                    ? [0, -50]
                    : defaultIcon.options.popupAnchor,
              })
            }
          >
            {marker.title && (
              <Popup>
                <span className="text-lg font-bold">{marker.title}</span>
                <br />
                {marker.description}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
