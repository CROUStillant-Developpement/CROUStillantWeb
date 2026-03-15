import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr as frLocale } from "date-fns/locale";
import type { Locale } from "date-fns";
import { useState } from "react";
import { useUmami } from "next-umami";

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
  const [, setDate] = React.useState<Date | undefined>(new Date());
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDateChange = (date: Date) => {
    setDate(date); // to trigger re-render
    onDateChange?.(date);
  };

  const locale = useLocale();
  const t = useTranslations("DatePickers");
  const tRes = useTranslations("RestaurantPage");
  const umami = useUmami();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-9 px-3 flex items-center gap-2 font-semibold transition-all shrink-0"
            onClick={() => {
              umami.event("DatePicker.Open");
            }}
          >
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs hidden min-[400px]:inline">
              {tRes("calendar")}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("chooseDate")}</DialogTitle>
            <DialogDescription>{t("chooseDateDescription")}</DialogDescription>
          </DialogHeader>
          <DatePickerSection
            setDate={handleDateChange}
            onClose={() => setOpen(false)}
            minDate={minDate}
            maxDate={maxDate}
            currentDate={current}
            availableDates={availableDates}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-9 px-3 flex items-center gap-2 font-semibold transition-all shrink-0"
          onClick={() => {
            umami.event("DatePicker.Open");
          }}
        >
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs hidden min-[400px]:inline">
            {tRes("calendar")}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("chooseDate")}</DrawerTitle>
          <DrawerDescription>{t("chooseDateDescription")}</DrawerDescription>
        </DrawerHeader>
        <DatePickerSection
          className="px-4"
          setDate={handleDateChange}
          onClose={() => setOpen(false)}
          minDate={minDate}
          maxDate={maxDate}
          currentDate={current}
          availableDates={availableDates}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type DatePickerSectionProps = {
  className?: React.ComponentProps<"form">["className"];
  minDate?: Date;
  maxDate?: Date;
  currentDate?: Date;
  availableDates?: Date[];
  setDate: (date: Date) => void;
  onClose?: () => void;
};

function DatePickerSection({
  className,
  minDate,
  maxDate,
  currentDate = new Date(),
  availableDates,
  setDate,
  onClose,
}: DatePickerSectionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const locale = useLocale();
  const t = useTranslations("DatePickers");
  const umami = useUmami();

  const [localDate, setLocalDate] = useState<Date | undefined>(currentDate);

  const handleDateChange = (date: Date) => {
    setLocalDate(date);
    onClose?.();
    setDate(date);
  };

  const defaultMaxDate = new Date(new Date().setDate(new Date().getDate() + 21));
  const activeMaxDate = maxDate || defaultMaxDate;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col items-center", className)}
    >
      <Calendar
        className="mb-4 rounded-md border"
        mode="single"
        defaultMonth={currentDate}
        selected={currentDate}
        onSelect={(date) => date && handleDateChange(date)}
        startMonth={minDate}
        endMonth={activeMaxDate}
        disabled={
          availableDates
            ? (date) =>
                !availableDates.some(
                  (d) =>
                    d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate()
                )
            : {
                before: minDate,
                after: activeMaxDate,
              }
        }
        locale={((): Locale | undefined => {
          if (!locale) return undefined;
          const lang = locale.split("-")[0];
          switch (lang) {
            case "fr":
              return frLocale;
            case "en":
            default:
              return enUS;
          }
        })()}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={!localDate || !currentDate}
        onClick={() => {
          umami.event("DatePicker.Choose", {
            date: localDate
              ? localDate.toISOString()
              : currentDate.toISOString(),
          });
        }}
      >
        {t("closeAndChoose", {
          date: localDate
            ? localDate.toLocaleDateString(locale)
            : currentDate.toLocaleDateString(locale),
        })}
      </Button>
    </form>
  );
}
