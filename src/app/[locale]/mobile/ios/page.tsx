import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import PlatformPage from "@/components/mobile/platform-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MobilePage");

  return {
    title: t("seo.iosTitle"),
    description: t("seo.iosDescription"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.iosTitle"),
      description: t("seo.iosDescription"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function IosPage() {
  return <PlatformPage platform="ios" />;
}
