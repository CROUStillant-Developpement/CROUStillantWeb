import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import RadarsCard from "./home-card-radar";
import GitCard from "./home-card-git";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";

export default function HomeCard() {
  const t = useTranslations("HomeCard");
  const umami = useUmami();

  return (
    <>
      <RadarsCard />
      <GitCard />
      <section className="md:col-span-2">
        <aside className="group flex flex-col md:flex-row w-full h-full gap-8 p-8 bg-secondary/30 rounded-4xl border border-border/50 transition-all hover:bg-secondary/40 hover:shadow-xl hover:shadow-primary/5">
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-4">
              <h3 className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                {t("ApiCard.title")}
              </h3>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                {t("ApiCard.subtitle")}
              </p>
            </div>
            <Link
              href="https://api.croustillant.menu/"
              className="text-base font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all inline-flex items-center gap-2 w-fit group/link"
              onClick={() => {
                umami.event("Home.API");
              }}
            >
              {t("ApiCard.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
          <section className="flex items-center justify-center flex-1 bg-background/50 backdrop-blur-xs border border-primary/10 rounded-2xl p-4 min-h-[160px]">
            <aside className="flex flex-col justify-between w-full h-full gap-0.5">
              <div className="flex gap-2 items-center px-4 py-2 bg-primary/5 border border-primary/10 border-b-0 rounded-t-xl">
                <p className="text-lg font-medium opacity-80">
                  {t("ApiCard.Card.title")}
                </p>
                <div className="relative flex items-center justify-center pl-1.5">
                  <div className="absolute size-2 rounded-full bg-green-500" />
                  <div className="absolute size-3 rounded-full bg-green-500 animate-scan" />
                </div>
              </div>
              <div className="px-4 py-2 bg-primary/5 border border-primary/10">
                <p className="text-sm md:text-lg font-medium">
                  https://api.croustillant.menu
                </p>
              </div>
              <div className="px-4 py-2 bg-primary/5 border border-primary/10 border-t-0 rounded-b-xl">
                <p className="text-xs md:text-base font-medium opacity-60">
                  {t("ApiCard.Card.subtitle")}
                </p>
              </div>
            </aside>
          </section>
        </aside>
      </section>
    </>
  );
}
