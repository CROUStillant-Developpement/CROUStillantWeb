import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The outer wrapper of every standard page: gutters, bottom padding and the
 * gap between the header and the sections. See DESIGN.md.
 *
 * `overflow-x-clip` rather than `overflow-x-hidden`: the latter turns the
 * wrapper into a scroll container, which breaks `position: sticky` below it
 * (the restaurants filters, the widget builder preview).
 */
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full mt-4 px-4 pb-20 flex flex-col gap-8 overflow-x-clip",
        className
      )}
    >
      {children}
    </div>
  );
}

/** The pill used for short taglines: under page titles, on status labels. */
export function Pill({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex font-semibold items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-inset ring-primary/20",
        className
      )}
    >
      {children}
    </span>
  );
}

interface PageHeaderProps {
  title: ReactNode;
  /** A short tagline, shown as a pill under the title. */
  badge?: ReactNode;
  /** A longer introduction, under the badge. */
  description?: ReactNode;
  /** Buttons or links, last in the text column. */
  actions?: ReactNode;
  /** Shown beside the text on large screens, under it otherwise. */
  aside?: ReactNode;
  /** A large, faint icon in the bottom-right corner. */
  icon?: ComponentType<{ className?: string }>;
  /** Extra attributes for the `<h1>` (e.g. `data-easter-egg`). */
  titleProps?: HTMLAttributes<HTMLHeadingElement> & Record<`data-${string}`, unknown>;
  /** Anything else for the text column, between the description and the actions. */
  children?: ReactNode;
}

/**
 * The header card at the top of every standard page. The only `<h1>` of the
 * page lives here. See DESIGN.md.
 */
export function PageHeader({
  title,
  badge,
  description,
  actions,
  aside,
  icon: Icon,
  titleProps,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10 shadow-xs border border-primary/10">
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <h1
            {...titleProps}
            className={cn(
              "text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground wrap-break-word",
              titleProps?.className
            )}
          >
            {title}
          </h1>
          {badge && (
            <div className="mt-4 flex items-center min-h-8">
              <Pill>{badge}</Pill>
            </div>
          )}
          {description && (
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
          {children}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>

      {Icon && (
        <Icon className="absolute right-8 bottom-4 h-48 w-48 text-primary/10 pointer-events-none hidden sm:block" />
      )}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute right-40 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
    </header>
  );
}
