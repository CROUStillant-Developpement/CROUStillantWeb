"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findRestaurantsAroundPosition, getGeoLocation } from "@/lib/utils";
import { Region, Restaurant } from "@/services/types";
import { CreditCard, Filter, Locate, RotateCcw } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ComboBoxResponsive } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { getRegions } from "@/services/region-service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useDebounceCallback } from "usehooks-ts";

interface RestaurantsFiltersProps {
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
}

interface Filters {
  search: string;
  isPmr: boolean;
  isOpen: boolean;
  region: number;
  izly: boolean;
  card: boolean;
}

export default function RestaurantsFilters({
  setFilteredRestaurants,
  restaurants,
}: RestaurantsFiltersProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLocError, setGeoLocError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    isPmr: false,
    isOpen: false,
    region: -1,
    izly: false,
    card: false,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initializeFilters = useCallback(() => {
    const tempFilters: Filters = {
      search: searchParams.get("search") || "",
      isPmr: searchParams.get("ispmr") === "true",
      isOpen: searchParams.get("open") === "true",
      region: parseInt(searchParams.get("region") || "-1", 10),
      izly: searchParams.get("izly") === "true",
      card: searchParams.get("card") === "true",
    };
    setFilters(tempFilters);
  }, [searchParams]);

  const handleLocationRequest = useCallback(async () => {
    setLoading(true);
    try {
      const position = await getGeoLocation();
      if (position) {
        const nearbyRestaurants = findRestaurantsAroundPosition(
          restaurants,
          position,
          10
        );
        if (nearbyRestaurants.length > 0) {
          setFilteredRestaurants(nearbyRestaurants);
        }
      }
    } catch (error: any) {
      setGeoLocError(error.message);
    } finally {
      setLoading(false);
    }
  }, [restaurants, setFilteredRestaurants]);

  useEffect(() => {
    // Update the query string instantly when filters change
    const queryString = new URLSearchParams();
    if (filters.search) queryString.set("search", filters.search);
    if (filters.isPmr) queryString.set("ispmr", "true");
    if (filters.isOpen) queryString.set("open", "true");
    if (filters.region !== -1)
      queryString.set("region", filters.region.toString());
    if (filters.izly) queryString.set("izly", "true");
    if (filters.card) queryString.set("card", "true");

    router.push(`${pathname}?${queryString.toString()}`);
  }, [filters, router, pathname]);

  const resetSearch = useCallback(() => {
    setFilteredRestaurants(restaurants);
    setFilters({
      search: "",
      isPmr: false,
      isOpen: false,
      region: -1,
      izly: false,
      card: false,
    });
  }, [restaurants, setFilteredRestaurants]);

  const filterRestaurants = useCallback(() => {
    const filtered = restaurants.filter((restaurant) => {
      const matchesSearch =
        !filters.search ||
        restaurant.nom?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPmr = !filters.isPmr || restaurant.ispmr;
      const matchesOpen = !filters.isOpen || restaurant.ouvert;
      const matchesRegion =
        filters.region === -1 || restaurant.region.code === filters.region;
      const matchesIzly =
        !filters.izly || restaurant.paiement?.includes("IZLY");
      const matchesCard =
        !filters.card || restaurant.paiement?.includes("Carte bancaire");

      return (
        matchesSearch &&
        matchesPmr &&
        matchesOpen &&
        matchesRegion &&
        matchesIzly &&
        matchesCard
      );
    });

    setFilteredRestaurants(filtered);
  }, [filters, restaurants, setFilteredRestaurants, router, pathname]);

  const debouncedFilterRestaurants = useCallback(
    useDebounceCallback(filterRestaurants, 300),
    [filterRestaurants]
  );

  useEffect(() => {
    setLoading(true);
    initializeFilters();

    getRegions()
      .then((result) => {
        if (result.success) {
          const fetchedRegions = result.data;
          fetchedRegions.unshift({ code: -1, libelle: "Toutes les régions" });
          setRegions(fetchedRegions);
        } else {
          console.error(result.error);
        }
      })
      .finally(() => setLoading(false));
  }, [initializeFilters]);

  useEffect(() => {
    debouncedFilterRestaurants();
    return () => debouncedFilterRestaurants.cancel();
  }, [filters, debouncedFilterRestaurants]);

  return (
    <div className="mt-4 w-full">
      <div className="flex gap-2 w-full">
        <Input
          placeholder="Rechercher un restaurant"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, search: e.target.value })
          }
          value={filters.search}
        />
        <Button
          variant="outline"
          disabled={loading}
          onClick={handleLocationRequest}
        >
          <Locate className="mr-2 h-4 w-4" />
          {loading
            ? "Recherche en cours"
            : geoLocError
            ? geoLocError
            : "Autour de moi"}
        </Button>
        <ComboBoxResponsive
          values={regions.map((region) => ({
            label: region.libelle,
            value: region.code.toString(),
          }))}
          selectedValue={filters.region.toString()}
          setSelectedValue={(value) =>
            setFilters({ ...filters, region: value ? parseInt(value) : -1 })
          }
          buttonTitle="Crous"
          loading={loading}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="w-14">
              <Button
                variant={filters.card ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  setFilters({ ...filters, card: !filters.card });
                }}
              >
                <CreditCard size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8} align="center">
              Paiement par carte bancaire
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild className="w-14">
              <Button
                variant={filters.izly ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  setFilters({ ...filters, izly: !filters.izly });
                }}
              >
                <Image
                  src="/icons/izly.png"
                  alt="heart"
                  width={20}
                  height={20}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8} align="center">
              Paiement par Izly
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" onClick={resetSearch}>
          <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
        </Button>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ispmr"
            onCheckedChange={(checked) =>
              setFilters({ ...filters, isPmr: checked === true })
            }
            checked={filters.isPmr}
          />
          <label
            htmlFor="ispmr"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accessible aux personnes à mobilité réduite
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="open"
            onCheckedChange={(checked) =>
              setFilters({ ...filters, isOpen: checked === true })
            }
            checked={filters.isOpen}
          />
          <label
            htmlFor="open"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ouvert maintenant
          </label>
        </div>
      </div>
    </div>
  );
}
