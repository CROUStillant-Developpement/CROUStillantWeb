import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import DishPage from "@/components/dishes/dish-page";
import ErrorPage from "@/components/error";
import { PageContainer, PageHeader } from "@/components/page-layout";
import { buildDishSlug, extractDishId } from "@/lib/dish-slug";
import { buildPageMetadata } from "@/lib/metadata";
import { getCanonicalDish, getCanonicalDishStats } from "@/services/dish-service";

async function fetchDish(slug: string) {
  const id = extractDishId(slug);
  if (id === null) return null;
  const result = await getCanonicalDish(id);
  return result.success ? result.data : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dish = await fetchDish(slug);
  const t = await getTranslations("DishPage");
  const locale = await getLocale();

  if (!dish) {
    return {
      title: t("seo.notFound"),
      robots: { index: false, follow: false },
    };
  }

  return buildPageMetadata({
    locale,
    path: `/dishes/${buildDishSlug(dish)}`,
    title: t("seo.title", { name: dish.libelle }),
    description: t("seo.description", { name: dish.libelle }),
    keywords: t("seo.keywords", { name: dish.libelle }),
  });
}

export default async function Dish({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const dish = await fetchDish(slug);
  if (!dish) notFound();

  const canonicalSlug = buildDishSlug(dish);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/${locale}/dishes/${canonicalSlug}`);
  }

  const stats = await getCanonicalDishStats(dish.code);
  if (!stats.success) {
    return <ErrorPage statusCode={500} />;
  }

  const t = await getTranslations("DishPage");

  return (
    <PageContainer>
      <PageHeader title={dish.libelle} badge={t("badge")} />
      <DishPage dish={dish} stats={stats.data} />
    </PageContainer>
  );
}
