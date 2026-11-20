"use client";

import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// The calendar (react-day-picker and the date-fns locales, about 140 kB) is
// only needed once the picker is opened.
const DatePickerSection = dynamic(() => import("./date-picker-section"), {
  ssr: false,
});

export type DatePickerOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  current?: Date;
  availableDates?: Date[];
};

/**
 * The date picker itself: a dialog on desktop, a drawer (vaul) on phones.
 * Loaded on demand by `DatePicker`, so neither is part of the bundle
 * downloaded to display a menu.
 */
export default function DatePickerOverlay({
  open,
  onOpenChange,
  onDateChange,
  minDate,
  maxDate,
  current,
  availableDates,
}: DatePickerOverlayProps) {
  const t = useTranslations("DatePickers");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const section = (className?: string) => (
    <DatePickerSection
      className={className}
      setDate={onDateChange}
      onClose={() => onOpenChange(false)}
      minDate={minDate}
      maxDate={maxDate}
      currentDate={current}
      availableDates={availableDates}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("chooseDate")}</DialogTitle>
            <DialogDescription>{t("chooseDateDescription")}</DialogDescription>
          </DialogHeader>
          {section()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("chooseDate")}</DrawerTitle>
          <DrawerDescription>{t("chooseDateDescription")}</DrawerDescription>
        </DrawerHeader>
        {section("px-4")}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
