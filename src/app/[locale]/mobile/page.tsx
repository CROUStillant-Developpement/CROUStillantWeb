import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";
import MobilePage from "@/components/mobile/mobile-page";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MobilePage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/mobile",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function Mobile() {
  return <MobilePage />;
}
