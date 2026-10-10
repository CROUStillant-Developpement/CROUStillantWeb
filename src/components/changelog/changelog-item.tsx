import { Sparkles, Wrench, Zap, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChangelogEntry, ChangelogEntryType } from "@/services/types";

const TYPE_STYLES: Record<ChangelogEntryType, { icon: LucideIcon; className: string }> = {
  feat: { icon: Sparkles, className: "bg-primary/10 text-primary" },
  fix: { icon: Wrench, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  perf: { icon: Zap, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
};

interface ChangelogItemProps {
  entry: ChangelogEntry;
  date: string;
  typeLabel: string;
}

export default function ChangelogItem({ entry, date, typeLabel }: ChangelogItemProps) {
  const { icon: Icon, className } = TYPE_STYLES[entry.type];

  return (
    <li>
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/item flex items-start gap-3 rounded-xl p-2 -mx-2 hover:bg-primary/5 transition-colors"
      >
        <span
          title={typeLabel}
          className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0", className)}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{typeLabel}</span>
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-medium text-foreground leading-snug group-hover/item:text-primary transition-colors wrap-break-word">
            {entry.message}
          </span>
          <time dateTime={entry.date} className="block mt-0.5 text-xs text-muted-foreground">
            {date}
          </time>
        </span>
      </a>
    </li>
  );
}
