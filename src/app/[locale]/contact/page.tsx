import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { ContactMethods } from "@/components/contact-methods";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/page-layout";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ContactPage");
  const locale = await getLocale();

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("seo.title"),
    description: t("seo.description"),
    keywords: t("seo.keywords"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <PageContainer>
      <PageHeader title={t("title")} badge={t("description")} />

      <div className="flex flex-col items-center justify-center">
        <Card className="w-full overflow-hidden p-4 sm:p-8 lg:p-12 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
          <CardContent className="p-0">
            <ContactMethods />
          </CardContent>
        </Card>
        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
          {t("footer")}
        </div>
      </div>
    </PageContainer>
  );
}
