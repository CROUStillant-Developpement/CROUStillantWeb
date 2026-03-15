import { Card, CardContent } from "@/components/ui/card";
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
    <div className="w-full mt-4 px-4">
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-sm border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
              {t("description")}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="flex flex-col items-center justify-center py-10">
        <Card className="w-full rounded-[2.5rem] border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden p-8 sm:p-12">
          <CardContent className="p-0">
            <ContactMethods />
          </CardContent>
        </Card>
        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
          {t("footer")}
        </div>
      </div>
    </div>
  );
}
