import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

type DateCardProps = {
  date: Date;
  onSelectedDateChange: (date: Date) => void;
  selectedDate: Date;
  menuIsLoading?: boolean;
  href?: string;
  showYear?: boolean;
};

export default function DateCard({
  date,
  onSelectedDateChange,
  selectedDate,
  menuIsLoading = false,
  href = "#",
  showYear = false, // default: false
}: DateCardProps) {
  const locale = useLocale();
  const isFrench = locale.startsWith("fr");

  // Format weekday, day, month, and optionally year
  const weekday = date.toLocaleDateString(locale, { weekday: "long" });
  const day = date.toLocaleDateString(locale, { day: "numeric" });
  const month = date.toLocaleDateString(locale, { month: "long" });
  const year = date.toLocaleDateString(locale, { year: "numeric" });

  // Combine elements in the proper order for each locale
  const formattedTop = isFrench
    ? `${weekday} ${day}` // e.g. "lundi 6"
    : `${weekday} ${day}`; // e.g. "Monday 6"

  const formattedBottom = isFrench
    ? `${month}${showYear ? ` ${year}` : ""}` // "octobre 2025"
    : `${month}${showYear ? `, ${year}` : ""}`; // "October 2025"

  const isSelected =
    selectedDate.toLocaleDateString(locale) === date.toLocaleDateString(locale);

  return (
    <Link href={href}>
      <Card
        key={date.toISOString()}
        className={`${
          isSelected ? "border-primary" : "border-card"
        } text-center flex-1 cursor-pointer relative dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80`}
        onClick={() => onSelectedDateChange(date)}
      >
        {menuIsLoading && isSelected && (
          <Button className="absolute top-2 right-2 rounded-full" size="icon">
            <LoaderCircle className="animate-spin" />
          </Button>
        )}
        <CardHeader className="pb-2">
          <CardTitle>
            <p className="capitalize">{formattedTop}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="capitalize">{formattedBottom}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
