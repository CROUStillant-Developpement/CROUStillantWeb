import SettingsPage from "@/components/settings/settings-page";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/settings",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    // Purely personal preferences, identical for every visitor and absent from
    // the sitemap: nothing to index, but its links are still worth following.
    robots: { index: false, follow: true },
  });
}

export default function Settings() {
  return <SettingsPage />;
}
