"use client";

import { useTranslations } from "next-intl";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Image,
  AlignLeft,
  Globe,
  CircleDot,
  MapPin,
  UtensilsCrossed,
  Clock,
  Mail,
  CreditCard,
  Bus,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import type { BlockConfig } from "./builder-page";

const BLOCK_ICONS: Record<string, React.ReactNode> = {
  header:      <Image className="w-3.5 h-3.5" />,
  header_text: <AlignLeft className="w-3.5 h-3.5" />,
  region:      <Globe className="w-3.5 h-3.5" />,
  status:      <CircleDot className="w-3.5 h-3.5" />,
  address:     <MapPin className="w-3.5 h-3.5" />,
  menu:        <UtensilsCrossed className="w-3.5 h-3.5" />,
  hours:       <Clock className="w-3.5 h-3.5" />,
  contact:     <Mail className="w-3.5 h-3.5" />,
  payment:     <CreditCard className="w-3.5 h-3.5" />,
  access:      <Bus className="w-3.5 h-3.5" />,
  link:        <ExternalLink className="w-3.5 h-3.5" />,
};

interface SortableBlockProps {
  block: BlockConfig;
  onToggle: () => void;
  label: string;
}

function SortableBlock({ block, onToggle, label }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
        block.enabled
          ? "border-primary/20 bg-primary/5"
          : "border-border/50 bg-card/30 hover:bg-card/60"
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 touch-none text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Icon */}
      <span className={`shrink-0 transition-colors ${block.enabled ? "text-primary" : "text-muted-foreground/50"}`}>
        {BLOCK_ICONS[block.id]}
      </span>

      {/* Label */}
      <span className={`flex-1 text-sm transition-colors ${block.enabled ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>

      {/* Toggle */}
      <button
        type="button"
        onClick={onToggle}
        className={`shrink-0 w-9 h-5 rounded-full transition-all duration-200 ${
          block.enabled ? "bg-primary" : "bg-muted"
        }`}
        aria-pressed={block.enabled}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`block w-4 h-4 rounded-full bg-background shadow-xs transition-transform mx-0.5 ${
            block.enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </li>
  );
}

interface Props {
  blocks: BlockConfig[];
  onChange: (blocks: BlockConfig[]) => void;
}

export default function BlocksPanel({ blocks, onChange }: Props) {
  const t = useTranslations("IframeBuilderPage");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const toggleBlock = (id: string) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">{t("blocks.hint")}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1.5">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onToggle={() => toggleBlock(block.id)}
                label={t(`blocks.${block.id}`)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
