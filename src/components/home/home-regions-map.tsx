"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useIntersectionObserver } from "usehooks-ts";
import { Link } from "@/i18n/routing";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { motion } from "@/lib/motion";

const HomeRegionsMapCanvas = dynamic(() => import("./home-regions-map-canvas"), {
  ssr: false,
});

export default function HomeRegionsMap() {
  const t = useTranslations("HomePage.regionsMap");
  // The map sits well below the fold: maplibre-gl and the region boundaries
  // (about 3 MB together) are only fetched once it is about to be seen.
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: "400px",
    freezeOnceVisible: true,
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
          {t("title")}
        </h2>
        <div className="h-1.5 w-24 bg-primary rounded-full mx-auto mb-6" />
        <p className="text-lg text-muted-foreground font-medium">
          {t("description")}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[3rem] border border-primary/5 bg-card/50 hover:border-primary/20 transition-all duration-300 shadow-sm p-4 md:p-6">
        <div
          ref={ref}
          className="relative z-10 h-[420px] md:h-[560px] rounded-[2rem] overflow-hidden"
        >
          {isIntersecting && <HomeRegionsMapCanvas />}
        </div>

        <div className="relative z-10 mt-6 flex justify-center">
          <Link
            href="/restaurants"
            className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all group/link"
          >
            <MapIcon className="h-4 w-4" />
            {t("cta")}
            <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      </div>
    </motion.section>
  );
}
