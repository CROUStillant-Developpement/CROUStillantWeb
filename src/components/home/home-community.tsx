"use client";

import { useTranslations } from "next-intl";
import { Code2, GraduationCap, Users, type LucideIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useUmami } from "next-umami";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/page-layout";
import { HomeCta, HomeGlow, HomeIconBadge, fadeUp, homeCardClassName } from "./home-ui";

const GITHUB_URL = "https://github.com/CROUStillant-Developpement";
const API_URL = "https://api.croustillant.menu";
const DISCORD_URL = "https://discord.gg/yG6FjqbWtk";

const MEMBERS = [
  "Paul Bayfield",
  "Alden Cherif",
  "Lucas Debeve",
  "Louis Descotes",
  "Audric Fullhardt",
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

/**
 * The "join the team" cards of the home page. Rendered as direct children of
 * the parent's staggered grid.
 */
export default function HomeCommunity() {
  const t = useTranslations("HomeCard");
  const tHome = useTranslations("HomePage");
  const umami = useUmami();

  return (
    <>
      <CommunityCard
        Icon={GraduationCap}
        tilt="right"
        title={t("RadarsCard.title")}
        description={t("RadarsCard.subtitle")}
        cta={t("RadarsCard.cta")}
        href={GITHUB_URL}
        onClick={() => umami.event("Home.Contribute.GitHub")}
      >
        <Pill>
          <FaGithub className="h-3.5 w-3.5" />
          {tHome("badge.title")}
        </Pill>
      </CommunityCard>

      <CommunityCard
        Icon={Users}
        tilt="left"
        title={t("GitCard.title")}
        description={t("GitCard.subtitle")}
        cta={t("GitCard.cta")}
        href={DISCORD_URL}
        onClick={() => umami.event("Home.Join.Discord")}
      >
        <ul className="flex flex-wrap justify-center gap-2" aria-label={t("GitCard.Card.name")}>
          {MEMBERS.map((name) => (
            <li
              key={name}
              className="inline-flex items-center gap-2 rounded-full bg-background/50 border border-primary/10 py-1 pl-1 pr-3 text-sm font-bold"
            >
              <span
                className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-black text-primary-foreground"
                aria-hidden="true"
              >
                {initials(name)}
              </span>
              {name}
            </li>
          ))}
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => umami.event("Home.Join.GitHub")}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 py-1 pl-1 pr-3 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
            >
              <span
                className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                aria-hidden="true"
              >
                <FaGithub className="h-4 w-4" />
              </span>
              + {t("GitCard.Card.contributors")}
            </a>
          </li>
        </ul>
      </CommunityCard>

      <CommunityCard
        Icon={Code2}
        tilt="right"
        title={t("ApiCard.title")}
        description={t("ApiCard.subtitle")}
        cta={t("ApiCard.cta")}
        href={API_URL}
        onClick={() => umami.event("Home.API")}
      >
        <div className="w-full rounded-2xl bg-background/50 border border-primary/10 px-4 py-3 space-y-1">
          <p className="flex items-center justify-center gap-3 text-sm font-bold text-foreground">
            <span className="relative flex items-center justify-center size-3" aria-hidden="true">
              <span className="absolute size-2 rounded-full bg-green-500" />
              <span className="absolute size-3 rounded-full bg-green-500 animate-scan" />
            </span>
            {t("ApiCard.Card.subtitle")}
          </p>
          <p className="font-mono text-sm text-muted-foreground break-all">{API_URL}</p>
        </div>
      </CommunityCard>
    </>
  );
}

function CommunityCard({
  Icon,
  tilt,
  title,
  description,
  cta,
  href,
  onClick,
  children,
}: {
  Icon: LucideIcon;
  tilt: "left" | "right";
  title: string;
  description: string;
  cta: string;
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} className={cn(homeCardClassName, "h-full p-8")}>
      <div className="relative z-10 flex flex-col items-center text-center gap-6 h-full">
        <HomeIconBadge Icon={Icon} tilt={tilt} />
        <div className="space-y-3">
          <h3 className="text-2xl font-black tracking-tight text-foreground wrap-break-word">
            {title}
          </h3>
          <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
        </div>
        {children}
        <div className="mt-auto">
          <HomeCta href={href} variant="secondary" target="_blank" rel="noopener noreferrer" onClick={onClick}>
            {cta}
          </HomeCta>
        </div>
      </div>
      <HomeGlow />
    </motion.div>
  );
}
