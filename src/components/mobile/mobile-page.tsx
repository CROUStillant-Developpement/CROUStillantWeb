"use client";

import { Smartphone, Zap, Heart, Search, Gift, ArrowRight } from "lucide-react";
import { FaAndroid, FaApple, FaGooglePlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import CommunityAppsSection from "@/components/community-apps/community-apps-section";
import { PageContainer, PageHeader } from "@/components/page-layout";

export default function MobilePage() {
  const t = useTranslations("MobilePage");

  const features = [
    { title: t("features.feature1.title"), description: t("features.feature1.description"), Icon: Zap },
    { title: t("features.feature2.title"), description: t("features.feature2.description"), Icon: Heart },
    { title: t("features.feature3.title"), description: t("features.feature3.description"), Icon: Search },
    { title: t("features.feature4.title"), description: t("features.feature4.description"), Icon: Gift },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={t("hero.title")}
        badge={
          <>
            <Smartphone className="w-3.5 h-3.5" />
            {t("hero.badge")}
          </>
        }
        description={t("hero.description")}
        icon={Smartphone}
        actions={
          <>
            <Button asChild size="lg" className="rounded-2xl px-8 font-black shadow-lg shadow-primary/20">
              <Link href="/mobile/android">
                <FaAndroid className="h-5 w-5" />
                {t("hero.androidCta")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-2xl px-8 font-bold">
              <Link href="/mobile/ios">
                <FaApple className="h-5 w-5" />
                {t("hero.iosCta")}
              </Link>
            </Button>
          </>
        }
      />

      <div className="space-y-12">
        {/* Platform Cards */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
            {t("platforms.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Android */}
            <div className="flex flex-col p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20 shadow-xs shrink-0">
                  <FaAndroid className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <h3 className="text-xl font-bold text-foreground">{t("platforms.android.title")}</h3>
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20 shrink-0">
                    {t("platforms.android.badge")}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">{t("platforms.android.description")}</p>
              <Button asChild size="lg" variant="outline" className="w-full rounded-2xl px-8 font-bold group/cta">
                <Link href="/mobile/android">
                  <FaGooglePlay className="h-4 w-4" />
                  {t("platforms.android.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* iOS */}
            <div className="flex flex-col p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-xs shrink-0">
                  <FaApple className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <h3 className="text-xl font-bold text-foreground">{t("platforms.ios.title")}</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20 shrink-0">
                    {t("platforms.ios.badge")}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">{t("platforms.ios.description")}</p>
              <Button asChild size="lg" variant="outline" className="w-full rounded-2xl px-8 font-bold group/cta">
                <Link href="/mobile/ios">
                  <FaApple className="h-4 w-4" />
                  {t("platforms.ios.cta")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">{t("features.description")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ title, description, Icon }, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-border/20 hover:bg-background transition-all group">
                <div className="p-2.5 rounded-xl bg-primary/10 shrink-0 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Apps */}
        <CommunityAppsSection />
      </div>
    </PageContainer>
  );
}
