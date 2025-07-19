/**
 * Modal Component & Imperative API
 *
 * Modal/Dialog system with both declarative and imperative APIs.
 * Supports modal.open(), modal.confirm(), modal.close() patterns.
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
import { createPortal } from 'react-dom';

import { Button } from './Button';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the modal is open */
  open?: boolean;
  /** Callback when modal should close */
  onOpenChange?: (open: boolean) => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal size */
  size?: ModalSize;
  /** Modal variant */
  variant?: ModalVariant;
  /** Whether to show close button */
  closable?: boolean;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on escape key */
  closeOnEscape?: boolean;
  /** Custom overlay class */
  overlayClassName?: string;
  /** Children content */
  children?: ReactNode;
}

const modalSizes = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

const modalVariants = {
  default: 'border-neutral-200',
  danger: 'border-error-200',
  success: 'border-success-200',
  warning: 'border-warning-200',
};

// Modal Context for imperative API
interface ModalContextType {
  modals: Map<string, ModalInstance>;
  addModal: (id: string, modal: ModalInstance) => void;
  removeModal: (id: string) => void;
  updateModal: (id: string, updates: Partial<ModalInstance>) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalInstance {
  id: string;
  title?: ReactNode;
  content: ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
  resolve?: (value: any) => void;
  reject?: (reason: any) => void;
}

// Modal Provider Component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<Map<string, ModalInstance>>(new Map());

  const addModal = (id: string, modal: ModalInstance) => {
    setModals((prev) => new Map(prev).set(id, modal));
  };

  const removeModal = (id: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const updateModal = (id: string, updates: Partial<ModalInstance>) => {
    setModals((prev) => {
      const next = new Map(prev);
      const existing = next.get(id);
      if (existing) {
        next.set(id, { ...existing, ...updates });
      }
      return next;
    });
  };

  return (
    <ModalContext.Provider value={{ modals, addModal, removeModal, updateModal }}>
      {children}
      {/* Render active modals */}
      {Array.from(modals.values()).map((modal) => (
        <Modal
          key={modal.id}
          open
          title={modal.title}
          size={modal.size ?? 'md'}
          variant={modal.variant ?? 'default'}
          closable={modal.closable ?? true}
          closeOnOverlayClick={modal.closeOnOverlayClick ?? true}
          closeOnEscape={modal.closeOnEscape ?? true}
          onOpenChange={(open) => {
            if (!open) {
              modal.onClose?.();
              removeModal(modal.id);
            }
          }}
        >
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

// Base Modal Component
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      children,
      open = false,
      onOpenChange,
      title,
      size = 'md',
      variant = 'default',
      closable = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      overlayClassName,
      ...props
    },
    ref
  ) => {
    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onOpenChange?.(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open, closeOnEscape, onOpenChange]);

    // Handle overlay click
    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onOpenChange?.(false);
      }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
      return undefined;
    }, [open]);

    if (!open) return null;

    const modalContent = (
      <div
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          overlayClassName
        )}
        onClick={handleOverlayClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <div
          ref={ref}
          className={clsx(
            'relative w-full rounded-lg border bg-white shadow-xl',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            modalSizes[size],
            modalVariants[variant],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          {...props}
        >
          {/* Header */}
          {(title || closable) && (
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                  {title}
                </h2>
              )}
              {closable && (
                <button
                  onClick={() => onOpenChange?.(false)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-neutral-100 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          )}

          {/* Content */}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    );

    return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
  }
);

Modal.displayName = 'Modal';

// Modal sub-components
export const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('border-b border-neutral-200 px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
);
ModalHeader.displayName = 'ModalHeader';

export const ModalBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
);
ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex justify-end gap-3 border-t border-neutral-200 px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);
ModalFooter.displayName = 'ModalFooter';

// Imperative API Hook
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  const { addModal, removeModal } = context;

  const open = (config: Omit<ModalInstance, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const promise = new Promise((resolve, reject) => {
      addModal(id, {
        ...config,
        id,
        onClose: () => {
          config.onClose?.();
          removeModal(id);
        },
        resolve,
        reject,
      });
    });

    return {
      id,
      promise,
      close: () => {
        removeModal(id);
      },
    };
  };

  const confirm = (config: {
    title?: ReactNode;
    content: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: ModalVariant;
    size?: ModalSize;
  }) => {
    const {
      title = 'Confirm',
      content,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'default',
      size = 'sm',
    } = config;

    return new Promise<boolean>((resolve) => {
      const modal = open({
        title,
        content: (
          <div className="space-y-4">
            <div className="text-text-secondary">{content}</div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  resolve(false);
                  modal.close();
                }}
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'destructive' : 'primary'}
                onClick={() => {
                  resolve(true);
                  modal.close();
                }}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        ),
        variant,
        size,
        closable: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
        onClose: () => {
          resolve(false);
        },
      });
    });
  };

  const alert = (config: {
    title?: ReactNode;
    content: ReactNode;
    buttonText?: string;
    variant?: ModalVariant;
    size?: ModalSize;
  }) => {
    const {
      title = 'Alert',
      content,
      buttonText = 'OK',
      variant = 'default',
      size = 'sm',
    } = config;

    return new Promise<void>((resolve) => {
      const modal = open({
        title,
        content: (
          <div className="space-y-4">
            <div className="text-text-secondary">{content}</div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  resolve();
                  modal.close();
                }}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        ),
        variant,
        size,
        closable: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
        onClose: () => {
          resolve();
        },
      });
    });
  };

  const close = (id: string) => {
    removeModal(id);
  };

  return { open, confirm, alert, close };
};

// Global Modal API (optional - requires ModalProvider at app root)
let globalModalApi: ReturnType<typeof useModal> | null = null;

export const modal = {
  open: (config: Parameters<ReturnType<typeof useModal>['open']>[0]) => {
    if (!globalModalApi) {
      console.warn(
        'Modal API not initialized. Please wrap your app with ModalProvider and call initModalApi()'
      );
      return { id: '', promise: Promise.resolve(), close: () => {} };
    }
    return globalModalApi.open(config);
  },

  confirm: (config: Parameters<ReturnType<typeof useModal>['confirm']>[0]) => {
    if (!globalModalApi) {
      console.warn(
        'Modal API not initialized. Please wrap your app with ModalProvider and call initModalApi()'
      );
      return Promise.resolve(false);
    }
    return globalModalApi.confirm(config);
  },

  alert: (config: Parameters<ReturnType<typeof useModal>['alert']>[0]) => {
    if (!globalModalApi) {
      console.warn(
        'Modal API not initialized. Please wrap your app with ModalProvider and call initModalApi()'
      );
      return Promise.resolve();
    }
    return globalModalApi.alert(config);
  },

  close: (id: string) => {
    if (!globalModalApi) {
      console.warn(
        'Modal API not initialized. Please wrap your app with ModalProvider and call initModalApi()'
      );
      return;
    }
    globalModalApi.close(id);
  },
};

// Initialize global API (call this once after ModalProvider is mounted)
export const initModalApi = () => {
  // This will be called from within a component that has access to ModalProvider
  const ModalInitializer: React.FC = () => {
    globalModalApi = useModal();
    return null;
  };
  return ModalInitializer;
};
