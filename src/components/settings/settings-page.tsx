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
  } = useUserPreferences();

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
              <SelectValue placeholder={t("favourites.selectPlaceholder")} />
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
        {favourites.length === 0 && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>{t("favourites.nofavouritesTitle")}</AlertTitle>
            <AlertDescription>
              {t.rich("favourites.nofavouritesDescription", {
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
              {t("favourites.starredTitle")}
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("favourites.starredDescription")}
            </p>
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
            <SelectTrigger className="min-w-[180px] truncate max-w-[250px] w-fit">
              <SelectValue
                className=""
                placeholder={
                  starredFav?.name || t("favourites.starredSelectPlaceholder")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {favourites.map((favourite) => (
                <SelectItem
                  key={favourite.code}
                  value={favourite.code.toString()}
                >
                  {favourite.name.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex md:flex-row flex-col md:items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">
              {t("favourites.regionTitle")}
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              {t("favourites.regionDescription")}
            </p>
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
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue
                placeholder={
                  favouriteRegion?.libelle ||
                  t("favourites.regionSelectPlaceholder")
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
              <Button
                variant="destructive"
                onClick={() => {
                  umami.event("Settings.Personal.DeleteData");
                }}
              >
                {t("personal.deleteDataButton")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="space-y-2">
                <p>{t("personal.deleteDataConfirmTitle")}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPopoverOpen(false);
                      umami.event("Settings.Personal.DeleteData.Cancel");
                    }}
                  >
                    {t("personal.deleteDataConfirmNo")}
                  </Button>
                  <Button
                    variant="destructive"
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
      </SettingCard>
    </div>
  );
}
