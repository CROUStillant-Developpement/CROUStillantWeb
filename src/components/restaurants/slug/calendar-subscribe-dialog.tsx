"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy } from "lucide-react";
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { cn } from "@/lib/utils";
import {
  CALENDAR_MEALS,
  CalendarMeal,
  getCalendarSubscribeLinks,
} from "@/lib/calendar";

const HINT_STORAGE_KEY = "calendar-hint-dismissed";

/**
 * Visibility of the "add to your calendar" hint, persisted so it is only dismissed once.
 */
export function useCalendarHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(HINT_STORAGE_KEY)) setVisible(true);
    } catch {
      // storage unavailable (private mode) — keep the hint hidden
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(HINT_STORAGE_KEY, "1");
    } catch {
      // storage unavailable — dismissal simply won't persist
    }
    setVisible(false);
  }

  return { visible, dismiss };
}

interface CalendarSubscribeDialogProps {
  dialogTrigger: React.ReactNode;
  restaurantCode: number;
  restaurantName: string;
  /** Meals selected when the dialog opens. Every meal by default. */
  initialMeals?: CalendarMeal[];
}

export default function CalendarSubscribeDialog({
  dialogTrigger,
  restaurantCode,
  restaurantName,
  initialMeals = [...CALENDAR_MEALS],
}: CalendarSubscribeDialogProps) {
  const t = useTranslations("CalendarDialog");
  const { toast } = useToast();
  const umami = useUmami();

  const [meals, setMeals] = useState<CalendarMeal[]>(initialMeals);
  const [minimal, setMinimal] = useState(false);

  const links = getCalendarSubscribeLinks(restaurantCode, restaurantName, {
    meals,
    minimal,
  });

  const toggleMeal = (meal: CalendarMeal) => {
    setMeals((current) =>
      current.includes(meal)
        ? // At least one meal must stay selected, otherwise the feed would be empty.
          current.length > 1
          ? current.filter((m) => m !== meal)
          : current
        : [...current, meal]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(links.https);
    toast({
      title: t("copyLink.toastTitle"),
      description: t("copyLink.toastDescription"),
    });
    umami.event("CalendarDialog.CopyLink", { restaurant: restaurantCode });
  };

  const providers = [
    { id: "google", label: t("providers.google"), href: links.google, Icon: FaGoogle },
    { id: "apple", label: t("providers.apple"), href: links.webcal, Icon: FaApple },
    { id: "outlook", label: t("providers.outlook"), href: links.outlook, Icon: FaMicrosoft },
  ] as const;

  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[480px] max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-primary/20 rounded-sm shadow-2xl p-5 sm:p-8 will-change-[transform,opacity]">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium text-sm">
            {t("description", { name: restaurantName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              {t("meals.title")}
            </p>
            <div className="flex flex-wrap gap-2">
              {CALENDAR_MEALS.map((meal) => {
                const selected = meals.includes(meal);
                return (
                  <Button
                    key={meal}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    className={cn("rounded-xl font-bold", !selected && "opacity-70")}
                    onClick={() => toggleMeal(meal)}
                  >
                    {t(`meals.${meal}`)}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-secondary/10 border border-primary/10">
            <label htmlFor="calendar-minimal" className="space-y-1 cursor-pointer">
              <span className="block text-sm font-bold">{t("minimal.title")}</span>
              <span className="block text-xs text-muted-foreground font-medium">
                {t("minimal.description")}
              </span>
            </label>
            <Switch
              id="calendar-minimal"
              checked={minimal}
              onCheckedChange={setMinimal}
              className="mt-0.5"
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              {t("providers.title")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {providers.map(({ id, label, href, Icon }) => (
                <Button
                  key={id}
                  asChild
                  variant="outline"
                  className="rounded-xl h-11 font-bold hover:border-primary/40"
                >
                  <a
                    href={href}
                    target={id === "apple" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={() =>
                      umami.event(`CalendarDialog.${id}`, { restaurant: restaurantCode })
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                    {label}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              {t("copyLink.title")}
            </p>
            <div className="flex gap-2 p-1.5 bg-secondary/20 border border-primary/10 rounded-2xl items-center focus-within:border-primary/30 transition-colors min-w-0">
              <input
                type="text"
                value={links.https}
                readOnly
                aria-label={t("copyLink.title")}
                className="flex-1 min-w-0 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium focus:outline-hidden truncate"
                onFocus={(e) => e.target.select()}
              />
              <Button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 rounded-xl h-9 sm:h-10 px-3 sm:px-4 font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                aria-label={t("copyLink.title")}
              >
                <Copy className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">{t("copyLink.cta")}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {t("copyLink.help")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
