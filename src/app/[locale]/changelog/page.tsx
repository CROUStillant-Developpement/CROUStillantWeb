import { getChangelog } from "@/services/changelog-service";
import { Metadata } from "next";
import ChangelogPage from "./changelog-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ChangelogPage");

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function Changelog() {
  const logs = await getChangelog();
  return <ChangelogPage changelogs={logs.success ? logs.data : {}} />;
}
