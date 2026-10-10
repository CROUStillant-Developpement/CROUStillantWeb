"use client";

import { useTranslations, useLocale } from "next-intl";

import { ArrowUpRight, Globe, Library, Settings, LucideIcon } from "lucide-react";
import ChangelogItem from "./changelog-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Changelog } from "@/services/types";
import {
  CHANGELOG_CATEGORIES,
  CHANGELOG_SERVICES,
  ChangelogServiceCategory,
} from "@/data/changelog-services";

interface ChangelogPageProps {
  changelogs: Changelog;
}

const GITHUB_ORGANISATION_URL = "https://github.com/CROUStillant-Developpement";

const CATEGORY_ICONS: Record<ChangelogServiceCategory, LucideIcon> = {
  public: Globe,
  internal: Settings,
  libraries: Library,
};

export default function ChangelogPage({ changelogs }: ChangelogPageProps) {
  const t = useTranslations("ChangelogPage");

  const locale = useLocale();

  // Formatted in UTC so the server render and the hydration agree whatever
  // the visitor's time zone.
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="space-y-16">
      {CHANGELOG_CATEGORIES.map((category) => {
        const CategoryIcon = CATEGORY_ICONS[category];

        // A service is absent from the changelog when its repository could
        // not be read (private, or GitHub unreachable): its card is hidden.
        const services = CHANGELOG_SERVICES.filter(
          (service) => service.category === category && service.name in changelogs
        );
        if (services.length === 0) return null;

        return (
          <section key={category} id={category} className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                <CategoryIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-black text-xl sm:text-3xl tracking-tight wrap-break-word">
                {t(`categories.${category}`)}
              </h2>
              <Separator className="flex-1 opacity-20" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {services.map((service) => {
                const entries = changelogs[service.name];

                return (
                  <Card
                    key={service.name}
                    id={service.name}
                    className="rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:border-primary/20 transition-all duration-300 shadow-xs flex flex-col scroll-mt-32"
                  >
                    <CardHeader className="bg-muted/30 border-b border-primary/5 p-4 sm:p-6 rounded-t-2xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg sm:text-xl font-black tracking-tight text-primary wrap-break-word">
                          {service.name}
                        </CardTitle>
                        <a
                          href={`${GITHUB_ORGANISATION_URL}/${service.name}/commits`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 shrink-0 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                        >
                          {t("viewAll")}
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(`services.${service.name}`)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 text-primary bg-primary/10 rounded-full"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 flex-1">
                      {entries.length > 0 ? (
                        <ul className="space-y-1">
                          {entries.map((entry) => (
                            <ChangelogItem
                              key={entry.sha}
                              entry={entry}
                              date={formatDate(entry.date)}
                              typeLabel={t(`types.${entry.type}`)}
                            />
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("noUpdates")}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
