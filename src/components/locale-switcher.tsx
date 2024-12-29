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

export default function LocaleToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(locale: string) {
    startTransition(() => {
      router.replace({ pathname }, { locale: locale });
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
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
          🇫🇷
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={useLocale() === "en" || isPending}
          className={useLocale() === "en" ? "bg-accent" : ""}
          onClick={() => {
            handleChange("en");
          }}
        >
          🇬🇧
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
