import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getLast100Dishes, getTop100Dishes } from "@/services/stats-services";
import ErrorPage from "@/components/error";
import DishesPage from "@/components/dishes/dishes-page";
import { PageContainer, PageHeader } from "@/components/page-layout";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DishesPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/dishes",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function Dishes() {
  const t = await getTranslations("DishesPage");

  const top100Dishes = await getTop100Dishes();
  const last100Dishes = await getLast100Dishes();

  if (!top100Dishes.success || !last100Dishes.success) {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <PageContainer>
      <PageHeader title={t("title")} badge={t("description")} />

      <DishesPage
        top100Dishes={top100Dishes.data}
        last100Dishes={last100Dishes.data}
      />
    </PageContainer>
  );
}
