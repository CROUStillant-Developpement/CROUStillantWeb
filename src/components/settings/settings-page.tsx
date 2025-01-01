"use client";

import SettingCard from "@/components/setting-card";
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
import { startTransition, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/routing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { getRegions } from "@/services/region-service";
import { Region } from "@/services/types";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/routing";

export default function SettingsPage() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  const t = useTranslations("SettingsPage");

  const { toast } = useToast();
  const { setTheme, theme, systemTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const {
    favorites,
    clearUserPreferences,
    setStarredFav,
    starredFav,
    setFavoriteRegion,
    favoriteRegion,
  } = useUserPreferences();

  const handleClearFavorites = () => {
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
        res.data.unshift({ code: -1, libelle: t("favorites.regionSelectAll") });
        setRegions(res.data);
      }
    });
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl">{t("title")}</h1>
      <SettingCard title={t("appearanceTitle")}>
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">{t("theme.title")}</p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("theme.description")}
            </p>
          </div>
          <Switch
            checked={
              theme === "system" ? systemTheme === "dark" : theme === "dark"
            }
            onCheckedChange={handleThemeChange}
          />
        </div>
        <div className="space-y-2 flex md:flex-row flex-col md:items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">{t("language.title")}</p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("language.description")}
            </p>
          </div>
          <Select defaultValue={locale} onValueChange={handleLocaleChange}>
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue placeholder={t("favorites.selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {routing.locales.map((cur) => (
                <SelectItem key={cur} value={cur}>
                  {t(`language.${cur}`, { locale: cur })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingCard>
      <SettingCard title={t("behaviorTitle")}>
        {favorites.length === 0 && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>{t("favorites.noFavoritesTitle")}</AlertTitle>
            <AlertDescription>
              {t.rich("favorites.noFavoritesDescription", {
                restaurants: (chunks) => (
                  <Link href="/restaurants" className="underline font-bold">
                    {chunks}
                  </Link>
                ),
              })}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2 flex md:flex-row flex-col md:items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">
              {t("favorites.starredTitle")}
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("favorites.starredDescription")}
            </p>
          </div>
          <Select
            onValueChange={(value) => {
              const favorite = favorites.find((f) => f.code === +value);
              if (favorite && starredFav?.code === favorite.code) {
                return;
              }
              if (favorite) {
                setStarredFav(favorite);
                toast({
                  title: t("favorites.starredSuccessTitle"),
                  description: t("favorites.starredSuccessDescription"),
                });
              }
            }}
            disabled={favorites.length === 0}
            defaultValue={starredFav?.code.toString()}
          >
            <SelectTrigger className="min-w-[180px] truncate max-w-[250px] w-fit">
              <SelectValue
                className=""
                placeholder={
                  starredFav?.name || t("favorites.starredSelectPlaceholder")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {favorites.map((favorite) => (
                <SelectItem
                  key={favorite.code}
                  value={favorite.code.toString()}
                >
                  {favorite.name.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex md:flex-row flex-col md:items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">
              {t("favorites.regionTitle")}
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("favorites.regionDescription")}
            </p>
          </div>
          <Select
            onValueChange={(value) => {
              const region = regions.find((r) => r.code === +value);
              if (region && favoriteRegion?.code === region.code) {
                return;
              }
              if (region) {
                setFavoriteRegion(region);
                toast({
                  title: t("favorites.regionEditSuccessTitle"),
                  description: t("favorites.regionEditSuccessDescription"),
                });
              }
            }}
            disabled={regions.length === 0}
            defaultValue={favoriteRegion?.code.toString()}
            value={favoriteRegion?.code.toString()}
          >
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue
                placeholder={
                  favoriteRegion?.libelle ||
                  t("favorites.regionSelectPlaceholder")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.code} value={region.code.toString()}>
                  {region.libelle.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SettingCard>
      <SettingCard title={t("personalTitle")}>
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">
              {t("personal.deleteDataTitle")}
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t.rich("personal.deleteDataDescription", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="destructive">
                {t("personal.deleteDataButton")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="space-y-2">
                <p>{t("personal.deleteDataConfirmTitle")}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPopoverOpen(false)}
                  >
                    {t("personal.deleteDataConfirmNo")}
                  </Button>
                  <Button variant="destructive" onClick={handleClearFavorites}>
                    {t("personal.deleteDataConfirmYes")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SettingCard>
    </div>
  );
}
