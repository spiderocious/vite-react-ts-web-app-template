/**
 * Avatar Component
 *
 * A flexible avatar component for displaying user profile pictures, initials, or icons.
 */

import clsx from 'clsx';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  /** Size of the avatar */
  size?: AvatarSize;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Name for generating initials */
  name?: string;
  /** Custom initials (overrides name) */
  initials?: string;
  /** Icon to display when no image/initials */
  icon?: ReactNode;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom text color */
  textColor?: string;
  /** Whether to show a status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Whether the avatar should be clickable */
  clickable?: boolean;
  /** Callback when avatar is clicked */
  onClick?: () => void;
}

const avatarSizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
  '2xl': 'h-16 w-16 text-xl',
};

const avatarShapes = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

const statusColors = {
  online: 'bg-success',
  offline: 'bg-neutral-400',
  away: 'bg-warning',
  busy: 'bg-error',
};

const statusSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
  '2xl': 'h-4 w-4',
};

/**
 * Default user icon
 */
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Generate initials from name
 */
function generateInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Generate background color from name
 */
function generateBackgroundColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length] || 'bg-neutral-400';
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      className,
      size = 'md',
      shape = 'circle',
      name,
      initials,
      icon,
      backgroundColor,
      textColor = 'text-white',
      status,
      clickable = false,
      onClick,
      src,
      alt,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Generate initials and background color
    const displayInitials = initials || (name ? generateInitials(name) : '');
    const bgColor = backgroundColor || (name ? generateBackgroundColor(name) : 'bg-neutral-400');

    // Determine what to show
    const showImage = src && !imageError && imageLoaded;
    const showInitials = !showImage && displayInitials;
    const showIcon = !showImage && !showInitials;

    const avatarElement = (
      <div
        className={clsx(
          // Base styles
          'relative inline-flex items-center justify-center overflow-hidden',
          'select-none font-medium',

          // Size styles
          avatarSizes[size],

          // Shape styles
          avatarShapes[shape],

          // Background color
          !showImage && bgColor,

          // Text color
          textColor,

          // Clickable styles
          clickable && [
            'cursor-pointer transition-transform duration-fast',
            'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          ],

          className
        )}
        onClick={clickable ? onClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
      >
        {/* Image */}
        {src && (
          <img
            ref={ref}
            src={src}
            alt={alt || name || 'Avatar'}
            className={clsx(
              'h-full w-full object-cover',
              avatarShapes[shape],
              showImage ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            {...props}
          />
        )}

        {/* Initials */}
        {showInitials && <span className="leading-none">{displayInitials}</span>}

        {/* Icon */}
        {showIcon && (
          <span className="text-neutral-400">{icon || <UserIcon className="h-3/5 w-3/5" />}</span>
        )}

        {/* Status indicator */}
        {status && (
          <span
            className={clsx(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
              statusSizes[size],
              statusColors[status]
            )}
          />
        )}
      </div>
    );

    return avatarElement;
  }
);

Avatar.displayName = 'Avatar';
