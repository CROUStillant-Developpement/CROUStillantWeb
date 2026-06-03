import { getTranslations, getLocale } from "next-intl/server";
import { Metadata } from "next";
import AboutPage from "@/components/about/about-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AboutPage");
  const locale = await getLocale();

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        fr: "/fr/about",
        en: "/en/about",
      },
    },
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
      siteName: "CROUStillant",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: process.env.WEB_URL + "/banner.png" },
    },
  };
}

export default async function About() {
  return <AboutPage />;
}
