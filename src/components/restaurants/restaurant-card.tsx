import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Accessibility, CreditCard, Heart, MapPin } from "lucide-react";
import { slugify } from "@/lib/utils";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Restaurant } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useUmami } from "next-umami";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [imageSrc, setImageSrc] = useState(
    restaurant.image_url ?? "/default_ru.png"
  );

  const { addOrRemoveFromfavourites, favourites } = useUserPreferences();
  const t = useTranslations("RestaurantCard");
  const umami = useUmami();

  const handleImageError = () => {
    setImageSrc("/default_ru.png");
  };

  const isFavourite = favourites.some((f) => f.code === restaurant.code);

  const restaurantUrl = `/restaurants/${slugify(restaurant.nom)}-r${restaurant.code}`;

  return (
    <TooltipProvider>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-background/50 backdrop-blur-xs">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={restaurant.nom}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-80" />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-20 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border border-white/30 text-white"
            onClick={(e) => {
              e.preventDefault();
              addOrRemoveFromfavourites(restaurant.code, restaurant.nom);
              umami.event("Restaurant.Favourite", {
                restaurant: restaurant.code,
              });
            }}
          >
            <Heart className={isFavourite ? "text-red-500 fill-red-500" : ""} />
          </Button>

          <Link
            href={restaurantUrl}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100"
            onClick={() => {
              umami.event("Restaurant.Card.View", {
                restaurant: restaurant.code,
              });
            }}
          >
            <span className="translate-y-4 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform duration-300 group-hover:translate-y-0">
              {t("cta")}
            </span>
          </Link>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
            <Badge
              className={`shadow-md font-semibold ${
                restaurant.ouvert
                  ? "bg-green-500/90 text-white hover:bg-green-600/90"
                  : "bg-red-500/90 text-white hover:bg-red-600/90"
              }`}
            >
              {restaurant.ouvert ? t("open") : t("closed")}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <h2 className="line-clamp-1 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {restaurant.nom}
          </h2>
          
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4 shrink-0 text-primary/70" />
            <span className="line-clamp-1">{restaurant.zone}</span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex -space-x-1.5 overflow-hidden">
              {restaurant.paiement?.includes("Carte bancaire") && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground shadow-xs transition-transform hover:z-10 hover:scale-110">
                      <CreditCard className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} align="center">
                    {t("creditCard")}
                  </TooltipContent>
                </Tooltip>
              )}
              {restaurant.paiement?.includes("IZLY") && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-[#E1000F]/10 shadow-xs transition-transform hover:z-10 hover:scale-110">
                      <Image
                        src="/icons/izly.png"
                        alt="Izly"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} align="center">
                    {t("izly")}
                  </TooltipContent>
                </Tooltip>
              )}
              {restaurant.ispmr && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-blue-500/10 text-blue-600 shadow-xs transition-transform hover:z-10 hover:scale-110">
                      <Accessibility className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} align="center">
                    {t("accessibility")}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <Button asChild variant="ghost" size="sm" className="font-semibold text-primary hover:bg-primary/10">
              <Link
                href={restaurantUrl}
                onClick={() => {
                  umami.event("Restaurant.Card.View", {
                    restaurant: restaurant.code,
                  });
                }}
              >
                {t("cta")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
