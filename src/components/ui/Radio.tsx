/**
 * Radio Component & RadioGroup
 *
 * Flexible radio components with validation states and accessibility features.
 */

import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { createContext, forwardRef, useContext } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';
export type ValidationState = 'default' | 'success' | 'warning' | 'error';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupContextType {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: RadioSize;
  state?: ValidationState;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

export interface RadioGroupProps {
  /** Name for the radio group */
  name?: string;
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Size of radios */
  size?: RadioSize;
  /** Validation state */
  state?: ValidationState;
  /** Options for the radio group */
  options?: RadioOption[];
  /** Label for the radio group */
  label?: string;
  /** Helper text to display below the group */
  helperText?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Whether the group is disabled */
  disabled?: boolean;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Custom class name */
  className?: string;
  children?: ReactNode;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size of the radio */
  size?: RadioSize;
  /** Validation state */
  state?: ValidationState;
  /** Label text for the radio */
  label?: ReactNode;
  /** Description text below the label */
  description?: string;
}

const radioSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const radioStates = {
  default: {
    radio: 'border-border text-primary focus:ring-primary',
    label: 'text-text-primary',
  },
  success: {
    radio: 'border-success-border text-success focus:ring-success',
    label: 'text-text-primary',
  },
  warning: {
    radio: 'border-warning-border text-warning focus:ring-warning',
    label: 'text-text-primary',
  },
  error: {
    radio: 'border-error-border text-error focus:ring-error',
    label: 'text-text-primary',
  },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { className, size, state, label, description, value, onChange, name, disabled, id, ...props },
    ref
  ) => {
    const context = useContext(RadioGroupContext);

    // Use context values as defaults
    const effectiveSize = size || context?.size || 'md';
    const effectiveState = state || context?.state || 'default';
    const effectiveName = name || context?.name;
    const effectiveDisabled = disabled || context?.disabled;
    const isChecked = context?.value === value;

    const handleChange = () => {
      if (onChange) {
        onChange({ target: { value } } as any);
      } else if (context?.onChange && typeof value === 'string') {
        context.onChange(value);
      }
    };

    const radioId = id || (typeof label === 'string' ? `${effectiveName}-${value}` : undefined);

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            name={effectiveName}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={effectiveDisabled}
            className={clsx(
              // Base styles
              'border-2 bg-surface transition-colors duration-fast',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
              'disabled:opacity-50 disabled:cursor-not-allowed',

              // Size styles
              radioSizes[effectiveSize],

              // State styles
              radioStates[effectiveState].radio,

              className
            )}
            {...props}
          />
        </div>

        {/* Label and description */}
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={radioId}
                className={clsx(
                  'text-sm font-medium cursor-pointer',
                  radioStates[effectiveState].label,
                  effectiveDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={clsx(
                  'text-xs text-text-secondary mt-1',
                  effectiveDisabled && 'opacity-50'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export function RadioGroup({
  name,
  value,
  onChange,
  size = 'md',
  state = 'default',
  options,
  label,
  helperText,
  errorMessage,
  successMessage,
  warningMessage,
  disabled = false,
  direction = 'vertical',
  className,
  children,
}: RadioGroupProps) {
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

  const contextValue: RadioGroupContextType = {
    ...(name && { name }),
    ...(value && { value }),
    ...(onChange && { onChange }),
    size,
    state: effectiveState,
    disabled,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={clsx('flex flex-col', className)}>
        {/* Label */}
        {label && <legend className="text-sm font-medium text-text-primary mb-2">{label}</legend>}

        {/* Radio options */}
        <div
          className={clsx('space-y-3', direction === 'horizontal' && 'flex space-y-0 space-x-6')}
        >
          {/* Options from props */}
          {options?.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
              {...(option.description && { description: option.description })}
              {...(option.disabled && { disabled: option.disabled })}
            />
          ))}

          {/* Children radios */}
          {children}
        </div>

        {/* Message */}
        {message && (
          <p
            className={clsx('mt-2 text-xs', messageColor)}
            role={effectiveState === 'error' ? 'alert' : undefined}
          >
            {message}
          </p>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
}
