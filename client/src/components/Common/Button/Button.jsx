import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; // For loading spinner

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'outline', 'destructive', 'ghost', 'link'
  size = 'default', // 'default', 'sm', 'lg', 'icon'
  disabled = false,
  isLoading = false,
  iconLeft: IconLeft, // Expects a Lucide icon component
  iconRight: IconRight, // Expects a Lucide icon component
  className = '',
  loadingText = null,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8 text-base', // Made lg slightly larger
    icon: 'h-10 w-10', // Common size for icon-only buttons
  };

  const iconSizeClasses = {
    default: 'h-4 w-4',
    sm: 'h-3.5 w-3.5',
    lg: 'h-5 w-5',
    icon: 'h-5 w-5', // Icon size for 'icon' button size
  }

  const currentIconSize = iconSizeClasses[size] || iconSizeClasses.default;

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className={cn("animate-spin", loadingText || children ? "mr-2" : "", currentIconSize)} />
          {loadingText ? (
            <span>{loadingText}</span>
          ) : children ? (
            <span className="sr-only">{children}</span> // Keep original children for screen readers if no loadingText
          ) : (
            <span className="sr-only">Loading</span>
          )}
        </>
      ) : (
        <>
          {IconLeft && <IconLeft className={cn("mr-2", currentIconSize)} aria-hidden="true" />}
          {children && <span>{children}</span>}
          {IconRight && <IconRight className={cn("ml-2", currentIconSize)} aria-hidden="true" />}
        </>
      )}
    </button>
  );
};

export default Button;
