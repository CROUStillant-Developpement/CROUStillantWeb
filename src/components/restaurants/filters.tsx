"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Region, Restaurant } from "@/services/types";
import { CreditCard, Locate, RotateCcw } from "lucide-react";
import { ComboBoxResponsive } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useRestaurantFilters } from "@/hooks/useRestaurantFilters";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface RestaurantsFiltersProps {
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
  setLoading: (loading: boolean) => void;
  loading: boolean;
  regions: Region[];
}

export default function RestaurantsFilters({
  restaurants,
  setFilteredRestaurants,
  setLoading,
  loading,
  regions,
}: RestaurantsFiltersProps) {
  const t = useTranslations("Filters");

  /**
   * Sort the regions alphabetically and add an "all regions" option at the beginning.
   * useMemo is used to avoid sorting the regions array on every render.
   *
   * @returns The sorted regions array with an "all regions" option at the beginning.
   */
  const sortedRegions = useMemo(() => {
    // Copy the regions array to avoid mutating the original prop
    const sorted = [...regions].sort((a, b) =>
      a.libelle.localeCompare(b.libelle)
    );
    // Add the "all regions" option to the beginning
    sorted.unshift({ code: -1, libelle: t("region.all") });
    return sorted;
  }, [regions, t]);

  const {
    filters,
    setFilters,
    geoLocError,
    handleLocationRequest,
    resetFilters,
  } = useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading);

  return (
    <div className="mt-4 w-full">
      <div className="flex gap-2 w-full flex-wrap lg:flex-nowrap">
        <Input
          placeholder={t("search")}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, search: e.target.value })
          }
          value={filters.search}
          disabled={loading}
        />
        <Button
          variant="outline"
          disabled={loading}
          onClick={handleLocationRequest}
        >
          <Locate className="mr-2 h-4 w-4" />
          {loading
            ? t("loading")
            : geoLocError
            ? geoLocError
            : t("geolocated.title")}
        </Button>
        <ComboBoxResponsive
          values={sortedRegions.map((region) => ({
            label: region.libelle,
            value: region.code.toString(),
          }))}
          selectedValue={filters.region.toString()}
          setSelectedValue={(value) =>
            setFilters({ ...filters, region: value ? parseInt(value) : -1 })
          }
          buttonTitle={t("region.title")}
          placeholder={t("region.placeholder")}
          loadingText={t("loading")}
          noResultsText={t("region.noResults")}
          loading={loading}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="w-14">
              <Button
                disabled={loading}
                variant={filters.card ? "default" : "outline"}
                size="icon"
                onClick={() => {
                  setFilters({ ...filters, card: !filters.card });
                }}
                className="lg:w-32"
              >
                <CreditCard size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={8} align="center">
              {t("creditCard")}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild className="w-14">
              <Button
                variant={filters.izly ? "default" : "outline"}
                size="icon"
                disabled={loading}
                onClick={() => {
                  setFilters({ ...filters, izly: !filters.izly });
                }}
                className="lg:w-32"
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
              {t("izly")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" disabled={loading} onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" /> {t("reset")}
        </Button>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap lg:flex-nowrap">
        <div className="flex items-center space-x-2">
          <Checkbox
            disabled={loading}
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
            {t("accessibility")}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            disabled={loading}
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
            {t("open")}
          </label>
        </div>
      </div>
    </div>
  );
}
