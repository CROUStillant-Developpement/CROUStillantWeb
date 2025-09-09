"use client";

import * as React from "react";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import ReactCountryFlag from "react-country-flag"
import { useUmami } from "next-umami";

export default function LocaleToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const umami = useUmami();

  function handleChange(locale: string) {
    startTransition(() => {
      router.replace({ pathname }, { locale: locale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => umami.event('LocaleSwitcher.Toggle')}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Changer de langue</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={useLocale() === "fr" || isPending}
          className={useLocale() === "fr" ? "bg-accent" : ""}
          onClick={() => {
            handleChange("fr");
          }}
        >
          <ReactCountryFlag 
            countryCode="FR"
            title="Français"
            aria-label="Français" 
            svg
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={useLocale() === "en" || isPending}
          className={useLocale() === "en" ? "bg-accent" : ""}
          onClick={() => {
            handleChange("en");
          }}
        >
          <ReactCountryFlag 
            countryCode="GB"
            title="English"
            aria-label="English"
            svg
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
