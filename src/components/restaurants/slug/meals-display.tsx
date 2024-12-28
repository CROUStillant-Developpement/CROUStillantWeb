import MealCard from "@/components/restaurants/slug/meal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repas } from "@/services/types";

interface MealsDisplayProps {
  selectedDateBreakfast: Repas[];
  selectedDateLunch: Repas[];
  selectedDateDinner: Repas[];
}

export default function MealsDisplay({
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
}: MealsDisplayProps) {
  return (
    <>
      {selectedDateBreakfast.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🥞 Petit-déjeuner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBreakfast.map((meal) => (
              <MealCard
                key={meal.code}
                meal={meal.categories.length > 0 ? meal.categories[0] : null}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {selectedDateLunch.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🍽 Déjeuner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateLunch.map((meal) => (
              <MealCard
                key={meal.code}
                meal={meal.categories.length > 0 ? meal.categories[0] : null}
              />
            ))}
          </CardContent>
        </Card>
      )}
      {selectedDateDinner.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🍲 Dîner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateDinner.map((meal) => (
              <MealCard
                key={meal.code}
                meal={meal.categories.length > 0 ? meal.categories[0] : null}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
