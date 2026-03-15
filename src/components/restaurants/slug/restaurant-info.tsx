import { Restaurant } from "@/services/types";
import {
  Check,
  ArrowRight,
  MapPinHouse,
  X,
  CreditCard,
  Accessibility,
  Navigation,
  Clock,
  Mail,
  Phone,
  Info,
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
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

type RestaurantInfoProps = {
  restaurant: Restaurant;
};

export default function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  const t = useTranslations("RestaurantInformation");
  const umami = useUmami();
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-6 p-1 h-full">
      {/* Location */}
      <section className="bg-card border border-border/50 rounded-3xl p-5 shadow-sm flex flex-col gap-4 transition-all hover:border-primary/20">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
          <MapPinHouse className="w-5 h-5 text-primary" />
          {t("location")}
        </h2>
        <div className="text-[13px] font-medium leading-relaxed bg-secondary/5 p-3 rounded-2xl border border-border/50">
          {restaurant?.adresse}
          {restaurant?.acces?.map((acces, index) => (
            <div className="flex items-start gap-2 mt-2 text-[11px] opacity-70 group" key={index}>
              <ArrowRight className="w-3 h-3 mt-0.5 text-primary/50 group-hover:text-primary transition-colors" />
              <span>{acces}</span>
            </div>
          ))}
        </div>

        <Button asChild className="w-full rounded-2xl h-10 font-bold group text-sm" variant="secondary">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
            target="_blank"
            onClick={() => {
              umami.event("Restaurant.ExternalMap", {
                restaurant: restaurant.code,
              });
            }}
          >
            <Navigation className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            {t("openInGoogleMaps")}
          </Link>
        </Button>
      </section>

      {/* Opening Hours Section */}
      <section className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-primary/20 mt-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="opening-hours" className="border-none">
            <div className="flex items-center justify-between px-5 pt-6 pb-4  ">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold">{t("openingHours")}</h2>
              </div>
            </div>
            {restaurant?.horaires && restaurant?.horaires.length > 0 && (
              <div className="text-[13px] font-medium leading-relaxed bg-secondary/5 p-3 rounded-2xl border border-border/50 mx-5">
                {restaurant?.horaires?.join(", ")}
              </div>
            )}

            <AccordionTrigger className="px-5 py-2 hover:no-underline hover:bg-secondary/20 transition-colors text-[11px] font-medium opacity-60 mt-4">
              {t("clickToSeeAll")}
            </AccordionTrigger>

            <AccordionContent className="px-5 pb-5 pt-4">
              <div className="flex flex-col gap-2">
                {restaurant?.jours_ouvert?.map((jour, index) => (
                  <div key={index} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-secondary/10 border border-transparent hover:border-border/10 transition-colors">
                    <span className="font-bold text-[10px] uppercase tracking-wider opacity-50">
                      {t(jour.jour)}
                    </span>
                    <div className="flex flex-col gap-1">
                      <StatusRow label={t("breakfast")} active={jour.ouverture.matin} />
                      <StatusRow label={t("lunch")} active={jour.ouverture.midi} />
                      <StatusRow label={t("dinner")} active={jour.ouverture.soir} />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Contact & Services */}
      <section className="bg-card border border-border/50 rounded-3xl p-5 shadow-sm flex flex-col gap-4 transition-all hover:border-primary/20">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
          <Info className="w-5 h-5 text-primary" />
          {t("contactAndServices")}
        </h2>

        {(restaurant.email || restaurant.telephone) && (
          <>
            <div className="flex flex-col gap-3">
              {restaurant.email && (
                <a
                  href={`mailto:${restaurant.email}`}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50"
                  onClick={() => umami.event("Restaurant.Email", { restaurant: restaurant.code })}
                >
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[9px] uppercase font-bold opacity-50 leading-none mb-1">{t("email")}</span>
                    <span className="text-[12px] font-medium truncate max-w-[160px] sm:max-w-[220px] text-ellipsis">{restaurant.email}</span>
                  </div>
                </a>
              )}
              {restaurant.telephone && (
                <a
                  href={`tel:${restaurant.telephone}`}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50"
                  onClick={() => umami.event("Restaurant.Phone", { restaurant: restaurant.code })}
                >
                  <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold opacity-50 leading-none mb-1">{t("phone")}</span>
                    <span className="text-[12px] font-medium">{restaurant.telephone}</span>
                  </div>
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-border/10"></div>
          </>
        )}

        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {restaurant.paiement?.includes("Carte bancaire") && (
              <ServiceIcon icon={<CreditCard size={18} />} label={t("creditCard")} />
            )}
            {restaurant.paiement?.includes("IZLY") && (
              <ServiceIcon
                icon={<Image src="/icons/izly.png" alt="izly" width={18} height={18} />}
                label={t("izly")}
              />
            )}
            {restaurant.ispmr && (
              <ServiceIcon icon={<Accessibility size={18} />} label={t("accessibility")} />
            )}
          </TooltipProvider>
        </div>

        <div className="flex flex-row items-center gap-2">
          {restaurant.type && (
            <Badge variant="secondary" className="rounded-full px-2 py-0">{restaurant.type.libelle}</Badge>
          )}
          {restaurant.region && (
            <Badge variant="outline" className="rounded-full px-2 py-0 hover:bg-secondary transition-colors cursor-pointer" onClick={() => {
              umami.event("Restaurant.Region", { restaurant: restaurant.code });
              router.push(`/${locale}/restaurants?region=${restaurant.region.code}`);
            }}>
              {restaurant.region.libelle}
            </Badge>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusRow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs font-semibold py-1">
      <span className="opacity-60">{label}</span>
      {active ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500/50" />
      )}
    </div>
  );
}

function ServiceIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="p-3 rounded-2xl bg-secondary/50 border border-border/50 text-foreground/70 hover:text-primary transition-colors cursor-help">
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent sideOffset={8} align="center" className="rounded-xl font-bold">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
