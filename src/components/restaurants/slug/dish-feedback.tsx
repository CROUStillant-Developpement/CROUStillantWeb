"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDishName, getDishTags, getDishType } from "@/lib/dish-tags";
import { cn } from "@/lib/utils";
import type { Plat } from "@/services/types";
import { CircleCheck, CookingPot, EllipsisVertical, Flag, Info, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * What a user can report as wrong on a dish. Sent as is in the `Dish.Report`
 * Umami event, so keep the values stable.
 */
export const REPORT_REASONS = ["type", "vegetarian", "allergens", "origin", "name", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

// Delay before closing the hover popover, so the pointer can move from the button to the popover
const HOVER_CLOSE_DELAY = 150;

type DishTagsInfoProps = {
  /** Classes of the trigger button (to match the buttons next to it). */
  className?: string;
  /** Content of the trigger button. Defaults to an info icon. */
  children?: ReactNode;
};

/**
 * An info button explaining that the dish tags are generated automatically and
 * only indicative. Opens on hover (mouse), focus or tap, and stays open when
 * clicked.
 */
export function DishTagsInfo({ className, children }: DishTagsInfoProps) {
  const t = useTranslations("DishFeedback");
  const [open, setOpen] = useState(false);
  // Opened by the mouse hovering: a click then pins it instead of closing it
  const openedByHover = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (openedByHover.current) setOpen(false);
    }, HOVER_CLOSE_DELAY);
  };

  useEffect(() => cancelClose, []);

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        openedByHover.current = false;
        setOpen(value);
      }}
    >
      <PopoverTrigger
        className={className}
        aria-label={t("info.label")}
        title={t("info.label")}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          cancelClose();
          if (!open) {
            openedByHover.current = true;
            setOpen(true);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") scheduleClose();
        }}
        onClick={(e) => {
          if (openedByHover.current) {
            // already open from hovering: keep it open (pinned) instead of toggling it closed
            e.preventDefault();
            openedByHover.current = false;
          }
        }}
      >
        {children ?? <Info className="w-5 h-5 opacity-70" aria-hidden="true" />}
      </PopoverTrigger>
      <PopoverContent
        className="w-80 rounded-xl p-4 text-sm"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") cancelClose();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") scheduleClose();
        }}
      >
        <p className="font-semibold">{t("info.title")}</p>
        <p className="mt-1.5 text-muted-foreground">{t("info.generated")}</p>
        <p className="mt-2 text-muted-foreground">{t("info.allergies")}</p>
        <p className="mt-2 flex items-start gap-1.5 text-muted-foreground">
          <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t("info.report")}</span>
        </p>
      </PopoverContent>
    </Popover>
  );
}

type DishReportButtonProps = {
  plat: Plat;
  /** Classes of the trigger button (to match the buttons next to it). */
  className?: string;
};

/**
 * A button to report a wrong tag or label on a dish. The report is sent as a
 * `Dish.Report` Umami event (no account, no email).
 */
export function DishReportButton({ plat, className }: DishReportButtonProps) {
  const t = useTranslations("DishFeedback");
  const label = t("report.label", { dish: getDishName(plat) });

  return (
    <Popover>
      <PopoverTrigger className={className} aria-label={label} title={label}>
        <Flag className="h-4 w-4" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-xl p-3 text-sm normal-case">
        <DishReportForm plat={plat} />
      </PopoverContent>
    </Popover>
  );
}

type DishActionsMenuProps = {
  plat: Plat;
  /** Follow / unfollow the dish. */
  follow: { label: string; active: boolean; onToggle: () => void };
  /** Link and label of the recipe search. */
  recipeUrl: string;
  recipeLabel: string;
  className?: string;
};

/**
 * Compact menu (phones) grouping the follow button, the recipe search and the
 * report form behind a single button, so a dish row keeps room for its name.
 */
export function DishActionsMenu({ plat, follow, recipeUrl, recipeLabel, className }: DishActionsMenuProps) {
  const t = useTranslations("DishFeedback");
  const [view, setView] = useState<"menu" | "report">("menu");
  const label = t("menu.label", { dish: getDishName(plat) });

  const itemClass = cn(
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
    "hover:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
  );

  return (
    <Popover onOpenChange={(open) => !open && setView("menu")}>
      <PopoverTrigger className={className} aria-label={label} title={label}>
        <EllipsisVertical className="h-4 w-4" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-xl p-2 text-sm normal-case">
        {view === "menu" ? (
          <ul className="grid gap-0.5">
            <li>
              <button type="button" aria-pressed={follow.active} onClick={follow.onToggle} className={itemClass}>
                <Star
                  className={cn(
                    "h-4 w-4 shrink-0",
                    follow.active ? "fill-current text-amber-500" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                {follow.label}
              </button>
            </li>
            <li>
              <a href={recipeUrl} target="_blank" rel="noopener noreferrer" className={itemClass}>
                <CookingPot className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {recipeLabel}
              </a>
            </li>
            <li>
              <button type="button" onClick={() => setView("report")} className={itemClass}>
                <Flag className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {t("report.title")}
              </button>
            </li>
          </ul>
        ) : (
          <div className="p-1">
            <DishReportForm plat={plat} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/**
 * The report form: the reasons to choose from, then a thank-you message. Its
 * state resets when the popover holding it closes (the content is unmounted).
 */
function DishReportForm({ plat }: { plat: Plat }) {
  const t = useTranslations("DishFeedback");
  const umami = useUmami();
  const [sent, setSent] = useState(false);

  const name = getDishName(plat);

  const report = (reason: ReportReason) => {
    umami.event("Dish.Report", {
      plat: String(plat.code),
      libelle: name.slice(0, 500),
      raison: reason,
      type: getDishType(plat) ?? "",
      vegetarien: getDishTags(plat).some((tag) => tag.kind === "vegetarian"),
    });
    setSent(true);
  };

  if (sent) {
    return (
      <p role="status" className="flex items-start gap-2">
        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>{t("report.thanks")}</span>
      </p>
    );
  }

  return (
    <>
      <p className="font-semibold">{t("report.title")}</p>
      <p className="mt-1 text-muted-foreground">{t("report.question", { dish: name })}</p>
      <ul className="mt-2 grid gap-1">
        {REPORT_REASONS.map((reason) => (
          <li key={reason}>
            <button
              type="button"
              onClick={() => report(reason)}
              className={cn(
                "w-full rounded-lg px-2.5 py-1.5 text-left transition-colors",
                "hover:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              {t(`report.reasons.${reason}`)}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">{t("report.anonymous")}</p>
    </>
  );
}
