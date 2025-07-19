import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Declare gtag for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Web Vitals thresholds
const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint (replaces FID)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
} as const;

type VitalName = keyof typeof VITALS_THRESHOLDS;
type VitalRating = 'good' | 'needs-improvement' | 'poor';

interface VitalData {
  name: VitalName;
  value: number;
  rating: VitalRating;
  delta: number;
  id: string;
  url: string;
  timestamp: number;
}

// Performance event handlers
type PerformanceHandler = (vital: VitalData) => void;

class PerformanceMonitor {
  private handlers: PerformanceHandler[] = [];
  private isEnabled: boolean = false;

  constructor() {
    this.isEnabled = !import.meta.env.DEV && typeof window !== 'undefined';
  }

  /**
   * Add a handler for performance metrics
   */
  onMetric(handler: PerformanceHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Remove a performance handler
   */
  offMetric(handler: PerformanceHandler): void {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  /**
   * Start monitoring web vitals
   */
  startMonitoring(): void {
    if (!this.isEnabled) return;

    // Monitor Core Web Vitals
    onCLS(this.handleMetric);
    onINP(this.handleMetric);
    onLCP(this.handleMetric);

    // Monitor other important metrics
    onFCP(this.handleMetric);
    onTTFB(this.handleMetric);
  }

  /**
   * Handle web vital metric
   */
  private handleMetric = (metric: Metric): void => {
    const vitalName = metric.name;
    const threshold = VITALS_THRESHOLDS[vitalName];

    if (!threshold) return;

    const rating: VitalRating =
      metric.value <= threshold.good
        ? 'good'
        : metric.value <= threshold.poor
          ? 'needs-improvement'
          : 'poor';

    const vitalData: VitalData = {
      name: vitalName,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      url: window.location.href,
      timestamp: Date.now(),
    };

    // Notify all handlers
    this.handlers.forEach((handler) => {
      try {
        handler(vitalData);
      } catch (error) {
        console.error('Error in performance handler:', error);
      }
    });
  };

  /**
   * Send metrics to analytics service
   */
  sendToAnalytics(vital: VitalData): void {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', vital.name, {
        event_category: 'Web Vitals',
        value: Math.round(vital.name === 'CLS' ? vital.value * 1000 : vital.value),
        event_label: vital.rating,
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    if (import.meta.env['VITE_ANALYTICS_ENDPOINT']) {
      fetch(import.meta.env['VITE_ANALYTICS_ENDPOINT'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'web-vital',
          ...vital,
        }),
      }).catch((error) => {
        console.error('Failed to send analytics:', error);
      });
    }
  }

  /**
   * Log metrics to console (development)
   */
  logToConsole(vital: VitalData): void {
    const color =
      vital.rating === 'good' ? 'green' : vital.rating === 'needs-improvement' ? 'orange' : 'red';

    console.log(
      `%c${vital.name}: ${vital.value.toFixed(2)}ms (${vital.rating})`,
      `color: ${color}; font-weight: bold;`
    );
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Default handlers
performanceMonitor.onMetric((vital) => {
  if (import.meta.env.DEV) {
    performanceMonitor.logToConsole(vital);
  } else {
    performanceMonitor.sendToAnalytics(vital);
  }
});

// Auto-start monitoring
performanceMonitor.startMonitoring();

// Export for manual usage
export { type VitalData, type VitalRating, type PerformanceHandler };
export default performanceMonitor;
