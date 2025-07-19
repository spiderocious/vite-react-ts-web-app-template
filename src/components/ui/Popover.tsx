/**
 * Popover Component
 *
 * Popover component for displaying floating content that can contain interactive elements.
 */

import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type PopoverPlacement =
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

export type PopoverVariant = 'default' | 'elevated';
export type PopoverSize = 'sm' | 'md' | 'lg' | 'xl';

export interface PopoverProps {
  /** Content to show inside the popover */
  content: ReactNode;
  /** The element that triggers the popover */
  children: ReactNode;
  /** Placement of the popover relative to the trigger */
  placement?: PopoverPlacement;
  /** Visual variant of the popover */
  variant?: PopoverVariant;
  /** Size of the popover */
  size?: PopoverSize;
  /** Whether the popover is disabled */
  disabled?: boolean;
  /** Whether to show an arrow pointing to the trigger */
  arrow?: boolean;
  /** Custom class name for the popover content */
  className?: string;
  /** Trigger events */
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  /** Whether popover is visible (controlled mode) */
  open?: boolean;
  /** Callback when visibility changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether to close on outside click */
  closeOnOutsideClick?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Offset from the trigger element */
  offset?: number;
  /** Custom width for the popover */
  width?: number;
}

const popoverVariants = {
  default: 'bg-white border border-neutral-200 shadow-lg',
  elevated: 'bg-white border border-neutral-200 shadow-xl',
};

const popoverSizes = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

// Helper function to calculate popover position
const getPopoverPosition = (
  triggerRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopoverPlacement,
  offset = 8
) => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = triggerRect.top + scrollY - popoverRect.height - offset;
      left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
      break;
    case 'top-start':
      top = triggerRect.top + scrollY - popoverRect.height - offset;
      left = triggerRect.left + scrollX;
      break;
    case 'top-end':
      top = triggerRect.top + scrollY - popoverRect.height - offset;
      left = triggerRect.right + scrollX - popoverRect.width;
      break;
    case 'bottom':
      top = triggerRect.bottom + scrollY + offset;
      left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
      break;
    case 'bottom-start':
      top = triggerRect.bottom + scrollY + offset;
      left = triggerRect.left + scrollX;
      break;
    case 'bottom-end':
      top = triggerRect.bottom + scrollY + offset;
      left = triggerRect.right + scrollX - popoverRect.width;
      break;
    case 'left':
      top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
      left = triggerRect.left + scrollX - popoverRect.width - offset;
      break;
    case 'left-start':
      top = triggerRect.top + scrollY;
      left = triggerRect.left + scrollX - popoverRect.width - offset;
      break;
    case 'left-end':
      top = triggerRect.bottom + scrollY - popoverRect.height;
      left = triggerRect.left + scrollX - popoverRect.width - offset;
      break;
    case 'right':
      top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
      left = triggerRect.right + scrollX + offset;
      break;
    case 'right-start':
      top = triggerRect.top + scrollY;
      left = triggerRect.right + scrollX + offset;
      break;
    case 'right-end':
      top = triggerRect.bottom + scrollY - popoverRect.height;
      left = triggerRect.right + scrollX + offset;
      break;
  }

  // Keep popover within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < 8) left = 8;
  if (left + popoverRect.width > viewportWidth - 8) left = viewportWidth - popoverRect.width - 8;
  if (top < 8) top = 8;
  if (top + popoverRect.height > viewportHeight + scrollY - 8) {
    top = viewportHeight + scrollY - popoverRect.height - 8;
  }

  return { top, left };
};

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({
    children,
    content,
    placement = 'bottom',
    variant = 'default',
    size = 'md',
    disabled = false,
    arrow = true,
    className,
    trigger = 'click',
    open: controlledOpen,
    onOpenChange,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    offset = 8,
    width,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const open = controlledOpen ?? isOpen;

    const updatePosition = () => {
      if (!triggerRef.current || !popoverRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      const newPosition = getPopoverPosition(triggerRect, popoverRect, placement, offset);
      setPosition(newPosition);
    };

    useLayoutEffect(() => {
      if (open) {
        updatePosition();
      }
    }, [open, content, placement, offset]);

    const showPopover = () => {
      if (disabled) return;
      setIsOpen(true);
      onOpenChange?.(true);
    };

    const hidePopover = () => {
      setIsOpen(false);
      onOpenChange?.(false);
    };

    const togglePopover = () => {
      if (open) {
        hidePopover();
      } else {
        showPopover();
      }
    };

    // Handle outside clicks
    useEffect(() => {
      if (!open || !closeOnOutsideClick) return;

      const handleOutsideClick = (event: MouseEvent) => {
        if (
          triggerRef.current?.contains(event.target as Node) ||
          popoverRef.current?.contains(event.target as Node)
        ) {
          return;
        }
        hidePopover();
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [open, closeOnOutsideClick]);

    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          hidePopover();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open, closeOnEscape]);

    const handleTriggerProps = () => {
      const props: HTMLAttributes<HTMLElement> = {};

      if (trigger === 'hover') {
        props.onMouseEnter = showPopover;
        props.onMouseLeave = hidePopover;
      } else if (trigger === 'click') {
        props.onClick = togglePopover;
      } else if (trigger === 'focus') {
        props.onFocus = showPopover;
        props.onBlur = hidePopover;
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

    const popoverContent = open && content && (
      <div
        ref={popoverRef}
        className={clsx(
          'fixed z-50 rounded-lg transition-all duration-200',
          popoverVariants[variant],
          popoverSizes[size],
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        style={{
          top: position.top,
          left: position.left,
          width: width ? `${width}px` : undefined,
        }}
        role="dialog"
        aria-modal="false"
      >
        {content}

        {/* Arrow */}
        {arrow && (
          <div
            className={clsx(
              'absolute h-2 w-2 rotate-45 bg-white border',
              popoverVariants[variant].includes('border-neutral-200')
                ? 'border-neutral-200'
                : 'border-neutral-300',
              {
                // Top placements - arrow points up
                'bottom-0 translate-y-1/2': placement.startsWith('top'),

                // Bottom placements - arrow points down
                'top-0 -translate-y-1/2': placement.startsWith('bottom'),

                // Left placements - arrow points left
                'right-0 translate-x-1/2': placement.startsWith('left'),

                // Right placements - arrow points right
                'left-0 -translate-x-1/2': placement.startsWith('right'),
              },
              // Horizontal positioning
              placement === 'top' || placement === 'bottom' ? 'left-1/2 -translate-x-1/2' : '',
              placement === 'top-start' || placement === 'bottom-start' ? 'left-4' : '',
              placement === 'top-end' || placement === 'bottom-end' ? 'right-4' : '',

              // Vertical positioning
              placement === 'left' || placement === 'right' ? 'top-1/2 -translate-y-1/2' : '',
              placement === 'left-start' || placement === 'right-start' ? 'top-4' : '',
              placement === 'left-end' || placement === 'right-end' ? 'bottom-4' : ''
            )}
          />
        )}
      </div>
    );

    return (
      <>
        {clonedTrigger}
        {typeof window !== 'undefined' && createPortal(popoverContent, document.body)}
      </>
    );
  }
);

Popover.displayName = 'Popover';

// Simple popover hook for programmatic usage
export const usePopover = () => {
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

// Popover content components for common use cases
export const PopoverContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('max-w-sm', className)} {...props}>
      {children}
    </div>
  )
);
PopoverContent.displayName = 'PopoverContent';

export const PopoverHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('border-b border-neutral-200 pb-2 mb-2', className)} {...props}>
      <h4 className="font-semibold text-text-primary">{children}</h4>
    </div>
  )
);
PopoverHeader.displayName = 'PopoverHeader';

export const PopoverBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('text-sm text-text-secondary', className)} {...props}>
      {children}
    </div>
  )
);
PopoverBody.displayName = 'PopoverBody';

export const PopoverFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-t border-neutral-200 pt-2 mt-2 flex justify-end gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
);
PopoverFooter.displayName = 'PopoverFooter';
