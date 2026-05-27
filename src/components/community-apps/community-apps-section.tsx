"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ExternalLink, Smartphone, Plus } from "lucide-react";
import { FaGithub, FaAndroid, FaApple, FaGlobe } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useUmami } from "next-umami";
import { COMMUNITY_APPS, type CommunityApp, type Platform } from "@/data/community-apps";

function PlatformBadge({ platform }: { platform: Platform }) {
  const t = useTranslations("CommunityApps");
  const config: Record<Platform, { icon: React.ElementType; className: string }> = {
    android: { icon: FaAndroid, className: "text-green-500 bg-green-500/10 border-green-500/20" },
    ios: { icon: FaApple, className: "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20" },
    web: { icon: FaGlobe, className: "text-primary bg-primary/10 border-primary/20" },
  };
  const { icon: Icon, className } = config[platform];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}>
      <Icon className="h-3 w-3" />
      {t(`platforms.${platform}`)}
    </span>
  );
}

function AppCarousel({ screenshots, name }: { screenshots: string[]; name: string }) {
  const [current, setCurrent] = useState(0);

  if (screenshots.length === 0) {
    return (
      <div className="mt-4 flex items-center justify-center h-48 rounded-2xl bg-muted/30 border border-border/20">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <Smartphone className="h-10 w-10" />
        </div>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + screenshots.length) % screenshots.length);
  const next = () => setCurrent((c) => (c + 1) % screenshots.length);

  return (
    <div className="mt-4 flex flex-col items-center gap-3">
      <div className="relative w-full flex items-center justify-center gap-3">
        {screenshots.length > 1 && (
          <button
            onClick={prev}
            className="p-1.5 rounded-xl bg-background/80 border border-border/30 hover:bg-background hover:border-primary/30 transition-all shrink-0"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        <div className="relative h-72 w-36 rounded-2xl overflow-hidden border border-border/20 shadow-lg shrink-0">
          <Image
            src={screenshots[current]}
            alt={`${name} screenshot ${current + 1}`}
            fill
            className="object-cover"
          />
        </div>
        {screenshots.length > 1 && (
          <button
            onClick={next}
            className="p-1.5 rounded-xl bg-background/80 border border-border/30 hover:bg-background hover:border-primary/30 transition-all shrink-0"
            aria-label="Next screenshot"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      {screenshots.length > 1 && (
        <div className="flex gap-1.5">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-4 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommunityAppCard({ app }: { app: CommunityApp }) {
  const t = useTranslations("CommunityApps");
  const umami = useUmami();
  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl bg-background/50 border border-border/20 hover:bg-background hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-primary/10 shrink-0">
            <FaGithub className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold truncate">{t(`apps.${app.key}.name`)}</span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
          <Star className="h-3 w-3" />
          {t("badge")}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{t(`apps.${app.key}.description`)}</p>

      <div className="flex flex-wrap items-center gap-2">
        {app.platforms.map((p) => (
          <PlatformBadge key={p} platform={p} />
        ))}
        <span className="ml-auto text-xs text-muted-foreground font-medium">{t(`apps.${app.key}.author`)}</span>
      </div>

      <AppCarousel screenshots={app.screenshots} name={t(`apps.${app.key}.name`)} />

      <a href={app.github} target="_blank" rel="noopener noreferrer" className="mt-auto" onClick={() => umami.event("CommunityApps.OpenApp", { app: app.key })}>
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl font-bold hover:bg-primary/5 hover:border-primary/50 group transition-all"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          {t("githubButton")}
          <ExternalLink className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </a>
    </div>
  );
}

function SubmitAppCard() {
  const t = useTranslations("CommunityApps");
  const umami = useUmami();
  return (
    <Link
      href="/contact"
      onClick={() => umami.event("CommunityApps.SubmitApp")}
      className="group flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border-2 border-dashed border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-center min-h-[180px]"
    >
      <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 transition-transform group-hover:scale-110">
        <Plus className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-bold text-foreground">{t("cta.title")}</span>
        <span className="text-sm text-muted-foreground leading-relaxed">{t("cta.description")}</span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-70 group-hover:opacity-100 transition-opacity">
        {t("cta.button")}
        <ExternalLink className="h-3 w-3" />
      </span>
    </Link>
  );
}

export default function CommunityAppsSection({ platform }: { platform?: Platform } = {}) {
  const t = useTranslations("CommunityApps");

  const apps = platform
    ? COMMUNITY_APPS.filter((app) => app.platforms.includes(platform))
    : COMMUNITY_APPS;

  if (apps.length === 0) return null;

  return (
    <div className="p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-xs shrink-0">
          <Star className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground wrap-break-word">
          {t("title")}
        </h2>
      </div>
      <p className="text-lg text-muted-foreground mb-8">
        {t("description")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app) => (
          <CommunityAppCard key={app.key} app={app} />
        ))}
        <SubmitAppCard />
      </div>
    </div>
  );
}
