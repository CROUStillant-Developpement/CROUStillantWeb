import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { useUmami } from "next-umami";

type DatePickerProps = {
  onDateChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  current?: Date;
};

export default function DatePicker({
  onDateChange,
  minDate,
  maxDate,
  current,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [, setDate] = React.useState<Date | undefined>(new Date());
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDateChange = (date: Date) => {
    console.log("Date selected:", date);
    setDate(date); // to trigger re-render
    onDateChange?.(date);
  };

  const locale = useLocale();
  const t = useTranslations("DatePickers");
  const umami = useUmami();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              umami.event("DatePicker.Open");
            }}
          >
            {current
              ? t("currentDate", { date: current?.toLocaleDateString(locale) })
              : t("chooseDate")}
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
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className="mt-4 md:mt-8">
        <Button
          variant="outline"
          onClick={() => {
            umami.event("DatePicker.Open");
          }}
        >
          {current
            ? t("currentDate", { date: current?.toLocaleDateString(locale) })
            : t("chooseDate")}
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
  setDate: (date: Date) => void;
  onClose?: () => void;
};

function DatePickerSection({
  className,
  minDate = new Date(),
  maxDate,
  currentDate = new Date(),
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
        fromDate={minDate}
        toDate={
          maxDate || new Date(new Date().setDate(new Date().getDate() + 21))
        } // 3 weeks if no maxDate
        lang={locale}
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
