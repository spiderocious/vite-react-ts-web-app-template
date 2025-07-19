/**
 * Button Component
 *
 * A flexible button component with multiple variants, sizes, and states.
 * Supports loading states, disabled states, and accessibility features.
 */

import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'warning';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon to display before the button text */
  leftIcon?: ReactNode;
  /** Icon to display after the button text */
  rightIcon?: ReactNode;
  /** Make the button full width */
  fullWidth?: boolean;
  /** Custom loading text */
  loadingText?: string;
  children?: ReactNode;
}

const buttonVariants = {
  primary:
    'bg-primary text-primary-text hover:bg-primary-hover focus:ring-primary border-transparent',
  secondary:
    'bg-secondary text-secondary-text hover:bg-secondary-hover focus:ring-secondary border-transparent',
  outline:
    'bg-transparent text-text-primary hover:bg-surface-hover focus:ring-primary border-border',
  ghost:
    'bg-transparent text-text-primary hover:bg-surface-hover focus:ring-primary border-transparent',
  destructive: 'bg-error text-white hover:bg-error-600 focus:ring-error border-transparent',
  success: 'bg-success text-white hover:bg-success-600 focus:ring-success border-transparent',
  warning: 'bg-warning text-white hover:bg-warning-600 focus:ring-warning border-transparent',
};

const buttonSizes = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-md',
  xl: 'px-8 py-4 text-lg rounded-lg',
};

const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

/**
 * Loading spinner component
 */
function LoadingSpinner({ size }: { size: ButtonSize }) {
  return (
    <svg
      className={clsx('animate-spin', iconSizes[size])}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-all duration-fast',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
          'border',

          // Size styles
          buttonSizes[size],

          // Variant styles
          buttonVariants[variant],

          // State styles
          {
            'opacity-50 cursor-not-allowed': isDisabled,
            'w-full': fullWidth,
          },

          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Left icon or loading spinner */}
        {loading ? (
          <LoadingSpinner size={size} />
        ) : leftIcon ? (
          <span className={clsx(iconSizes[size], children && 'mr-2')} aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {/* Button content */}
        {loading && loadingText ? loadingText : children}

        {/* Right icon (hidden during loading) */}
        {!loading && rightIcon && (
          <span className={clsx(iconSizes[size], children && 'ml-2')} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
