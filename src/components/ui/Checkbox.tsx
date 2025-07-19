/**
 * Checkbox Component
 *
 * A flexible checkbox component with validation states and accessibility features.
 */

import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type ValidationState = 'default' | 'success' | 'warning' | 'error';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size of the checkbox */
  size?: CheckboxSize;
  /** Validation state */
  state?: ValidationState;
  /** Label text for the checkbox */
  label?: ReactNode;
  /** Description text below the label */
  description?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Whether the checkbox is indeterminate */
  indeterminate?: boolean;
}

const checkboxSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const checkboxStates = {
  default: {
    checkbox: 'border-border text-primary focus:ring-primary',
    label: 'text-text-primary',
  },
  success: {
    checkbox: 'border-success-border text-success focus:ring-success',
    label: 'text-text-primary',
  },
  warning: {
    checkbox: 'border-warning-border text-warning focus:ring-warning',
    label: 'text-text-primary',
  },
  error: {
    checkbox: 'border-error-border text-error focus:ring-error',
    label: 'text-text-primary',
  },
};

/**
 * Indeterminate icon
 */
function IndeterminateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size = 'md',
      state = 'default',
      label,
      description,
      errorMessage,
      successMessage,
      warningMessage,
      indeterminate = false,
      checked,
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
    const message = errorMessage || warningMessage || successMessage;
    const messageColor = {
      error: 'text-error-text',
      warning: 'text-warning-text',
      success: 'text-success-text',
      default: 'text-text-secondary',
    }[effectiveState];

    const checkboxId =
      id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={indeterminate ? false : checked}
              className={clsx(
                // Base styles
                'rounded border-2 bg-surface transition-colors duration-fast',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
                'disabled:opacity-50 disabled:cursor-not-allowed',

                // Size styles
                checkboxSizes[size],

                // State styles
                checkboxStates[effectiveState].checkbox,

                className
              )}
              {...props}
            />

            {/* Custom checkbox overlay for indeterminate state */}
            {indeterminate && (
              <div
                className={clsx(
                  'absolute pointer-events-none',
                  checkboxSizes[size],
                  'text-primary'
                )}
              >
                <IndeterminateIcon className="h-full w-full" />
              </div>
            )}
          </div>

          {/* Label and description */}
          {(label || description) && (
            <div className="ml-3">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={clsx(
                    'text-sm font-medium cursor-pointer',
                    checkboxStates[effectiveState].label
                  )}
                >
                  {label}
                </label>
              )}
              {description && <p className="text-xs text-text-secondary mt-1">{description}</p>}
            </div>
          )}
        </div>

        {/* Message */}
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

Checkbox.displayName = 'Checkbox';
