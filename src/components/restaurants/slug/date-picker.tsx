import * as React from "react";

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
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import dynamic from "next/dynamic";

// The calendar (react-day-picker and the date-fns locales, about 140 kB) is
// only needed once the picker is opened, so it is kept out of the bundle
// downloaded to display a menu.
const DatePickerSection = dynamic(() => import("./date-picker-section"), {
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
  const [, setDate] = React.useState<Date | undefined>(new Date());
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDateChange = (date: Date) => {
    setDate(date); // to trigger re-render
    onDateChange?.(date);
  };

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
          <span className="text-xs min-[400px]:inline">
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
