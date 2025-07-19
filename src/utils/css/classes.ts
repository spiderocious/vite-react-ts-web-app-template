import clsx, { type ClassValue } from 'clsx';

/**
 * Utility function for conditional CSS classes
 * Enhanced version of clsx with common patterns
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Conditional classes with variants support
 */
export function variants(
  base: string,
  variants: Record<string, Record<string, string>>,
  selectedVariants: Record<string, string | boolean | undefined>
): string {
  const variantClasses = Object.entries(selectedVariants)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      if (typeof value === 'boolean') return '';
      return variants[key]?.[value as string] || '';
    })
    .filter(Boolean);

  return cn(base, ...variantClasses);
}

/**
 * Toggle classes based on condition
 */
export function toggle(
  condition: boolean,
  truthyClasses: string,
  falsyClasses: string = ''
): string {
  return condition ? truthyClasses : falsyClasses;
}

/**
 * Merge multiple class objects
 */
export function mergeClasses(
  ...classObjects: Array<Record<string, boolean> | string | undefined>
): string {
  return cn(...classObjects);
}

/**
 * Focus ring utility
 */
export function focusRing(variant: 'default' | 'inset' | 'none' = 'default'): string {
  const variants = {
    default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    inset: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
    none: 'focus:outline-none',
  };

  return variants[variant];
}

/**
 * Responsive utility for classes
 */
export function responsive(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  return cn(
    classes.base,
    classes.sm && `sm:${classes.sm}`,
    classes.md && `md:${classes.md}`,
    classes.lg && `lg:${classes.lg}`,
    classes.xl && `xl:${classes.xl}`,
    classes['2xl'] && `2xl:${classes['2xl']}`
  );
}

/**
 * Dark mode utility
 */
export function darkMode(lightClasses: string, darkClasses: string): string {
  return cn(lightClasses, `dark:${darkClasses}`);
}
