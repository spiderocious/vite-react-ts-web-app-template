# Testing Guide

This project uses a comprehensive testing strategy with multiple layers of
testing to ensure code quality and reliability.

## Testing Stack

### Unit & Integration Testing

- **Vitest**: Modern testing framework optimized for Vite
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: Simulate user interactions
- **JSDOM**: DOM implementation for Node.js environment

### End-to-End Testing

- **Playwright**: Cross-browser E2E testing framework
- **Page Object Model**: Organized test structure
- **Multiple browser support**: Chromium, Firefox, WebKit
- **Mobile testing**: iPhone and Android viewports

### API Mocking

- **MSW (Mock Service Worker)**: API mocking for tests
- **Shared handlers**: Consistent mocking between dev and test environments

## Running Tests

### Unit Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed

# Debug E2E tests
npm run test:e2e:debug

# Show E2E test report
npm run test:e2e:report
```

## Test Structure

### Unit Tests

Unit tests are located in `src/components/ui/*.test.tsx` and follow the pattern:

```typescript
import { render, screen } from '@/test/utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### E2E Tests

E2E tests are organized in the `e2e/` directory:

```
e2e/
├── pages/           # Page Object Models
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── components.page.ts
├── tests/           # Test files
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   └── components.spec.ts
└── utils/           # Test utilities
    └── test-utils.ts
```

## Testing Best Practices

### Unit Testing

1. **Test behavior, not implementation**: Focus on what the component does, not
   how it does it
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over
   `getByTestId`
3. **Test user interactions**: Use `user-event` for realistic user interactions
4. **Mock external dependencies**: Use MSW for API calls, mock complex utilities

### E2E Testing

1. **Page Object Model**: Encapsulate page interactions in page objects
2. **Stable selectors**: Use semantic selectors (`getByRole`) over fragile ones
3. **Wait for elements**: Use `waitFor` and `expect` with timeouts
4. **Test critical user journeys**: Focus on the most important user flows
5. **Isolate tests**: Each test should be independent and can run in any order

### Common Patterns

#### Testing Components with Providers

```typescript
import { render, screen } from '@/test/utils';

// Custom render with all providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

test('component with providers', () => {
  renderWithProviders(<MyComponent />);
  // assertions...
});
```

#### Testing User Interactions

```typescript
import { render, screen } from '@/test/utils';
import { userEvent } from '@testing-library/user-event';

test('user interaction', async () => {
  const user = userEvent.setup();
  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));
  // assertions...
});
```

#### Testing Forms

```typescript
test('form submission', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();

  render(<LoginForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

## Test Configuration

### Vitest Configuration

The Vitest configuration is in `vitest.config.ts`:

- JSDOM environment for DOM testing
- Global test APIs (describe, it, expect)
- Custom test setup file
- Coverage configuration
- Path aliases

### Playwright Configuration

The Playwright configuration is in `playwright.config.ts`:

- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile testing (iPhone, Android)
- Automatic dev server startup
- Test artifacts (screenshots, videos, traces)
- Parallel execution

### Test Setup

Global test setup is in `src/test/setup.ts`:

- MSW server setup
- Browser API mocks
- Test utilities
- Global test configuration

## Coverage

Coverage reports are generated in the `coverage/` directory:

- HTML report: `coverage/index.html`
- JSON report: `coverage/coverage.json`
- LCOV report: `coverage/lcov.info`

Target coverage thresholds:

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## CI/CD Integration

Tests are automatically run in CI/CD pipeline:

1. **Unit tests**: Run on every push/PR
2. **E2E tests**: Run on staging environment
3. **Coverage reports**: Uploaded to CodeCov
4. **Test artifacts**: Stored for debugging

## Debugging Tests

### Unit Tests

```bash
# Debug with VS Code
npm run test:ui

# Debug specific test
npm run test -- --reporter=verbose Button.test.tsx
```

### E2E Tests

```bash
# Debug mode (step through tests)
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed

# Generate trace
npm run test:e2e -- --trace on
```

## Common Issues

### Flaky Tests

- Use `waitFor` for async operations
- Avoid hardcoded timeouts
- Mock external dependencies
- Use stable selectors

### Slow Tests

- Mock API calls
- Use `beforeEach` setup efficiently
- Run tests in parallel
- Focus on critical paths

### Test Isolation

- Clean up after each test
- Use fresh state
- Mock timers when needed
- Avoid shared state between tests
