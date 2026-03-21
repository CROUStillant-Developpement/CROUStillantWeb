"use client";

import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import ModeToggle from "@/components/theme-switcher";
import { Settings, Home, Info, UtensilsCrossed } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import LocaleToggle from "./locale-switcher";
import Logo from "./logo";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { useUmami } from "next-umami";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const t = useTranslations("Header");
  const umami = useUmami();

  return (
    <header className="flex justify-between items-center w-full mt-4 px-4">
      <nav className="">
        <ul
          className={cn(
            "flex items-center space-x-1 bg-secondary/40 p-1 rounded-xl shadow-inner border border-border/20 backdrop-blur-md"
          )}
        >
          <li>
            <Button
              size={isDesktop ? "default" : "icon"}
              asChild
              variant={pathname === "/" ? "default" : "ghost"}
              className={cn(
                "select-none h-9 rounded-lg text-sm transition-all duration-300 font-bold",
                pathname === "/"
                  ? "shadow-lg bg-background text-primary hover:bg-background/80"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                isDesktop ? "px-4" : "p-0 w-9"
              )}
              onClick={() => umami.event('Header.HomeButton')}
            >
              <Link href="/">
                {isDesktop ? t("home") : <Home className="h-5 w-5" />}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              size={isDesktop ? "default" : "icon"}
              asChild
              variant={pathname?.startsWith("/restaurants") ? "default" : "ghost"}
              className={cn(
                "select-none h-9 rounded-lg text-sm transition-all duration-300 font-bold",
                pathname?.startsWith("/restaurants")
                  ? "shadow-lg bg-background text-primary hover:bg-background/80"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                isDesktop ? "px-4" : "p-0 w-9"
              )}
              onClick={() => umami.event('Header.RestaurantsButton')}
            >
              <Link href="/restaurants">
                {isDesktop ? (
                  t("restaurants")
                ) : (
                  <UtensilsCrossed className="h-5 w-5" />
                )}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              size={isDesktop ? "default" : "icon"}
              asChild
              variant={pathname === "/about" ? "default" : "ghost"}
              className={cn(
                "select-none h-9 rounded-lg text-sm transition-all duration-300 font-bold",
                pathname === "/about"
                  ? "shadow-lg bg-background text-primary hover:bg-background/80"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                isDesktop ? "px-4" : "p-0 w-9"
              )}
              onClick={() => umami.event('Header.AboutButton')}
            >
              <Link href="/about">
                {isDesktop ? t("about") : <Info className="h-5 w-5" />}
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center gap-1">
          <Logo />
          {isDesktop && <span className="font-bold text-lg">CROUStillant</span>}
        </Link>
      </div>
      <div className="flex justify-end">
        <div
          className={cn(
            "flex items-center bg-secondary/40 p-1 rounded-xl shadow-inner border border-border/20 backdrop-blur-md"
          )}
        >
          <ModeToggle />
          <LocaleToggle />
          <Button
            asChild
            variant={pathname === "/settings" ? "default" : "ghost"}
            size={isDesktop ? "default" : "icon"}
            className={cn(
              "select-none h-9 rounded-lg transition-all duration-300 font-bold",
              pathname === "/settings"
                ? "shadow-lg bg-background text-primary hover:bg-background/80"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10",
              isDesktop ? "px-4" : "p-0 w-9"
            )}
            onClick={() => umami.event('Header.SettingsButton')}
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
