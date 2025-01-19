import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statVariants = cva(
  "rounded-lg border px-4 py-3 bg-card [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 w-[250px] flex flex-col items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Stat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="stat"
    className={cn(statVariants({ variant }), className)}
    {...props}
  />
))
Stat.displayName = "Stat"

const StatTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
StatTitle.displayName = "StatTitle"

const StatDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-bold [&_p]:leading-relaxed", className)}
    {...props}
  />
))
StatDescription.displayName = "StatDescription"

export { Stat, StatTitle, StatDescription }
