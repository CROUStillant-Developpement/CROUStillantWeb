"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations, useLocale } from "next-intl";

import { Drill } from "lucide-react";
import ChangelogItem from "./changelog-item";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Changelog } from "@/services/types";

interface ChangelogPageProps {
  changelogs: Changelog;
}

export default function ChangelogPage({ changelogs }: ChangelogPageProps) {
  const t = useTranslations("ChangelogPage");

  const locale = useLocale();

  return (
    <div>
      <h1 className="font-bold text-3xl mb-4">Changelog</h1>
      <Alert className="mb-6">
        <Drill className="h-4 w-4" />
        <AlertTitle>{t("buildInProgress")} 🚧</AlertTitle>
        <AlertDescription>{t("buildInProgressDescription")}</AlertDescription>
      </Alert>
      <div className="my-6">
        <div className="flex justify-evenly mb-6">
          {Object.keys(changelogs).map((key) => (
            <Button asChild variant="outline" key={key}>
              <Link key={key} href={`#${key}`}>
                {key}
              </Link>
            </Button>
          ))}
        </div>
        {Object.keys(changelogs).map((key) => (
          <div key={key} id={key}>
            <Separator />
            <h1 className="font-bold text-2xl my-4">{key}</h1>
            {changelogs[key].map((item, index) => {
              return (
                <ChangelogItem
                  key={index}
                  date={new Date(item.date).toLocaleDateString(locale)}
                  version={item.version}
                  shortDescription={
                    locale === "en"
                      ? item.en.shortDescription
                      : item.fr.shortDescription
                  }
                  fullDescription={
                    locale === "en"
                      ? item.en.fullDescription
                      : item.fr.fullDescription
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
