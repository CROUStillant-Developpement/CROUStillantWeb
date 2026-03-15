"use client";

import { cn, formatToISODate } from "@/lib/utils";
import { DateMenu } from "@/services/types";
import { useLocale } from "next-intl";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateScrollerProps {
  availableDates: DateMenu[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateScroller({
  availableDates,
  selectedDate,
  onDateChange,
}: DateScrollerProps) {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    // Scroll to the selected date when it changes
    const container = scrollRef.current;
    const selectedElement = container?.querySelector('[data-selected="true"]') as HTMLElement;

    if (container && selectedElement) {
      const containerWidth = container.offsetWidth;
      const elementOffset = selectedElement.offsetLeft;
      const elementWidth = selectedElement.offsetWidth;

      // Calculate scroll position to center the current element
      const scrollTo = elementOffset - (containerWidth / 2) + (elementWidth / 2);

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, [selectedDate, availableDates]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [availableDates]);

  const scrollBy = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full max-w-full relative group/scroller select-none overflow-x-hidden min-w-0">
      <AnimatePresence>
        {showLeftArrow && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-xl bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background h-8 w-8"
              onClick={() => scrollBy("left")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightArrow && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:block"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-xl bg-background/90 backdrop-blur-sm border-border/50 hover:bg-background h-8 w-8"
              onClick={() => scrollBy("right")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden custom-scrollbar p-1 touch-pan-x max-w-full w-full"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {availableDates.map((dateObj) => {
          const date = formatToISODate(dateObj.date);

          if (isNaN(date.getTime())) return null;

          const isSelected =
            !isNaN(selectedDate.getTime()) &&
            selectedDate.toDateString() === date.toDateString();

          const weekday = date.toLocaleDateString(locale, { weekday: "short" });
          const day = date.toLocaleDateString(locale, { day: "numeric" });
          const month = date.toLocaleDateString(locale, { month: "short" });

          return (
            <button
              key={dateObj.code}
              data-selected={isSelected}
              onClick={() => onDateChange(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] sm:min-w-[65px] h-[75px] sm:h-[80px] rounded-2xl border transition-all duration-300 scroll-snap-align-center shrink-0",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary scale-105 z-10 scale-110"
                  : "bg-card text-card-foreground border-border/50 hover:border-primary/30 hover:bg-accent/50"
              )}
            >
              <span className={cn(
                "text-[10px] uppercase font-bold tracking-widest opacity-60",
                isSelected && "opacity-90"
              )}>
                {weekday}
              </span>
              <span className="text-2xl font-black my-1 tabular-nums tracking-tighter">
                {day}
              </span>
              <span className={cn(
                "text-[10px] font-semibold opacity-60",
                isSelected && "opacity-90"
              )}>
                {month}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
