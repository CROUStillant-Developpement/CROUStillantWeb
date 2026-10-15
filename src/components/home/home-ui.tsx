"use client";

import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The home page's own vocabulary (bigger, bolder and more playful than the
 * inner pages, see DESIGN.md). Every home section is built from these.
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/** Centered title, primary bar and optional description opening a section. */
export function HomeSectionTitle({
  title,
  description,
}: {
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-6">
        {title}
      </h2>
      <div className={cn("h-1.5 w-24 bg-primary rounded-full mx-auto", description && "mb-6")} />
      {description && (
        <p className="text-lg text-muted-foreground font-medium">{description}</p>
      )}
    </motion.div>
  );
}

/** The large rounded surface every home block sits on. */
export const homeCardClassName =
  "relative overflow-hidden rounded-[2rem] border border-primary/5 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md group";

/** Two soft primary glows in opposite corners of a home card. */
export function HomeGlow() {
  return (
    <>
      <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
    </>
  );
}

/** Solid primary icon badge with a glow, tilted until hovered. */
export function HomeIconBadge({
  Icon,
  tilt = "right",
  size = "md",
}: {
  Icon: LucideIcon;
  tilt?: "left" | "right";
  size?: "md" | "lg";
}) {
  return (
    <div className="relative w-fit">
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl scale-110 group-hover:scale-125 transition-transform" />
      <div
        className={cn(
          "relative bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:rotate-0",
          tilt === "right" ? "rotate-3" : "-rotate-3",
          size === "lg" ? "p-5 rounded-[1.75rem]" : "p-4 rounded-2xl"
        )}
      >
        <Icon className={size === "lg" ? "h-10 w-10" : "h-7 w-7"} />
      </div>
    </div>
  );
}

/** The chunky home call-to-action link, primary or secondary. */
export function HomeCta({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" }) {
  return (
    <motion.div className="w-fit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Link
        {...props}
        className={cn(
          "flex items-center gap-2 text-sm md:text-base rounded-2xl py-4 px-8 font-black group/cta",
          variant === "primary"
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "border border-border bg-background text-foreground",
          className
        )}
      >
        {children}
        <ArrowRight className="h-5 w-5 transition-transform group-hover/cta:translate-x-1" />
      </Link>
    </motion.div>
  );
}
