"use client";


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
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

export default function LocaleToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const umami = useUmami();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function handleChange(locale: string) {
    startTransition(() => {
      router.replace({ pathname }, { locale: locale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={isDesktop ? "default" : "icon"}
          className={cn(
            "select-none h-9 rounded-lg transition-all duration-300 font-bold text-muted-foreground hover:text-primary hover:bg-primary/10",
            isDesktop ? "px-4" : "p-0 w-9"
          )}
          onClick={() => umami.event('LocaleSwitcher.Toggle')}
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Changer de langue</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-primary/20 shadow-xl p-2 gap-1 flex flex-col bg-background/80 backdrop-blur-xl min-w-[140px]">
        <DropdownMenuItem
          disabled={useLocale() === "fr" || isPending}
          className={`rounded-lg cursor-pointer transition-all py-2 ${useLocale() === "fr" ? "bg-primary/10 text-primary shadow-sm font-bold" : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          onClick={() => {
            handleChange("fr");
          }}
        >
          <ReactCountryFlag 
            countryCode="FR"
            title="Français"
            aria-label="Français" 
            svg
            style={{ fontSize: '1.2em' }}
          />
          <span className="ml-2">Français</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={useLocale() === "en" || isPending}
          className={`rounded-lg cursor-pointer transition-all py-2 ${useLocale() === "en" ? "bg-primary/10 text-primary shadow-sm font-bold" : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          onClick={() => {
            handleChange("en");
          }}
        >
          <ReactCountryFlag 
            countryCode="GB"
            title="English"
            aria-label="English"
            svg
            style={{ fontSize: '1.2em' }}
          />
          <span className="ml-2">English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
