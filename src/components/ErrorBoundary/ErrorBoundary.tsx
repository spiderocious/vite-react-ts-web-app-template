/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */

import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import { config } from '@/configs';
import { ROUTES } from '@/constants/routes';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Log to external service if enabled
    if (config.features.useSentry && typeof window !== 'undefined') {
      // Sentry would be initialized here
      console.log('Would log to Sentry:', { error, errorInfo });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We encountered an unexpected error. Our team has been notified and we're working to
              fix it.
            </p>

            <div className="flex gap-4 justify-center mb-8">
              <button onClick={this.handleRetry} className="btn btn-primary px-6 py-3">
                Try Again
              </button>

              <button onClick={this.handleReload} className="btn btn-outline px-6 py-3">
                Reload Page
              </button>

              <Link to={ROUTES.HOME} className="btn btn-outline px-6 py-3">
                Go Home
              </Link>
            </div>

            {/* Error Details (Development Only) */}
            {config.isDevelopment && this.state.error && (
              <div className="max-w-4xl mx-auto mt-8">
                <details className="bg-white border border-red-200 rounded-lg p-4 text-left">
                  <summary className="font-medium text-red-900 cursor-pointer">
                    Error Details (Development Mode)
                  </summary>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Error Message:</h4>
                      <pre className="text-sm text-red-600 bg-red-50 p-2 rounded overflow-auto">
                        {this.state.error.message}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Stack Trace:</h4>
                      <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </div>

                    {this.state.errorInfo && (
                      <div>
                        <h4 className="font-medium text-gray-900">Component Stack:</h4>
                        <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
