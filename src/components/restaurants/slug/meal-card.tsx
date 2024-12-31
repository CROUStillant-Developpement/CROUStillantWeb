import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Categorie, CategorieTriee, Plat } from "@/services/types";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

type MealCardProps = {
  meal: Categorie | CategorieTriee | null;
};

export default function MealCard({ meal }: MealCardProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!meal) return;

  // sort meal by order
  meal?.plats.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isDesktop ? `meal-${meal.code}` : ""}
    >
      <AccordionItem value={`meal-${meal.code}`}>
        <AccordionTrigger className="capitalize">
          {meal.libelle}
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            {meal.plats.map((foodItem: Plat, index: number) => (
              <li key={index} className="flex items-center capitalize">
                <ArrowRight className="h-4 w-4 mr-2" />
                {foodItem.libelle}
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
