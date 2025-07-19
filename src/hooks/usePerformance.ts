import { useEffect, useRef, useState } from 'react';

import { performanceMonitor, type VitalData } from '../utils/performance';

/**
 * Hook to monitor component render performance
 */
export function useRenderTime(componentName: string) {
  const renderStartRef = useRef<number | undefined>(undefined);
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
  });

  useEffect(() => {
    if (renderStartRef.current) {
      const duration = performance.now() - renderStartRef.current;
      setRenderTime(duration);

      if (import.meta.env.DEV && duration > 16) {
        // 16ms = 60fps threshold
        console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
      }
    }
  });

  return renderTime;
}

/**
 * Hook to track component mount/unmount performance
 */
export function useComponentLifecycle(componentName: string) {
  const mountStartRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    mountStartRef.current = performance.now();

    return () => {
      if (mountStartRef.current) {
        const mountDuration = performance.now() - mountStartRef.current;

        if (import.meta.env.DEV) {
          console.log(`${componentName} lifecycle: ${mountDuration.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName]);
}

/**
 * Hook to measure async operation performance
 */
export function useAsyncPerformance() {
  const measure = (name: string, fn: () => Promise<any>) => {
    const start = performance.now();

    return fn().finally(() => {
      const duration = performance.now() - start;

      if (import.meta.env.DEV) {
        console.log(`Async operation "${name}": ${duration.toFixed(2)}ms`);
      }

      // Send to analytics if operation takes too long
      if (duration > 1000) {
        // 1 second threshold
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'slow_operation', {
            event_category: 'Performance',
            event_label: name,
            value: Math.round(duration),
          });
        }
      }
    });
  };

  return { measure };
}

/**
 * Hook to track Web Vitals in components
 */
export function useWebVitals() {
  const [vitals, setVitals] = useState<VitalData[]>([]);

  useEffect(() => {
    const handleVital = (vital: VitalData) => {
      setVitals((prev) => [...prev, vital]);
    };

    performanceMonitor.onMetric(handleVital);

    return () => {
      performanceMonitor.offMetric(handleVital);
    };
  }, []);

  return vitals;
}

/**
 * Hook to measure image loading performance
 */
export function useImagePerformance(src: string) {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    const startTime = performance.now();

    img.onload = () => {
      const duration = performance.now() - startTime;
      setLoadTime(duration);
      setIsLoading(false);

      if (import.meta.env.DEV) {
        console.log(`Image loaded: ${src} in ${duration.toFixed(2)}ms`);
      }
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loadTime, isLoading, error };
}

/**
 * Hook to detect performance issues
 */
export function usePerformanceIssues() {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (usagePercent > 90) {
          setIssues((prev) => [...prev, 'High memory usage detected']);
        }
      }
    };

    const checkLongTasks = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              // Long task threshold
              setIssues((prev) => [...prev, `Long task detected: ${entry.duration.toFixed(2)}ms`]);
            }
          });
        });

        try {
          observer.observe({ entryTypes: ['longtask'] });
          return () => {
            observer.disconnect();
          };
        } catch (e) {
          // longtask might not be supported
          return () => {};
        }
      }
      return () => {};
    };

    const memoryInterval = setInterval(checkMemoryUsage, 5000);
    const longTaskCleanup = checkLongTasks();

    return () => {
      clearInterval(memoryInterval);
      longTaskCleanup();
    };
  }, []);

  return issues;
}
