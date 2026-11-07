import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Categorie, CategorieTriee, Plat } from "@/services/types";
import { ArrowRight, CookingPot, Info, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUmami } from "next-umami";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { useUserPreferences } from "@/store/userPreferencesStore";
import { getDishName, isInfoLine, isNoise } from "@/lib/dish-tags";
import DishTags from "@/components/restaurants/slug/dish-tags";

type MealCardProps = {
  meal: Categorie | CategorieTriee | null;
};

const DISH_ACTION_CLASS =
  "mt-1 shrink-0 rounded-full p-1 transition-colors hover:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";

export default function MealCard({ meal }: MealCardProps) {
  const t = useTranslations("MealCard");
  const umami = useUmami();
  const hydrated = useHydrated();
  const followedDishes = useUserPreferences((state) => state.followedDishes);
  const toggleFollowedDish = useUserPreferences((state) => state.toggleFollowedDish);

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
            {meal.plats?.map((foodItem: Plat, index: number) => {
              if (isNoise(foodItem)) return null;

              const name = getDishName(foodItem);

              // Information lines ("Fermé", an announcement...) are not dishes:
              // no tags, no follow or recipe buttons.
              if (isInfoLine(foodItem)) {
                return (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground min-w-0"
                  >
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 wrap-break-word first-letter:uppercase">{name}</span>
                  </li>
                );
              }

              // Followed dishes live in localStorage: unknown until hydrated.
              const isFollowed =
                hydrated && followedDishes.some((dish) => dish.code === String(foodItem.code));
              const followLabel = t(isFollowed ? "unfollowDish" : "followDish", {
                dish: name,
              });

              return (
                <li
                  key={index}
                  className="flex items-start capitalize text-sm font-medium group min-w-0"
                >
                  <div className="mt-1 mr-3 shrink-0 p-0.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="wrap-break-word opacity-80 group-hover:opacity-100 transition-opacity">
                      {name}
                    </span>
                    <DishTags plat={foodItem} className="mt-1.5" />
                  </div>
                  <button
                    type="button"
                    aria-label={followLabel}
                    aria-pressed={isFollowed}
                    title={followLabel}
                    className={cn(
                      DISH_ACTION_CLASS,
                      "ml-2",
                      isFollowed
                        ? "text-amber-500"
                        : "text-muted-foreground/60 hover:text-foreground group-hover:text-foreground"
                    )}
                    onClick={() => {
                      toggleFollowedDish(foodItem.code, name);
                      umami.event(isFollowed ? "Dish.Unfollow" : "Dish.Follow");
                    }}
                  >
                    <Star className={cn("h-4 w-4", isFollowed && "fill-current")} aria-hidden="true" />
                  </button>
                  <a
                    href={`https://www.marmiton.org/recettes/recherche.aspx?aqt=${encodeURIComponent(name.trim())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("findRecipe", { dish: name })}
                    title={t("findRecipe", { dish: name })}
                    className={cn(
                      DISH_ACTION_CLASS,
                      "ml-1 text-muted-foreground/60 hover:text-foreground group-hover:text-foreground"
                    )}
                  >
                    <CookingPot className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
