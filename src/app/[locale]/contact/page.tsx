import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ContactMethods } from "@/components/contact-methods";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ContactPage");

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

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <div className="flex flex-col items-center justify-center md:px-4 py-10">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-center md:text-2xl text-xl font-bold text-wrap">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactMethods />
        </CardContent>
      </Card>
      <div className="mt-6 text-center text-sm text-gray-500">
        {t("footer")}
      </div>
    </div>
  );
}
