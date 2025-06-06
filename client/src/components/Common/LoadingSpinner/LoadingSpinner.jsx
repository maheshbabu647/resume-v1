import React from 'react';
import { cn } from '@/lib/utils'; // For combining class names

const sizeMap = {
  small: 'h-5 w-5',    // Slightly increased for better visibility
  medium: 'h-8 w-8',   // Default size
  large: 'h-12 w-12',
  xlarge: 'h-16 w-16', // Added an extra large option
};

const LoadingSpinner = ({
  size = 'medium',
  center = false,
  className = '',
  label = 'Loading...',
  colorClassName = 'text-primary', // Default to primary theme color
}) => {
  const sizeClass = sizeMap[size] || sizeMap.medium;
  const centerClass = center ? 'flex flex-col justify-center items-center' : '';

  return (
    <div
      className={cn(centerClass, className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg
        className={cn('animate-spin', sizeClass, colorClassName)} // Apply color class here
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true" // SVG is decorative, label is provided
        focusable="false"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor" // Inherits color from parent SVG's text color
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor" // Inherits color from parent SVG's text color
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" // Fuller spinner path
        />
      </svg>
      {/* Visually hidden label for screen readers, if the spinner is centered and prominent,
          you might also want visible text if `center` is true. */}
      {center && label && <span className="sr-only">{label}</span>}
      {!center && <span className="sr-only">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
