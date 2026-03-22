"use client";

import {
  Clock,
  CreditCard,
  ForkKnifeCrossed,
  MapPin,
  HeartHandshakeIcon,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import HomeCard from "./home-card";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";

interface CardProps {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  style?: string;
  children: React.ReactNode;
}

const BasicCard = ({
  title,
  description,
  cta,
  ctaLink,
  children,
}: CardProps) => {
  const umami = useUmami();

  return (
    <div className="group relative flex items-center min-h-[180px] w-full overflow-hidden rounded-3xl bg-secondary/30 border border-border/50 p-6 transition-all hover:bg-secondary/50 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex flex-col w-full max-w-[75%] gap-4 relative z-10 font-bold">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed font-medium">
            {description}
          </p>
        </div>
        <Link
          href={`/${ctaLink}`}
          className="text-sm font-bold underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all flex items-center gap-2 group/link"
          onClick={() => {
            umami.event("Home.About");
          }}
        >
          {cta}
          <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
      <div className="absolute -right-8 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
        {children}
      </div>
    </div>
  );
};

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="w-full space-y-24 md:space-y-32">
      <section id="info" className="scroll-mt-32">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
            {t("title.second")}
          </h2>
          <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BasicCard
            title={t("card1.title")}
            description={t("card1.description")}
            cta={t("card1.cta")}
            ctaLink="about"
          >
            <MapPin size={180} className="text-primary" />
          </BasicCard>
          <BasicCard
            title={t("card2.title")}
            description={t("card2.description")}
            cta={t("card2.cta")}
            ctaLink="about"
          >
            <Clock size={180} className="text-primary" />
          </BasicCard>
          <BasicCard
            title={t("card3.title")}
            description={t("card3.description")}
            cta={t("card3.cta")}
            ctaLink="about"
          >
            <CreditCard size={180} className="text-primary" />
          </BasicCard>
          <BasicCard
            title={t("card4.title")}
            description={t("card4.description")}
            cta={t("card4.cta")}
            ctaLink="about"
          >
            <ForkKnifeCrossed size={180} className="text-primary" />
          </BasicCard>
        </div>
      </section>

      <section id="team" className="scroll-mt-32">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
            {t("title.third")}
          </h2>
          <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <HomeCard />
        </div>
      </section>

      <section className="">
        <div className="relative overflow-hidden rounded-[3rem] bg-secondary/30 border border-border/50 p-10 sm:p-20 transition-all hover:bg-secondary/40 shadow-xl">
          <div className="relative z-10 flex flex-col items-center text-center gap-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform" />
              <div className="relative p-8 rounded-[2.5rem] bg-primary shadow-2xl shadow-primary/40 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <HeartHandshakeIcon className="text-white h-16 w-16" />
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <h3 className="text-4xl md:text-6xl font-black tracking-tight text-foreground italic underline decoration-primary decoration-8 underline-offset-4">
                {t("footer.title")}
              </h3>
              <p className="text-xl text-muted-foreground font-medium">
                {t("footer.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/restaurants"
                className="flex items-center hover:scale-105 transition-transform duration-300 ease-out text-sm md:text-base rounded-2xl bg-primary shadow-lg shadow-primary/25 py-4 px-8 text-white font-black group"
              >
                {t("cta.first")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Decorative blurs */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
