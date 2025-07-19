/**
 * Badge Component
 *
 * A flexible badge component for labels, status indicators, and notifications.
 */

import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Whether to show a dot indicator */
  dot?: boolean;
  /** Icon to display in the badge */
  icon?: ReactNode;
  /** Whether the badge should be removable */
  removable?: boolean;
  /** Callback when badge is removed */
  onRemove?: () => void;
  children?: ReactNode;
}

const badgeVariants = {
  default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
  primary: 'bg-primary-100 text-primary-800 border-primary-200',
  secondary: 'bg-neutral-200 text-neutral-900 border-neutral-300',
  success: 'bg-success-100 text-success-800 border-success-200',
  warning: 'bg-warning-100 text-warning-800 border-warning-200',
  error: 'bg-error-100 text-error-800 border-error-200',
  info: 'bg-info-100 text-info-800 border-info-200',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-4 w-4',
};

/**
 * Remove icon
 */
function RemoveIcon({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={clsx(
        'ml-1 inline-flex items-center justify-center rounded-full',
        'hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current',
        'transition-colors duration-fast',
        className
      )}
      onClick={onClick}
      aria-label="Remove"
    >
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      icon,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          // Base styles
          'inline-flex items-center rounded-full border font-medium',
          'whitespace-nowrap',

          // Size styles
          badgeSizes[size],

          // Variant styles
          badgeVariants[variant],

          // Dot variant
          dot && 'px-2',

          className
        )}
        {...props}
      >
        {/* Dot indicator */}
        {dot && (
          <span
            className={clsx('mr-1.5 h-2 w-2 rounded-full', {
              'bg-neutral-400': variant === 'default',
              'bg-primary': variant === 'primary',
              'bg-neutral-500': variant === 'secondary',
              'bg-success': variant === 'success',
              'bg-warning': variant === 'warning',
              'bg-error': variant === 'error',
              'bg-info': variant === 'info',
            })}
          />
        )}

        {/* Icon */}
        {icon && !dot && (
          <span className={clsx(iconSizes[size], children && 'mr-1')} aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {removable && onRemove && <RemoveIcon onClick={onRemove} />}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
