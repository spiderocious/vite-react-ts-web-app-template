# Contributing to Frontend Template

Thank you for your interest in contributing to the Frontend Template! This
document provides guidelines and instructions for contributing to this project.

## 🎯 Project Vision

This template aims to provide a **production-ready, enterprise-grade React
TypeScript starter** that eliminates setup friction and enables developers to
focus on building features rather than configuring tools.

## 📋 Development Process

### Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/frontend_template.git
   cd frontend_template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Check the TODO list** in `todo.md` for current implementation priorities
2. **Follow the project structure** outlined in `technical.md`
3. **Write code** following our coding standards (see below)
4. **Test your changes** thoroughly
5. **Submit a pull request** with clear description

## 🏗️ Project Structure Guidelines

### File Organization

Follow the established barrel export pattern:

```
src/
├── components/
│   ├── ui/              # Basic UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts     # Barrel export
│   │   └── index.ts         # Barrel export for all UI
│   └── index.ts             # Barrel export for all components
```

### Naming Conventions

- **Components**: PascalCase (`Button`, `UserProfile`)
- **Files**: PascalCase for components, camelCase for utilities
- **Folders**: camelCase for most, PascalCase for component folders
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS`)
- **Types**: PascalCase with descriptive names (`UserData`, `ApiResponse`)

## 📝 Coding Standards

### TypeScript Guidelines

1. **Use strict TypeScript configuration** - No `any` types without
   justification
2. **Define explicit types** for component props and API responses
3. **Use type guards** for runtime type checking
4. **Prefer interfaces over types** for object shapes
5. **Use discriminated unions** for complex state modeling

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

// ❌ Avoid
interface ButtonProps {
  variant: string;
  size: string;
  children: any;
  onClick?: any;
}
```

### React Component Guidelines

1. **Use functional components** with hooks
2. **Implement proper prop types** with TypeScript interfaces
3. **Use React.memo** for performance optimization when appropriate
4. **Follow the component structure**:

```typescript
// Component imports
import React from 'react';
import { cn } from '@/utils';

// Type imports
import type { ButtonProps } from './Button.types';

// Component definition
export const Button = React.memo<ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'btn-base',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
```

### CSS and Styling Guidelines

1. **Use Tailwind CSS classes** for styling
2. **Create custom CSS for complex components** in the component folder
3. **Use CSS custom properties** for theme variables
4. **Follow the design system** defined in `design.md`

```typescript
// ✅ Good - Using utility classes with conditional logic
const buttonClass = cn(
  'px-4 py-2 rounded-md font-medium transition-colors',
  {
    'bg-blue-600 hover:bg-blue-700 text-white': variant === 'primary',
    'bg-gray-200 hover:bg-gray-300 text-gray-900': variant === 'secondary',
  },
  className
);
```

### Utility Function Guidelines

1. **Keep functions pure** when possible
2. **Add comprehensive JSDoc comments**
3. **Include TypeScript types** for all parameters and return values
4. **Organize by category** in appropriate utils folders

```typescript
/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
```

## 🧪 Testing Guidelines

### Unit Testing

1. **Test component behavior**, not implementation
2. **Use React Testing Library** for component testing
3. **Mock external dependencies** appropriately
4. **Test error states** and edge cases

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

1. **Test user workflows** rather than individual functions
2. **Use MSW** for API mocking
3. **Test both happy path and error scenarios**

## 📦 Service Layer Guidelines

### API Services

1. **Implement both real and mock versions** of each service
2. **Use consistent interfaces** between mock and real implementations
3. **Include realistic delays** in mock services
4. **Handle error scenarios** appropriately

```typescript
// Real service
export const userApiService: UserService = {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
};

// Mock service
export const userMockService: UserService = {
  async getCurrentUser(): Promise<User> {
    await sleep(500); // Realistic delay
    return mockUsers.find((user) => user.id === 'current-user-id')!;
  },
};
```

## 🎨 Design System Guidelines

### Component Variants

1. **Use consistent variant naming** across components
2. **Implement size variants** (sm, md, lg)
3. **Support theme variations** (primary, secondary, etc.)
4. **Follow accessibility standards**

### Color System

1. **Use CSS custom properties** for colors
2. **Support both light and dark modes**
3. **Maintain WCAG AA contrast ratios**
4. **Use semantic color names**

## 📚 Documentation Guidelines

### Code Documentation

1. **Write clear JSDoc comments** for all public functions
2. **Include usage examples** in complex utilities
3. **Document component props** with TypeScript interfaces
4. **Explain non-obvious business logic**

### README Updates

1. **Update feature lists** when adding new capabilities
2. **Include usage examples** for new components
3. **Document breaking changes** in release notes
4. **Keep installation instructions current**

## 🚀 Pull Request Guidelines

### Before Submitting

1. **Run all quality checks**:

   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Update the TODO list** if completing items

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new TypeScript errors
- [ ] All tests pass
```

### Review Process

1. **Automated checks** must pass (linting, type checking, tests)
2. **Manual review** by maintainers
3. **Testing** of new functionality
4. **Documentation review** for completeness

## 🐛 Bug Reports

### Before Reporting

1. **Check existing issues** to avoid duplicates
2. **Test with the latest version**
3. **Provide minimal reproduction** case

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96, Firefox 94]
- Node version: [e.g., 18.0.0]
- npm version: [e.g., 8.0.0]

## Additional Context

Screenshots, error messages, etc.
```

## 💡 Feature Requests

### Before Requesting

1. **Check the TODO list** to see if it's already planned
2. **Search existing issues** for similar requests
3. **Consider if it fits** the template's scope and vision

### Feature Request Template

```markdown
## Feature Description

Clear description of the proposed feature

## Use Case

Why is this feature needed? What problem does it solve?

## Proposed Implementation

How should this feature work?

## Alternatives Considered

Other solutions you've considered

## Additional Context

Mockups, examples, references, etc.
```

## 🔄 Release Process

### Version Management

1. **Follow semantic versioning** (major.minor.patch)
2. **Update CHANGELOG.md** with new features and fixes
3. **Tag releases** appropriately
4. **Update documentation** for breaking changes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped appropriately
- [ ] Breaking changes documented

## 📞 Getting Help

### Community Support

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Ask questions** in issue discussions
4. **Join our community** (Discord/Slack - if available)

### Maintainer Contact

For urgent issues or security concerns, contact the maintainers directly through
GitHub.

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all.
Please read and follow our Code of Conduct:

### Our Standards

- **Be respectful** and inclusive in all interactions
- **Be constructive** in feedback and criticism
- **Be collaborative** and help others learn
- **Be professional** in all communications

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the project maintainers. All complaints will be reviewed and
investigated promptly and fairly.

---

**Thank you for contributing! 🎉**

Every contribution, no matter how small, helps make this template better for the
entire development community.
