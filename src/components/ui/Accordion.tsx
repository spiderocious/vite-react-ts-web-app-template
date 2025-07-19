/**
 * Accordion Component
 *
 * Collapsible content component with support for single or multiple open panels.
 */

import clsx from 'clsx';
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export type AccordionType = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'bordered' | 'separated';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Accordion type - single allows one item open, multiple allows multiple */
  type: AccordionType;
  /** Default open items */
  defaultValue?: string | string[];
  /** Controlled open items */
  value?: string | string[];
  /** Callback when items change */
  onValueChange?: (value: string | string[]) => void;
  /** Visual variant */
  variant?: AccordionVariant;
  /** Whether items are collapsible (only for single type) */
  collapsible?: boolean;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique item value */
  value: string;
  /** Whether item is disabled */
  disabled?: boolean;
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** Children content */
  children?: ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Children content */
  children?: ReactNode;
}

// Accordion Context
interface AccordionContextType {
  openItems: string[];
  onItemToggle: (value: string) => void;
  variant: AccordionVariant;
  type: AccordionType;
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
};

// Accordion Item Context
interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem');
  }
  return context;
};

const accordionVariants = {
  default: {
    container: 'space-y-1',
    item: 'border border-neutral-200 rounded-lg overflow-hidden',
    trigger: 'hover:bg-neutral-50 focus:bg-neutral-50',
    content: 'border-t border-neutral-200',
  },
  bordered: {
    container: 'border border-neutral-200 rounded-lg overflow-hidden',
    item: 'border-b border-neutral-200 last:border-b-0',
    trigger: 'hover:bg-neutral-50 focus:bg-neutral-50',
    content: 'border-t border-neutral-200',
  },
  separated: {
    container: 'space-y-2',
    item: 'border border-neutral-200 rounded-lg overflow-hidden shadow-sm',
    trigger: 'hover:bg-neutral-50 focus:bg-neutral-50',
    content: 'border-t border-neutral-200',
  },
};

// Main Accordion Component
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      children,
      type,
      defaultValue,
      value: controlledValue,
      onValueChange,
      variant = 'default',
      collapsible = false,
      ...props
    },
    ref
  ) => {
    // Normalize default value based on type
    const normalizedDefaultValue =
      type === 'single'
        ? Array.isArray(defaultValue)
          ? defaultValue[0] || ''
          : defaultValue || ''
        : Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue
            ? [defaultValue]
            : [];

    const [internalValue, setInternalValue] = useState<string[]>(
      type === 'single'
        ? normalizedDefaultValue
          ? [normalizedDefaultValue as string]
          : []
        : (normalizedDefaultValue as string[])
    );

    // Convert controlled value to array format internally
    const openItems = controlledValue
      ? type === 'single'
        ? controlledValue
          ? [controlledValue as string]
          : []
        : (controlledValue as string[])
      : internalValue;

    const handleItemToggle = (value: string) => {
      let newOpenItems: string[];

      if (type === 'single') {
        if (openItems.includes(value)) {
          // Close if already open and collapsible
          newOpenItems = collapsible ? [] : openItems;
        } else {
          // Open this item, close others
          newOpenItems = [value];
        }
      } else {
        // Multiple type
        if (openItems.includes(value)) {
          newOpenItems = openItems.filter((item) => item !== value);
        } else {
          newOpenItems = [...openItems, value];
        }
      }

      if (!controlledValue) {
        setInternalValue(newOpenItems);
      }

      // Call onChange with appropriate format
      const callbackValue = type === 'single' ? newOpenItems[0] || '' : newOpenItems;
      onValueChange?.(callbackValue);
    };

    const variantConfig = accordionVariants[variant];

    return (
      <AccordionContext.Provider
        value={{
          openItems,
          onItemToggle: handleItemToggle,
          variant,
          type,
          collapsible,
        }}
      >
        <div ref={ref} className={clsx(variantConfig.container, className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

// Accordion Item Component
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    const { openItems, variant } = useAccordionContext();
    const variantConfig = accordionVariants[variant];
    const isOpen = openItems.includes(value);

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, disabled }}>
        <div ref={ref} className={clsx(variantConfig.item, className)} {...props}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

// Accordion Trigger Component
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { onItemToggle, variant } = useAccordionContext();
    const { value, isOpen, disabled } = useAccordionItemContext();
    const variantConfig = accordionVariants[variant];

    return (
      <button
        ref={ref}
        className={clsx(
          'flex w-full items-center justify-between p-4 text-left font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0',
          !disabled && variantConfig.trigger,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => !disabled && onItemToggle(value)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${value}`}
        id={`accordion-trigger-${value}`}
        disabled={disabled}
        {...props}
      >
        <span className="text-text-primary">{children}</span>
        <svg
          className={clsx(
            'h-4 w-4 transition-transform duration-200 text-text-secondary',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }
);

AccordionTrigger.displayName = 'AccordionTrigger';

// Accordion Content Component
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = useAccordionContext();
    const { value, isOpen } = useAccordionItemContext();
    const variantConfig = accordionVariants[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'animate-in slide-down-from-top-1' : 'animate-out slide-up-to-top-1 hidden',
          variantConfig.content
        )}
        id={`accordion-content-${value}`}
        aria-labelledby={`accordion-trigger-${value}`}
        role="region"
        {...props}
      >
        {isOpen && <div className={clsx('p-4 pt-0', className)}>{children}</div>}
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';
