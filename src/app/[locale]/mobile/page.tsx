import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import MobilePage from "@/components/mobile/mobile-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MobilePage");

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

export default async function Mobile() {
  return <MobilePage />;
}
