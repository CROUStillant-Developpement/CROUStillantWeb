import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ContactPage");

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
    openGraph: {
      title: t("seo.title"),
      description: t("seo.description"),
      images: { url: "/banner.png" },
      siteName: "CROUStillant",
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage"); // Access the ContactPage translations

  return (
    <div className="flex flex-col items-center justify-center md:px-4 py-10">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-center md:text-2xl text-xl font-bold text-wrap">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">{t("description")}</p>
          <div className="space-y-4">
            <Button asChild variant="default" className="w-full">
              <Link href="mailto:croustillant@bayfield.dev">
                {t("methods.email")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="fit">
              <Link
                href="https://github.com/CROUStillant-Developpement/CROUStillantWeb/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wrap text-center"
              >
                {t("methods.github")}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <a
                href="https://discord.gg/yG6FjqbWtk"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("methods.discord")}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 text-center text-sm text-gray-500">
        {t("footer")}
      </div>
    </div>
  );
}
