import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";
import AboutPage from "@/components/about/about-page";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AboutPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function About() {
  return <AboutPage />;
}
