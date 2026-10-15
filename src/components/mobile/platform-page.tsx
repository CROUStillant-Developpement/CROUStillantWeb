"use client";

import { Smartphone, ArrowRight, CheckIcon, TabletSmartphone } from "lucide-react";
import { FaAndroid, FaApple, FaGooglePlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import CommunityAppsSection from "@/components/community-apps/community-apps-section";
import { PageContainer, PageHeader } from "@/components/page-layout";

const ANDROID_URL = "https://play.google.com/apps/testing/com.audric.CroustillantApp";
const IOS_URL = "https://apps.apple.com/fr/app/croustillantapp/id6754869187";

export default function PlatformPage({ platform }: { platform: "android" | "ios" }) {
  const t = useTranslations("MobilePage");
  const isAndroid = platform === "android";
  const storeUrl = isAndroid ? ANDROID_URL : IOS_URL;

  const features = [
    t("features.feature1.title"),
    t("features.feature2.title"),
    t("features.feature3.title"),
    t("features.feature4.title"),
  ];

  return (
    <PageContainer>
      <PageHeader
        title={isAndroid ? t("platforms.android.pageTitle") : t("platforms.ios.pageTitle")}
        badge={
          <>
            {isAndroid ? <FaAndroid className="h-3.5 w-3.5" /> : <FaApple className="h-3.5 w-3.5" />}
            {isAndroid ? t("platforms.android.title") : t("platforms.ios.title")}
          </>
        }
        description={isAndroid ? t("platforms.android.pageDescription") : t("platforms.ios.pageDescription")}
        icon={Smartphone}
        actions={
          <>
            <Button asChild size="lg" className="rounded-2xl px-8 font-black shadow-lg shadow-primary/20">
              <Link href={storeUrl} target="_blank" rel="noopener noreferrer">
                {isAndroid ? <FaGooglePlay className="h-5 w-5" /> : <FaApple className="h-5 w-5" />}
                {isAndroid ? t("platforms.android.cta") : t("platforms.ios.cta")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-2xl font-bold text-muted-foreground hover:text-foreground">
              <Link href="/mobile">
                <TabletSmartphone className="h-4 w-4" />
                {t("backMobile")}
              </Link>
            </Button>
          </>
        }
      />

      <div className="space-y-12">
        {/* Feature checklist */}
        <div className="p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/20 hover:bg-background transition-all">
                <CheckIcon className="h-7 w-7 flex-none rounded-full bg-green-500 p-1 text-black dark:bg-green-400" />
                <p className="font-medium text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-platform CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {isAndroid ? t("platforms.ios.title") : t("platforms.android.title")}
            </h2>
            <p className="text-muted-foreground">
              {isAndroid ? t("platforms.ios.description") : t("platforms.android.description")}
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0 rounded-2xl px-8 font-bold group/cta">
            <Link href={isAndroid ? "/mobile/ios" : "/mobile/android"}>
              {isAndroid ? <FaApple className="h-4 w-4" /> : <FaAndroid className="h-4 w-4" />}
              {isAndroid ? t("platforms.ios.cta") : t("platforms.android.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Community Apps filtered by platform */}
        <CommunityAppsSection platform={platform} />
      </div>
    </PageContainer>
  );
}
