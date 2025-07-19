# Best Practices & Patterns

This document outlines the best practices, patterns, and conventions used in
this Frontend Template. Following these guidelines ensures consistency,
maintainability, and scalability across the codebase.

## 📁 File Organization & Structure

### Barrel Exports Pattern

Use barrel exports (`index.ts` files) to create clean import paths and organize
code logically.

```typescript
// ✅ Good - Clean imports
import { Button, Input, Modal } from '@/components/ui';
import { formatCurrency, validateEmail } from '@/utils';

// ❌ Avoid - Deep import paths
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { formatCurrency } from '@/utils/formatting/currency';
```

### Component Folder Structure

```
Button/
├── Button.tsx           # Main component
├── Button.types.ts      # TypeScript interfaces
├── Button.stories.tsx   # Storybook stories (if using)
├── Button.test.tsx      # Unit tests
├── Button.module.css    # Component-specific styles (if needed)
└── index.ts            # Barrel export
```

### Utility Organization

Organize utilities by domain/category:

```
utils/
├── common/             # General utilities
├── validation/         # Form/data validation
├── formatting/         # Data formatting
├── date/              # Date manipulation
├── css/               # CSS utilities
├── performance/       # Performance utilities
└── dom/               # DOM manipulation
```

## 🧩 Component Patterns

### Component Definition Pattern

Follow this structure for all React components:

```typescript
import React from 'react';
import { cn } from '@/utils';
import type { ButtonProps } from './Button.types';

export const Button = React.memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',

        // Variant styles
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500':
            variant === 'primary',
          'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus-visible:ring-secondary-500':
            variant === 'secondary',
        },

        // Size styles
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
        },

        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
```

### TypeScript Interface Pattern

Define comprehensive prop interfaces:

```typescript
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Whether the button is in a loading state */
  loading?: boolean;

  /** Custom CSS class */
  className?: string;

  /** Button content */
  children: React.ReactNode;
}
```

### Custom Hook Patterns

Create reusable logic with custom hooks:

```typescript
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await asyncFn();

      setData(result);
      options.onSuccess?.(result);

      if (options.showSuccessToast) {
        toast.success('Operation completed successfully');
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);

      if (options.showErrorToast) {
        toast.error(error.message);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFn, options, toast]);

  return { execute, loading, error, data };
}
```

## 🔄 State Management Patterns

### Local State with useState

Use for component-specific state:

```typescript
function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
  });

  const handleSubmit = useCallback(async (data: UserFormData) => {
    try {
      await userService.updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  }, []);

  return (
    // Component JSX
  );
}
```

### Server State with React Query

Use for server data management:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services';

// Query hook
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: userService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation hook
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (updatedUser) => {
      // Update cache
      queryClient.setQueryData(['user', 'current'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Global State with Context

Use for application-wide state:

```typescript
interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Notification[];
}

interface AppActions {
  setTheme: (theme: AppState['theme']) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    theme: 'system',
    sidebarOpen: false,
    notifications: [],
  });

  const actions: AppActions = {
    setTheme: (theme) => setState(prev => ({ ...prev, theme })),
    toggleSidebar: () => setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen })),
    addNotification: (notification) => setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { ...notification, id: generateId() }],
    })),
    removeNotification: (id) => setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    })),
  };

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

## 🔧 Service Layer Patterns

### Service Interface Pattern

Define consistent interfaces for all services:

```typescript
// Base service interface
export interface UserService {
  getCurrentUser(): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  getUsers(params?: GetUsersParams): Promise<PaginatedResponse<User>>;
}

// Real API implementation
export const userApiService: UserService = {
  async getCurrentUser() {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  async updateUser(id, data) {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async getUsers(params) {
    const response = await apiClient.get<PaginatedResponse<User>>('/users', {
      params,
    });
    return response.data;
  },
};

// Mock implementation
export const userMockService: UserService = {
  async getCurrentUser() {
    await sleep(300); // Simulate network delay
    return mockUsers.find((user) => user.id === 'current-user')!;
  },

  async updateUser(id, data) {
    await sleep(500);
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new Error('User not found');

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
    return mockUsers[userIndex];
  },

  async getUsers(params) {
    await sleep(400);
    // Implement pagination, filtering, etc.
    return {
      data: mockUsers,
      total: mockUsers.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
    };
  },
};
```

### Service Factory Pattern

Switch between mock and real services:

```typescript
// services/index.ts
import { config } from '@/configs';
import { userApiService, userMockService } from './user';
import { authApiService, authMockService } from './auth';

export const userService = config.useMock ? userMockService : userApiService;
export const authService = config.useMock ? authMockService : authApiService;

// Re-export types
export type { UserService } from './user';
export type { AuthService } from './auth';
```

## 🎨 Styling Patterns

### Utility-First CSS

Use Tailwind CSS utilities with conditional logic:

```typescript
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-700',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
};

const buttonSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const buttonClass = cn(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  buttonVariants[variant],
  buttonSizes[size],
  className
);
```

### CSS Custom Properties for Theming

Use CSS custom properties for theme values:

```css
:root {
  /* Color scales */
  --color-primary-50: 239 246 255;
  --color-primary-500: 59 130 246;
  --color-primary-900: 30 58 138;

  /* Semantic colors */
  --color-background: var(--color-white);
  --color-foreground: var(--color-gray-900);
  --color-muted: var(--color-gray-50);
  --color-muted-foreground: var(--color-gray-500);

  /* Component-specific */
  --color-border: var(--color-gray-200);
  --color-input: var(--color-white);
  --color-ring: var(--color-primary-500);
}

[data-theme='dark'] {
  --color-background: var(--color-gray-950);
  --color-foreground: var(--color-gray-50);
  --color-muted: var(--color-gray-900);
  --color-muted-foreground: var(--color-gray-400);
  --color-border: var(--color-gray-800);
  --color-input: var(--color-gray-950);
}
```

### Component-Specific Styles

When Tailwind isn't enough, use CSS modules or styled components:

```css
/* Button.module.css */
.button {
  @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
  @apply disabled:pointer-events-none disabled:opacity-50;
}

.button--primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
  @apply focus-visible:ring-primary-500;
}

.button--loading {
  @apply cursor-not-allowed;
}

.button--loading::before {
  content: '';
  @apply absolute inset-0 bg-current opacity-20 rounded-md;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 🧪 Testing Patterns

### Component Testing

Test behavior, not implementation:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
```

### Hook Testing

Test custom hooks in isolation:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('handles successful execution', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(mockFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBe(null);
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useAsync(mockFn));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBe(null);
  });
});
```

### Integration Testing with MSW

Test API integration with mocked services:

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UserProfile } from './UserProfile';

const server = setupServer(
  rest.get('/api/users/me', (req, res, ctx) => {
    return res(ctx.json({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('UserProfile', () => {
  it('displays user information', async () => {
    renderWithProviders(<UserProfile />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });
});
```

## 🚀 Performance Patterns

### Code Splitting

Split code at route and component levels:

```typescript
// Route-level splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserSettings = lazy(() => import('@/pages/UserSettings'));

// Component-level splitting for heavy components
const Chart = lazy(() => import('@/components/Chart'));
const DataTable = lazy(() => import('@/components/DataTable'));

// Usage with Suspense
<Suspense fallback={<PageSkeleton />}>
  <Dashboard />
</Suspense>
```

### Memoization Patterns

Use React.memo and useMemo strategically:

```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo<Props>(({ data, options }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item));
  }, [data]);

  const handleClick = useCallback((id: string) => {
    options.onItemClick(id);
  }, [options.onItemClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onClick={handleClick} />
      ))}
    </div>
  );
});

// Memoize callback functions
const Parent = () => {
  const [items, setItems] = useState([]);

  const handleItemClick = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return <ExpensiveComponent data={items} options={{ onItemClick: handleItemClick }} />;
};
```

### Virtual Scrolling for Large Lists

```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }: { items: Item[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## 🔒 Error Handling Patterns

### Error Boundaries

Create comprehensive error boundaries:

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);

    // Report to error tracking service
    if (config.useSentry) {
      import('@sentry/react').then(({ captureException }) => {
        captureException(error, { extra: errorInfo });
      });
    }
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### API Error Handling

Handle API errors consistently:

```typescript
// API client configuration
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = new ApiError(
      error.response?.data?.message || error.message,
      error.response?.status || 500,
      error.response?.data
    );

    // Handle specific error cases
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }

    if (error.response?.status >= 500) {
      toast.error('Something went wrong. Please try again later.');
    }

    return Promise.reject(apiError);
  }
);

// Custom API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## 🔐 Security Patterns

### Input Sanitization

Sanitize user inputs:

```typescript
import DOMPurify from 'dompurify';

// HTML content sanitization
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

### Environment Variable Validation

Validate and type environment variables:

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_USE_MOCK: z.string().transform((val) => val === 'true'),
  VITE_JWT_SECRET: z.string().min(32),
  VITE_SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(import.meta.env);
export type Env = z.infer<typeof envSchema>;
```

## 📊 Monitoring & Analytics

### Performance Monitoring

Track Core Web Vitals:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initializePerformanceMonitoring() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  if (config.gaTrackingId) {
    gtag('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
}
```

### User Analytics

Track user interactions:

```typescript
// analytics/events.ts
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (config.gaTrackingId && typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }

  // Also send to other analytics services
  if (config.amplitude && typeof amplitude !== 'undefined') {
    amplitude.track(eventName, parameters);
  }
};

// Usage in components
const handleButtonClick = () => {
  trackEvent('button_click', {
    button_text: 'Sign Up',
    page_location: window.location.pathname,
  });

  // Handle button logic
};
```

---

## 📚 Additional Resources

- **React Patterns**: [React Patterns Documentation](https://reactpatterns.com/)
- **TypeScript Best Practices**:
  [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Accessibility Guidelines**:
  [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **Performance Best Practices**:
  [Web.dev Performance](https://web.dev/performance/)

Following these patterns and practices will help you build maintainable,
scalable, and performant React applications. Remember to adapt these guidelines
to your specific project needs while maintaining consistency across your
codebase.
