"use client";

import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";

interface RestaurantMiniMapProps {
  latitude: number;
  longitude: number;
}

export default function RestaurantMiniMap({ latitude, longitude }: RestaurantMiniMapProps) {
  return (
    <div className="w-full h-44 rounded-2xl overflow-hidden border border-border/30">
      <Map
        center={[longitude, latitude]}
        zoom={14}
        className="w-full h-full rounded-2xl"
        minZoom={2}
        scrollZoom={false}
      >
        <MapMarker longitude={longitude} latitude={latitude}>
          <MarkerContent />
        </MapMarker>
        <MapControls position="bottom-right" showZoom />
      </Map>
    </div>
  );
}
