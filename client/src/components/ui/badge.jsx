import * as React from "react"
import { cva } from "class-variance-authority"; // Ensure installed: npm install class-variance-authority

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border", // Added border-border for outline variant
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  // Badges are typically non-interactive, so 'div' or 'span' is more appropriate than 'button' or 'Slot' by default.
  // However, keeping Slot for flexibility if it needs to wrap an interactive element.
  // const Comp = asChild ? Slot : "div"; // If you need asChild prop
  return (
    <div // Changed from Comp to div for typical badge usage
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  )
})
Badge.displayName = "Badge"


export { Badge, badgeVariants }
