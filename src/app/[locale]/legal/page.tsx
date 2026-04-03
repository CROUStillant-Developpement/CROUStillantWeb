import { Link } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LegalPage");

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

export default async function LegalPage() {
  const t = await getTranslations("LegalPage");

  const sections = [
    { id: "legal", key: "legal", parts: ["part1", "part2", "part3", "part4", "part5"] },
    { id: "privacy", key: "privacy", parts: ["part1", "part2", "part3"] },
    { id: "cookies", key: "cookies", parts: ["part1", "part2"] },
    { id: "terms", key: "terms", parts: ["part1", "part2", "part3", "part4", "part5"] },
  ];

  return (
    <div className="w-full mt-4 px-4 flex flex-col gap-8 overflow-x-hidden">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word">
            {t("title")}
          </h1>
          <div className="mt-4 text-lg text-muted-foreground flex items-center h-8">
            <span className="inline-flex font-semibold items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20">
              {t("subtitle")}
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      </div>

      <div className="mb-8 flex flex-col gap-10">
        <Card className="rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs">
          <CardContent className="p-4 sm:p-8 lg:p-12 space-y-6">
            <p className="text-muted-foreground leading-relaxed">{t("description")}</p>
            <div className="flex flex-wrap gap-3">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex items-center rounded-full bg-primary/5 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/10 hover:bg-primary/10 transition-colors"
                >
                  {t(`${section.key}.title`)}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {sections.map((section) => (
          <Card
            key={section.id}
            id={section.id}
            className="rounded-2xl border-primary/5 bg-card/50 backdrop-blur-xs hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs w-full scroll-mt-40"
          >
            <CardHeader className="bg-muted/30 border-b border-primary/5 p-4 sm:p-8 rounded-t-2xl">
              <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight text-primary wrap-break-word">
                {t(`${section.key}.title`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 lg:p-12 space-y-10">
              {section.parts.map((partKey, index) => (
                <div key={partKey} className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center gap-3 wrap-break-word">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">
                      {index + 1}
                    </span>
                    {t(`${section.key}.${partKey}.title`)}
                  </h3>
                  <div className="flex flex-col gap-3 text-muted-foreground leading-relaxed pl-0 sm:pl-11">
                    <p>{t(`${section.key}.${partKey}.content1`)}</p>
                    <p>{t(`${section.key}.${partKey}.content2`)}</p>
                  </div>
                  {index < section.parts.length - 1 && (
                    <Separator className="mt-10 opacity-50" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
