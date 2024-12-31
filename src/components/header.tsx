"use client";

import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/theme-switcher";
import {
  Settings,
  Home,
  Info,
  Mail,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { getGithubStarCount } from "@/lib/utils";
import { useEffect, useState } from "react";
import LocaleToggle from "./locale-switcher";
import Logo from "./logo";
import { useTranslations } from "next-intl";

export default function Header() {
  const [stars, setStars] = useState<number>(0); // [1
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const t = useTranslations("Header");

  useEffect(() => {
    getGithubStarCount()
      .then((count) => setStars(count))
      .catch(() => setStars(0));
  }, []);

  return (
    <header className="flex justify-between items-center w-full">
      <nav className="md:w-64">
        <ul
          className={`flex h-9 items-center space-x-1 bg-background p-1 rounded-none border-none ${
            isDesktop ? "border border-b" : "gap-2"
          }`}
        >
          <li>
            <Button
              size={isDesktop ? "default" : "icon"}
              asChild
              variant={pathname === "/" ? "default" : "outline"}
              className={`select-none snowy-button h-9 rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/">
                {isDesktop ? t("home") : <Home className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              size={isDesktop ? "default" : "icon"}
              asChild
              variant={pathname === "/" ? "default" : "outline"}
              className={`select-none h-9 rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/restaurants">
                {isDesktop ? (
                  t("restaurants")
                ) : (
                  <UtensilsCrossed className="h-6 w-6" />
                )}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant={pathname === "/about" ? "default" : "outline"}
              className={`select-none h-9 rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/about">
                {isDesktop ? t("about") : <Info className="h-6 w-6" />}
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
      <div className="flex gap-2 md:w-64 justify-end">
        {isDesktop && (
          <Button asChild variant="outline">
            <Link
              href="https://github.com/CROUStillant-Developpement"
              target="_blank"
              rel="noreferrer"
            >
              {stars} <Star className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <ModeToggle />
        <LocaleToggle />
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
          className={`select-none h-9 w-9 rounded-sm`}
        >
          <Link href="/settings">
            <Settings className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
