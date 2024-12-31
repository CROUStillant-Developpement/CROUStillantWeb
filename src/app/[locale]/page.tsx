"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Utensils } from "lucide-react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { slugify } from "@/lib/utils";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { starredFav } = useUserPreferences();

  return (
    <div className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0 h-80svh mt-9 md:mt-0">
      <div className="mx-auto flex max-w-container flex-col gap-12 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <Link href="/" className="flex items-center">
            <Badge variant="outline" className="animate-appear group">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">
                  {t("badge.title")}
                </span>
                <span className="text-foreground">{t("badge.link")}</span>
              </div>
              <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Badge>
          </Link>
          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {t("title.first")} <br /> {t("title.second")}
          </h1>
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground delay-100 sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="relative z-10 flex animate-appear justify-center gap-4 delay-300">
            <div className="relative z-10 flex animate-appear justify-center gap-4 delay-300 flex-wrap">
              <Button variant="default" size="lg" asChild className="group">
                <Link
                  href={
                    starredFav
                      ? `/restaurants/${slugify(starredFav.name)}-r${
                          starredFav.code
                        }`
                      : "/restaurants"
                  }
                  className="text-wrap"
                >
                  {starredFav
                    ? t("cta.starred", { name: starredFav.name })
                    : t("cta.first")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/restaurants">
                  {t("cta.second")}
                  <Utensils className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
