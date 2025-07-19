/**
 * Theme Toggle Component
 *
 * A button component for switching between light, dark, and system themes.
 * Includes icons and smooth transitions.
 */

import type { Theme } from '../../contexts/ThemeContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'select' | 'buttons';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, effectiveTheme } = useTheme();

  if (variant === 'select') {
    return (
      <select
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value as Theme);
        }}
        className={`
          bg-surface border border-border rounded-md px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-colors duration-fast
          ${className}
        `}
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex rounded-lg bg-surface p-1 ${className}`} role="tablist">
        {(['light', 'dark', 'system'] as const).map((themeOption) => (
          <button
            key={themeOption}
            type="button"
            onClick={() => {
              setTheme(themeOption);
            }}
            className={`
              flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all duration-fast
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface
              ${
                theme === themeOption
                  ? 'bg-primary text-primary-text shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }
            `}
            role="tab"
            aria-selected={theme === themeOption}
          >
            <span className="flex items-center justify-center gap-2">
              <ThemeIcon theme={themeOption} size={16} />
              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Default icon variant - cycles through themes
  const getNextTheme = (): Theme => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'light';
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(getNextTheme());
      }}
      className={`
        inline-flex items-center justify-center rounded-md p-2
        bg-surface hover:bg-surface-hover border border-border
        text-text-secondary hover:text-text-primary
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
        transition-all duration-fast
        ${className}
      `}
      aria-label={`Switch to ${getNextTheme()} theme`}
      title={`Current: ${theme} (${effectiveTheme}). Click to switch to ${getNextTheme()}.`}
    >
      <ThemeIcon theme={effectiveTheme} size={20} />
    </button>
  );
}

interface ThemeIconProps {
  theme: 'light' | 'dark' | 'system';
  size?: number;
}

function ThemeIcon({ theme, size = 20 }: ThemeIconProps) {
  const iconProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    className: 'transition-transform duration-fast',
  };

  switch (theme) {
    case 'light':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
        </svg>
      );
    case 'dark':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'system':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
}
