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
    <Card className="relative overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group rounded-3xl">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
      <QrCodeDialog
        dialogTrigger={
          <div className="absolute top-6 right-6 p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <Share2 className="w-5 h-5 opacity-70" />
          </div>
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
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <span className="font-extrabold tracking-tight">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid gap-3">
          {sortedCategories.map((meal) => (
            <MealCard key={meal.code} meal={meal} />
          ))}
        </div>
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
