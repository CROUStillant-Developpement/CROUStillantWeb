"use client";

import Image from "next/image";
import {
  CheckIcon,
  HeartHandshake,
  ExternalLinkIcon,
  GraduationCap,
  FileCode2,
  Soup,
  CookingPot,
  Bot,
  Globe,
  Code,
  Database,
  FileTerminal,
  ChevronsLeftRightEllipsis,
  Smartphone,
  GithubIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

function Checkmark() {
  return (
    <CheckIcon className="h-7 w-7 flex-none rounded-full bg-green-500 p-1 text-black dark:bg-green-400" />
  );
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <div className="w-full mt-4 px-4 overflow-x-hidden">
      {/* Header Section */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word">
            {t("seo.title")}
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
              {t("presentation.title")}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="space-y-12 mx-auto pb-20">
        {/* Presentation & Updates Card */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="flex-1 rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50">
            <div className="flex items-center gap-4 mb-6 min-w-0">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-xs shrink-0">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground wrap-break-word">
                {t("presentation.title")}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("presentation.description")}
            </p>
          </div>

          <div className="flex-1 rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50">
            <div className="flex items-center gap-4 mb-6 min-w-0">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-xs shrink-0">
                <Soup className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground wrap-break-word">
                {t("updates.title")}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("updates.description")}
            </p>
          </div>
        </div>

        {/* Open Source Card */}
        <div className="rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-xs">
              <FileCode2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground wrap-break-word">
              {t("open-source.title")}
            </h2>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            {t("open-source.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/20 transition-all hover:bg-background">
                <Checkmark />
                <p className="font-medium">{t(`open-source.features.feature${i}`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Preview Card */}
        <div className="flex flex-col xl:flex-row gap-8 items-center rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 overflow-hidden">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6 wrap-break-word">
              {t("product.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("product.description")}
            </p>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Checkmark />
                  <p className="font-medium text-foreground/90">{t(`product.features.feature${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <Image
              width={1350}
              height={900}
              src="/previews/homepage.png"
              alt="Homepage Preview"
              className="rounded-2xl object-contain shadow-2xl ring-1 ring-border/20 transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Team Section */}
        <div id="team" className="scroll-mt-32 rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50">
          <div className="flex flex-col lg:flex-row-reverse gap-12">
            <div className="flex flex-col gap-10 lg:w-1/2 justify-center">
              <div className="flex flex-col">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6 wrap-break-word">{t("team.title")}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{t("team.description")}</p>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 wrap-break-word">{t("job.title")}</h2>
                <p className="text-lg text-muted-foreground mb-8">{t("job.description")}</p>
                <Link href="https://discord.gg/yG6FjqbWtk" rel="noopener noreferrer" target="_blank">
                  <Button variant="outline" size="lg" className="rounded-2xl px-8 font-bold shadow-xs transition-all hover:bg-primary/5 hover:border-primary/50 group">
                    {t("job.button")}
                    <ExternalLinkIcon className="ml-3 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 gap-4">
              {[
                { key: "member1", icon: FileTerminal },
                { key: "member2", icon: Code },
                { key: "member3", icon: Database },
                { key: "member4", icon: ChevronsLeftRightEllipsis },
                { key: "member5", icon: Smartphone },
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-5 p-4 rounded-2xl bg-background/50 border border-border/20 hover:bg-background transition-colors group">
                  <div className="p-3 rounded-xl bg-primary/10 transition-transform group-hover:scale-110 shrink-0">
                    <member.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <a href={t(`team.members.${member.key}.github`)} className="text-base sm:text-lg font-bold hover:text-primary transition-colors underline-offset-4 hover:underline wrap-break-word">
                      {t(`team.members.${member.key}.name`)}
                      <GithubIcon className="inline-block ml-2 h-4 w-4 text-muted-foreground shrink-0" />
                    </a>
                    <p className="text-sm text-muted-foreground font-medium wrap-break-word">{t(`team.members.${member.key}.role`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources Section */}
        <div className="flex flex-col xl:flex-row gap-8 items-center rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 overflow-hidden">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6 wrap-break-word">
              {t("sources.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("sources.description")}
            </p>
            <Link href="https://www.data.gouv.fr/fr/dataservices/api-croustillant/" rel="noopener noreferrer" target="_blank">
              <Button variant="outline" size="lg" className="rounded-2xl px-8 font-bold shadow-xs transition-all hover:bg-primary/5 group">
                {t("sources.button")}
                <ExternalLinkIcon className="ml-3 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <Image
              width={1350}
              height={900}
              src="/previews/data.gouv.fr.png"
              alt="data.gouv.fr Preview"
              className="rounded-2xl object-contain shadow-2xl ring-1 ring-border/20 transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Architecture & Integrated Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="flex flex-col rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 overflow-hidden">
            <div className="flex-1 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 wrap-break-word">{t("discord.title")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("discord.description")}</p>
              <Link href="https://discord.com/oauth2/authorize?client_id=1024564077068025867" target="_blank">
                <Button size="lg" className="rounded-2xl px-8 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <Bot className="mr-3 h-5 w-5" />
                  {t("discord.button")}
                </Button>
              </Link>
            </div>
            <div className="mt-auto flex items-center justify-center">
              <Image
                width={1350}
                height={900}
                src="/previews/menu.png"
                alt="Menu Preview"
                className="rounded-2xl object-contain shadow-xl ring-1 ring-border/10"
              />
            </div>
          </div>

          <div className="flex flex-col rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 overflow-hidden">
            <div className="flex-1 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 wrap-break-word">{t("architecture.title")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("architecture.description")}</p>
            </div>
            <div className="mt-auto flex items-center justify-center">
              <Image
                width={1350}
                height={900}
                src="/previews/structure.png"
                alt="Structure Preview"
                className="rounded-2xl object-contain shadow-xl ring-1 ring-border/10"
              />
            </div>
          </div>
        </div>

        {/* API Section */}
        <div className="flex flex-col xl:flex-row-reverse gap-8 items-center rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 overflow-hidden">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6 wrap-break-word">
              {t("integrated.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("integrated.description")}
            </p>
            <Link href="https://api.croustillant.menu" target="_blank">
              <Button size="lg" className="rounded-2xl px-8 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                <Globe className="mr-3 h-5 w-5" />
                {t("integrated.button")}
              </Button>
            </Link>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <Image
              width={1350}
              height={900}
              src="/previews/api.png"
              alt="API Preview"
              className="rounded-2xl object-cover shadow-2xl ring-1 ring-border/20 transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Iframe Section */}
        <div className="rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50 overflow-hidden">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-3 wrap-break-word">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                  <FileCode2 className="h-6 w-6 text-primary" />
                </div>
                {t("integrated.iframe_title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("integrated.iframe_description")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-primary/70">{t("integrated.iframe_info_title")}</p>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/20 font-mono text-sm break-all opacity-80 select-all transition-colors group-hover:border-primary/30">
                    {"https://api.croustillant.menu/v1/restaurants/<code>/iframe"}
                  </div>
                </div>
                <div className="group space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-primary/70">{t("integrated.iframe_menu_title")}</p>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/20 font-mono text-sm break-all opacity-80 select-all transition-colors group-hover:border-primary/30">
                    {"https://api.croustillant.menu/v1/restaurants/<code>/menu/<date>/iframe"}
                  </div>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border/20 font-mono text-sm break-all opacity-80 select-all transition-colors group-hover:border-primary/30">
                    {"https://api.croustillant.menu/v1/restaurants/<code>/menu/iframe"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col h-[350px] rounded-2xl border border-border/50 bg-background overflow-hidden shadow-xs">
                <div className="px-4 py-2 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">{t("integrated.iframe_info_title")}</span>
                    <span className="text-xs font-mono text-muted-foreground">{"https://api.croustillant.menu/v1/restaurants/871/iframe"}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                    <div className="h-2 w-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <iframe
                  src="https://api.croustillant.menu/v1/restaurants/871/iframe"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col h-[350px] rounded-2xl border border-border/50 bg-background overflow-hidden shadow-xs">
                <div className="px-4 py-2 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">{t("integrated.iframe_menu_title")}</span>
                    <span className="text-xs font-mono text-muted-foreground">{"https://api.croustillant.menu/v1/restaurants/871/menu/13-03-2026/iframe"}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                    <div className="h-2 w-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <iframe
                  src="https://api.croustillant.menu/v1/restaurants/871/menu/13-03-2026/iframe"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6 wrap-break-word">
              {t("convinced.title")}
            </h3>
            <p className="text-lg text-muted-foreground mb-8">{t("convinced.description")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-2xl px-6 font-black shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                <Link href="/restaurants" prefetch={true}>
                  <CookingPot className="mr-2 h-5 w-5" />
                  {t("convinced.button")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-2xl px-6 font-bold shadow-xs border border-border/50">
                <Link href="https://discord.com/oauth2/authorize?client_id=1024564077068025867">
                  <Bot className="mr-2 h-5 w-5" />
                  {t("convinced.button2")}
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-3xl bg-secondary/30 border border-border/50 p-4 sm:p-8 transition-all hover:bg-secondary/50">
            <div className="flex items-center gap-4 mb-6 min-w-0">
              <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-xs shrink-0">
                <HeartHandshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground wrap-break-word">
                {t("more-convinced.title")}
              </h3>
            </div>
            <p className="text-lg text-muted-foreground mb-8">{t("more-convinced.description")}</p>
            <div className="relative mt-auto flex">
              <Link href="https://discord.gg/yG6FjqbWtk" rel="noopener noreferrer" target="_blank">
                <Button variant="outline" size="lg" className="rounded-2xl px-8 font-bold shadow-xs transition-all hover:bg-primary/5 group">
                  {t("more-convinced.button")}
                  <ExternalLinkIcon className="ml-3 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
