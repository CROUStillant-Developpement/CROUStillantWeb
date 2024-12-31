import SettingsPage from "@/components/settings/settings-page";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsPage");

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: ["/banner.png"],
      siteName: "CROUStillant",
    },
  };
}

export default function Settings() {
  return <SettingsPage />;
}
