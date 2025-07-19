/**
 * Card Component
 *
 * Flexible content container component with multiple variants and layouts.
 */

import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the card */
  variant?: CardVariant;
  /** Size of the card padding */
  size?: CardSize;
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
}

const cardVariants = {
  default: 'bg-white border border-neutral-200',
  outlined: 'bg-white border-2 border-neutral-300',
  elevated: 'bg-white border border-neutral-200 shadow-md',
  filled: 'bg-neutral-50 border border-neutral-200',
};

const cardSizes = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      children,
      variant = 'default',
      size = 'md',
      interactive = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg transition-all duration-200',
          cardVariants[variant],
          cardSizes[size],

          // Interactive states
          interactive &&
            !disabled && [
              'cursor-pointer hover:shadow-lg hover:scale-[1.02]',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            ],

          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed',

          className
        )}
        tabIndex={interactive && !disabled ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title of the card */
  title?: ReactNode;
  /** Subtitle or description */
  subtitle?: ReactNode;
  /** Action elements (buttons, etc.) */
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, title, subtitle, action, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex items-start justify-between border-b border-neutral-200 pb-4 mb-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {title && <h3 className="text-lg font-semibold text-text-primary truncate">{title}</h3>}
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

// Card Body Component
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('text-text-secondary', className)} {...props}>
      {children}
    </div>
  )
);
CardBody.displayName = 'CardBody';

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether to add border top */
  bordered?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, bordered = true, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex items-center justify-between pt-4 mt-4',
        bordered && 'border-t border-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';

// Card Image Component
export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  /** Image source */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Whether image should cover the container */
  cover?: boolean;
  /** Aspect ratio */
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, cover = true, aspectRatio = 'auto', ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'overflow-hidden rounded-t-lg -mx-4 -mt-4 mb-4',
        {
          'aspect-square': aspectRatio === 'square',
          'aspect-video': aspectRatio === 'video',
          'aspect-[3/1]': aspectRatio === 'wide',
        },
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={clsx('w-full h-full', cover ? 'object-cover' : 'object-contain')}
      />
    </div>
  )
);
CardImage.displayName = 'CardImage';
