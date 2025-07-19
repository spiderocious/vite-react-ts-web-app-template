/**
 * Loading Fallback Component
 *
 * Used as Suspense fallback for lazy-loaded components.
 */

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

export default function Loading({
  size = 'md',
  fullScreen = false,
  message = 'Loading...',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Spinning Icon */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <svg className="w-full h-full text-brand-primary-500" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>

      {/* Loading Message */}
      <p className="mt-4 text-sm text-gray-600 animate-pulse">{message}</p>
    </div>
  );
}
