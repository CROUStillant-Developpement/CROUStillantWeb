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
    <div className="space-y-12">
      <Alert className="rounded-2xl border-primary/20 bg-primary/5 p-6 border-l-4 border-l-primary">
        <Drill className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-bold ml-2">
          {t("buildInProgress")} 🚧
        </AlertTitle>
        <AlertDescription className="text-muted-foreground ml-2">
          {t("buildInProgressDescription")}
        </AlertDescription>
      </Alert>

      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-md -mx-4 px-4 overflow-x-auto">
        <div className="flex justify-center gap-3">
          {Object.keys(changelogs).reverse().map((key) => (
            <Button asChild variant="outline" key={key} className="rounded-full px-6 border-primary/10 hover:bg-primary/5 hover:text-primary transition-all">
              <Link href={`#${key}`}>
                {key}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-20">
        {Object.keys(changelogs).reverse().map((key) => (
          <div key={key} id={key} className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-black text-4xl text-primary/20 tracking-tighter uppercase">{key}</h2>
              <Separator className="flex-1 opacity-20" />
            </div>
            <div className="grid gap-2">
              {changelogs[key].map((item, index) => {
                return (
                  <ChangelogItem
                    key={index}
                    date={new Date(item.date).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
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
          </div>
        ))}
      </div>
    </div>
  );
}
