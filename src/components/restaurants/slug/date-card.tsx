import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "next-intl";


type DateCardProps = {
  date: Date;
  onSelectedDateChange: (date: Date) => void;
  selectedDate: Date;
};

export default function DateCard({
  date,
  onSelectedDateChange,
  selectedDate,
}: DateCardProps) {
  const locale = useLocale();

  return (
    <Card
      key={date.toISOString()}
      className={`${
        selectedDate.toLocaleDateString() === date.toLocaleDateString()
          ? "border-primary"
          : "border-card"
      } text-center flex-1 cursor-pointer relative dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80`}
      onClick={() => onSelectedDateChange(date)}
    >
      <CardHeader>
        <CardContent>
          <p className="capitalize">
            {date.toLocaleDateString(locale, {
              weekday: "long",
            })}
          </p>
        </CardContent>
        <CardTitle>
          {date.toLocaleDateString(locale, {
            day: "numeric",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="capitalize">
          {date.toLocaleDateString(locale, {
            month: "long",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
