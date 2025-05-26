"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Region, TypeRestaurant } from "@/services/types";
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
} from "lucide-react";
import { ComboBoxResponsive } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveFilterBadge from "./active-filter-badge";
import { Filters } from "@/lib/filters";

interface RestaurantsFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  geoLocError: string | null;
  handleLocationRequest: () => Promise<void>;
  resetFilters: () => void;
  activeFilterCount: number;
  loading: boolean;
  regions: Region[];
  typesRestaurants: TypeRestaurant[];
}

export default function RestaurantsFilters({
  filters,
  setFilters,
  geoLocError,
  handleLocationRequest,
  resetFilters,
  activeFilterCount,
  loading,
  regions,
  typesRestaurants,
}: RestaurantsFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

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
            <Button variant={activeFilterCount > 0 ? "default" : "outline"}>
              <Settings2 className="mr-2 h-4 w-4" />
              {t("title")}{" "}
              {activeFilterCount > 0 && (
                <span className="bg-black rounded-full py-1 px-3">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ScrollArea className="h-full pr-4 mt-4 mb-4 pb-4">
              <SheetHeader>
                <SheetTitle>{t("title")}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <div className="flex flex-col gap-4 flex-wrap lg:flex-nowrap">
                  <h1 className="text-lg">{t("region.title")}</h1>
                  <ComboBoxResponsive
                    values={sortedRegions.map((region) => ({
                      label: region.libelle,
                      value: region.code.toString(),
                      key: region.code.toString(),
                    }))}
                    selectedValue={filters.crous.toString()}
                    setSelectedValue={(value) =>
                      setFilters({
                        ...filters,
                        crous: value ? Number.parseInt(value) : -1,
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
                            restaurantCityAsc: false,
                            restaurantCityDesc: false,
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
                            restaurantCityAsc: false,
                            restaurantCityDesc: false,
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
                    <h1 className="text-lg">{t("restaurantCity.title")}</h1>
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        disabled={loading}
                        id="restaurantCitySortAsc"
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            restaurantCityAsc: checked === true,
                            restaurantCityDesc: false,
                            restaurantNameAsc: false,
                            restaurantNameDesc: false,
                          })
                        }
                        checked={filters.restaurantCityAsc}
                      />
                      <label
                        htmlFor="restaurantCitySortAsc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <ArrowDownAZ className="h-4 w-4 mr-2" />
                        {t("restaurantCity.sortAsc")}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        disabled={loading}
                        id="restaurantCitySortDesc"
                        onCheckedChange={(checked) =>
                          setFilters({
                            ...filters,
                            restaurantCityDesc: checked === true,
                            restaurantCityAsc: false,
                            restaurantNameAsc: false,
                            restaurantNameDesc: false,
                          })
                        }
                        checked={filters.restaurantCityDesc}
                      />
                      <label
                        htmlFor="restaurantCitySortDesc"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                      >
                        <ArrowUpAZ className="h-4 w-4 mr-2" />
                        {t("restaurantCity.sortDesc")}
                      </label>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h1 className="text-lg mb-2">
                      {t("restaurantType.title")}
                    </h1>
                    <ComboBoxResponsive
                      values={sortedTypesRestaurants.map((type) => ({
                        label: type.libelle,
                        value: type.code.toString(),
                        key: type.code.toString(),
                      }))}
                      selectedValue={filters.restaurantType.toString()}
                      setSelectedValue={(value) =>
                        setFilters({
                          ...filters,
                          restaurantType: value ? Number.parseInt(value) : -1,
                        })
                      }
                      buttonTitle={t("restaurantType.title")}
                      placeholder={t("restaurantType.placeholder")}
                      loadingText={t("loading")}
                      noResultsText={t("restaurantType.noResults")}
                      loading={loading}
                    />
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
            ? t("geolocated.error")
            : t("geolocated.title")}
        </Button>
        {filters.crous === -1 && (
          <Button variant="outline" disabled={loading} onClick={toggleDisplay}>
            {display == "list" ? (
              <>
                <Map className="mr-2 h-4 w-4" />
                {t("map")}
              </>
            ) : (
              <>
                <AlignLeft className="mr-2 h-4 w-4" />
                {t("list")}
              </>
            )}
          </Button>
        )}
        <Button variant="outline" disabled={loading} onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" /> {t("reset")}
        </Button>
      </div>
      {activeFilterCount > 0 && (
        <div className="mt-4">
          <ul className="flex gap-2 flex-wrap items-center">
            <li>{t("activeFilters")}</li>
            {filters.search && (
              <ActiveFilterBadge
                text={t.rich("searchTitle", {
                  italic: (chunks) => <span className="italic">{chunks}</span>,
                  query: filters.search,
                })}
                onRemove={() => setFilters({ ...filters, search: "" })}
              />
            )}
            {filters.crous !== -1 && (
              <li>
                <ActiveFilterBadge
                  setSheetOpen={setSheetOpen}
                  text={
                    t("region.title") +
                    ": " +
                    sortedRegions.find((r) => r.code === filters.crous)?.libelle
                  }
                  onRemove={() => setFilters({ ...filters, crous: -1 })}
                />
              </li>
            )}
            {filters.card && (
              <li>
                <ActiveFilterBadge
                  text={t("payment.creditCard")}
                  setSheetOpen={setSheetOpen}
                  onRemove={() => setFilters({ ...filters, card: false })}
                />
              </li>
            )}
            {filters.izly && (
              <li>
                <ActiveFilterBadge
                  text={t("payment.izly")}
                  setSheetOpen={setSheetOpen}
                  onRemove={() => setFilters({ ...filters, izly: false })}
                />
              </li>
            )}
            {filters.isPmr && (
              <li>
                <ActiveFilterBadge
                  text={t("additionnal.accessibility")}
                  setSheetOpen={setSheetOpen}
                  onRemove={() => setFilters({ ...filters, isPmr: false })}
                />
              </li>
            )}
            {filters.isOpen && (
              <li>
                <ActiveFilterBadge
                  text={t("additionnal.open")}
                  setSheetOpen={setSheetOpen}
                  onRemove={() => setFilters({ ...filters, isOpen: false })}
                />
              </li>
            )}
            {filters.restaurantNameAsc && (
              <li>
                <ActiveFilterBadge
                  text={`${t("restaurantName.title")} : ${t(
                    "restaurantName.sortAsc"
                  )}`}
                  setSheetOpen={setSheetOpen}
                  onRemove={() =>
                    setFilters({ ...filters, restaurantNameAsc: false })
                  }
                />
              </li>
            )}
            {filters.restaurantNameDesc && (
              <li>
                <ActiveFilterBadge
                  text={`${t("restaurantName.title")} : ${t(
                    "restaurantName.sortDesc"
                  )}`}
                  setSheetOpen={setSheetOpen}
                  onRemove={() =>
                    setFilters({ ...filters, restaurantNameDesc: false })
                  }
                />
              </li>
            )}
            {filters.restaurantCityAsc && (
              <li>
                <ActiveFilterBadge
                  text={`${t("restaurantCity.title")} : ${t(
                    "restaurantCity.sortAsc"
                  )}`}
                  setSheetOpen={setSheetOpen}
                  onRemove={() =>
                    setFilters({ ...filters, restaurantCityAsc: false })
                  }
                />
              </li>
            )}
            {filters.restaurantCityDesc && (
              <li>
                <ActiveFilterBadge
                  text={`${t("restaurantCity.title")} : ${t(
                    "restaurantCity.sortDesc"
                  )}`}
                  setSheetOpen={setSheetOpen}
                  onRemove={() =>
                    setFilters({ ...filters, restaurantCityDesc: false })
                  }
                />
              </li>
            )}
            {filters.restaurantType !== -1 && (
              <li>
                <ActiveFilterBadge
                  text={`${t("restaurantType.title")}: ${
                    typesRestaurants.find(
                      (r) => r.code === filters.restaurantType
                    )?.libelle
                  }`}
                  setSheetOpen={setSheetOpen}
                  onRemove={() =>
                    setFilters({ ...filters, restaurantType: -1 })
                  }
                />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
