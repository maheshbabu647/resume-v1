import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"; // Ensure installed: npm install class-variance-authority

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)
// Note: The default text color will be inherited (e.g., text-foreground or text-card-foreground).
// You can add specific text color classes here if a different default label color is always desired,
// or apply text color utilities when using the <Label /> component.

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
