/**
 * Tooltip Component
 *
 * Tooltip component for showing helpful information on hover or focus.
 */

import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export type TooltipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'dark';
export type TooltipSize = 'sm' | 'md' | 'lg';

export interface TooltipProps {
  /** Content to show inside the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Placement of the tooltip relative to the trigger */
  placement?: TooltipPlacement;
  /** Visual variant of the tooltip */
  variant?: TooltipVariant;
  /** Size of the tooltip */
  size?: TooltipSize;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Whether to show an arrow pointing to the trigger */
  arrow?: boolean;
  /** Custom class name for the tooltip content */
  className?: string;
  /** Trigger events */
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  /** Whether tooltip is visible (controlled mode) */
  open?: boolean;
  /** Callback when visibility changes */
  onOpenChange?: (open: boolean) => void;
  /** Maximum width of the tooltip */
  maxWidth?: number;
}

const tooltipVariants = {
  default: 'bg-neutral-900 text-white border-neutral-800',
  primary: 'bg-primary text-white border-primary-600',
  success: 'bg-success text-white border-success-600',
  warning: 'bg-warning text-warning-900 border-warning-600',
  error: 'bg-error text-white border-error-600',
  dark: 'bg-neutral-800 text-white border-neutral-700',
};

const tooltipSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const arrowSizes = {
  sm: 'h-1 w-1',
  md: 'h-1.5 w-1.5',
  lg: 'h-2 w-2',
};

// Helper function to calculate tooltip position
const getTooltipPosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
  offset = 8
) => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = triggerRect.top + scrollY - tooltipRect.height - offset;
      left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'top-start':
      top = triggerRect.top + scrollY - tooltipRect.height - offset;
      left = triggerRect.left + scrollX;
      break;
    case 'top-end':
      top = triggerRect.top + scrollY - tooltipRect.height - offset;
      left = triggerRect.right + scrollX - tooltipRect.width;
      break;
    case 'bottom':
      top = triggerRect.bottom + scrollY + offset;
      left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom-start':
      top = triggerRect.bottom + scrollY + offset;
      left = triggerRect.left + scrollX;
      break;
    case 'bottom-end':
      top = triggerRect.bottom + scrollY + offset;
      left = triggerRect.right + scrollX - tooltipRect.width;
      break;
    case 'left':
      top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.left + scrollX - tooltipRect.width - offset;
      break;
    case 'left-start':
      top = triggerRect.top + scrollY;
      left = triggerRect.left + scrollX - tooltipRect.width - offset;
      break;
    case 'left-end':
      top = triggerRect.bottom + scrollY - tooltipRect.height;
      left = triggerRect.left + scrollX - tooltipRect.width - offset;
      break;
    case 'right':
      top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
      left = triggerRect.right + scrollX + offset;
      break;
    case 'right-start':
      top = triggerRect.top + scrollY;
      left = triggerRect.right + scrollX + offset;
      break;
    case 'right-end':
      top = triggerRect.bottom + scrollY - tooltipRect.height;
      left = triggerRect.right + scrollX + offset;
      break;
  }

  // Keep tooltip within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < 0) left = 8;
  if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8;
  if (top < 0) top = 8;
  if (top + tooltipRect.height > viewportHeight + scrollY)
    top = viewportHeight + scrollY - tooltipRect.height - 8;

  return { top, left };
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({
    children,
    content,
    placement = 'top',
    variant = 'default',
    size = 'md',
    disabled = false,
    delay = 200,
    arrow = true,
    className,
    trigger = 'hover',
    open: controlledOpen,
    onOpenChange,
    maxWidth = 320,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const open = controlledOpen ?? isOpen;

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const newPosition = getTooltipPosition(triggerRect, tooltipRect, placement);
      setPosition(newPosition);
    };

    useLayoutEffect(() => {
      if (open) {
        updatePosition();
      }
    }, [open, content, placement]);

    const showTooltip = () => {
      if (disabled) return;

      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsOpen(true);
          onOpenChange?.(true);
        }, delay);
      } else {
        setIsOpen(true);
        onOpenChange?.(true);
      }
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(false);
      onOpenChange?.(false);
    };

    const toggleTooltip = () => {
      if (open) {
        hideTooltip();
      } else {
        showTooltip();
      }
    };

    const handleTriggerProps = () => {
      const props: HTMLAttributes<HTMLElement> = {};

      if (trigger === 'hover') {
        props.onMouseEnter = showTooltip;
        props.onMouseLeave = hideTooltip;
        props.onFocus = showTooltip;
        props.onBlur = hideTooltip;
      } else if (trigger === 'click') {
        props.onClick = toggleTooltip;
      } else if (trigger === 'focus') {
        props.onFocus = showTooltip;
        props.onBlur = hideTooltip;
      }

      return props;
    };

    // Clone the trigger element to add event handlers
    const triggerElement =
      typeof children === 'object' && children !== null && 'type' in children
        ? (children as React.ReactElement)
        : children;

    const clonedTrigger =
      typeof triggerElement === 'object' && triggerElement !== null && 'type' in triggerElement ? (
        React.cloneElement(triggerElement as React.ReactElement<any>, {
          ...handleTriggerProps(),
          ref: (node: HTMLElement) => {
            triggerRef.current = node;
            // Handle forwarded refs from the original element
            const originalRef = (triggerElement as any).ref;
            if (typeof originalRef === 'function') {
              originalRef(node);
            } else if (originalRef) {
              originalRef.current = node;
            }
          },
        })
      ) : (
        <span {...handleTriggerProps()} ref={triggerRef}>
          {children}
        </span>
      );

    const tooltipContent = open && content && (
      <div
        ref={tooltipRef}
        className={clsx(
          'pointer-events-none fixed z-50 rounded-lg border shadow-lg transition-opacity duration-200',
          tooltipVariants[variant],
          tooltipSizes[size],
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          maxWidth,
        }}
        role="tooltip"
      >
        {content}

        {/* Arrow */}
        {arrow && (
          <div
            className={clsx(
              'absolute',
              arrowSizes[size],
              tooltipVariants[variant].split(' ')[0], // Get background color
              'rotate-45',
              {
                // Top placements - arrow points up
                'bottom-0 translate-y-full': placement.startsWith('top'),

                // Bottom placements - arrow points down
                'top-0 -translate-y-full': placement.startsWith('bottom'),

                // Left placements - arrow points left
                'right-0 translate-x-full': placement.startsWith('left'),

                // Right placements - arrow points right
                'left-0 -translate-x-full': placement.startsWith('right'),
              },
              // Horizontal positioning
              placement === 'top' || placement === 'bottom' ? 'left-1/2 -translate-x-1/2' : '',
              placement === 'top-start' || placement === 'bottom-start' ? 'left-2' : '',
              placement === 'top-end' || placement === 'bottom-end' ? 'right-2' : '',

              // Vertical positioning
              placement === 'left' || placement === 'right' ? 'top-1/2 -translate-y-1/2' : '',
              placement === 'left-start' || placement === 'right-start' ? 'top-2' : '',
              placement === 'left-end' || placement === 'right-end' ? 'bottom-2' : ''
            )}
          />
        )}
      </div>
    );

    return (
      <>
        {clonedTrigger}
        {typeof window !== 'undefined' && createPortal(tooltipContent, document.body)}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

// Simple tooltip hook for programmatic usage
export const useTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => {
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
    toggle: () => {
      setIsOpen(!isOpen);
    },
  };
};
