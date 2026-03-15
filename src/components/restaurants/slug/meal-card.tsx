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
      className="w-full"
    >
      <AccordionItem value={`meal-${meal.code}`} className="border-b-0">
        <AccordionTrigger className="capitalize text-lg font-semibold py-4 px-4 hover:bg-secondary/30 rounded-2xl transition-all hover:no-underline [&[data-state=open]]:bg-secondary/50 [&[data-state=open]]:rounded-b-none">
          {meal.libelle}
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-4 px-6 bg-secondary/20 rounded-b-2xl border-x border-b border-border/10">
          <ul className="grid gap-3">
            {meal.plats?.map((foodItem: Plat, index: number) => (
              <li key={index} className="flex items-start capitalize text-sm font-medium group">
                <div className="mt-1 mr-3 p-0.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowRight className="h-3 w-3" />
                </div>
                <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {foodItem.libelle}
                </span>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
