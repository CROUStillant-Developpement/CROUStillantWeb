import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { CircleX } from "lucide-react";
import { useUmami } from "next-umami";
import { useTranslations } from "next-intl";

interface ActiveFilterBadgeProps {
  setSheetOpen?: (open: boolean) => void;
  onRemove?: () => void;
  text: string | ReactNode;
}

export default function ActiveFilterBadge({
  setSheetOpen,
  onRemove,
  text,
}: ActiveFilterBadgeProps) {
  const umami = useUmami();
  const t = useTranslations("Common");

  return (
    <Badge className="transition-all ease-in-out duration-300 rounded-full h-6 bg-background/40 text-black hover:bg-primary/80 hover:text-white dark:text-white dark:hover:bg-primary/80 p-0 overflow-hidden">
      <button
        type="button"
        className="px-2 h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        onClick={() => setSheetOpen?.(true)}
      >
        {text}
      </button>
      <button
        type="button"
        aria-label={t("removeFilter")}
        className="pr-1.5 h-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        onClick={() => {
          onRemove?.();
          umami.event("Restaurant.Filter.Remove");
        }}
      >
        <CircleX className="w-4 h-4 hover:scale-110 transition-transform ease-in-out duration-300" />
      </button>
    </Badge>
  );
}
