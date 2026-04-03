// components/Map.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { LatLngExpression, LatLngBounds, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'
import useMarkerStore from "@/store/markerStore";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Restaurant } from "@/services/types";
import { motion, AnimatePresence } from "@/lib/motion";
import { X, MapPin, Clock, CreditCard, Accessibility, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { cn, slugify } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

const markerSvg = (fill: string, iconFill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<?xml version="1.0" encoding="iso-8859-1"?>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="${fill}" fill-opacity="1"/>
      <path d="M11 26V16.85C10.15 16.6167 9.43767 16.15 8.863 15.45C8.28833 14.75 8.00067 13.9333 8 13V6H10V13H11V6H13V13H14V6H16V13C16 13.9333 15.7127 14.75 15.138 15.45C14.5633 16.15 13.8507 16.6167 13 16.85V26H11ZM21 26V18H18V11C18 9.61667 18.4877 8.43767 19.463 7.463C20.4383 6.48833 21.6173 6.00067 23 6V26H21Z" fill="${iconFill}"/>
    </svg>
  `)}`;

const defaultIcon = new Icon({
  iconUrl: markerSvg("white", "#B52606"),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const selectedIcon = new Icon({
  iconUrl: markerSvg("#B52606", "white"),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  loading?: boolean;
}

const FitBoundsToMarkers = () => {
  const { markers } = useMarkerStore();
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = new LatLngBounds(
      markers.map((marker) => {
        if (Array.isArray(marker.position)) {
          return marker.position as [number, number];
        }
        return [marker.position.lat, marker.position.lng] as [number, number];
      })
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, map]);

  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
  useMapEvents({ click: onMapClick });
  return null;
};

const RestaurantPanel = ({
  restaurant,
  onClose,
  isMobile,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  isMobile: boolean;
}) => {
  const t = useTranslations("RestaurantCard");
  const tInfo = useTranslations("RestaurantInformation");
  const restaurantUrl = `/restaurants/${slugify(restaurant.nom)}-r${restaurant.code}`;

  return (
    <motion.div
      initial={isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
      animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
      exit={isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className={cn(
        "absolute z-20 bg-background shadow-2xl border border-border flex flex-col overflow-y-auto",
        isMobile
          ? "inset-x-4 bottom-4 max-h-[55svh] rounded-2xl"
          : "top-4 right-4 bottom-4 w-80 lg:w-96 rounded-2xl"
      )}
    >
      {/* Hero image */}
      <div className="relative h-44 shrink-0 overflow-hidden rounded-t-2xl">
        <img
          src={restaurant.image_url || "/default_ru.png"}
          alt={restaurant.nom}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.currentTarget.src = "/default_ru.png"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X size={15} />
        </button>

        <div className="absolute bottom-3 left-3">
          <Badge
            className={cn(
              "text-xs font-semibold border-0",
              restaurant.ouvert
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full mr-1.5",
                restaurant.ouvert ? "bg-white animate-pulse" : "bg-white/60"
              )}
            />
            {restaurant.ouvert ? t("open") : t("closed")}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Name & zone */}
        <div>
          <h2 className="text-lg font-bold leading-snug">{restaurant.nom}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{restaurant.zone}</p>
        </div>

        {/* Address */}
        {restaurant.adresse && (
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{restaurant.adresse}</span>
          </div>
        )}

        {/* Hours */}
        {restaurant.horaires && restaurant.horaires.length > 0 && (
          <div className="flex items-start gap-2.5 text-sm">
            <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{restaurant.horaires.join(", ")}</span>
          </div>
        )}

        {/* Payment & accessibility icons */}
        {(restaurant.paiement?.length || restaurant.ispmr) && (
          <TooltipProvider>
            <div className="flex gap-2 flex-wrap">
              {restaurant.paiement?.includes("Carte bancaire") && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-xl border border-border/50 text-foreground/70 hover:text-primary transition-colors cursor-help">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} className="rounded-xl font-bold">
                    {t("creditCard")}
                  </TooltipContent>
                </Tooltip>
              )}
              {restaurant.paiement?.includes("IZLY") && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-xl border border-border/50 hover:opacity-80 transition-opacity cursor-help">
                      <img src="/icons/izly.png" alt="IZLY" className="w-4 h-4 object-contain" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} className="rounded-xl font-bold">
                    {t("izly")}
                  </TooltipContent>
                </Tooltip>
              )}
              {restaurant.ispmr && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="p-2 rounded-xl border border-border/50 text-blue-500 hover:text-blue-600 transition-colors cursor-help">
                      <Accessibility className="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} className="rounded-xl font-bold">
                    {t("accessibility")}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        )}

        {/* CTAs */}
        <div className="mt-auto pt-2 flex gap-2">
          <Button asChild className="flex-1 rounded-xl font-bold text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/20 transition-all">
            <Link href={restaurantUrl}>{t("cta")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-xl shrink-0"
            title={tInfo("openInGoogleMaps")}
          >
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const DEFAULT_CENTER: LatLngExpression = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;

const Map = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  loading = false,
}: MapProps) => {
  const { markers } = useMarkerStore();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedRestaurant(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="col-span-3 flex-1 relative p-4">
      {loading && (
        <div className="absolute top-0 left-0 inset-0 flex flex-col items-center justify-center rounded-2xl bg-transparent z-20 backdrop-blur-xs">
          <div className="rounded-full h-20 w-20 bg-primary animate-ping"></div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        className="flex-1 w-full h-80svh rounded-2xl z-10"
        minZoom={2}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsToMarkers />
        <MapClickHandler onMapClick={() => setSelectedRestaurant(null)} />
        <MarkerClusterGroup showCoverageOnHover={false}>
          {markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={marker.position}
              icon={selectedRestaurant?.code === marker.id ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => {
                  if (marker.restaurant) setSelectedRestaurant(marker.restaurant);
                },
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantPanel
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Map;
