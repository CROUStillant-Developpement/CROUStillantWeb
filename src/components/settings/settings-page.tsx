"use client";

import SettingCard from "@/components/settings/setting-card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { startTransition, useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/routing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert, Trash2, Palette, Languages, Cog, Star, MapPin, Eye, ScrollText } from "lucide-react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { getRegions } from "@/services/region-service";
import { Region } from "@/services/types";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/routing";
import { useUmami } from "next-umami";

export default function SettingsPage() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  const t = useTranslations("SettingsPage");
  const umami = useUmami();

  const { toast } = useToast();
  const { setTheme, theme, systemTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const {
    favourites,
    clearUserPreferences,
    setStarredFav,
    starredFav,
    setfavouriteRegion,
    favouriteRegion,
    display,
    dislexicFont,
  } = useUserPreferences();

  const localData = useMemo(() => ({
    favourites,
    starredFav,
    favouriteRegion,
    display,
    dislexicFont,
    theme,
    locale,
  }), [favourites, starredFav, favouriteRegion, display, dislexicFont, theme, locale]);

  const handleClearfavourites = () => {
    clearUserPreferences();
    setPopoverOpen(false);
    toast({
      title: t("personal.deleteDataSuccessTitle"),
      description: t("personal.deleteDataSuccessDescription"),
    });
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast({
      title: t("theme.successTitle"),
      description: checked ? t("theme.successDark") : t("theme.successLight"),
    });
  };

  const handleLocaleChange = (value: string) => {
    startTransition(() => {
      router.replace({ pathname }, { locale: value });
    });

    toast({
      title: t("language.successTitle"),
      description: t("language.successDescription"),
    });
  };

  useEffect(() => {
    getRegions().then((res) => {
      if (res.success) {
        res.data.sort((a, b) => a.libelle.localeCompare(b.libelle));
        res.data.unshift({
          code: -1,
          libelle: t("favourites.regionSelectAll"),
        });
        setRegions(res.data);
      }
    });
  }, []);

  return (
    <div className="w-full mt-4 px-4 overflow-x-hidden">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-sm border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground break-words">
            {t("title")}
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
              {t("subtitle", { fallback: "Preferences & Personalization" })}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="space-y-12 mx-auto pb-20">
        <SettingCard title={t("appearanceTitle")}>
          <div className="group space-y-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl bg-secondary/30 border border-border/50 p-6 transition-all hover:bg-secondary/50 lg:flex-1 lg:min-w-[400px]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm group-hover:scale-110 transition-transform">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg leading-none">{t("theme.title")}</p>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  {t("theme.description")}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2 sm:pt-0">
              <Switch
                checked={
                  theme === "system" ? systemTheme === "dark" : theme === "dark"
                }
                onCheckedChange={handleThemeChange}
                className="scale-110"
              />
            </div>
          </div>

          <div className="group space-y-4 flex flex-col rounded-3xl bg-secondary/30 border border-border/50 p-6 transition-all hover:bg-secondary/50 lg:flex-1 lg:min-w-[400px]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm group-hover:scale-110 transition-transform">
                <Languages className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg leading-none">{t("language.title")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("language.description")}
                </p>
              </div>
            </div>
            <Select defaultValue={locale} onValueChange={handleLocaleChange}>
              <SelectTrigger className="w-full h-12 rounded-2xl bg-background border-border/50 shadow-sm text-base font-medium">
                <SelectValue placeholder={t("favourites.selectPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50">
                {routing.locales.map((cur) => (
                  <SelectItem key={cur} value={cur} className="rounded-xl my-1 mx-2">
                    {t(`language.${cur}`, { locale: cur })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SettingCard>

        <SettingCard title={t("behaviorTitle")}>
          {favourites.length === 0 && (
            <Alert variant="destructive" className="rounded-3xl border-destructive/20 bg-destructive/5 py-6 px-6 w-full">
              <TriangleAlert className="h-5 w-5 ml-2 mt-3" />
              <AlertTitle className="font-black text-lg ml-2">{t("favourites.nofavouritesTitle")}</AlertTitle>
              <AlertDescription className="ml-2 text-base opacity-90">
                {t.rich("favourites.nofavouritesDescription", {
                  restaurants: (chunks) => (
                    <Link href="/restaurants" className="underline font-black decoration-2 underline-offset-4 hover:text-primary transition-colors">
                      {chunks}
                    </Link>
                  ),
                })}
              </AlertDescription>
            </Alert>
          )}

          <div className="group space-y-4 flex flex-col rounded-3xl bg-secondary/30 border border-border/50 p-6 transition-all hover:bg-secondary/50 lg:flex-1 lg:min-w-[400px]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm group-hover:scale-110 transition-transform">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg leading-none">
                  {t("favourites.starredTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("favourites.starredDescription")}
                </p>
              </div>
            </div>
            <Select
              onValueChange={(value) => {
                const favourite = favourites.find((f) => f.code === +value);
                if (favourite && starredFav?.code === favourite.code) {
                  return;
                }
                if (favourite) {
                  setStarredFav(favourite);
                  toast({
                    title: t("favourites.starredSuccessTitle"),
                    description: t("favourites.starredSuccessDescription"),
                  });
                }
              }}
              disabled={favourites.length === 0}
              defaultValue={starredFav?.code.toString()}
            >
              <SelectTrigger className="w-full h-12 rounded-2xl bg-background border-border/50 shadow-sm text-base font-medium">
                <SelectValue
                  placeholder={
                    starredFav?.name || t("favourites.starredSelectPlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50">
                {favourites.map((favourite) => (
                  <SelectItem
                    key={favourite.code}
                    value={favourite.code.toString()}
                    className="rounded-xl my-1 mx-2"
                  >
                    {favourite.name.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="group space-y-4 flex flex-col rounded-3xl bg-secondary/30 border border-border/50 p-6 transition-all hover:bg-secondary/50 lg:flex-1 lg:min-w-[400px]">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg leading-none">
                  {t("favourites.regionTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("favourites.regionDescription")}
                </p>
              </div>
            </div>
            <Select
              onValueChange={(value) => {
                const region = regions.find((r) => r.code === +value);
                if (region && favouriteRegion?.code === region.code) {
                  return;
                }
                if (region) {
                  setfavouriteRegion(region);
                  toast({
                    title: t("favourites.regionEditSuccessTitle"),
                    description: t("favourites.regionEditSuccessDescription"),
                  });
                }
              }}
              disabled={regions.length === 0}
              defaultValue={favouriteRegion?.code.toString()}
              value={favouriteRegion?.code.toString()}
            >
              <SelectTrigger className="w-full h-12 rounded-2xl bg-background border-border/50 shadow-sm text-base font-medium">
                <SelectValue
                  placeholder={
                    favouriteRegion?.libelle ||
                    t("favourites.regionSelectPlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 max-h-80">
                {regions.map((region) => (
                  <SelectItem key={region.code} value={region.code.toString()} className="rounded-xl my-1 mx-2">
                    {region.libelle.trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SettingCard>

        <SettingCard title={t("personalTitle")}>
          <div className="group space-y-6 flex flex-col rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm group-hover:scale-110 transition-transform">
                <Cog className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1 text-left">
                <p className="font-black text-lg sm:text-xl text-foreground leading-snug break-words">
                  {t("personal.viewDataTitle")} & {t("personal.deleteDataTitle").toLowerCase()}
                </p>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {t("personal.viewDataDescription")} {t("personal.deleteDataDescription")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 rounded-2xl font-black text-lg shadow-sm hover:bg-primary/5 hover:text-primary transition-all group"
                    onClick={() => {
                      umami.event("Settings.Personal.ViewData");
                    }}
                  >
                    <Eye className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                    {t("personal.viewDataButton")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] rounded-3xl p-0 border-border/50 overflow-hidden shadow-2xl backdrop-blur-xl">
                  <DialogHeader className="p-4 sm:p-8 pb-4 bg-secondary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <ScrollText className="h-5 w-5 text-primary" />
                      </div>
                      <DialogTitle className="font-black text-2xl tracking-tight">
                        {t("personal.viewDataTitle")}
                      </DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                      {t("personal.viewDataDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 sm:p-8 pt-4">
                    <div className="rounded-2xl bg-muted/50 border border-border/50 p-6 font-mono text-sm overflow-auto max-h-[60vh] custom-scrollbar">
                      <pre className="text-foreground/90 whitespace-pre-wrap break-all">
                        {JSON.stringify(localData, null, 2)}
                      </pre>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="flex-1 h-14 rounded-2xl font-black text-lg shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    onClick={() => {
                      umami.event("Settings.Personal.DeleteData");
                    }}
                  >
                    <Trash2 className="mr-3 h-5 w-5" />
                    {t("personal.deleteDataButton")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 rounded-3xl p-6 border-destructive/30 shadow-2xl backdrop-blur-xl">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="font-black text-xl text-foreground leading-tight">{t("personal.deleteDataConfirmTitle")}</p>
                      <p className="text-sm text-muted-foreground">{t("personal.deleteDataConfirmDescription")}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-2xl h-12 font-bold hover:bg-secondary/50"
                        onClick={() => {
                          setPopoverOpen(false);
                          umami.event("Settings.Personal.DeleteData.Cancel");
                        }}
                      >
                        {t("personal.deleteDataConfirmNo")}
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 rounded-2xl h-12 font-black shadow-lg shadow-destructive/20"
                        onClick={() => {
                          handleClearfavourites();
                          umami.event("Settings.Personal.DeleteData.Confirm");
                        }}
                      >
                        {t("personal.deleteDataConfirmYes")}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
