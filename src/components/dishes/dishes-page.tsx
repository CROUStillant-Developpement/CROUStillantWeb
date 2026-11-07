"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plat, TypePlat } from "@/services/types";
import { useMemo, useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useFormatter, useTranslations } from "next-intl";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { getDishType } from "@/lib/dish-tags";
import { Search, Trophy, History } from "lucide-react";
import DishTags from "@/components/restaurants/slug/dish-tags";
import FollowedDishesWeek from "./followed-dishes-week";

interface DishesPageProps {
  top100Dishes: Plat[];
  last100Dishes: Plat[];
}

// Order of the type filters (AUTRE is never offered: it means "unknown")
const TYPE_ORDER: TypePlat[] = ["ENTREE", "PLAT", "ACCOMPAGNEMENT", "DESSERT", "FROMAGE", "BOISSON", "FORMULE"];

const CHIP_CLASS =
  "rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";

export default function DishesPage({ top100Dishes, last100Dishes }: DishesPageProps) {
  const t = useTranslations("DishesPage");

  return (
    <div className="space-y-8">
      <FollowedDishesWeek />

      <div className="flex flex-wrap gap-3 justify-center md:hidden">
        <Button asChild variant="secondary" className="rounded-full shadow-xs border-primary/10">
          <Link href="#top100">{t("top100")}</Link>
        </Button>
        <Button asChild variant="secondary" className="rounded-full shadow-xs border-primary/10">
          <Link href="#last100">{t("last100")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col gap-10"
        >
          <DishesTable
            id="top100"
            icon={Trophy}
            title={t("top100")}
            description={t("top100Description")}
            dishes={top100Dishes}
            column="occurrences"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col gap-10"
        >
          <DishesTable
            id="last100"
            icon={History}
            title={t("last100")}
            description={t("last100Description")}
            dishes={last100Dishes}
            column="code"
          />
        </motion.div>
      </div>
    </div>
  );
}

type DishesTableProps = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  dishes: Plat[];
  /** Second column: number of occurrences (top 100) or dish code (last 100). */
  column: "occurrences" | "code";
};

/**
 * A ranked list of dishes with a text search and a filter by dish type. The
 * ranking stays the position in the full list, whatever the filters.
 */
export function DishesTable({ id, icon: Icon, title, description, dishes, column }: DishesTableProps) {
  const t = useTranslations("DishesPage");
  const tTags = useTranslations("DishTags");
  const format = useFormatter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<TypePlat | null>(null);

  // Only offer the types present in the list (none before the API returns them)
  const types = useMemo(() => {
    const present = new Set(dishes.map(getDishType));
    return TYPE_ORDER.filter((value) => present.has(value));
  }, [dishes]);

  const query = search.trim().toLowerCase();
  const rows = dishes
    .map((dish, index) => ({ dish, rank: index + 1 }))
    .filter(({ dish }) => dish.libelle.toLowerCase().includes(query))
    .filter(({ dish }) => type === null || getDishType(dish) === type);

  return (
    <Card
      className="rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs"
      id={id}
    >
      <CardHeader className="border-b border-primary/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary wrap-break-word">
              {title}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              className="pl-11 rounded-2xl bg-muted/30 border-primary/5 focus-visible:ring-primary/20 h-12 text-base"
              placeholder={t("search")}
              aria-label={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {types.length > 0 && (
            <div role="group" aria-label={t("filterByType")} className="flex flex-wrap gap-2">
              {[null, ...types].map((value) => {
                const active = type === value;
                return (
                  <button
                    key={value ?? "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setType(value)}
                    className={cn(
                      CHIP_CLASS,
                      active
                        ? "bg-primary text-primary-foreground ring-primary"
                        : "bg-primary/5 text-primary ring-primary/10 hover:bg-primary/10"
                    )}
                  >
                    {value === null ? t("allTypes") : tTags(`types.${value}`)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-primary/5 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-primary/5">
                <TableHead className="w-24 text-center font-bold">{t("ranking")}</TableHead>
                <TableHead className="w-32 text-center font-bold">{t(column)}</TableHead>
                <TableHead className="font-bold">{t("label")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ dish, rank }) => (
                <TableRow key={dish.code} className="group border-primary/5 hover:bg-primary/5 transition-colors">
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 font-bold text-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {rank}
                    </span>
                  </TableCell>
                  {column === "occurrences" ? (
                    <TableCell className="text-center font-semibold">
                      {typeof dish.total === "number" ? format.number(dish.total) : null}
                    </TableCell>
                  ) : (
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">{dish.code}</TableCell>
                  )}
                  <TableCell className="font-medium">
                    <span className="wrap-break-word">{dish.libelle}</span>
                    <DishTags plat={dish} className="mt-1.5" />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
