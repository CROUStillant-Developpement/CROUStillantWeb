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
  Settings2,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Info,
} from "lucide-react";
import { ComboBoxResponsive } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useRestaurantFilters } from "@/hooks/useRestaurantFilters";
import { useTranslations } from "next-intl";
import { ReactNode, useMemo } from "react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Separator } from "@/components/ui/separator";
import ActiveFilterBadge from "./active-filter-badge";
import { useUmami } from "next-umami";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

interface RestaurantsFiltersProps {
  setFilteredRestaurants: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
  setLoading: (loading: boolean) => void;
  loading: boolean;
  regions: Region[];
  typesRestaurants: TypeRestaurant[];
  children?: ReactNode;
}

export default function RestaurantsFilters({
  restaurants,
  setFilteredRestaurants,
  setLoading,
  loading,
  regions,
  typesRestaurants,
  children,
}: RestaurantsFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isSmallScreen = useMediaQuery("(min-width: 550px)");
  const t = useTranslations("Filters");
  const umami = useUmami();


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
    activeFilterCount,
  } = useRestaurantFilters(restaurants, setFilteredRestaurants, setLoading);

  const renderFiltersContent = () => (
    <TooltipProvider delayDuration={0}>
      <Accordion type="multiple" defaultValue={["location"]} className="w-full border-none flex flex-col gap-3">
        {/* Location */}
        <div className={cn("bg-background/40 border border-border/40 rounded-2xl p-2 px-3 shadow-sm hover:border-primary/20 transition-colors", isCollapsed && "px-2")}>
          <AccordionItem value="location" className="border-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <AccordionTrigger
                  className={cn("hover:no-underline py-2", isCollapsed && "justify-center")}
                  hideArrow={isCollapsed}
                  onClick={(e) => {
                    if (isCollapsed) {
                      e.preventDefault();
                      setIsCollapsed(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Locate className="h-4 w-4 text-primary shrink-0" />
                    {!isCollapsed && <span className="font-semibold text-sm">{t("region.title")}</span>}
                  </div>
                </AccordionTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{t("region.title")}</TooltipContent>}
            </Tooltip>
            {!isCollapsed && (
              <AccordionContent className="pb-2">
                <div className="pt-2">
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
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </div>

        {/* Restaurant Type */}
        <div className={cn("bg-background/40 border border-border/40 rounded-2xl p-2 px-3 shadow-sm hover:border-primary/20 transition-colors", isCollapsed && "px-2")}>
          <AccordionItem value="type" className="border-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <AccordionTrigger
                  className={cn("hover:no-underline py-2", isCollapsed && "justify-center")}
                  hideArrow={isCollapsed}
                  onClick={(e) => {
                    if (isCollapsed) {
                      e.preventDefault();
                      setIsCollapsed(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary shrink-0" />
                    {!isCollapsed && <span className="font-semibold text-sm">{t("restaurantType.title")}</span>}
                  </div>
                </AccordionTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{t("restaurantType.title")}</TooltipContent>}
            </Tooltip>
            {!isCollapsed && (
              <AccordionContent className="pb-2">
                <div className="pt-2">
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
              </AccordionContent>
            )}
          </AccordionItem>
        </div>

        {/* Payment */}
        <div className={cn("bg-background/40 border border-border/40 rounded-2xl p-2 px-3 shadow-sm hover:border-primary/20 transition-colors", isCollapsed && "px-2")}>
          <AccordionItem value="payment" className="border-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <AccordionTrigger
                  className={cn("hover:no-underline py-2", isCollapsed && "justify-center")}
                  hideArrow={isCollapsed}
                  onClick={(e) => {
                    if (isCollapsed) {
                      e.preventDefault();
                      setIsCollapsed(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary shrink-0" />
                    {!isCollapsed && <span className="font-semibold text-sm">{t("payment.title")}</span>}
                  </div>
                </AccordionTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{t("payment.title")}</TooltipContent>}
            </Tooltip>
            {!isCollapsed && (
              <AccordionContent className="pb-2">
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      disabled={loading}
                      id="card"
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, card: checked === true })
                      }
                      checked={filters.card}
                    />
                    <label htmlFor="card" className="text-sm font-medium leading-none cursor-pointer flex items-center">
                      <CreditCard className="h-3 w-3 mr-2 text-muted-foreground" />
                      {t("payment.creditCard")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      disabled={loading}
                      id="izly"
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, izly: checked === true })
                      }
                      checked={filters.izly}
                    />
                    <label htmlFor="izly" className="text-sm font-medium leading-none cursor-pointer flex items-center">
                      <Image src="/icons/izly.png" alt="izly" width={16} height={16} className="h-3 w-3 mr-2" />
                      {t("payment.izly")}
                    </label>
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </div>

        {/* Status / Additionnal */}
        <div className={cn("bg-background/40 border border-border/40 rounded-2xl p-2 px-3 shadow-sm hover:border-primary/20 transition-colors", isCollapsed && "px-2")}>
          <AccordionItem value="additional" className="border-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <AccordionTrigger
                  className={cn("hover:no-underline py-2", isCollapsed && "justify-center")}
                  hideArrow={isCollapsed}
                  onClick={(e) => {
                    if (isCollapsed) {
                      e.preventDefault();
                      setIsCollapsed(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary shrink-0" />
                    {!isCollapsed && <span className="font-semibold text-sm">{t("additionnal.title")}</span>}
                  </div>
                </AccordionTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{t("additionnal.title")}</TooltipContent>}
            </Tooltip>
            {!isCollapsed && (
              <AccordionContent className="pb-2">
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      disabled={loading}
                      id="open"
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, isOpen: checked === true })
                      }
                      checked={filters.isOpen}
                    />
                    <label htmlFor="open" className="text-sm font-medium leading-none cursor-pointer flex items-center">
                      <CalendarCheck className="h-3 w-3 mr-2 text-muted-foreground" />
                      {t("additionnal.open")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      disabled={loading}
                      id="ispmr"
                      onCheckedChange={(checked) =>
                        setFilters({ ...filters, isPmr: checked === true })
                      }
                      checked={filters.isPmr}
                    />
                    <label htmlFor="ispmr" className="text-sm font-medium leading-none cursor-pointer flex items-center">
                      <Accessibility className="mr-2 h-3 w-3 text-muted-foreground" />
                      {t("additionnal.accessibility")}
                    </label>
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </div>

        {/* Sorting */}
        <div className={cn("bg-background/40 border border-border/40 rounded-2xl p-2 px-3 shadow-sm hover:border-primary/20 transition-colors", isCollapsed && "px-2")}>
          <AccordionItem value="sort" className="border-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <AccordionTrigger
                  className={cn("hover:no-underline py-2", isCollapsed && "justify-center")}
                  hideArrow={isCollapsed}
                  onClick={(e) => {
                    if (isCollapsed) {
                      e.preventDefault();
                      setIsCollapsed(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-primary shrink-0" />
                    {!isCollapsed && <span className="font-semibold text-sm">{t("restaurantName.title")} / {t("restaurantCity.title")}</span>}
                  </div>
                </AccordionTrigger>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{t("restaurantName.title")} / {t("restaurantCity.title")}</TooltipContent>}
            </Tooltip>
            {!isCollapsed && (
              <AccordionContent className="pb-2">
                <div className="flex flex-col gap-3 pt-2">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{t("restaurantName.title")}</p>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.restaurantNameAsc ? "default" : "outline"}
                        size="sm"
                        className="flex-1 h-8 text-xs rounded-lg"
                        onClick={() => setFilters({
                          ...filters,
                          restaurantNameAsc: !filters.restaurantNameAsc,
                          restaurantNameDesc: false,
                          restaurantCityAsc: false,
                          restaurantCityDesc: false
                        })}
                      >
                        <ArrowDownAZ className="h-3 w-3 mr-1" /> A-Z
                      </Button>
                      <Button
                        variant={filters.restaurantNameDesc ? "default" : "outline"}
                        size="sm"
                        className="flex-1 h-8 text-xs rounded-lg"
                        onClick={() => setFilters({
                          ...filters,
                          restaurantNameDesc: !filters.restaurantNameDesc,
                          restaurantNameAsc: false,
                          restaurantCityAsc: false,
                          restaurantCityDesc: false
                        })}
                      >
                        <ArrowUpAZ className="h-3 w-3 mr-1" /> Z-A
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{t("restaurantCity.title")}</p>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.restaurantCityAsc ? "default" : "outline"}
                        size="sm"
                        className="flex-1 h-8 text-xs rounded-lg"
                        onClick={() => setFilters({
                          ...filters,
                          restaurantCityAsc: !filters.restaurantCityAsc,
                          restaurantCityDesc: false,
                          restaurantNameAsc: false,
                          restaurantNameDesc: false
                        })}
                      >
                        <ArrowDownAZ className="h-3 w-3 mr-1" /> A-Z
                      </Button>
                      <Button
                        variant={filters.restaurantCityDesc ? "default" : "outline"}
                        size="sm"
                        className="flex-1 h-8 text-xs rounded-lg"
                        onClick={() => setFilters({
                          ...filters,
                          restaurantCityDesc: !filters.restaurantCityDesc,
                          restaurantCityAsc: false,
                          restaurantNameAsc: false,
                          restaurantNameDesc: false
                        })}
                      >
                        <ArrowUpAZ className="h-3 w-3 mr-1" /> Z-A
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </div>
      </Accordion>
    </TooltipProvider>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full lg:flex z-10 relative gap-6 items-start">
        <div className={cn(
          "hidden lg:flex shrink-0 bg-secondary/30 border border-border/50 shadow-sm p-4 rounded-2xl transition-all duration-300 ease-in-out flex-col lg:sticky lg:top-[10px] overflow-x-hidden",
          isCollapsed ? "w-16 items-center px-2" : "w-1/4"
        )}>
          <div className={cn("flex items-center justify-between mb-4 text-foreground w-full", isCollapsed && "flex-col gap-3")}>
            <div
              className={cn("flex items-center", isCollapsed && "justify-center cursor-pointer")}
              onClick={() => isCollapsed && setIsCollapsed(false)}
            >
              <Settings2 className={cn("h-5 w-5 text-primary", !isCollapsed && "mr-2")} />
              {!isCollapsed && <h2 className="font-bold text-lg">{t("title")}</h2>}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className={cn("mb-4 w-full", isCollapsed && "flex justify-center")}>
            {isCollapsed ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCollapsed(false)}
                      className="h-12 w-11 p-0 rounded-xl bg-background border border-border/50 shadow-sm flex items-center justify-center"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Search</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Input
                placeholder={t("search")}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                value={filters.search}
                className="w-full rounded-xl bg-background border-border/50 shadow-sm h-9 text-sm"
              />
            )}
          </div>

          <ScrollArea className={cn("flex-1 w-full mb-4", !isCollapsed && "pr-2 -mr-2")}>
            {renderFiltersContent()}
          </ScrollArea>

          <div className={cn(
            "pt-4 border-t border-border/50",
            isCollapsed ? "w-full flex justify-center" : "w-full"
          )}>
            <Button
              variant="outline"
              size="sm"
              disabled={activeFilterCount === 0}
              onClick={() => resetFilters()}
              className={cn(
                "h-9 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                isCollapsed
                  ? "w-9 p-0 border-none bg-background shadow-sm hover:bg-destructive/10 text-destructive disabled:opacity-30 flex-shrink-0"
                  : "w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-white disabled:bg-muted disabled:text-muted-foreground disabled:border-border"
              )}
            >
              <Trash2 className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && t("reset")}
            </Button>
          </div>
        </div>

        <div className={cn(
          "w-full flex flex-col gap-6 transition-all duration-300 ease-in-out min-h-screen",
          isCollapsed ? "lg:w-[calc(100%-4rem-1.5rem)]" : "lg:w-3/4"
        )}>
          <div className="sticky top-[10px] z-30 flex flex-col gap-3 w-full justify-between bg-background/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-primary/20 shadow-xl transition-all duration-300 ring-1 ring-primary/5">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex gap-3 w-full">
                <div className="bg-secondary/40 p-1 rounded-xl flex items-center shadow-inner border border-border/20 backdrop-blur-md w-full md:w-auto">
                  <Button
                    variant={display === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      if (display !== "list") toggleDisplay();
                      umami.event("Restaurants.ToggleDisplay", { display: "list" });
                    }}
                    className={cn(
                      "rounded-lg h-9 flex-1 md:flex-initial px-4 text-sm transition-all duration-300 font-bold",
                      display === "list"
                        ? "shadow-lg bg-background text-primary scale-105 hover:bg-background/80 ml-1 sm:ml-2 md:ml-1"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <AlignLeft className="mr-2 h-4 w-4 shrink-0" />
                    {isSmallScreen ? t("list") : ""}
                  </Button>
                  <Button
                    variant={display === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      if (display !== "map") toggleDisplay();
                      umami.event("Restaurants.ToggleDisplay", { display: "map" });
                    }}
                    className={cn(
                      "rounded-lg h-9 flex-1 md:flex-initial px-4 text-sm transition-all duration-300 font-bold",
                      display === "map"
                        ? "shadow-lg bg-background text-primary scale-105 hover:bg-background/80 mr-1 sm:ml-2 md:mr-1"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                  >
                    <Map className="mr-2 h-4 w-4 shrink-0" />
                    {isSmallScreen ? t("map") : ""}
                  </Button>
                </div>

                <div className="lg:hidden md:static md:flex items-center gap-3">
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        className="rounded-xl h-11 w-11 p-0 shadow-md border-primary/20 hover:border-primary/40 relative"
                        variant={activeFilterCount > 0 ? "default" : "outline"}
                      >
                        <Filter className="h-5 w-5" />
                        {activeFilterCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-extrabold ring-2 ring-background animate-in zoom-in">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0">
                      <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 pb-2 border-b">
                          <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2">
                              <Settings2 className="h-5 w-5 text-primary" />
                              {t("title")}
                            </SheetTitle>
                          </div>
                        </SheetHeader>
                        <ScrollArea className="flex-1 p-6">
                          <div className="mb-6">
                            <Input
                              placeholder={t("search")}
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFilters({ ...filters, search: e.target.value })
                              }
                              value={filters.search}
                              className="w-full rounded-xl bg-background border-border/50 shadow-sm"
                            />
                          </div>
                          {renderFiltersContent()}
                        </ScrollArea>
                        <SheetFooter className="p-6 border-t flex flex-row gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/10"
                            onClick={resetFilters}
                            disabled={activeFilterCount === 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("reset")}
                          </Button>
                          <SheetClose asChild>
                            <Button className="flex-1 rounded-xl" onClick={() => setSheetOpen(false)}>
                              {t("close")}
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <Button
                className={cn(
                  "rounded-xl h-11 px-6 text-sm font-bold transition-all border-none shadow-lg items-center gap-2 w-full md:w-auto",
                  "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/20"
                )}
                variant="default"
                disabled={loading}
                onClick={() => {
                  handleLocationRequest();
                  umami.event("Restaurants.Geolocate");
                }}
              >
                <Locate className={cn("h-5 w-5", loading && "animate-spin")} />
                {loading
                  ? t("loading")
                  : geoLocError
                    ? t("geolocated.error")
                    : t("geolocated.title")}
              </Button>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-primary/5 px-3 py-2 md:px-4 md:py-3 rounded-2xl border border-primary/10 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 w-full">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mr-1 opacity-70 shrink-0">{t("activeFilters")}</span>
                <div className="flex flex-wrap gap-2 items-center">
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
                    <ActiveFilterBadge
                      text={
                        t("region.title") +
                        ": " +
                        sortedRegions.find((r) => r.code === filters.crous)?.libelle
                      }
                      onRemove={() => setFilters({ ...filters, crous: -1 })}
                    />
                  )}
                  {filters.card && (
                    <ActiveFilterBadge
                      text={t("payment.creditCard")}
                      onRemove={() => setFilters({ ...filters, card: false })}
                    />
                  )}
                  {filters.izly && (
                    <ActiveFilterBadge
                      text={t("payment.izly")}
                      onRemove={() => setFilters({ ...filters, izly: false })}
                    />
                  )}
                  {filters.isPmr && (
                    <ActiveFilterBadge
                      text={t("additionnal.accessibility")}
                      onRemove={() => setFilters({ ...filters, isPmr: false })}
                    />
                  )}
                  {filters.isOpen && (
                    <ActiveFilterBadge
                      text={t("additionnal.open")}
                      onRemove={() => setFilters({ ...filters, isOpen: false })}
                    />
                  )}
                  {filters.restaurantNameAsc && (
                    <ActiveFilterBadge
                      text={`${t("restaurantName.title")} : ${t(
                        "restaurantName.sortAsc"
                      )}`}
                      onRemove={() =>
                        setFilters({ ...filters, restaurantNameAsc: false })
                      }
                    />
                  )}
                  {filters.restaurantNameDesc && (
                    <ActiveFilterBadge
                      text={`${t("restaurantName.title")} : ${t(
                        "restaurantName.sortDesc"
                      )}`}
                      onRemove={() =>
                        setFilters({ ...filters, restaurantNameDesc: false })
                      }
                    />
                  )}
                  {filters.restaurantCityAsc && (
                    <ActiveFilterBadge
                      text={`${t("restaurantCity.title")} : ${t(
                        "restaurantCity.sortAsc"
                      )}`}
                      onRemove={() =>
                        setFilters({ ...filters, restaurantCityAsc: false })
                      }
                    />
                  )}
                  {filters.restaurantCityDesc && (
                    <ActiveFilterBadge
                      text={`${t("restaurantCity.title")} : ${t(
                        "restaurantCity.sortDesc"
                      )}`}
                      onRemove={() =>
                        setFilters({ ...filters, restaurantCityDesc: false })
                      }
                    />
                  )}
                  {filters.restaurantType !== -1 && (
                    <ActiveFilterBadge
                      text={`${t("restaurantType.title")}: ${typesRestaurants.find(
                        (r) => r.code === filters.restaurantType
                      )?.libelle
                        }`}
                      onRemove={() =>
                        setFilters({ ...filters, restaurantType: -1 })
                      }
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => resetFilters()}
                    className="h-7 px-3 text-[10px] text-destructive hover:bg-destructive/10 hover:text-destructive uppercase font-black transition-all rounded-lg ml-auto md:ml-0"
                  >
                    {t("reset")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
