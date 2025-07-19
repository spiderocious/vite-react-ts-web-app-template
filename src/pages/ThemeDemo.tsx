/**
 * Theme Demo Page
 *
 * Demonstrates the theming system with various components and color examples.
 */

import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeDemo() {
  const { theme, effectiveTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary">Theme System Demo</h1>
            <p className="mt-2 text-text-secondary">
              Current: {theme} (effective: {effectiveTheme})
            </p>
          </div>
          <div className="flex gap-4">
            <ThemeToggle variant="icon" />
            <ThemeToggle variant="select" />
          </div>
        </div>

        {/* Theme Toggle Variants */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Theme Toggle Variants</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-secondary">Icon Toggle</h3>
              <ThemeToggle variant="icon" />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-secondary">Select Dropdown</h3>
              <ThemeToggle variant="select" />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-secondary">Button Group</h3>
              <ThemeToggle variant="buttons" />
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Color Palette</h2>

          {/* Primary Colors */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-medium text-text-primary">Primary Colors</h3>
            <div className="grid grid-cols-11 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                <div key={shade} className="flex flex-col items-center">
                  <div
                    className={`h-12 w-12 rounded-md bg-primary-${shade} border border-border`}
                  />
                  <span className="mt-1 text-xs text-text-tertiary">{shade}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['success', 'warning', 'error', 'info'].map((color) => (
              <div key={color} className="space-y-2">
                <h4 className="text-sm font-medium text-text-primary capitalize">{color}</h4>
                <div className="grid grid-cols-3 gap-1">
                  <div className={`h-8 rounded bg-${color} flex items-center justify-center`}>
                    <span className="text-xs text-white">500</span>
                  </div>
                  <div className={`h-8 rounded bg-${color}-200 flex items-center justify-center`}>
                    <span className="text-xs text-neutral-700">200</span>
                  </div>
                  <div
                    className={`h-8 rounded bg-${color}-50 flex items-center justify-center border border-border`}
                  >
                    <span className="text-xs text-neutral-700">50</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Typography</h2>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-text-primary">Heading 1 - Bold 4xl</div>
            <div className="text-3xl font-semibold text-text-primary">Heading 2 - Semibold 3xl</div>
            <div className="text-2xl font-medium text-text-primary">Heading 3 - Medium 2xl</div>
            <div className="text-xl text-text-primary">Heading 4 - Regular xl</div>
            <div className="text-lg text-text-primary">Large text - lg</div>
            <div className="text-base text-text-primary">Body text - base</div>
            <div className="text-sm text-text-secondary">Small text - sm</div>
            <div className="text-xs text-text-tertiary">Extra small text - xs</div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="mb-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Interactive Elements</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Buttons */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-text-primary">Buttons</h3>
              <div className="space-y-3">
                <button className="btn bg-primary text-primary-text hover:bg-primary-hover px-4 py-2">
                  Primary Button
                </button>
                <button className="btn bg-secondary text-secondary-text hover:bg-secondary-hover px-4 py-2">
                  Secondary Button
                </button>
                <button className="btn border border-border text-text-primary hover:bg-surface-hover px-4 py-2">
                  Outline Button
                </button>
                <button className="btn text-primary hover:bg-primary/10 px-4 py-2">
                  Ghost Button
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-text-primary">Form Elements</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Text input" className="form-input" />
                <select className="form-input">
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea placeholder="Textarea" className="form-input resize-none" rows={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Cards and Surfaces */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Cards and Surfaces</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {['Default Card', 'Featured Card', 'Info Card'].map((title) => (
              <div key={title} className="card p-4">
                <h3 className="mb-2 text-lg font-medium text-text-primary">{title}</h3>
                <p className="text-text-secondary">
                  This is a sample card demonstrating the theming system with proper contrast and
                  accessibility.
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="btn bg-primary text-primary-text hover:bg-primary-hover px-3 py-1 text-sm">
                    Action
                  </button>
                  <button className="btn text-text-secondary hover:bg-surface-hover px-3 py-1 text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
