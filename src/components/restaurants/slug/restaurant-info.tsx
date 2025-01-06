import { Restaurant } from "@/services/types";
import {
  Check,
  ArrowRight,
  MapPinHouse,
  X,
  CreditCard,
  Accessibility,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useMediaQuery } from "usehooks-ts";

type RestaurantInfoProps = {
  restaurant: Restaurant;
};

export default function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  const t = useTranslations("RestaurantInformation");

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div>
      <ul className="flex flex-col gap-4 p-4 mb-4 md:mb-8">
        <li>
          <h1 className="text-xl font-semibold mb-2 flex items-center gap-2">
            {t("openingHours")}
            <Badge>{restaurant?.ouvert ? t("open") : t("closed")}</Badge>
          </h1>
          <p className="text-sm font-semibold mb-2 italic opacity-50">
            {restaurant?.horaires?.join(", ")}
          </p>
          <div className="border rounded-lg overflow-hidden">
            <table className={`table-auto w-full ${isMobile ? "text-xs" : ""}`}>
              <thead className="">
                <tr className="rounded-lg">
                  <th className="text-center border px-4 py-2">{t("day")}</th>
                  <th className="text-center border px-4 py-2">
                    {t("breakfast")}
                  </th>
                  <th className="text-center border px-4 py-2">{t("lunch")}</th>
                  <th className="text-center border px-4 py-2">
                    {t("dinner")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurant?.jours_ouvert?.map((jour, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2 font-medium">
                      {isMobile ? t(jour.jour).slice(0, 3) : t(jour.jour)}
                    </td>
                    <td className="border px-4 py-2">
                      {jour.ouverture.matin ? (
                        <div className="flex justify-center items-center">
                          <Check className="w-6 h-6 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <X className="w-6 h-6 text-red-500" />
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2 mx-auto">
                      {jour.ouverture.midi ? (
                        <div className="flex justify-center items-center">
                          <Check className="w-6 h-6 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <X className="w-6 h-6 text-red-500" />
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {jour.ouverture.soir ? (
                        <div className="flex justify-center items-center">
                          <Check className="w-6 h-6 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <X className="w-6 h-6 text-red-500" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </li>
        <li className="flex-1 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPinHouse className="w-6 h-6" />
              {restaurant?.adresse}
            </div>
            {restaurant?.acces?.map((acces, index) => (
              <div
                className="flex items-center gap-2 ml-8 text-sm opacity-75"
                key={index}
              >
                <ArrowRight className="w-4 h-4" />
                {acces}
              </div>
            ))}
          </div>
          <Button size="icon" asChild className="flex-1">
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
              target="_blank"
            >
              <Navigation className="w-6 h-6" />
            </Link>
          </Button>
        </li>
        <li className="flex-1 flex items-center gap-2">
          <TooltipProvider>
            <div className="flex gap-1 items-center">
              {restaurant.paiement?.includes("Carte bancaire") && (
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
              )}
              {restaurant.paiement?.includes("IZLY") && (
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
              )}
              {restaurant.ispmr && (
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
              )}
            </div>
          </TooltipProvider>
        </li>
        {(restaurant.email || restaurant.telephone) && (
          <li>
            <p className="text-sm font-semibold mb-2 italic opacity-50">
              {t("contact")}
            </p>
            {restaurant.email && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">{t("email")}:</span>{" "}
                <Link className="underline" href={`mailto:${restaurant.email}`}>
                  {restaurant.email}
                </Link>
              </div>
            )}
            {restaurant.telephone && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">{t("phone")}:</span>{" "}
                <Link
                  className="underline"
                  href={`tel:${restaurant.telephone}`}
                >
                  {restaurant.telephone}
                </Link>
              </div>
            )}
          </li>
        )}
        {(restaurant.type_restaurant || restaurant.region) && (
          <li>
            <p className="text-sm font-semibold mb-2 italic opacity-50">
              {t("otherInformation")}
            </p>
            {restaurant.type_restaurant && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">{t("type")}:</span>{" "}
                {restaurant.type_restaurant?.libelle}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold">{t("crous")}:</span>
              <Link
                className="underline"
                href={`/restaurants?region=${restaurant.region.code}`}
              >
                {restaurant.region.libelle}
              </Link>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
