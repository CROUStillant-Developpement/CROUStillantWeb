"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Region, Restaurant, TypeRestaurant } from "@/services/types";
import {
  Accessibility,
  AlignLeft,
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarCheck,
  CreditCard,
  Locate,
  Map,
  RotateCcw,
  Settings2,
  Trash2,
} from "lucide-react";
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
import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RestaurantsFiltersProps {
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
  setLoading: (loading: boolean) => void;
  loading: boolean;
  regions: Region[];
  typesRestaurants: TypeRestaurant[];
}

export default function RestaurantsFilters({
  restaurants,
  setFilteredRestaurants,
  setLoading,
  loading,
  regions,
  typesRestaurants,
}: RestaurantsFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const t = useTranslations("Filters");

  const { display, toggleDisplay } = useUserPreferences();

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

  const sortedTypesRestaurants = useMemo(() => {
    // Copy the typesRestaurants array to avoid mutating the original prop
    const sorted = [...typesRestaurants].sort((a, b) =>
      a.libelle.localeCompare(b.libelle)
    );

    // Add the "all types" option to the beginning
    sorted.unshift({ code: -1, libelle: t("restaurantType.all") });
    return sorted;
  }, [typesRestaurants, t]);

  const {
    filters,
    setFilters,
    geoLocError,
    handleLocationRequest,
    resetFilters,
  } = useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading);

  useEffect(() => {
    const activeFilters = Object.keys(filters).filter((key) => {
      if (key === "crous" && filters[key] === -1) return false;
      if (key === "restaurantType" && filters[key] === -1) return false;
      return (
        key === "search" ||
        key === "restaurantNameAsc" ||
        key === "restaurantNameDesc" ||
        key === "restaurantTypeAsc" ||
        key === "restaurantTypeDesc" ||
        key === "card" ||
        key === "izly" ||
        key === "isPmr" ||
        key === "isOpen"
      );
    });

    const count = activeFilters.reduce(
      (acc, key) => (filters[key as keyof typeof filters] ? acc + 1 : acc),
      0
    );

    setActiveFiltersCount(count);
  }, [filters]);

  return (
    <div className="mt-4 w-full">
      <div className="flex md:gap-4 gap-2 flex-wrap items-center">
        <Input
          placeholder={t("search")}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, search: e.target.value })
          }
          value={filters.search}
          className="max-w-md"
        />
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant={activeFiltersCount > 0 ? "default" : "outline"}>
              <Settings2 className="mr-2 h-4 w-4" />
              {t("title")}{" "}
              {activeFiltersCount > 0 && (
                <Badge className="bg-muted">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <SheetHeader>
                <SheetTitle>{t("title")}</SheetTitle>
                <SheetDescription>{t("description")}</SheetDescription>
              </SheetHeader>
              <div className="mt-8">
                <div className="flex flex-col gap-4 flex-wrap lg:flex-nowrap">
                  <h1 className="text-lg">{t("region.title")}</h1>
                  <ComboBoxResponsive
                    values={sortedRegions.map((region) => ({
                      label: region.libelle,
                      value: region.code.toString(),
                    }))}
                    selectedValue={filters.crous.toString()}
                    setSelectedValue={(value) =>
                      setFilters({
                        ...filters,
                        crous: value ? parseInt(value) : -1,
                      })
                    }
                    buttonTitle={t("region.title")}
                    placeholder={t("region.placeholder")}
                    loadingText={t("loading")}
                    noResultsText={t("region.noResults")}
                    loading={loading}
                  />
                  <Separator />
                  <div className="mb-4">
                    <h1 className="text-lg">{t("restaurantName.title")}</h1>
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        disabled={loading}
                        id="restaurantNameSortAsc"
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            restaurantNameAsc: checked === true,
                            restaurantNameDesc: false,
                            restaurantTypeAsc: false,
                            restaurantTypeDesc: false,
                          })
                        }
                        checked={filters.restaurantNameAsc}
                      />
                      <label
                        htmlFor="restaurantNameSortAsc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <ArrowDownAZ className="h-4 w-4 mr-2" />
                        {t("restaurantName.sortAsc")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        disabled={loading}
                        id="restaurantNameSortDesc"
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            restaurantNameDesc: checked === true,
                            restaurantNameAsc: false,
                            restaurantTypeAsc: false,
                            restaurantTypeDesc: false,
                          })
                        }
                        checked={filters.restaurantNameDesc}
                      />
                      <label
                        htmlFor="restaurantNameSortDesc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <ArrowUpAZ className="h-4 w-4 mr-2" />
                        {t("restaurantName.sortDesc")}
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div className="mb-4">
                    <h1 className="text-lg mb-2">
                      {t("restaurantType.title")}
                    </h1>
                    <ComboBoxResponsive
                      values={sortedTypesRestaurants.map((type) => ({
                        label: type.libelle,
                        value: type.code.toString(),
                      }))}
                      selectedValue={filters.restaurantType.toString()}
                      setSelectedValue={(value) =>
                        setFilters({
                          ...filters,
                          restaurantType: value ? parseInt(value) : -1,
                        })
                      }
                      buttonTitle={t("restaurantType.title")}
                      placeholder={t("restaurantType.placeholder")}
                      loadingText={t("loading")}
                      noResultsText={t("restaurantType.noResults")}
                      loading={loading}
                    />
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        disabled={loading}
                        id="restaurantTypeSortAsc"
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            restaurantTypeAsc: checked === true,
                            restaurantTypeDesc: false,
                            restaurantNameAsc: false,
                            restaurantNameDesc: false,
                          })
                        }
                        checked={filters.restaurantTypeAsc}
                      />
                      <label
                        htmlFor="restaurantTypeSortAsc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <ArrowDownAZ className="h-4 w-4 mr-2" />
                        {t("restaurantType.sortAsc")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        disabled={loading}
                        id="restaurantTypeSortDesc"
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            restaurantTypeDesc: checked === true,
                            restaurantTypeAsc: false,
                            restaurantNameAsc: false,
                            restaurantNameDesc: false,
                          })
                        }
                        checked={filters.restaurantTypeDesc}
                      />
                      <label
                        htmlFor="restaurantTypeSortDesc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <ArrowUpAZ className="h-4 w-4 mr-2" />
                        {t("restaurantType.sortDesc")}
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div className="mb-4">
                    <h1 className="text-lg">{t("payment.title")}</h1>
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        disabled={loading}
                        id="card"
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, card: checked === true })
                        }
                        checked={filters.card}
                      />
                      <label
                        htmlFor="card"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t("payment.creditCard")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        disabled={loading}
                        id="izly"
                        onCheckedChange={(checked) =>
                          setFilters({ ...filters, izly: checked === true })
                        }
                        checked={filters.izly}
                      />
                      <label
                        htmlFor="izly"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <Image
                          src="/icons/izly.png"
                          alt="heart"
                          width={20}
                          height={20}
                          className="h-4 w-4 mr-2"
                        />
                        {t("payment.izly")}
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h1 className="text-lg">{t("additionnal.title")}</h1>
                    <div className="flex items-center space-x-2 mt-4">
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <CalendarCheck className="h-4 w-4 mr-2" />
                        {t("additionnal.open")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <Accessibility className="mr-2 h-4 w-4" />
                        {t("additionnal.accessibility")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full mt-4" type="submit">
                    {t("close")}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </ScrollArea>
          </SheetContent>
        </Sheet>
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
        <Button variant="outline" disabled={loading} onClick={toggleDisplay}>
          {display == "list" ? (
            <>
              <Map className="mr-2 h-4 w-4" />
              Afficher la carte
            </>
          ) : (
            <>
              <AlignLeft className="mr-2 h-4 w-4" />
              Afficher la liste
            </>
          )}
        </Button>
        <Button variant="outline" disabled={loading} onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" /> {t("reset")}
        </Button>
      </div>
      {(filters.search.length > 0 ||
        filters.crous !== -1 ||
        filters.card ||
        filters.izly ||
        filters.isPmr ||
        filters.isOpen ||
        filters.restaurantNameAsc ||
        filters.restaurantNameDesc ||
        filters.restaurantTypeAsc ||
        filters.restaurantTypeDesc ||
        filters.restaurantType !== -1) && (
        <div className="mt-4">
          <ul className="flex gap-2 flex-wrap items-center">
            <li>{t("activeFilters")}</li>
            {filters.search && (
              <Badge className="cursor-pointer">
                {t.rich("searchTitle", {
                  italic: (chunks) => <span className="italic">{chunks}</span>,
                  query: filters.search,
                })}
              </Badge>
            )}
            {filters.crous !== -1 && (
              <li>
                <Badge
                  className="cursor-pointer transition-all ease-in-out duration-300"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("region.title")}:{" "}
                  {sortedRegions.find((r) => r.code === filters.crous)?.libelle}
                </Badge>
              </li>
            )}
            {filters.card && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("payment.creditCard")}
                </Badge>
              </li>
            )}
            {filters.izly && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("payment.izly")}
                </Badge>
              </li>
            )}
            {filters.isPmr && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("additionnal.accessibility")}
                </Badge>
              </li>
            )}
            {filters.isOpen && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("additionnal.open")}
                </Badge>
              </li>
            )}
            {filters.restaurantNameAsc && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("restaurantName.title")} : {t("restaurantName.sortAsc")}
                </Badge>
              </li>
            )}
            {filters.restaurantNameDesc && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("restaurantName.title")} : {t("restaurantName.sortDesc")}
                </Badge>
              </li>
            )}
            {filters.restaurantTypeAsc && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("restaurantType.title")} : {t("restaurantType.sortAsc")}
                </Badge>
              </li>
            )}
            {filters.restaurantTypeDesc && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("restaurantType.title")} : {t("restaurantType.sortDesc")}
                </Badge>
              </li>
            )}
            {filters.restaurantType !== -1 && (
              <li>
                <Badge
                  className="cursor-pointer"
                  onClick={() => setSheetOpen(true)}
                >
                  {t("restaurantType.title")}:{" "}
                  {
                    typesRestaurants.find(
                      (r) => r.code === filters.restaurantType
                    )?.libelle
                  }
                </Badge>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
