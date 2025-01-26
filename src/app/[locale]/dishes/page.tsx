import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";;
import { CodeXml, Drill } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DishesPage");

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function Dishes() {
  const t = await getTranslations("DishesPage");

  return (
    <div className="space-y-6 mt-6 lg:mt-12">
      <Alert>
        <Drill className="h-4 w-4" />
        <AlertTitle>{t("buildInProgress")} 🚧</AlertTitle>
        <AlertDescription>{t("buildInProgressDescription")}</AlertDescription>
      </Alert>
      <Alert variant="info">
        <CodeXml className="h-4 w-4" />
        <AlertTitle>{t("helpUs")}</AlertTitle>
        <AlertDescription>{t("helpUsDescription")}</AlertDescription>
      </Alert>
    </div>
  );
}
