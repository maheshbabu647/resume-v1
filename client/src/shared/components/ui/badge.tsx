import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-primary text-primary-foreground',
        secondary:   'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline:     'border-border text-foreground',
        success:     'border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
        warning:     'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        violet:      'border-transparent bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
        amber:       'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
        'outline-violet': 'border-violet-200 text-violet-700 dark:border-violet-800 dark:text-violet-400',
        'outline-amber':  'border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
