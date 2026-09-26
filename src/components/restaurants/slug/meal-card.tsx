import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Categorie, CategorieTriee, Plat } from "@/services/types";
import { ArrowRight, CookingPot } from "lucide-react";
import { useTranslations } from "next-intl";

type MealCardProps = {
  meal: Categorie | CategorieTriee | null;
};

export default function MealCard({ meal }: MealCardProps) {
  const t = useTranslations("MealCard");

  if (!meal) return;

  // sort meal by order
  meal?.plats.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`meal-${meal.code}`}
      className="w-full"
    >
      <AccordionItem value={`meal-${meal.code}`} className="border-b-0">
        <AccordionTrigger className="capitalize text-lg font-semibold py-4 px-4 rounded-2xl transition-all hover:no-underline data-[state=open]:bg-secondary/50 data-[state=open]:rounded-b-none">
          {meal.libelle}
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-4 px-6 rounded-b-2xl border-x border-b border-border/10">
          <ul className="grid gap-3">
            {meal.plats?.map((foodItem: Plat, index: number) => (
              <li
                key={index}
                className="flex items-start capitalize text-sm font-medium group min-w-0"
              >
                <div className="mt-1 mr-3 shrink-0 p-0.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowRight className="h-3 w-3" />
                </div>
                <span className="min-w-0 flex-1 wrap-break-word opacity-80 group-hover:opacity-100 transition-opacity">
                  {foodItem.libelle}
                </span>
                <a
                  href={`https://www.marmiton.org/recettes/recherche.aspx?aqt=${encodeURIComponent(foodItem.libelle.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("findRecipe", { dish: foodItem.libelle })}
                  title={t("findRecipe", { dish: foodItem.libelle })}
                  className="ml-2 mt-1 shrink-0 rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-foreground group-hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CookingPot className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
