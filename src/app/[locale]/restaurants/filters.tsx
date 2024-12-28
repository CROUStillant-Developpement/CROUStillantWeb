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
import { useRestaurantFilters } from "@/hooks/useRestaurantFilters";

interface RestaurantsFiltersProps {
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
}

export default function RestaurantsFilters({
  restaurants,
  setFilteredRestaurants,
}: RestaurantsFiltersProps) {
  const {
    filters,
    setFilters,
    regions,
    loading,
    geoLocError,
    handleLocationRequest,
    resetFilters,
  } = useRestaurantFilters(restaurants, setFilteredRestaurants);

  return (
    <div className="mt-4 w-full">
      <div className="flex gap-2 w-full flex-wrap lg:flex-nowrap">
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
        <Button variant="outline" onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
        </Button>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap lg:flex-nowrap">
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
