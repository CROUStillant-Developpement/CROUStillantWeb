"use client";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/page-layout";
import { Link } from "@/i18n/routing";
import { FishOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { useState } from "react";

interface ErrorPageProps {
  statusCode: number;
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const t = useTranslations("ErrorPage");
  const umami = useUmami();

  const titles = Object.values(
    t.raw(statusCode.toString() + ".titles")
  ) as string[];

  const [title] = useState(() => titles[Math.floor(Math.random() * titles.length)].toString());

  return (
    <div className="w-full px-4 flex items-center justify-center min-h-80svh">
      <div className="relative w-full overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-12 shadow-xs border border-primary/10">
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <FishOff className="h-12 w-12" aria-hidden="true" />
          </div>
          <Pill>{statusCode}</Pill>
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word">
            {title}
          </h1>
          <p className="max-w-md text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t(statusCode.toString() + ".description")}
          </p>
          <div className="mt-2 flex gap-3 flex-wrap justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 font-black shadow-lg shadow-primary/20"
              onClick={() => umami.event("ErrorPage.Reload")}
            >
              <Link href="/">{t(statusCode.toString() + ".cta")}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 font-bold"
              onClick={() => umami.event("ErrorPage.Report")}
            >
              <Link href="/contact">{t(statusCode.toString() + ".report")}</Link>
            </Button>
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
