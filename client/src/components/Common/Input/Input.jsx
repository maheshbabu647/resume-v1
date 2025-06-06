import React, { forwardRef } from 'react';
import { Input as UiInput } from "@/components/ui/input"; // Aliased to avoid name clash
import { Label as UiLabel } from "@/components/ui/label"; // Aliased
import { cn } from "@/lib/utils";
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(
  (
    {
      id,
      label,
      type = 'text',
      name,
      value,
      onChange,
      placeholder,
      error = null,
      required = false,
      className = '', // For the wrapper div
      inputClassName = '', // Specifically for the UiInput component
      helperText,
      autoComplete,
      iconLeft: IconLeft, // Expects a Lucide icon component
      ...props // Other props for UiInput
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const helperId = helperText && !error ? `${id}-helper` : undefined;
    const describedByIds = [errorId, helperId].filter(Boolean).join(' ');

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <UiLabel htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </UiLabel>
        )}
        <div className={cn("relative", IconLeft ? "flex items-center" : "")}>
          {IconLeft && (
            <IconLeft
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
          )}
          <UiInput
            type={type}
            id={id}
            name={name || id}
            value={value ?? ''} // Ensure value is controlled, default to empty string if null/undefined
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            ref={ref}
            className={cn(
              "w-full bg-background border-input focus:border-primary focus:ring-primary", // Base styles from ui/input
              IconLeft ? "pl-10" : "", // Padding for left icon
              error ? "border-destructive focus-visible:ring-destructive/50" : "focus-visible:ring-ring",
              inputClassName
            )}
            aria-invalid={!!error}
            aria-required={required ? 'true' : undefined}
            aria-describedby={describedByIds || undefined}
            {...props}
          />
        </div>
        {error && (
          <div id={errorId} className="flex items-center text-xs text-destructive pt-1" role="alert">
            <AlertCircle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-muted-foreground pt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "InputWrapper"; // Changed display name to avoid confusion with UiInput

export default Input;
