import MealCard from "@/components/restaurants/slug/meal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repas } from "@/services/types";

interface MealsDisplayProps {
  selectedDateBreakfast: Repas | null;
  selectedDateLunch: Repas | null;
  selectedDateDinner: Repas | null;
}

export default function MealsDisplay({
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
}: MealsDisplayProps) {
  return (
    <>
      {selectedDateBreakfast && (
        <Card>
          <CardHeader>
            <CardTitle>🥞 Petit-déjeuner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBreakfast.categories.map((meal) => (
              <MealCard
                key={meal.code}
                meal={meal}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {selectedDateLunch && (
        <Card>
          <CardHeader>
            <CardTitle>🍽 Déjeuner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateLunch.categories.map((meal) => (
              <MealCard
                key={meal.code}
                meal={meal}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {selectedDateDinner && (
        <Card>
          <CardHeader>
            <CardTitle>🍲 Dîner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateDinner.categories.map((meal) => (
              <MealCard
                key={meal.code}
                meal={meal}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
