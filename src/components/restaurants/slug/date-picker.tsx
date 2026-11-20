import * as React from "react";

import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import dynamic from "next/dynamic";

// The dialog / drawer (vaul, radix dialog) and the calendar are loaded on the
// first click: the button is all a menu page needs to render.
const DatePickerOverlay = dynamic(() => import("./date-picker-overlay"), {
  ssr: false,
});

type DatePickerProps = {
  onDateChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  current?: Date;
  availableDates?: Date[];
};

export default function DatePicker({
  onDateChange,
  minDate,
  maxDate,
  current,
  availableDates,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Mounted on the first open, then kept so the closing animation can play
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const wasOpen = React.useRef(false);

  const tRes = useTranslations("RestaurantPage");
  const umami = useUmami();

  // Without a Radix trigger, focus has to be given back to the button on close
  React.useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        aria-label={tRes("calendar")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-xl h-9 w-9 sm:w-auto p-0 sm:px-3 flex items-center justify-center gap-2 font-semibold transition-all shrink-0"
        onClick={() => {
          setMounted(true);
          setOpen(true);
          umami.event("DatePicker.Open");
        }}
      >
        <CalendarDays className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs hidden sm:inline">{tRes("calendar")}</span>
      </Button>
      {mounted && (
        <DatePickerOverlay
          open={open}
          onOpenChange={setOpen}
          onDateChange={(date) => onDateChange?.(date)}
          minDate={minDate}
          maxDate={maxDate}
          current={current}
          availableDates={availableDates}
        />
      )}
    </>
  );
}
