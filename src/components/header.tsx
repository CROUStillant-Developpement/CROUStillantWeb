"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/theme-switcher";
import { Settings, Home, Info, Mail, Star } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { getGithubStarCount } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Header() {
  const [stars, setStars] = useState<number>(0); // [1
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    getGithubStarCount().then((count) => setStars(count));
  }, []);

  return (
    <header className="flex justify-between items-center">
      <nav>
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
              <Link
                href={{
                  pathname: "/",
                  query: { referer: "me" },
                }}
              >
                {isDesktop ? "Accueil" : <Home className="h-6 w-6" />}
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
                {isDesktop ? "À propos" : <Info className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant={pathname === "/contact" ? "default" : "outline"}
              className={`select-none h-9 rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/contact">
                {isDesktop ? "Contact" : <Mail className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="https://github.com/CROUStillant-Developpement"
            target="_blank"
            rel="noreferrer"
          >
            {stars} <Star className="h-4 w-4" />
          </Link>
        </Button>
        <ModeToggle />
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
