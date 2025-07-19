/**
 * Router Configuration
 *
 * Sets up React Router with lazy loading, route guards, and error boundaries.
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import Loading from '@/components/Loading';
import { ROUTES } from '@/constants/routes';

// ================================
// Lazy Loaded Components
// ================================

// Public Pages
const Landing = lazy(() => import('@/pages/Landing'));
const About = lazy(() => import('@/pages/About'));
const ThemeDemo = lazy(() => import('@/pages/ThemeDemo'));
const ComponentsDemo = lazy(() => import('@/pages/ComponentsDemo'));

// Protected Pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));

// Error Pages
const NotFound = lazy(() => import('@/pages/Errors/NotFound'));
const Unauthorized = lazy(() => import('@/pages/Errors/Unauthorized'));

// ================================
// Layout Components
// ================================

/**
 * Root Layout with Error Boundary and Suspense
 */
function RootLayout() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading fullScreen message="Loading application..." />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Route Guard for Protected Routes
 * TODO: Implement actual authentication check when auth system is ready
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // TODO: Replace with actual authentication check
  const isAuthenticated = true; // Temporary - will be replaced with real auth

  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}

/**
 * Suspense wrapper for lazy loaded components
 */
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading fullScreen />}>{children}</Suspense>;
}

// ================================
// Router Configuration
// ================================

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
    children: [
      // Public Routes
      {
        index: true,
        element: (
          <LazyWrapper>
            <Landing />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.ABOUT,
        element: (
          <LazyWrapper>
            <About />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.THEME_DEMO,
        element: (
          <LazyWrapper>
            <ThemeDemo />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.COMPONENTS_DEMO,
        element: (
          <LazyWrapper>
            <ComponentsDemo />
          </LazyWrapper>
        ),
      },

      // Protected Routes
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <Dashboard />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },

      // Error Routes
      {
        path: ROUTES.NOT_FOUND,
        element: (
          <LazyWrapper>
            <NotFound />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.UNAUTHORIZED,
        element: (
          <LazyWrapper>
            <Unauthorized />
          </LazyWrapper>
        ),
      },

      // Catch-all route (404)
      {
        path: '*',
        element: (
          <LazyWrapper>
            <NotFound />
          </LazyWrapper>
        ),
      },
    ],
  },
]);

// ================================
// Router Provider Component
// ================================

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
