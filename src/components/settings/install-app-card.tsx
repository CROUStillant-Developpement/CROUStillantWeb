"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import usePwaStore from "@/store/pwaStore";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari predates the media query and exposes this instead.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac.
    (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
}

export default function InstallAppCard() {
  const t = useTranslations("SettingsPage");
  const umami = useUmami();
  const { toast } = useToast();
  const { installPrompt, setInstallPrompt } = usePwaStore();

  // Both depend on the browser, so they are only known after hydration.
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIos());
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    umami.event("Settings.App.Install");

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    // A prompt can only be shown once.
    setInstallPrompt(null);

    if (outcome === "accepted") {
      setInstalled(true);
      toast({
        title: t("install.successTitle"),
        description: t("install.successDescription"),
      });
    }
  };

  // Only Chromium can be asked to install; elsewhere the user has to go
  // through the browser's own menu, so the card explains where to find it.
  let hint: string | null = null;
  if (installed) hint = t("install.installed");
  else if (!installPrompt) hint = ios ? t("install.iosHint") : t("install.manualHint");

  return (
    <div className="flex flex-col justify-between gap-4 h-full rounded-2xl border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 group shadow-xs p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-xs group-hover:scale-110 transition-transform">
          <Smartphone className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-lg leading-none">{t("install.title")}</p>
          <p className="text-sm text-muted-foreground">
            {t("install.description")}
          </p>
        </div>
      </div>
      {hint ? (
        <p className="text-sm font-medium text-foreground/80">{hint}</p>
      ) : (
        <Button
          size="lg"
          className="w-full h-12 rounded-2xl font-bold text-base"
          onClick={handleInstall}
        >
          <Download className="mr-2 h-5 w-5" />
          {t("install.button")}
        </Button>
      )}
    </div>
  );
}
