import { getChangelog } from "@/services/changelog-service";
import { Metadata } from "next";
import ChangelogPage from "@/components/changelog/changelog-page";
import { getTranslations } from "next-intl/server";
import ErrorPage from "@/components/error";

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

  if (!logs.success) {
    return <ErrorPage statusCode={500} />;
  }

  return <ChangelogPage changelogs={logs.data} />;
}
