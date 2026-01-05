"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContactMethods() {
  const t = useTranslations("ContactPage");
  const [reason, setReason] = useState<string | null>(null);

  const isSiteIssue = reason === "site" || reason === "other";

  return (
    <div className="space-y-4">
      <Select onValueChange={setReason}>
        <SelectTrigger>
          <SelectValue placeholder={t("select.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="site">{t("select.site")}</SelectItem>
          <SelectItem value="crous">{t("select.crous")}</SelectItem>
          <SelectItem value="other">{t("select.other")}</SelectItem>
        </SelectContent>
      </Select>

      {reason && (reason === "crous" || reason === "other") && (
        <p className="text-sm text-red-600 text-center font-semibold">
          {t("notOfficial")}
        </p>
      )}

      {isSiteIssue && (
        <>
          <p className="text-center text-gray-600 mb-6">
            {t("description")}
          </p>

          <Button asChild className="w-full">
            <Link href="mailto:croustillant@bayfield.dev">
              {t("methods.email")}
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link
              href="https://github.com/CROUStillant-Developpement/CROUStillantWeb/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("methods.github")}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <a
              href="https://discord.gg/yG6FjqbWtk"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("methods.discord")}
            </a>
          </Button>
        </>
      )}
    </div>
  );
}
