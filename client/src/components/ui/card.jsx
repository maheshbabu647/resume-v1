import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card"
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm", // Removed default padding and gap from here
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn(
      "flex flex-col space-y-1.5 p-6", // Added default padding
      // Kept grid for action slot from original, might need adjustment based on usage
      // "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 // Changed from div to h3 for semantics
    ref={ref}
    data-slot="card-title"
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)} // Standard title styling
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p // Changed from div to p for semantics
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// CardAction is typically for an element within the CardHeader, like a settings button
const CardAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn(
      // Position this absolutely or within a flex container in CardHeader if needed
      // "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className
    )}
    {...props}
  />
));
CardAction.displayName = "CardAction";


const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-6 pt-0", className)} // Added default padding, pt-0 if header has pb-6
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("flex items-center p-6 pt-0", className)} // Added default padding, pt-0 if content has pb-6
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAction }
