import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useLocale, useTranslations } from "next-intl";
import { enUS, fr as frLocale } from "date-fns/locale";
import type { Locale } from "date-fns";
import { useUmami } from "next-umami";

type DatePickerSectionProps = {
  className?: React.ComponentProps<"form">["className"];
  minDate?: Date;
  maxDate?: Date;
  currentDate?: Date;
  availableDates?: Date[];
  setDate: (date: Date) => void;
  onClose?: () => void;
};

export default function DatePickerSection({
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
    onClose?.();
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
