import DateCard from "@/components/restaurants/slug/date-card";
import { formatToISODate } from "@/lib/utils";
import { DateMenu } from "@/services/types";

interface RestaurantCalendarProps {
  availableDates: DateMenu[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function RestaurantCalendar({
  availableDates,
  selectedDate,
  setSelectedDate,
}: RestaurantCalendarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {availableDates.map((date) => (
        <DateCard
          key={date.code}
          date={formatToISODate(date.date)}
          onSelectedDateChange={setSelectedDate}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  );
}
