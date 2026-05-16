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
} from "lucide-react";
import { FaAndroid, FaApple } from "react-icons/fa";
import { useTranslations } from "next-intl";
import HomeCard from "./home-card";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";
import { motion } from "@/lib/motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface CardProps {
  title: string;
  description: string;
  cta: string;
  ctaLink: string;
  eventName?: string;
  style?: string;
  children: React.ReactNode;
}

const BasicCard = ({
  title,
  description,
  cta,
  ctaLink,
  eventName = "Home.About",
  children,
}: CardProps) => {
  const umami = useUmami();

  return (
    <div className="relative flex items-center min-h-[180px] w-full overflow-hidden rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs p-6">
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
            umami.event(eventName);
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
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
            {t("title.second")}
          </h2>
          <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div variants={fadeUp}>
            <BasicCard
              title={t("card1.title")}
              description={t("card1.description")}
              cta={t("card1.cta")}
              ctaLink="about"
            >
              <MapPin size={180} className="text-primary" />
            </BasicCard>
          </motion.div>
          <motion.div variants={fadeUp}>
            <BasicCard
              title={t("card2.title")}
              description={t("card2.description")}
              cta={t("card2.cta")}
              ctaLink="about"
            >
              <Clock size={180} className="text-primary" />
            </BasicCard>
          </motion.div>
          <motion.div variants={fadeUp}>
            <BasicCard
              title={t("card3.title")}
              description={t("card3.description")}
              cta={t("card3.cta")}
              ctaLink="about"
            >
              <CreditCard size={180} className="text-primary" />
            </BasicCard>
          </motion.div>
          <motion.div variants={fadeUp}>
            <BasicCard
              title={t("card4.title")}
              description={t("card4.description")}
              cta={t("card4.cta")}
              ctaLink="about"
            >
              <ForkKnifeCrossed size={180} className="text-primary" />
            </BasicCard>
          </motion.div>

          {/* Widget builder — full width */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <BasicCard
              title={t("cardWidget.title")}
              description={t("cardWidget.description")}
              cta={t("cardWidget.cta")}
              ctaLink="iframe-builder"
              eventName="Home.Widget"
            >
              <LayoutTemplate size={180} className="text-primary" />
            </BasicCard>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className=""
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
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
            {t("title.third")}
          </h2>
          <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <HomeCard />
        </motion.div>
      </section>

      <motion.section
        className=""
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
