/**
 * Toast Component & Imperative API
 *
 * Toast notification system with both declarative and imperative APIs.
 * Supports toast.open(), toast.success(), toast.error(), toast.close() patterns.
 */

import clsx from 'clsx';
import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { Button } from './Button';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Toast variant */
  variant?: ToastVariant;
  /** Toast title */
  title?: ReactNode;
  /** Toast description */
  description?: ReactNode;
  /** Whether to show close button */
  closable?: boolean;
  /** Auto dismiss duration in ms (0 to disable) */
  duration?: number;
  /** Toast position */
  position?: ToastPosition;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
}

const toastVariants = {
  default: {
    bg: 'bg-white border-neutral-200',
    icon: null,
    iconBg: '',
  },
  success: {
    bg: 'bg-white border-success-200',
    icon: (
      <svg className="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    iconBg: 'bg-success-100',
  },
  warning: {
    bg: 'bg-white border-warning-200',
    icon: (
      <svg className="h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    iconBg: 'bg-warning-100',
  },
  error: {
    bg: 'bg-white border-error-200',
    icon: (
      <svg className="h-5 w-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    iconBg: 'bg-error-100',
  },
  info: {
    bg: 'bg-white border-primary-200',
    icon: (
      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    iconBg: 'bg-primary-100',
  },
};

const toastPositions = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

// Toast Context for imperative API
interface ToastContextType {
  toasts: Map<string, ToastInstance>;
  addToast: (id: string, toast: ToastInstance) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<ToastInstance>) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastInstance {
  id: string;
  variant?: ToastVariant;
  title?: ReactNode;
  description?: ReactNode;
  closable?: boolean;
  duration?: number;
  position?: ToastPosition;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

// Toast Provider Component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Map<string, ToastInstance>>(new Map());

  const addToast = (id: string, toast: ToastInstance) => {
    setToasts((prev) => new Map(prev).set(id, toast));
  };

  const removeToast = (id: string) => {
    setToasts((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const updateToast = (id: string, updates: Partial<ToastInstance>) => {
    setToasts((prev) => {
      const next = new Map(prev);
      const existing = next.get(id);
      if (existing) {
        next.set(id, { ...existing, ...updates });
      }
      return next;
    });
  };

  // Group toasts by position
  const toastsByPosition = Array.from(toasts.values()).reduce(
    (acc, toast) => {
      const position = toast.position || 'top-right';
      if (!acc[position]) acc[position] = [];
      acc[position].push(toast);
      return acc;
    },
    {} as Record<ToastPosition, ToastInstance[]>
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      {/* Render toast containers for each position */}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={clsx(
            'fixed z-50 flex flex-col gap-2 pointer-events-none',
            toastPositions[position as ToastPosition],
            position.includes('bottom') ? 'flex-col-reverse' : 'flex-col'
          )}
        >
          {positionToasts.map((toast) => (
            <Toast
              key={toast.id}
              variant={toast.variant ?? 'default'}
              title={toast.title}
              description={toast.description}
              closable={toast.closable ?? true}
              duration={toast.duration ?? 5000}
              {...(toast.action && { action: toast.action })}
              onDismiss={() => {
                toast.onDismiss?.();
                removeToast(toast.id);
              }}
            />
          ))}
        </div>
      ))}
    </ToastContext.Provider>
  );
};

// Base Toast Component
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = 'default',
      title,
      description,
      closable = true,
      duration = 5000,
      action,
      onDismiss,
      ...props
    },
    ref
  ) => {
    const variantConfig = toastVariants[variant];

    // Auto dismiss
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss?.();
        }, duration);
        return () => {
          clearTimeout(timer);
        };
      }
      return undefined;
    }, [duration, onDismiss]);

    return (
      <div
        ref={ref}
        className={clsx(
          'pointer-events-auto w-full max-w-sm rounded-lg border p-4 shadow-lg',
          'animate-in slide-in-from-top-2 fade-in-0 duration-300',
          variantConfig.bg,
          className
        )}
        role="alert"
        {...props}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          {variantConfig.icon && (
            <div className={clsx('flex-shrink-0 rounded-full p-1', variantConfig.iconBg)}>
              {variantConfig.icon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && <div className="font-medium text-text-primary">{title}</div>}
            {description && (
              <div className={clsx('text-sm text-text-secondary', title && 'mt-1')}>
                {description}
              </div>
            )}
            {action && (
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={action.onClick}>
                  {action.label}
                </Button>
              </div>
            )}
          </div>

          {/* Close button */}
          {closable && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 rounded-lg p-1 text-text-secondary hover:bg-neutral-100 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Dismiss notification"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// Imperative API Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast } = context;

  const open = (config: Omit<ToastInstance, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    addToast(id, {
      ...config,
      id,
      onDismiss: () => {
        config.onDismiss?.();
        removeToast(id);
      },
    });

    return {
      id,
      close: () => {
        removeToast(id);
      },
    };
  };

  const success = (config: Omit<ToastInstance, 'id' | 'variant'>) => {
    return open({ ...config, variant: 'success' });
  };

  const error = (config: Omit<ToastInstance, 'id' | 'variant'>) => {
    return open({ ...config, variant: 'error' });
  };

  const warning = (config: Omit<ToastInstance, 'id' | 'variant'>) => {
    return open({ ...config, variant: 'warning' });
  };

  const info = (config: Omit<ToastInstance, 'id' | 'variant'>) => {
    return open({ ...config, variant: 'info' });
  };

  const close = (id: string) => {
    removeToast(id);
  };

  const closeAll = () => {
    context.toasts.forEach((_, id) => {
      removeToast(id);
    });
  };

  return { open, success, error, warning, info, close, closeAll };
};

// Global Toast API (optional - requires ToastProvider at app root)
let globalToastApi: ReturnType<typeof useToast> | null = null;

export const toast = {
  open: (config: Parameters<ReturnType<typeof useToast>['open']>[0]) => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return { id: '', close: () => {} };
    }
    return globalToastApi.open(config);
  },

  success: (config: Parameters<ReturnType<typeof useToast>['success']>[0]) => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return { id: '', close: () => {} };
    }
    return globalToastApi.success(config);
  },

  error: (config: Parameters<ReturnType<typeof useToast>['error']>[0]) => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return { id: '', close: () => {} };
    }
    return globalToastApi.error(config);
  },

  warning: (config: Parameters<ReturnType<typeof useToast>['warning']>[0]) => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return { id: '', close: () => {} };
    }
    return globalToastApi.warning(config);
  },

  info: (config: Parameters<ReturnType<typeof useToast>['info']>[0]) => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return { id: '', close: () => {} };
    }
    return globalToastApi.info(config);
  },

  close: (id: string) => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return;
    }
    globalToastApi.close(id);
  },

  closeAll: () => {
    if (!globalToastApi) {
      console.warn(
        'Toast API not initialized. Please wrap your app with ToastProvider and call initToastApi()'
      );
      return;
    }
    globalToastApi.closeAll();
  },
};

// Initialize global API (call this once after ToastProvider is mounted)
export const initToastApi = () => {
  // This will be called from within a component that has access to ToastProvider
  const ToastInitializer: React.FC = () => {
    globalToastApi = useToast();
    return null;
  };
  return ToastInitializer;
};
