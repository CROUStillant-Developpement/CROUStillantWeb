"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import type { Restaurant } from "@/services/types";

interface Props {
  restaurants: Restaurant[];
  value: number | null;
  onChange: (code: number | null) => void;
}

export default function RestaurantSearch({ restaurants, value, onChange }: Props) {
  const t = useTranslations("IframeBuilderPage");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = restaurants.find((r) => r.code === value) ?? null;

  const filtered = useMemo(() => {
    if (!query.trim()) return restaurants.slice(0, 12);
    const q = query.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return restaurants
      .filter((r) => {
        const nom = r.nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        const zone = r.zone.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        return nom.includes(q) || zone.includes(q);
      })
      .slice(0, 20);
  }, [query, restaurants]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (restaurant: Restaurant) => {
    onChange(restaurant.code);
    setQuery("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      {selected && !open ? (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-primary/20 bg-primary/5 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground truncate">{selected.nom}</span>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("search.clear")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={t("search.placeholder")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-4 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring text-foreground"
          />
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-primary/10 rounded-2xl shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("search.empty")}
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto divide-y divide-border/50">
              {filtered.map((restaurant) => (
                <li key={restaurant.code}>
                  <button
                    type="button"
                    onClick={() => handleSelect(restaurant)}
                    className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{restaurant.nom}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {restaurant.zone} · {restaurant.type?.libelle}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
