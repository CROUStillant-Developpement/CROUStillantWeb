"use client";


import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const t = useTranslations("ModeToggle");
  const umami = useUmami();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
          onClick={() => umami.event('ThemeSwitcher.Toggle')}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("title")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-primary/20 shadow-xl p-2 gap-1 flex flex-col bg-background/80 backdrop-blur-xl min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={`rounded-lg cursor-pointer transition-all py-2 ${theme === "light" ? "bg-primary/10 text-primary shadow-sm font-bold" : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        >
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={`rounded-lg cursor-pointer transition-all py-2 ${theme === "dark" ? "bg-primary/10 text-primary shadow-sm font-bold" : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        >
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={`rounded-lg cursor-pointer transition-all py-2 ${theme === "system" ? "bg-primary/10 text-primary shadow-sm font-bold" : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        >
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
