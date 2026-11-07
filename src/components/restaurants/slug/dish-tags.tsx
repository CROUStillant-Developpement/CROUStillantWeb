"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDishTags, type DishTag } from "@/lib/dish-tags";
import { cn } from "@/lib/utils";
import type { Plat } from "@/services/types";
import { Leaf, TriangleAlert } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

const TAG_CLASS =
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4 normal-case";
const NEUTRAL_TAG_CLASS = cn(TAG_CLASS, "bg-muted text-muted-foreground");

type DishTagsProps = {
  plat: Plat;
  className?: string;
};

/**
 * The tags of a dish (type, vegetarian, quality labels, declared allergens,
 * points). Renders nothing when the dish has no tags, e.g. before the API
 * returns the analysis.
 */
export default function DishTags({ plat, className }: DishTagsProps) {
  const tags = getDishTags(plat);
  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <li key={tagKey(tag)}>
          <Tag tag={tag} />
        </li>
      ))}
    </ul>
  );
}

function tagKey(tag: DishTag): string {
  switch (tag.kind) {
    case "type":
      return `type-${tag.type}`;
    case "label":
      return `label-${tag.label}`;
    default:
      return tag.kind;
  }
}

function Tag({ tag }: { tag: DishTag }) {
  const t = useTranslations("DishTags");
  const format = useFormatter();

  switch (tag.kind) {
    case "type":
      return <span className={cn(TAG_CLASS, "bg-primary/10 text-primary")}>{t(`types.${tag.type}`)}</span>;

    case "vegetarian":
      return (
        <span className={NEUTRAL_TAG_CLASS}>
          <Leaf className="h-3 w-3" aria-hidden="true" />
          {t("vegetarian")}
        </span>
      );

    case "label":
      return <span className={NEUTRAL_TAG_CLASS}>{t(`labels.${tag.label}`)}</span>;

    case "points":
      return (
        <span className={NEUTRAL_TAG_CLASS}>
          {t("points", { points: tag.points, formatted: format.number(tag.points) })}
        </span>
      );

    case "allergens": {
      const names = tag.allergens.map((a) =>
        t.has(`allergens.${a.code}`) ? t(`allergens.${a.code}`) : a.libelle
      );
      return (
        <Popover>
          <PopoverTrigger
            className={cn(
              NEUTRAL_TAG_CLASS,
              "transition-colors hover:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={t("allergensLabel", { allergens: format.list(names) })}
          >
            <TriangleAlert className="h-3 w-3" aria-hidden="true" />
            {t("allergens.title", { count: names.length })}
          </PopoverTrigger>
          <PopoverContent className="w-64 rounded-xl p-3 text-sm normal-case">
            <p className="font-semibold">{t("allergens.declared")}</p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-muted-foreground">
              {names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">{t("allergens.disclaimer")}</p>
          </PopoverContent>
        </Popover>
      );
    }
  }
}
