/**
 * Input Component
 *
 * A flexible input component with validation states, icons, and accessibility features.
 */

import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled';
export type ValidationState = 'default' | 'success' | 'warning' | 'error';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size of the input */
  size?: InputSize;
  /** Visual variant of the input */
  variant?: InputVariant;
  /** Validation state */
  state?: ValidationState;
  /** Icon to display before the input */
  leftIcon?: ReactNode;
  /** Icon to display after the input */
  rightIcon?: ReactNode;
  /** Helper text to display below the input */
  helperText?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Label for the input */
  label?: string;
  /** Whether the label should be hidden (for accessibility) */
  hideLabel?: boolean;
  /** Make the input full width */
  fullWidth?: boolean;
}

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const inputVariants = {
  default: 'bg-surface border-border',
  filled: 'bg-neutral-100 border-transparent',
};

const inputStates = {
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      state = 'default',
      leftIcon,
      rightIcon,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      label,
      hideLabel = false,
      fullWidth = true,
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

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium text-text-primary mb-1',
              hideLabel && 'sr-only'
            )}
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={clsx(iconSizes[size], 'text-text-tertiary')} aria-hidden="true">
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              // Base styles
              'block rounded-md border transition-colors duration-fast',
              'placeholder-text-tertiary',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Size styles
              inputSizes[size],

              // Variant styles
              inputVariants[variant],

              // State styles
              inputStates[effectiveState].border,
              inputStates[effectiveState].text,

              // Icon padding
              {
                'pl-9': leftIcon && size === 'sm',
                'pl-10': leftIcon && size === 'md',
                'pl-12': leftIcon && size === 'lg',
                'pr-9': rightIcon && size === 'sm',
                'pr-10': rightIcon && size === 'md',
                'pr-12': rightIcon && size === 'lg',
              },

              // Width
              fullWidth && 'w-full',

              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className={clsx(iconSizes[size], 'text-text-tertiary')} aria-hidden="true">
                {rightIcon}
              </span>
            </div>
          )}
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

Input.displayName = 'Input';
