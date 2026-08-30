"use client";

import { useEffect, useState } from "react";
import { PartyPopper, Share2, X as CloseIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import log from "@/lib/log";

const STORAGE_KEY = "celebration-banner-100k-rentree-2026-dismissed";
const SHARE_URL = "https://croustillant.menu";

/**
 * Visibility of the celebration banner, persisted so it is only dismissed once.
 * Lifted out of the component so the page can avoid stacking several hints.
 */
export function useCelebrationBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // storage unavailable (private mode) — keep the banner hidden
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // storage unavailable — dismissal simply won't persist
    }
    setVisible(false);
  }

  return { visible, dismiss };
}

interface CelebrationBannerProps {
  onDismiss: () => void;
}

export default function CelebrationBanner({ onDismiss }: CelebrationBannerProps) {
  const t = useTranslations("CelebrationBanner");
  const { toast } = useToast();
  const umami = useUmami();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      toast({ title: t("copied.title"), description: t("copied.description") });
    } catch (error) {
      log.error([error], "dev");
    }
  }

  async function handleShare() {
    umami.event("Celebration.Share");

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "CROUStillant",
          text: t("shareText"),
          url: SHARE_URL,
        });
        return;
      } catch (error) {
        // The user cancelled the share sheet — don't fall back to a copy.
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    await copyLink();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-r from-primary/5 via-primary/3 to-transparent backdrop-blur-md p-4 md:p-6 group hover:from-primary/15 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4 min-w-0">
          <div className="flex h-12 w-12 rounded-2xl bg-primary/10 text-primary items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PartyPopper size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-base md:text-lg font-extrabold tracking-tight text-foreground">
              {t("title")}
            </p>
            <p className="mt-1 text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("message")}
            </p>
            <p className="mt-1 text-sm md:text-base font-bold italic text-muted-foreground leading-relaxed">
              {t("sub-message")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Button
            size="sm"
            className="rounded-xl h-10 px-4 font-bold"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t("shareCta")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("dismiss")}
            className="h-10 w-10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => {
              umami.event("Celebration.Dismiss");
              onDismiss();
            }}
          >
            <CloseIcon size={18} className="opacity-50" />
          </Button>
        </div>
      </div>
    </div>
  );
}
