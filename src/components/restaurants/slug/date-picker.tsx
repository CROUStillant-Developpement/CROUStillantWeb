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

type DatePickerProps = {
  onDateChange?: (date: Date) => void;
  maxDate?: Date;
  current?: Date;
};

export default function DatePicker({
  onDateChange,
  maxDate,
  current,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDateChange = (date: Date) => {
    setDate(date);
    onDateChange?.(date);
  };

  const locale = useLocale();
  const t = useTranslations("DatePickers");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
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
            onDateChange={handleDateChange}
            onClose={() => setOpen(false)}
            maxDate={maxDate}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className="mt-4 md:mt-8">
        <Button variant="outline">
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
          onDateChange={handleDateChange}
          onClose={() => setOpen(false)}
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
  maxDate?: Date;
  onDateChange?: (date: Date) => void;
  onClose?: () => void;
};

function DatePickerSection({
  className,
  maxDate,
  onDateChange,
  onClose,
}: DatePickerSectionProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDateChange?.(date!);
    onClose?.();
  };

  const locale = useLocale();
  const t = useTranslations("DatePickers");

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col items-center", className)}
    >
      <Calendar
        className="mb-4 rounded-md border"
        mode="single"
        selected={date}
        onSelect={setDate}
        fromDate={new Date()}
        toDate={
          maxDate || new Date(new Date().setDate(new Date().getDate() + 21))
        }
        lang={locale}
      />
      <Button type="submit" className="w-full" disabled={!date}>
        {t("ctaChoose", { date: date?.toLocaleDateString(locale) })}
      </Button>
    </form>
  );
}
