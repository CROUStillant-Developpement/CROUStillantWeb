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
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
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
