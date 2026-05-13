"use client";

import { Smartphone, ArrowLeft, ArrowRight, CheckIcon, TabletSmartphone } from "lucide-react";
import { FaAndroid, FaApple, FaGooglePlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
    <div className="w-full mt-4 px-4 overflow-x-hidden">
      {/* Hero */}
      <div className={`relative mb-8 overflow-hidden rounded-2xl p-6 sm:p-10 shadow-xs border ${
        isAndroid
          ? "bg-linear-to-br from-green-500/10 via-background to-background border-green-500/10"
          : "bg-linear-to-br from-blue-500/10 via-background to-background border-blue-500/10"
      }`}>
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <div className={`p-3 rounded-2xl shadow-xs ${
              isAndroid
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-blue-500/10 border border-blue-500/20"
            }`}>
              {isAndroid
                ? <FaAndroid className="h-6 w-6 text-green-500" />
                : <FaApple className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              }
            </div>
            <span className={`inline-flex font-semibold items-center rounded-full px-4 py-1.5 text-sm ring-1 ring-inset ${
              isAndroid
                ? "bg-green-500/10 text-green-700 dark:text-green-400 ring-green-500/20"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-500/20"
            }`}>
              {isAndroid ? t("platforms.android.title") : t("platforms.ios.title")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word">
            {isAndroid ? t("platforms.android.pageTitle") : t("platforms.ios.pageTitle")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-xl">
            {isAndroid ? t("platforms.android.pageDescription") : t("platforms.ios.pageDescription")}
          </p>
          <div className="mt-8 flex flex-wrap gap-5 items-center">
            <Link href={storeUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className={`rounded-2xl px-8 font-black hover:scale-[1.02] transition-transform ${
                isAndroid
                  ? "shadow-lg shadow-green-500/20"
                  : "shadow-lg shadow-blue-500/20"
              }`}>
                {isAndroid
                  ? <FaGooglePlay className="mr-2 h-5 w-5" />
                  : <FaApple className="mr-2 h-5 w-5" />
                }
                {isAndroid ? t("platforms.android.cta") : t("platforms.ios.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mobile">
              <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-muted-foreground hover:text-foreground -ml-2 group">
                <TabletSmartphone className="h-4 w-4" />
                {t("backMobile")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative */}
        <div className={`absolute -right-10 -top-10 h-64 w-64 rounded-full blur-3xl pointer-events-none ${
          isAndroid ? "bg-green-500/10" : "bg-blue-500/10"
        }`} />
        <div className={`absolute right-40 -bottom-20 h-40 w-40 rounded-full blur-2xl pointer-events-none ${
          isAndroid ? "bg-green-500/20" : "bg-blue-500/20"
        }`} />
        <Smartphone className={`absolute right-8 bottom-4 h-48 w-48 pointer-events-none hidden sm:block ${
          isAndroid ? "text-green-500/10" : "text-blue-500/10"
        }`} />
      </div>

      <div className="space-y-12 mx-auto pb-20">
        {/* Feature checklist */}
        <div className="p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">
            {t("features.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-border/20 hover:bg-background transition-all">
                <CheckIcon className={`h-7 w-7 flex-none rounded-full p-1 text-white shrink-0 ${
                  isAndroid ? "bg-green-500" : "bg-blue-500"
                }`} />
                <p className="font-medium text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-platform CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 sm:p-8 rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-xs overflow-hidden">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-2">
              {isAndroid ? t("platforms.ios.title") : t("platforms.android.title")}
            </h3>
            <p className="text-muted-foreground">
              {isAndroid ? t("platforms.ios.description") : t("platforms.android.description")}
            </p>
          </div>
          <Link href={isAndroid ? "/mobile/ios" : "/mobile/android"} className="shrink-0">
            <Button variant="outline" size="lg" className="rounded-2xl px-6 font-bold hover:bg-primary/5 hover:border-primary/50 group">
              {isAndroid
                ? <FaApple className="mr-2 h-4 w-4" />
                : <FaAndroid className="mr-2 h-4 w-4" />
              }
              {isAndroid ? t("platforms.ios.cta") : t("platforms.android.cta")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
