/**
 * Spinner Component
 *
 * Loading spinner component for indicating loading states.
 */

import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'white';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Visual variant of the spinner */
  variant?: SpinnerVariant;
  /** Custom label for accessibility */
  label?: string;
  /** Whether to show text below spinner */
  showLabel?: boolean;
}

const spinnerSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const spinnerVariants = {
  default: 'text-neutral-600',
  primary: 'text-primary',
  white: 'text-white',
};

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      label = 'Loading...',
      showLabel = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx('inline-flex flex-col items-center', className)}
        role="status"
        aria-label={label}
        {...props}
      >
        {/* Spinner SVG */}
        <svg
          className={clsx('animate-spin', spinnerSizes[size], spinnerVariants[variant])}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        {/* Optional label */}
        {showLabel && (
          <span className={clsx('mt-2 font-medium', textSizes[size], spinnerVariants[variant])}>
            {label}
          </span>
        )}

        {/* Screen reader text */}
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

// Preset spinner components
export const SpinnerOverlay = forwardRef<HTMLDivElement, Omit<SpinnerProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <div
      className={clsx(
        'absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm',
        className
      )}
    >
      <Spinner ref={ref} variant="primary" showLabel {...props} />
    </div>
  )
);
SpinnerOverlay.displayName = 'SpinnerOverlay';

export const SpinnerButton = forwardRef<HTMLDivElement, Omit<SpinnerProps, 'showLabel'>>(
  (props, ref) => <Spinner ref={ref} showLabel={false} {...props} />
);
SpinnerButton.displayName = 'SpinnerButton';
