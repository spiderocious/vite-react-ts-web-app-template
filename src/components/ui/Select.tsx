/**
 * Select Component
 *
 * A flexible select component with validation states and accessibility features.
 */

import clsx from 'clsx';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'filled';
export type ValidationState = 'default' | 'success' | 'warning' | 'error';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Size of the select */
  size?: SelectSize;
  /** Visual variant of the select */
  variant?: SelectVariant;
  /** Validation state */
  state?: ValidationState;
  /** Options for the select */
  options?: SelectOption[];
  /** Placeholder option */
  placeholder?: string;
  /** Helper text to display below the select */
  helperText?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Label for the select */
  label?: string;
  /** Whether the label should be hidden (for accessibility) */
  hideLabel?: boolean;
  /** Make the select full width */
  fullWidth?: boolean;
  /** Icon to display before the select */
  leftIcon?: ReactNode;
  children?: ReactNode;
}

const selectSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const selectVariants = {
  default: 'bg-surface border-border',
  filled: 'bg-neutral-100 border-transparent',
};

const selectStates = {
  default: {
    border: 'border-border focus:border-primary focus:ring-primary',
    text: 'text-text-primary',
  },
  success: {
    border: 'border-success-border focus:border-success focus:ring-success',
    text: 'text-text-primary',
  },
  warning: {
    border: 'border-warning-border focus:border-warning focus:ring-warning',
    text: 'text-text-primary',
  },
  error: {
    border: 'border-error-border focus:border-error focus:ring-error',
    text: 'text-text-primary',
  },
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * Chevron down icon for select
 */
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      state = 'default',
      options,
      placeholder,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      label,
      hideLabel = false,
      fullWidth = true,
      leftIcon,
      children,
      id,
      ...props
    },
    ref
  ) => {
    // Determine the effective state based on messages
    const effectiveState = errorMessage
      ? 'error'
      : warningMessage
        ? 'warning'
        : successMessage
          ? 'success'
          : state;

    // Determine the message to display
    const message = errorMessage || warningMessage || successMessage || helperText;
    const messageColor = {
      error: 'text-error-text',
      warning: 'text-warning-text',
      success: 'text-success-text',
      default: 'text-text-secondary',
    }[effectiveState];

    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={clsx(
              'block text-sm font-medium text-text-primary mb-1',
              hideLabel && 'sr-only'
            )}
          >
            {label}
          </label>
        )}

        {/* Select container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={clsx(iconSizes[size], 'text-text-tertiary')} aria-hidden="true">
                {leftIcon}
              </span>
            </div>
          )}

          {/* Select element */}
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              // Base styles
              'block rounded-md border transition-colors duration-fast appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Size styles
              selectSizes[size],

              // Variant styles
              selectVariants[variant],

              // State styles
              selectStates[effectiveState].border,
              selectStates[effectiveState].text,

              // Icon padding
              {
                'pl-9': leftIcon && size === 'sm',
                'pl-10': leftIcon && size === 'md',
                'pl-12': leftIcon && size === 'lg',
                'pr-8': size === 'sm',
                'pr-9': size === 'md',
                'pr-10': size === 'lg',
              },

              // Width
              fullWidth && 'w-full',

              className
            )}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options from props */}
            {options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}

            {/* Children options */}
            {children}
          </select>

          {/* Chevron down icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className={clsx(iconSizes[size], 'text-text-tertiary')} />
          </div>
        </div>

        {/* Helper/Error/Success message */}
        {message && (
          <p
            className={clsx('mt-1 text-xs', messageColor)}
            role={effectiveState === 'error' ? 'alert' : undefined}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
