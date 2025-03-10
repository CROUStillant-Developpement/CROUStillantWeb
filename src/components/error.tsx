"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { FishOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorPageProps {
  statusCode: number;
}

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  const t = useTranslations("ErrorPage");

  const titles = Object.values(t.raw(statusCode.toString() + ".titles")) as string[];

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 md:px-6 h-80svh">
      <FishOff className="h-20 w-20 text-gray-500 dark:text-gray-400" />
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
        {titles[Math.floor(Math.random() * titles.length)].toString()}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
        {t(statusCode.toString() + ".description")}
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Button asChild>
          <Link href="/">{t(statusCode.toString() + ".cta")}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">{t(statusCode.toString() + ".report")}</Link>
        </Button>
      </div>
    </div>
  );
}
