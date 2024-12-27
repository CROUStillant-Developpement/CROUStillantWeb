import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Accessibility, CreditCard, Heart, HeartOff } from "lucide-react";
import { slugify } from "@/lib/utils";
// import { useUserPreferences } from "@/store/userPreferencesStore";
import { Restaurant } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // const { isFavorite, addOrRemoveFromFavorites } = useUserPreferences();

  return (
    <TooltipProvider>
      <div>
        <Image
          src={restaurant.image_url ?? ""}
          alt={restaurant.nom}
          width={400}
          height={400}
          className="rounded-lg object-cover w-full h-56"
        />
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-xl font-bold">{restaurant.nom}</h1>
          <Badge className={restaurant.ouvert ? "bg-green-500" : "bg-red-500"}>
            {restaurant.ouvert ? "Ouvert" : "Fermé"}
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
                    Paiement par CB
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
                    Paiement par Izly
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
                    Accessible aux PMR
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
          <Button asChild>
            <Link href={`/restaurants/${slugify(restaurant.nom)}`}>
              Voir le menu
            </Link>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
