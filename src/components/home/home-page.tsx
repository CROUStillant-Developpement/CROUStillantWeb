"use client";

import {
  Clock,
  CreditCard,
  ForkKnifeCrossed,
  MapPin,
  HeartHandshakeIcon,
  ArrowRight,
  Smartphone,
  LayoutTemplate,
  CalendarPlus,
  type LucideIcon,
} from "lucide-react";
import { FaAndroid, FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import HomeCommunity from "./home-community";
import HomeRegionsMap from "./home-regions-map";
import {
  HomeCta,
  HomeGlow,
  HomeIconBadge,
  HomeSectionTitle,
  fadeUp,
  homeCardClassName,
  staggerGrid,
} from "./home-ui";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FEATURES: { key: string; Icon: LucideIcon }[] = [
  { key: "card1", Icon: MapPin },
  { key: "card2", Icon: Clock },
  { key: "card3", Icon: CreditCard },
  { key: "card4", Icon: ForkKnifeCrossed },
];

const TOOLS: {
  key: string;
  Icon: LucideIcon;
  href: string;
  event: string;
  variant: "primary" | "secondary";
}[] = [
  { key: "cardCalendar", Icon: CalendarPlus, href: "/restaurants", event: "Home.Calendar", variant: "primary" },
  { key: "cardWidget", Icon: LayoutTemplate, href: "/iframe-builder", event: "Home.Widget", variant: "secondary" },
];

export default function HomePage() {
  const t = useTranslations("HomePage");
  const umami = useUmami();

  return (
    <div className="w-full space-y-24 md:space-y-32">
      <section id="info" className="scroll-mt-32">
        <HomeSectionTitle title={t("title.second")} description={t("sections.info")} />

        {/* What the site shows about each restaurant, as one block */}
        <motion.div
          className={cn(homeCardClassName, "p-8 md:p-12")}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {FEATURES.map(({ key, Icon }, index) => (
              <div key={key} className="flex flex-col items-center text-center gap-5">
                <HomeIconBadge Icon={Icon} tilt={index % 2 === 0 ? "right" : "left"} />
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight text-foreground">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <HomeGlow />
        </motion.div>

        {/* Tools built on top of the menus */}
        <motion.div
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {TOOLS.map(({ key, Icon, href, event, variant }, index) => (
            <motion.div
              key={key}
              variants={fadeUp}
              className={cn(homeCardClassName, "h-full p-8 md:p-10")}
            >
              <div className="relative z-10 flex flex-col items-center text-center gap-6 h-full">
                <HomeIconBadge Icon={Icon} size="lg" tilt={index % 2 === 0 ? "right" : "left"} />
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-4xl font-black tracking-tight text-foreground wrap-break-word">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    {t(`${key}.description`)}
                  </p>
                </div>
                <div className="mt-auto">
                  <HomeCta href={href} variant={variant} onClick={() => umami.event(event)}>
                    {t(`${key}.cta`)}
                  </HomeCta>
                </div>
              </div>
              <HomeGlow />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/about"
            className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all group/link"
            onClick={() => umami.event("Home.About")}
          >
            {t("card1.cta")}
            <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </section>

      <HomeRegionsMap />

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="relative overflow-hidden rounded-[3rem] border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-sm p-10 hover:shadow-md">
          <div className="relative z-10 flex flex-col items-center text-center gap-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform" />
              <div className="relative p-8 rounded-[2.5rem] bg-primary shadow-2xl shadow-primary/40 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Smartphone className="text-white h-16 w-16" />
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <h3 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                {t("mobile.title")}
              </h3>
              <p className="text-xl text-muted-foreground font-medium">
                {t("mobile.description")}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/mobile/android"
                  className="flex items-center gap-2 text-sm md:text-base rounded-2xl bg-primary shadow-lg shadow-primary/25 py-4 px-8 text-primary-foreground font-black group"
                >
                  <FaAndroid className="h-5 w-5" />
                  {t("mobile.androidCta")}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/mobile/ios"
                  className="flex items-center gap-2 text-sm md:text-base rounded-2xl border border-border bg-background py-4 px-8 text-foreground font-black"
                >
                  <FaApple className="h-5 w-5" />
                  {t("mobile.iosCta")}
                </Link>
              </motion.div>
            </div>

            <Link
              href="/mobile"
              className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all group/link"
            >
              {t("mobile.learnMore")}
              <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>

          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        </div>
      </motion.section>

      <section id="team" className="scroll-mt-32">
        <HomeSectionTitle title={t("title.third")} description={t("sections.team")} />

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={staggerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <HomeCommunity />
        </motion.div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="relative overflow-hidden rounded-[3rem] border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-sm p-10 hover:shadow-md">
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
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/restaurants"
                  className="flex items-center text-sm md:text-base rounded-2xl bg-primary shadow-lg shadow-primary/25 py-4 px-8 text-white font-black group"
                >
                  {t("cta.first")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        </div>
      </motion.section>
    </div>
  );
}
