import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Accessibility, CreditCard, Heart, HeartOff } from "lucide-react";
import { slugify } from "@/lib/utils";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { Restaurant } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { addOrRemoveFromFavorites, favorites } = useUserPreferences();
  const t = useTranslations("RestaurantCard");

  return (
    <TooltipProvider>
      <div className="relative group p-2 hover:p-0 fading-border hover:before:border-none hover:cursor-pointer before:border-primary transition-all duration-300 ease-in-out">
        <Image
          src={restaurant.image_url ?? "/default_ru.png"}
          alt={restaurant.nom}
          width={400}
          height={400}
          className="rounded-lg object-cover w-full h-56"
        />
        <Button
          variant="outline"
          size="icon"
          className="rounded-full absolute top-4 right-4 z-20"
          onClick={() => addOrRemoveFromFavorites(restaurant.code)}
        >
          {favorites.includes(restaurant.code) ? (
            <Heart size={20} />
          ) : (
            <HeartOff size={20} />
          )}
        </Button>
        <Link
          href={`/restaurants/${slugify(restaurant.nom)}-r${restaurant.code}`}
          className="absolute top-0 left-0 h-56 w-full rounded-lg hidden group-hover:flex items-center justify-center bg-black bg-opacity-50 transition"
        >
          <p className="text-lg font-bold text-primary-foreground">
            {t("cta")}
          </p>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-xl font-bold">{restaurant.nom}</h1>
          <Badge className={restaurant.ouvert ? "bg-green-500" : "bg-red-500"}>
            {restaurant.ouvert ? t("open") : t("closed")}
          </Badge>
        </div>
        <p className="text-gray-500 mt-2">{restaurant.zone}</p>
        <div className="mt-2 flex gap-1 items-center justify-between">
          <div className="flex gap-1 items-center">
            {restaurant.paiement?.includes("Carte bancaire") && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <CreditCard size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} align="center">
                    {t("creditCard")}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {restaurant.paiement?.includes("IZLY") && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Image
                        src="/icons/izly.png"
                        alt="heart"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} align="center">
                    {t("izly")}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {restaurant.ispmr && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Accessibility size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} align="center">
                    {t("accessibility")}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
          <Button asChild>
            <Link
              href={`/restaurants/${slugify(restaurant.nom)}-r${
                restaurant.code
              }`}
            >
              {t("cta")}
            </Link>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}