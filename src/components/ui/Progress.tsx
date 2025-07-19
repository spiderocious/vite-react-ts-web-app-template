/**
 * Progress Component
 *
 * Progress bar component for showing completion status.
 */

import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Size of the progress bar */
  size?: ProgressSize;
  /** Visual variant of the progress bar */
  variant?: ProgressVariant;
  /** Whether to show the percentage text */
  showValue?: boolean;
  /** Custom label for the progress */
  label?: string;
  /** Whether the progress should be animated */
  animated?: boolean;
  /** Whether the progress is indeterminate */
  indeterminate?: boolean;
}

const progressSizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const progressVariants = {
  default: {
    bg: 'bg-neutral-200',
    fill: 'bg-neutral-600',
  },
  primary: {
    bg: 'bg-primary-100',
    fill: 'bg-primary',
  },
  success: {
    bg: 'bg-success-100',
    fill: 'bg-success',
  },
  warning: {
    bg: 'bg-warning-100',
    fill: 'bg-warning',
  },
  error: {
    bg: 'bg-error-100',
    fill: 'bg-error',
  },
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = 'md',
      variant = 'primary',
      showValue = false,
      label,
      animated = false,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    // Normalize the value to percentage
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayValue = Math.round(percentage);

    return (
      <div ref={ref} className={clsx('w-full', className)} {...props}>
        {/* Label and value */}
        {(label || showValue) && (
          <div className={clsx('mb-2 flex justify-between', textSizes[size])}>
            {label && <span className="font-medium text-text-primary">{label}</span>}
            {showValue && !indeterminate && (
              <span className="text-text-secondary">{displayValue}%</span>
            )}
          </div>
        )}

        {/* Progress bar container */}
        <div
          className={clsx(
            'w-full overflow-hidden rounded-full',
            progressSizes[size],
            progressVariants[variant].bg
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        >
          {/* Progress bar fill */}
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-300 ease-out',
              progressVariants[variant].fill,

              // Indeterminate animation
              indeterminate && [
                'animate-pulse',
                'bg-gradient-to-r from-transparent via-current to-transparent',
                'w-full',
              ],

              // Animated progress
              animated && !indeterminate && 'transition-all duration-500 ease-in-out'
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Preset progress components
export const ProgressCircular = forwardRef<HTMLDivElement, Omit<ProgressProps, 'size'>>(
  ({ className, value, max = 100, variant = 'primary', showValue = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayValue = Math.round(percentage);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        className={clsx('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="6"
            className={clsx('text-neutral-200', {
              'text-primary-100': variant === 'primary',
              'text-success-100': variant === 'success',
              'text-warning-100': variant === 'warning',
              'text-error-100': variant === 'error',
            })}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={clsx('transition-all duration-300 ease-out', {
              'text-neutral-600': variant === 'default',
              'text-primary': variant === 'primary',
              'text-success': variant === 'success',
              'text-warning': variant === 'warning',
              'text-error': variant === 'error',
            })}
          />
        </svg>

        {/* Center value */}
        {showValue && (
          <span className="absolute text-sm font-semibold text-text-primary">{displayValue}%</span>
        )}
      </div>
    );
  }
);
ProgressCircular.displayName = 'ProgressCircular';
