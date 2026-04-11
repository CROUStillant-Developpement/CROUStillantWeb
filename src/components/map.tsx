"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Map as MapGL,
  MapClusterLayer,
  MapControls,
  useMap,
} from "@/components/ui/map";
import useMarkerStore from "@/store/markerStore";
import { Restaurant } from "@/services/types";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  Accessibility,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/i18n/routing";
import { cn, slugify } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

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
          : "top-4 right-4 bottom-4 w-80 lg:w-96 rounded-2xl max-h-[80svh]",
      )}
    >
      {/* Hero image */}
      <div className="relative h-44 shrink-0 overflow-hidden rounded-t-2xl">
        <Image
          src={restaurant.image_url || "/default_ru.png"}
          alt={restaurant.nom}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-cover transition-transform duration-500 hover:scale-105"
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
              "text-xs font-semibold border-0 hover",
              restaurant.ouvert
                ? "bg-green-500/90 text-white hover:bg-green-700"
                : "bg-red-500/90 text-white hover:bg-red-700",
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full mr-1.5",
                restaurant.ouvert ? "bg-white animate-pulse" : "bg-white/60",
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
          <p className="text-sm text-muted-foreground mt-0.5">
            {restaurant.zone}
          </p>
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
            <span className="text-muted-foreground">
              {restaurant.horaires.join(", ")}
            </span>
          </div>
        )}

        {/* Payment & accessibility icons */}
        {(restaurant.paiement?.length || restaurant.ispmr) && (
          <TooltipProvider>
            <div className="flex gap-2 flex-wrap">
              {restaurant.paiement?.includes("Carte bancaire") && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded-xl border border-border/50 text-foreground/70 hover:text-primary transition-colors cursor-help"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={8}
                    className="rounded-xl font-bold"
                  >
                    {t("creditCard")}
                  </TooltipContent>
                </Tooltip>
              )}
              {restaurant.paiement?.includes("IZLY") && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded-xl border border-border/50 hover:opacity-80 transition-opacity cursor-help"
                    >
                      <Image
                        src="/icons/izly.png"
                        alt="IZLY"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={8}
                    className="rounded-xl font-bold"
                  >
                    {t("izly")}
                  </TooltipContent>
                </Tooltip>
              )}
              {restaurant.ispmr && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="p-2 rounded-xl border border-border/50 text-blue-500 hover:text-blue-600 transition-colors cursor-help"
                    >
                      <Accessibility className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={8}
                    className="rounded-xl font-bold"
                  >
                    {t("accessibility")}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        )}

        {/* CTAs */}
        <div className="mt-auto pt-2 flex gap-2">
          <Button
            asChild
            className="flex-1 rounded-xl font-bold text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/20 transition-all"
          >
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

const GroupPickerPanel = ({
  restaurants,
  onSelect,
  onClose,
  isMobile,
}: {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  onClose: () => void;
  isMobile: boolean;
}) => {
  const t = useTranslations("RestaurantCard");

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
          : "top-4 right-4 bottom-4 w-80 lg:w-96 rounded-2xl max-h-[80svh]",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-base font-bold">
          {restaurants.length} restaurants
        </h2>
        <button
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          onClick={onClose}
          aria-label="Close panel"
        >
          <X size={15} />
        </button>
      </div>
      <div className="flex flex-col divide-y divide-border overflow-y-auto">
        {restaurants.map((r) => (
          <button
            key={r.code}
            onClick={() => onSelect(r)}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
              <Image
                src={r.image_url || "/default_ru.png"}
                alt={r.nom}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{r.nom}</p>
              <p className="text-xs text-muted-foreground truncate">{r.zone}</p>
            </div>
            <Badge
              className={cn(
                "text-xs font-semibold border-0 shrink-0",
                r.ouvert
                  ? "bg-green-500/90 text-white hover:bg-green-700"
                  : "bg-red-500/90 text-white hover:bg-red-700",
              )}
            >
              {r.ouvert ? t("open") : t("closed")}
            </Badge>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Each GeoJSON point holds all restaurants within 100 m as a JSON array.
// restaurant_count drives the cluster label via clusterProperties aggregation.
type SerializedMarker = { _rs: string; restaurant_count: number };

const PROXIMITY_M = 100;

/** Haversine distance in metres between two [lat, lng] points. */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// [lng, lat] for MapLibre (France center)
const DEFAULT_CENTER: [number, number] = [1.888334, 46.603354];
const DEFAULT_ZOOM = 4;

interface MapProps {
  center?: [number, number];
  zoom?: number;
  loading?: boolean;
}

const FitBoundsToMarkers = () => {
  const { markers } = useMarkerStore();
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || markers.length === 0) return;

    // positions stored as [lat, lng] — extract lng/lat for MapLibre bounds
    const lngs = markers.map((m) => m.position[1]);
    const lats = markers.map((m) => m.position[0]);

    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 50 },
    );
  }, [markers, map, isLoaded]);

  return null;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
  const { map } = useMap();
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  useEffect(() => {
    if (!map) return;
    const handler = () => onMapClickRef.current();
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map]);

  return null;
};

const MapComponent = ({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  loading = false,
}: MapProps) => {
  const { markers } = useMarkerStore();
  // A group holds all restaurants at a shared coordinate.
  // If length === 1 the panel shows directly; if > 1 a picker is shown first.
  const [selectedGroup, setSelectedGroup] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pointJustClicked = useRef(false);

  // Group restaurants within PROXIMITY_M of each other into one GeoJSON point.
  // The point is placed at the centroid of the group.
  // MapLibre GL flattens feature properties — serialize the array as JSON.
  // markers store position as [lat, lng]; GeoJSON needs [lng, lat]
  const geoJsonData = useMemo((): GeoJSON.FeatureCollection<
    GeoJSON.Point,
    SerializedMarker
  > => {
    type Group = {
      lats: number[];
      lngs: number[];
      restaurants: Restaurant[];
      cellKeys: Set<string>;
    };

    const groups: Group[] = [];
    const grid = new Map<string, Group[]>();
    const metersPerDegreeLat = 111_320;
    const cellSizeLat = PROXIMITY_M / metersPerDegreeLat;

    const getLngCellSize = (lat: number) => {
      const metersPerDegreeLng =
        metersPerDegreeLat * Math.max(Math.cos((lat * Math.PI) / 180), 0.000001);
      return PROXIMITY_M / metersPerDegreeLng;
    };

    const getCellCoords = (lat: number, lng: number) => {
      const lngCellSize = getLngCellSize(lat);
      return {
        cellLat: Math.floor(lat / cellSizeLat),
        cellLng: Math.floor(lng / lngCellSize),
      };
    };

    const getNeighborKeys = (lat: number, lng: number) => {
      const { cellLat, cellLng } = getCellCoords(lat, lng);
      const keys: string[] = [];
      for (let latOffset = -1; latOffset <= 1; latOffset++) {
        for (let lngOffset = -1; lngOffset <= 1; lngOffset++) {
          keys.push(`${cellLat + latOffset}:${cellLng + lngOffset}`);
        }
      }
      return keys;
    };

    const addGroupToCell = (group: Group, lat: number, lng: number) => {
      const { cellLat, cellLng } = getCellCoords(lat, lng);
      const key = `${cellLat}:${cellLng}`;

      if (group.cellKeys.has(key)) return;

      group.cellKeys.add(key);
      const existing = grid.get(key);
      if (existing) {
        existing.push(group);
      } else {
        grid.set(key, [group]);
      }
    };

    for (const marker of markers) {
      const [lat, lng] = marker.position;
      const candidateGroups = new Set<Group>();

      for (const key of getNeighborKeys(lat, lng)) {
        const cellGroups = grid.get(key);
        if (!cellGroups) continue;
        for (const group of cellGroups) {
          candidateGroups.add(group);
        }
      }

      let match: Group | undefined;
      for (const group of candidateGroups) {
        if (
          group.lats.some(
            (gLat, i) => haversineDistance(lat, lng, gLat, group.lngs[i]) <= PROXIMITY_M
          )
        ) {
          match = group;
          break;
        }
      }

      if (match) {
        match.lats.push(lat);
        match.lngs.push(lng);
        if (marker.restaurant) match.restaurants.push(marker.restaurant);
        addGroupToCell(match, lat, lng);
      } else {
        const group: Group = {
          lats: [lat],
          lngs: [lng],
          restaurants: marker.restaurant ? [marker.restaurant] : [],
          cellKeys: new Set<string>(),
        };
        groups.push(group);
        addGroupToCell(group, lat, lng);
      }
    }

    return {
      type: "FeatureCollection",
      features: groups.map(({ lats, lngs, restaurants }) => {
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [centerLng, centerLat] },
          properties: { _rs: JSON.stringify(restaurants), restaurant_count: restaurants.length },
        };
      }),
    };
  }, [markers]);

  const handlePointClick = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Point, SerializedMarker>) => {
      pointJustClicked.current = true;
      const restaurants = JSON.parse(feature.properties._rs) as Restaurant[];
      if (restaurants.length === 1) {
        setSelectedRestaurant(restaurants[0]);
        setSelectedGroup([]);
      } else {
        setSelectedGroup(restaurants);
        setSelectedRestaurant(null);
      }
    },
    [],
  );

  const handleMapClick = useCallback(() => {
    if (pointJustClicked.current) {
      pointJustClicked.current = false;
      return;
    }
    setSelectedRestaurant(null);
    setSelectedGroup([]);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRestaurant(null);
        setSelectedGroup([]);
      }
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

      <div className="w-full h-[80svh] rounded-2xl overflow-hidden relative z-10">
        <MapGL center={center} zoom={zoom} className="rounded-2xl" minZoom={2} projection={{ type: "globe" }}>
          <FitBoundsToMarkers />
          <MapClickHandler onMapClick={handleMapClick} />
          <MapClusterLayer<SerializedMarker>
            data={geoJsonData}
            clusterColors={["#B52606", "#8a1d04", "#5c1202"]}
            clusterThresholds={[10, 50]}
            pointColor="#B52606"
            onPointClick={handlePointClick}
            clusterProperties={{ restaurant_count: ["+", ["get", "restaurant_count"]] }}
            countField="restaurant_count"
          />
          <MapControls
            position="bottom-right"
            showZoom
            showCompass
            showLocate
            showFullscreen
          />
        </MapGL>
      </div>

      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantPanel
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
            isMobile={isMobile}
          />
        )}
        {selectedGroup.length > 1 && !selectedRestaurant && (
          <GroupPickerPanel
            restaurants={selectedGroup}
            onSelect={(r) => {
              setSelectedRestaurant(r);
              setSelectedGroup([]);
            }}
            onClose={() => setSelectedGroup([])}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapComponent;
