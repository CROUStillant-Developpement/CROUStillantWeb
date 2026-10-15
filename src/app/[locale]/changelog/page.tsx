import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import ChangelogPage from "@/components/changelog/changelog-page";
import ErrorPage from "@/components/error";
import { PageContainer, PageHeader } from "@/components/page-layout";
import { getChangelog } from "@/services/changelog-service";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ChangelogPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/changelog",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function Changelog() {
  const t = await getTranslations("ChangelogPage");
  const logs = await getChangelog();

  if (!logs.success) {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <PageContainer>
      <PageHeader title={t("title")} badge={t("description")} />

      <ChangelogPage changelogs={logs.data} />
    </PageContainer>
  );
}
