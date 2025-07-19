/**
 * Switch Component
 *
 * A toggle switch component with validation states and accessibility features.
 */

import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';
export type ValidationState = 'default' | 'success' | 'warning' | 'error';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size of the switch */
  size?: SwitchSize;
  /** Validation state */
  state?: ValidationState;
  /** Label text for the switch */
  label?: ReactNode;
  /** Description text below the label */
  description?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Position of the label */
  labelPosition?: 'left' | 'right';
}

const switchSizes = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
};

const switchStates = {
  default: {
    trackOff: 'bg-neutral-200',
    trackOn: 'bg-primary',
    thumb: 'bg-white',
    label: 'text-text-primary',
    focus: 'focus:ring-primary',
  },
  success: {
    trackOff: 'bg-neutral-200',
    trackOn: 'bg-success',
    thumb: 'bg-white',
    label: 'text-text-primary',
    focus: 'focus:ring-success',
  },
  warning: {
    trackOff: 'bg-neutral-200',
    trackOn: 'bg-warning',
    thumb: 'bg-white',
    label: 'text-text-primary',
    focus: 'focus:ring-warning',
  },
  error: {
    trackOff: 'bg-neutral-200',
    trackOn: 'bg-error',
    thumb: 'bg-white',
    label: 'text-text-primary',
    focus: 'focus:ring-error',
  },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
      labelPosition = 'right',
      checked = false,
      disabled = false,
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

    const switchId =
      id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const switchElement = (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={clsx(
          // Base styles
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-fast ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Size styles
          switchSizes[size].track,

          // State and checked styles
          checked ? switchStates[effectiveState].trackOn : switchStates[effectiveState].trackOff,
          switchStates[effectiveState].focus,

          className
        )}
        onClick={() => {
          if (!disabled && props.onChange) {
            props.onChange({ target: { checked: !checked } } as any);
          }
        }}
      >
        <span className="sr-only">{label}</span>
        <span
          className={clsx(
            // Base thumb styles
            'pointer-events-none inline-block rounded-full shadow transform ring-0',
            'transition duration-fast ease-in-out',

            // Size styles
            switchSizes[size].thumb,

            // Position styles
            checked ? switchSizes[size].translate : 'translate-x-0',

            // Color styles
            switchStates[effectiveState].thumb
          )}
        />
      </button>
    );

    const labelElement = (label || description) && (
      <div className={clsx('flex flex-col', labelPosition === 'left' ? 'mr-3' : 'ml-3')}>
        {label && (
          <label
            htmlFor={switchId}
            className={clsx(
              'text-sm font-medium cursor-pointer',
              switchStates[effectiveState].label,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={clsx('text-xs text-text-secondary mt-1', disabled && 'opacity-50')}>
            {description}
          </p>
        )}
      </div>
    );

    return (
      <div className="flex flex-col">
        <div
          className={clsx(
            'flex items-start',
            labelPosition === 'left' ? 'flex-row-reverse justify-end' : 'flex-row'
          )}
        >
          {/* Hidden input for form compatibility */}
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          {switchElement}
          {labelElement}
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

Switch.displayName = 'Switch';
