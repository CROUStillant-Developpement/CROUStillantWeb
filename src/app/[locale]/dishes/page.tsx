import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLast100Dishes, getTop100Dishes } from "@/services/stats-services";
import ErrorPage from "@/components/error";
import DishesPage from "@/components/dishes/dishes-page";

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
    <div className="w-full mt-4 px-4 overflow-x-hidden">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word">
            {t("title")}
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
              {t("description")}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <DishesPage
        top100Dishes={top100Dishes.data}
        last100Dishes={last100Dishes.data}
      />
    </div>
  );
}
