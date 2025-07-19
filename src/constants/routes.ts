/**
 * Route Constants & Type-Safe Routing
 *
 * Centralized route definitions with TypeScript support.
 * Enables type-safe navigation and parameter validation.
 */

// ================================
// Route Definitions
// ================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  THEME_DEMO: '/theme-demo',
  COMPONENTS_DEMO: '/components-demo',

  // Authentication routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password/:token',
  VERIFY_EMAIL: '/auth/verify-email/:token',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_SETTINGS: '/admin/settings',

  // Example feature routes
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  USER_EDIT: '/users/:id/edit',

  POSTS: '/posts',
  POST_DETAIL: '/posts/:id',
  POST_CREATE: '/posts/create',
  POST_EDIT: '/posts/:id/edit',

  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
} as const;

// ================================
// Route Types
// ================================

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

// Parameter types for dynamic routes
export interface RouteParams {
  [ROUTES.RESET_PASSWORD]: { token: string };
  [ROUTES.VERIFY_EMAIL]: { token: string };
  [ROUTES.ADMIN_USER_DETAIL]: { id: string };
  [ROUTES.USER_DETAIL]: { id: string };
  [ROUTES.USER_EDIT]: { id: string };
  [ROUTES.POST_DETAIL]: { id: string };
  [ROUTES.POST_EDIT]: { id: string };
}

// ================================
// Route Metadata
// ================================

export interface RouteConfig {
  path: string;
  title: string;
  description?: string;
  requiresAuth: boolean;
  requiredRoles?: string[];
  isPublic: boolean;
  showInNavigation?: boolean;
  icon?: string;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  [ROUTES.HOME]: {
    path: ROUTES.HOME,
    title: 'Home',
    description: 'Welcome to our application',
    requiresAuth: false,
    isPublic: true,
    showInNavigation: true,
    icon: 'home',
  },

  [ROUTES.ABOUT]: {
    path: ROUTES.ABOUT,
    title: 'About',
    description: 'Learn more about us',
    requiresAuth: false,
    isPublic: true,
    showInNavigation: true,
    icon: 'info',
  },

  [ROUTES.CONTACT]: {
    path: ROUTES.CONTACT,
    title: 'Contact',
    description: 'Get in touch with us',
    requiresAuth: false,
    isPublic: true,
    showInNavigation: true,
    icon: 'mail',
  },

  [ROUTES.LOGIN]: {
    path: ROUTES.LOGIN,
    title: 'Login',
    description: 'Sign in to your account',
    requiresAuth: false,
    isPublic: true,
    showInNavigation: false,
  },

  [ROUTES.REGISTER]: {
    path: ROUTES.REGISTER,
    title: 'Register',
    description: 'Create a new account',
    requiresAuth: false,
    isPublic: true,
    showInNavigation: false,
  },

  [ROUTES.DASHBOARD]: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
    description: 'Your personal dashboard',
    requiresAuth: true,
    isPublic: false,
    showInNavigation: true,
    icon: 'dashboard',
  },

  [ROUTES.PROFILE]: {
    path: ROUTES.PROFILE,
    title: 'Profile',
    description: 'Manage your profile',
    requiresAuth: true,
    isPublic: false,
    showInNavigation: true,
    icon: 'user',
  },

  [ROUTES.SETTINGS]: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    description: 'Application settings',
    requiresAuth: true,
    isPublic: false,
    showInNavigation: true,
    icon: 'settings',
  },

  [ROUTES.ADMIN]: {
    path: ROUTES.ADMIN,
    title: 'Admin',
    description: 'Administration panel',
    requiresAuth: true,
    requiredRoles: ['admin'],
    isPublic: false,
    showInNavigation: true,
    icon: 'shield',
  },

  [ROUTES.NOT_FOUND]: {
    path: ROUTES.NOT_FOUND,
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist',
    requiresAuth: false,
    isPublic: true,
    showInNavigation: false,
  },
};

// ================================
// Route Utilities
// ================================

/**
 * Generate a route path with parameters
 */
export function generatePath<T extends keyof RouteParams>(
  route: T,
  params: RouteParams[T]
): string {
  let path = route as string;

  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value));
  });

  return path;
}

/**
 * Get route configuration by path
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
  return ROUTE_CONFIG[path];
}

/**
 * Check if route requires authentication
 */
export function routeRequiresAuth(path: string): boolean {
  return getRouteConfig(path)?.requiresAuth ?? false;
}

/**
 * Check if user has required roles for route
 */
export function hasRequiredRoles(path: string, userRoles: string[] = []): boolean {
  const config = getRouteConfig(path);
  if (!config?.requiredRoles) return true;

  return config.requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * Get navigation routes (routes that should appear in navigation)
 */
export function getNavigationRoutes(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter((config) => config.showInNavigation);
}

/**
 * Get public routes (routes accessible without authentication)
 */
export function getPublicRoutes(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter((config) => config.isPublic);
}

/**
 * Get protected routes (routes requiring authentication)
 */
export function getProtectedRoutes(): RouteConfig[] {
  return Object.values(ROUTE_CONFIG).filter((config) => config.requiresAuth);
}

export default {
  ROUTES,
  ROUTE_CONFIG,
  generatePath,
  getRouteConfig,
  routeRequiresAuth,
  hasRequiredRoles,
  getNavigationRoutes,
  getPublicRoutes,
  getProtectedRoutes,
};
