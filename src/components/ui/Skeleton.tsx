/**
 * Skeleton Component
 *
 * Loading skeleton component for displaying placeholder content while data is loading.
 */

import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonSize = 'sm' | 'md' | 'lg';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the skeleton */
  variant?: SkeletonVariant;
  /** Size preset for common use cases */
  size?: SkeletonSize;
  /** Custom width */
  width?: string | number;
  /** Custom height */
  height?: string | number;
  /** Number of lines for text skeleton */
  lines?: number;
  /** Whether animation should be disabled */
  noAnimation?: boolean;
  /** Speed of animation */
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

const skeletonVariants = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg',
};

const skeletonSizes = {
  text: {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
  },
  circular: {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  },
  rectangular: {
    sm: 'h-16 w-24',
    md: 'h-24 w-32',
    lg: 'h-32 w-48',
  },
  rounded: {
    sm: 'h-16 w-24',
    md: 'h-24 w-32',
    lg: 'h-32 w-48',
  },
};

const animationSpeeds = {
  slow: 'animate-pulse',
  normal: 'animate-pulse',
  fast: 'animate-pulse',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'text',
      size = 'md',
      width,
      height,
      lines = 1,
      noAnimation = false,
      animationSpeed = 'normal',
      style,
      ...props
    },
    ref
  ) => {
    // Custom styles for width and height
    const customStyle = {
      ...style,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    };

    // For text variant with multiple lines
    if (variant === 'text' && lines > 1) {
      return (
        <div className={clsx('space-y-2', className)} ref={ref} {...props}>
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              className={clsx(
                // Base styles
                'bg-neutral-200 dark:bg-neutral-700',

                // Animation
                !noAnimation && animationSpeeds[animationSpeed],

                // Variant styles
                skeletonVariants[variant],

                // Size styles (only for text without custom dimensions)
                !width && !height && skeletonSizes[variant][size],

                // Last line should be shorter for more realistic look
                index === lines - 1 && !width && 'w-3/4'
              )}
              style={index === lines - 1 ? customStyle : { ...customStyle, width: undefined }}
            />
          ))}
        </div>
      );
    }

    // Single skeleton element
    return (
      <div
        ref={ref}
        className={clsx(
          // Base styles
          'bg-neutral-200 dark:bg-neutral-700',

          // Animation
          !noAnimation && animationSpeeds[animationSpeed],

          // Variant styles
          skeletonVariants[variant],

          // Size styles (only when no custom dimensions)
          !width && !height && skeletonSizes[variant][size],

          className
        )}
        style={customStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Preset skeleton components for common use cases
export const SkeletonText = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => <Skeleton ref={ref} variant="text" {...props} />
);
SkeletonText.displayName = 'SkeletonText';

export const SkeletonAvatar = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => <Skeleton ref={ref} variant="circular" {...props} />
);
SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonImage = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  (props, ref) => <Skeleton ref={ref} variant="rounded" {...props} />
);
SkeletonImage.displayName = 'SkeletonImage';
