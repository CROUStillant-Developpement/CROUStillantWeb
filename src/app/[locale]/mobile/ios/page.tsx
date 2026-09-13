import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import PlatformPage from "@/components/mobile/platform-page";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MobilePage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/mobile/ios",
    title: t("seo.iosTitle"),
    description: t("seo.iosDescription"),
    keywords: t("seo.keywords"),
  });
}

export default async function IosPage() {
  return <PlatformPage platform="ios" />;
}
