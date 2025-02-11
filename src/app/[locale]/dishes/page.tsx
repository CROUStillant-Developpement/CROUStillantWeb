import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLast100Dishes, getTop100Dishes } from "@/services/stats-services";
import ErrorPage from "@/components/error";
import DishesPage from "@/components/dishies/dishies-page";

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

  const top100Dishes = await getTop100Dishes();
  const last100Dishes = await getLast100Dishes();

  if (!top100Dishes.success || !last100Dishes.success) {
    return <ErrorPage statusCode={500} />;
  }

  return (
    <>
      <div>
        <h1 className="font-bold text-3xl">{t("title")}</h1>
        <p className="opacity-50">{t("description")}</p>
      </div>
      <DishesPage
        top100Dishes={top100Dishes.data}
        last100Dishes={last100Dishes.data}
      />
    </>
  );
}
