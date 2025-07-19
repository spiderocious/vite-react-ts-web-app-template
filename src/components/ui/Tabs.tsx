/**
 * Tabs Component
 *
 * Accessible tabs component for organizing content into panels.
 */

import clsx from 'clsx';
import { createContext, forwardRef, useContext, useState, type HTMLAttributes } from 'react';

export type TabsVariant = 'default' | 'pills' | 'underlined';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Default active tab value */
  defaultValue?: string;
  /** Controlled active tab value */
  value?: string;
  /** Callback when tab changes */
  onValueChange?: (value: string) => void;
  /** Visual variant */
  variant?: TabsVariant;
  /** Orientation of tabs */
  orientation?: TabsOrientation;
  /** Size of tabs */
  size?: TabsSize;
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** Tab value */
  value: string;
  /** Whether tab is disabled */
  disabled?: boolean;
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab value */
  value: string;
}

// Tabs Context
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  variant: TabsVariant;
  orientation: TabsOrientation;
  size: TabsSize;
}

const TabsContext = createContext<TabsContextType | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

const tabsSizes = {
  sm: {
    trigger: 'px-3 py-1.5 text-sm',
    content: 'p-3',
  },
  md: {
    trigger: 'px-4 py-2 text-sm',
    content: 'p-4',
  },
  lg: {
    trigger: 'px-6 py-3 text-base',
    content: 'p-6',
  },
};

const tabsVariants = {
  default: {
    list: 'bg-neutral-100 rounded-lg p-1',
    trigger: {
      base: 'relative rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      inactive: 'text-text-secondary hover:text-text-primary hover:bg-white/50',
      active: 'text-text-primary bg-white shadow-sm',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  pills: {
    list: 'flex gap-1',
    trigger: {
      base: 'rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      inactive: 'text-text-secondary hover:text-text-primary hover:bg-neutral-100',
      active: 'text-white bg-primary shadow-sm',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  underlined: {
    list: 'border-b border-neutral-200',
    trigger: {
      base: 'relative border-b-2 border-transparent font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      inactive: 'text-text-secondary hover:text-text-primary hover:border-neutral-300',
      active: 'text-primary border-primary',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
};

// Main Tabs Component
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      children,
      defaultValue,
      value: controlledValue,
      onValueChange,
      variant = 'default',
      orientation = 'horizontal',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const value = controlledValue ?? internalValue;

    const handleValueChange = (newValue: string) => {
      if (!controlledValue) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider
        value={{
          value,
          onValueChange: handleValueChange,
          variant,
          orientation,
          size,
        }}
      >
        <div
          ref={ref}
          className={clsx('tabs', orientation === 'vertical' && 'flex gap-4', className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// Tabs List Component
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, orientation } = useTabsContext();
    const variantConfig = tabsVariants[variant];

    return (
      <div
        ref={ref}
        className={clsx(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          orientation === 'vertical' && 'w-48 flex-shrink-0',
          variantConfig.list,
          className
        )}
        role="tablist"
        aria-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

// Tabs Trigger Component
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    const { value: activeValue, onValueChange, variant, size } = useTabsContext();
    const variantConfig = tabsVariants[variant];
    const sizeConfig = tabsSizes[size];
    const isActive = activeValue === value;

    return (
      <button
        ref={ref}
        className={clsx(
          variantConfig.trigger.base,
          sizeConfig.trigger,
          isActive ? variantConfig.trigger.active : variantConfig.trigger.inactive,
          disabled && variantConfig.trigger.disabled,
          className
        )}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        disabled={disabled}
        onClick={() => !disabled && onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// Tabs Content Component
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: activeValue, size } = useTabsContext();
    const sizeConfig = tabsSizes[size];
    const isActive = activeValue === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        className={clsx(
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          sizeConfig.content,
          className
        )}
        role="tabpanel"
        aria-labelledby={`tab-${value}`}
        id={`tabpanel-${value}`}
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';
