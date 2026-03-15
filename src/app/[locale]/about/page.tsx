import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import AboutPage from "@/components/about/about-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AboutPage");

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

export default async function About() {
  return <AboutPage />;
}
