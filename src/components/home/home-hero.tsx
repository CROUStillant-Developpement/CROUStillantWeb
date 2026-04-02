"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { slugify } from "@/lib/utils";

export default function HomeHero() {
  const t = useTranslations("HomePage");
  const { starredFav } = useUserPreferences();

  return (
    <div className="relative mb-24 overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/10 via-background to-background p-8 sm:p-16 shadow-xs border border-primary/10">
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
        <Link
          href="https://github.com/CROUStillant-Developpement"
          target="_blank"
          className="group inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20 transition-all hover:bg-primary/15"
        >
          {t("badge.title")}
          <ArrowRight
            size={15}
            className="ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
          />
        </Link>

        <h1 className="text-4xl md:text-8xl font-black tracking-tight leading-[1.1] bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
          {t("title.first")}
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
          {t("subtitle")}
        </p>

        <Link
          href={
            starredFav
              ? `/restaurants/${slugify(starredFav.name)}-r${starredFav.code}`
              : "/restaurants"
          }
          className="flex items-center hover:scale-105 transition-transform duration-300 ease-out text-sm md:text-base rounded-2xl bg-primary shadow-lg shadow-primary/25 py-4 px-8 text-primary-foreground font-black group"
        >
          {starredFav
            ? t("cta.starred", { name: starredFav.name })
            : t("cta.first")}
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
    </div>
  );
}
