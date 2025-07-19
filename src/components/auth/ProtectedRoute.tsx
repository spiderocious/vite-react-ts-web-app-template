/**
 * Protected Route Component
 *
 * Component for protecting routes that require authentication.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import type { Permission, UserRole } from '@/types/auth';

// ================================
// Protected Route Props
// ================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  fallbackPath?: string;
  requireEmailVerification?: boolean;
}

// ================================
// Protected Route Component
// ================================

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRole,
  fallbackPath = '/login',
  requireEmailVerification = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && user && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} replace />;
  }

  // Check role if specified
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
  }

  // Check permissions if specified
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) => hasPermission(permission));

    if (!hasAllPermissions) {
      return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

// ================================
// HOC for Protected Routes
// ================================

interface WithAuthOptions {
  requiredPermissions?: Permission[];
  requiredRole?: UserRole;
  fallbackPath?: string;
  requireEmailVerification?: boolean;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// ================================
// Role-based Route Components
// ================================

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleBasedRoute({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized',
}: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

// ================================
// Permission-based Route Component
// ================================

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermissions: Permission[];
  requireAll?: boolean; // true = require all permissions, false = require any
  fallbackPath?: string;
}

export function PermissionBasedRoute({
  children,
  requiredPermissions,
  requireAll = true,
  fallbackPath = '/unauthorized',
}: PermissionRouteProps) {
  const { hasPermission, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const hasRequiredPermissions = requireAll
    ? requiredPermissions.every((permission) => hasPermission(permission))
    : requiredPermissions.some((permission) => hasPermission(permission));

  if (!hasRequiredPermissions) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
