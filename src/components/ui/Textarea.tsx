/**
 * Textarea Component
 *
 * A flexible textarea component with validation states and accessibility features.
 */

import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaVariant = 'default' | 'filled';
export type ValidationState = 'default' | 'success' | 'warning' | 'error';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Size of the textarea */
  size?: TextareaSize;
  /** Visual variant of the textarea */
  variant?: TextareaVariant;
  /** Validation state */
  state?: ValidationState;
  /** Helper text to display below the textarea */
  helperText?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Label for the textarea */
  label?: string;
  /** Whether the label should be hidden (for accessibility) */
  hideLabel?: boolean;
  /** Make the textarea full width */
  fullWidth?: boolean;
  /** Whether to show character count */
  showCharCount?: boolean;
  /** Maximum character length */
  maxLength?: number;
}

const textareaSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const textareaVariants = {
  default: 'bg-surface border-border',
  filled: 'bg-neutral-100 border-transparent',
};

const textareaStates = {
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

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      state = 'default',
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      label,
      hideLabel = false,
      fullWidth = true,
      showCharCount = false,
      maxLength,
      value = '',
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

    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={clsx(
              'block text-sm font-medium text-text-primary mb-1',
              hideLabel && 'sr-only'
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea element */}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          className={clsx(
            // Base styles
            'block rounded-md border transition-colors duration-fast resize-y',
            'placeholder-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',

            // Size styles
            textareaSizes[size],

            // Variant styles
            textareaVariants[variant],

            // State styles
            textareaStates[effectiveState].border,
            textareaStates[effectiveState].text,

            // Width
            fullWidth && 'w-full',

            className
          )}
          {...props}
        />

        {/* Footer with message and character count */}
        {(message || showCharCount) && (
          <div className="mt-1 flex justify-between items-center">
            {/* Helper/Error/Success message */}
            {message && (
              <p
                className={clsx('text-xs', messageColor)}
                role={effectiveState === 'error' ? 'alert' : undefined}
              >
                {message}
              </p>
            )}

            {/* Character count */}
            {showCharCount && (
              <span
                className={clsx(
                  'text-xs',
                  maxLength && currentLength > maxLength * 0.9
                    ? 'text-warning-text'
                    : 'text-text-tertiary'
                )}
              >
                {currentLength}
                {maxLength && `/${maxLength}`}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
