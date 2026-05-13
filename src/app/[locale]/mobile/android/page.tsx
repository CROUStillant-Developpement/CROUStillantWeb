import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import PlatformPage from "@/components/mobile/platform-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MobilePage");

  return {
    title: t("seo.androidTitle"),
    description: t("seo.androidDescription"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.androidTitle"),
      description: t("seo.androidDescription"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function AndroidPage() {
  return <PlatformPage platform="android" />;
}
