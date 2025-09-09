import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { CircleX } from "lucide-react";
import { useUmami } from "next-umami";

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

  return (
    <Badge className="cursor-pointer transition-all ease-in-out duration-300">
      <div onClick={() => setSheetOpen?.(true)}>{text}</div>
      <CircleX
        className="w-4 h-4 ml-2 z-20 hover:scale-110 transition-transform ease-in-out duration-300"
        onClick={() => {
          onRemove?.();
          umami.event("Restaurant.Filter.Remove");
        }
      />
    </Badge>
  );
}
