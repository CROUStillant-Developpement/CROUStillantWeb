import QrCodeDialog from "@/components/qr-code-dialog";
import MealCard from "@/components/restaurants/slug/meal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repas } from "@/services/types";
import { Share2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface MealsDisplayProps {
  selectedDateBreakfast: Repas | null;
  selectedDateLunch: Repas | null;
  selectedDateDinner: Repas | null;
  date: Date;
}

function MealSection({
  repas,
  title,
  emoji,
  date,
  qrTitle,
  qrDescription,
}: {
  repas: Repas;
  title: string;
  emoji: string;
  date: Date;
  qrTitle: string;
  qrDescription: string;
}) {
  const sortedCategories = useMemo(
    () => [...repas.categories].sort((a, b) => a.ordre - b.ordre),
    [repas.categories]
  );
  return (
    <Card className="relative">
      <QrCodeDialog
        dialogTrigger={
          <Share2 className="absolute top-4 right-4 opacity-50 hover:opacity-100 cursor-pointer" />
        }
        title={qrTitle}
        url={(() => {
          const u = new URL(window.location.href);
          u.searchParams.set("date", date.toISOString().split("T")[0]);
          // if past date, add #history to URL
          if (date < new Date()) {
            u.hash = "history";
          }
          return u.toString();
        })()}
        description={qrDescription}
      />
      <CardHeader>
        <CardTitle>
          {emoji} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedCategories.map((meal) => (
          <MealCard key={meal.code} meal={meal} />
        ))}
      </CardContent>
    </Card>
  );
}

export default function MealsDisplay({
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
  date,
}: MealsDisplayProps) {
  const t = useTranslations("RestaurantInformation");

  return (
    <>
      {selectedDateBreakfast && (
        <MealSection
          repas={selectedDateBreakfast}
          title={t("breakfast")}
          emoji="🥞"
          date={date}
          qrTitle={t("qrCode.breakfastTitle", { date: date.toDateString() })}
          qrDescription={t("qrCode.breakfastDescription", {
            date: date.toDateString(),
          })}
        />
      )}
      {selectedDateLunch && (
        <MealSection
          repas={selectedDateLunch}
          title={t("lunch")}
          emoji="🍽"
          date={date}
          qrTitle={t("qrCode.lunchTitle", { date: date.toDateString() })}
          qrDescription={t("qrCode.lunchDescription", {
            date: date.toDateString(),
          })}
        />
      )}
      {selectedDateDinner && (
        <MealSection
          repas={selectedDateDinner}
          title={t("dinner")}
          emoji="🍲"
          date={date}
          qrTitle={t("qrCode.dinnerTitle", { date: date.toDateString() })}
          qrDescription={t("qrCode.dinnerDescription", {
            date: date.toDateString(),
          })}
        />
      )}
    </>
  );
}
