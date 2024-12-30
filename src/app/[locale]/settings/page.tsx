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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { getRegions } from "@/services/region-service";
import { Region } from "@/services/types";

export default function Settings() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  const { toast } = useToast();
  const { setTheme, theme, systemTheme } = useTheme();
  const pathname = usePathname();
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
      title: "Données supprimées",
      description: "Vos favoris ont été supprimés avec succès.",
    });
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast({
      title: "Thème modifié",
      description: `Le thème a été changé en ${
        checked ? "sombre" : "clair"
      } avec succès.`,
    });
  };

  useEffect(() => {
    getRegions().then((res) => {
      if (res.success) {
        setRegions(res.data);
      }
    });
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl">Paramètres</h1>
      <SettingCard title="Apparence">
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Thème sombre</p>
            <p className="text-[0.8rem] text-muted-foreground">
              Activez le thème sombre pour une meilleure expérience de nuit.
            </p>
          </div>
          <Switch
            checked={
              theme === "system" ? systemTheme === "dark" : theme === "dark"
            }
            onCheckedChange={handleThemeChange}
          />
        </div>
      </SettingCard>
      <SettingCard title="Comportement">
        {favorites.length === 0 && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              Vous n'avez pas de favoris pour le moment, les paramètres suivants
              sont désactivés. Ajoutez votre premier favori maintenant en se
              rendant sur la page{" "}
              <Link href="/restaurants" className="underline font-bold">
                des restaurants
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}
        {/* <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Favori comme page d'accueil</p>
            <p className="text-[0.8rem] text-muted-foreground">
              La page d'accueil affichera le premier restaurant en favori ou le
              restaurant choisi si défini.
            </p>
          </div>
          <Switch
            disabled={favorites.length === 0}
            checked={localFavAsHomePage}
            onCheckedChange={handleFavAsHomePageChange}
          />
        </div> */}
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Changer le favori ultime</p>
            <p className="text-[0.8rem] text-muted-foreground">
              Le bouton de la page d'accueil affichera le restaurant choisi.
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
                  title: "Favori modifié",
                  description: `Le favori a été changé avec succès.`,
                });
              }
            }}
            disabled={favorites.length === 0}
            defaultValue={starredFav?.code.toString()}
          >
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue placeholder={starredFav?.name || "Sélectionner"} />
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
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">
              Changer votre region préférée
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              La page des restaurants affichera les restaurants de la région par
              défaut.
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
                  title: "Region modifiée",
                  description: `La région a été changée avec succès.`,
                });
              }
            }}
            disabled={regions.length === 0}
            defaultValue={favoriteRegion?.code.toString()}
          >
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue
                placeholder={favoriteRegion?.libelle || "Sélectionner"}
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
      <SettingCard title="Personnel">
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Supprimer les données</p>
            <p className="text-[0.8rem] text-muted-foreground">Vous perdrez</p>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="destructive">Supprimer</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <p>
                  Êtes-vous sûr de vouloir supprimer tous vos favoris et vos
                  paramètres ?
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPopoverOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleClearFavorites}>
                    Supprimer
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
