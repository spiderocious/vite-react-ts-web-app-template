import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

interface LazyComponentOptions {
  /**
   * Minimum delay before showing the component (prevents flash)
   */
  minDelay?: number;

  /**
   * Preload the component after a delay
   */
  preload?: boolean;

  /**
   * Preload delay in milliseconds
   */
  preloadDelay?: number;
}

/**
 * Enhanced lazy loading with preloading and minimum delay
 */
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  const { minDelay = 0, preload = false, preloadDelay = 2000 } = options;

  let componentPromise: Promise<{ default: T }> | null = null;

  const loadComponent = () => {
    if (!componentPromise) {
      componentPromise =
        minDelay > 0
          ? Promise.all([factory(), new Promise((resolve) => setTimeout(resolve, minDelay))]).then(
              ([component]) => component
            )
          : factory();
    }
    return componentPromise;
  };

  const LazyComponent = lazy(loadComponent);

  // Add preload method
  (LazyComponent as any).preload = loadComponent;

  // Auto-preload if enabled
  if (preload) {
    setTimeout(() => {
      loadComponent();
    }, preloadDelay);
  }

  return LazyComponent as LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
}

/**
 * Preload multiple components
 */
export function preloadComponents(
  components: Array<{ preload: () => Promise<any> }>
): Promise<any[]> {
  return Promise.all(components.map((component) => component.preload()));
}

/**
 * Route-based code splitting helper
 */
export const createRouteComponent = (
  importFunction: () => Promise<{ default: ComponentType<any> }>,
  options?: LazyComponentOptions
) => {
  return createLazyComponent(importFunction, {
    minDelay: 100, // Prevent flash on fast networks
    preload: true,
    preloadDelay: 1000,
    ...options,
  });
};

/**
 * Modal/Dialog lazy loading helper
 */
export const createModalComponent = (
  importFunction: () => Promise<{ default: ComponentType<any> }>,
  options?: LazyComponentOptions
) => {
  return createLazyComponent(importFunction, {
    minDelay: 50,
    preload: false, // Don't preload modals by default
    ...options,
  });
};

/**
 * Feature-based code splitting helper
 */
export const createFeatureComponent = (
  importFunction: () => Promise<{ default: ComponentType<any> }>,
  options?: LazyComponentOptions
) => {
  return createLazyComponent(importFunction, {
    minDelay: 0,
    preload: true,
    preloadDelay: 3000, // Longer delay for features
    ...options,
  });
};

/**
 * Intersection Observer based lazy loading for components
 */
export function createIntersectionLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions & {
    rootMargin?: string;
    threshold?: number;
  } = {}
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  const { rootMargin = '100px', threshold = 0.1, ...lazyOptions } = options;

  let hasIntersected = false;
  let componentPromise: Promise<{ default: T }> | null = null;

  const loadComponent = () => {
    if (!componentPromise) {
      componentPromise = factory();
    }
    return componentPromise;
  };

  // Set up intersection observer for automatic preloading
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasIntersected) {
            hasIntersected = true;
            loadComponent();
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    // Observe any element with a specific data attribute
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-lazy-component]');
      elements.forEach((el) => {
        observer.observe(el);
      });
    }, 100);
  }

  return createLazyComponent(factory, lazyOptions);
}
