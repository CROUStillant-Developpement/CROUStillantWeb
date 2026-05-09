"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

interface LeafletMiniMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

export default function LeafletMiniMap({
  latitude,
  longitude,
  zoom = 14,
  className,
}: LeafletMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!containerRef.current || mapRef.current) return;

      const icon = L.divIcon({
        html: `<div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="white"/>
            <path d="M11 26V16.85C10.15 16.6167 9.43767 16.15 8.863 15.45C8.28833 14.75 8.00067 13.9333 8 13V6H10V13H11V6H13V13H14V6H16V13C16 13.9333 15.7127 14.75 15.138 15.45C14.5633 16.15 13.8507 16.6167 13 16.85V26H11ZM21 26V18H18V11C18 9.61667 18.4877 8.43767 19.463 7.463C20.4383 6.48833 21.6173 6.00067 23 6V26H21Z" fill="#B52606"/>
          </svg>
        </div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const map = L.map(containerRef.current, {
        center: [latitude, longitude],
        zoom,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      markerRef.current = L.marker([latitude, longitude], { icon }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([latitude, longitude], zoom);
    markerRef.current?.setLatLng([latitude, longitude]);
  }, [latitude, longitude, zoom]);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
