/**
 * UI Components Demo Page
 *
 * Showcases all the basic UI components with their variants and states.
 */

import { useState } from 'react';

import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Switch,
  Textarea,
  ThemeToggle,
} from '../components/ui';

export default function ComponentsDemo() {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    country: '',
    newsletter: false,
    theme: 'light',
    notifications: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Form submitted!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-text-primary">UI Components Demo</h1>
            <p className="mt-2 text-text-secondary">
              Explore all the basic UI components with different variants and states
            </p>
          </div>
          <ThemeToggle variant="buttons" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Buttons Section */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-4 text-2xl font-semibold text-text-primary">Buttons</h2>

            {/* Button Variants */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-text-primary">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-text-primary">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Button States */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-text-primary">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button loading={loading}>{loading ? 'Loading...' : 'Click to Load'}</Button>
                <Button disabled>Disabled</Button>
                <Button
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  }
                >
                  With Icon
                </Button>
              </div>
            </div>
          </div>

          {/* Form Inputs Section */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-4 text-2xl font-semibold text-text-primary">Form Inputs</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Examples */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-text-primary">Text Input</h3>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, email: e.target.value }));
                    }}
                    leftIcon={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    }
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    state="success"
                    successMessage="Strong password!"
                  />

                  <Input
                    label="Username"
                    placeholder="Enter username"
                    state="error"
                    errorMessage="Username is already taken"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-text-primary">Textarea</h3>
                <Textarea
                  label="Message"
                  placeholder="Enter your message"
                  rows={4}
                  showCharCount
                  maxLength={200}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, message: e.target.value }));
                  }}
                  helperText="Share your thoughts with us"
                />
              </div>

              {/* Select */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-text-primary">Select</h3>
                <Select
                  label="Country"
                  placeholder="Select your country"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, country: e.target.value }));
                  }}
                  options={[
                    { value: 'us', label: 'United States' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'uk', label: 'United Kingdom' },
                    { value: 'de', label: 'Germany' },
                    { value: 'fr', label: 'France' },
                  ]}
                />
              </div>

              <Button type="submit" loading={loading} fullWidth>
                Submit Form
              </Button>
            </form>
          </div>

          {/* Checkbox and Radio Section */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-4 text-2xl font-semibold text-text-primary">Selection Controls</h2>

            {/* Checkboxes */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium text-text-primary">Checkboxes</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Subscribe to newsletter"
                  description="Get updates about new features and releases"
                  checked={formData.newsletter}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, newsletter: e.target.checked }));
                  }}
                />

                <Checkbox
                  label="I agree to the terms and conditions"
                  state="error"
                  errorMessage="You must accept the terms to continue"
                />

                <Checkbox label="Indeterminate checkbox" indeterminate />

                <Checkbox label="Disabled checkbox" disabled />
              </div>
            </div>

            {/* Radio Buttons */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-text-primary">Radio Buttons</h3>
              <RadioGroup
                label="Preferred Theme"
                name="theme"
                value={formData.theme}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, theme: value }));
                }}
                options={[
                  {
                    value: 'light',
                    label: 'Light Theme',
                    description: 'Clean and bright interface',
                  },
                  { value: 'dark', label: 'Dark Theme', description: 'Easy on the eyes' },
                  { value: 'system', label: 'System', description: 'Follow system preference' },
                ]}
                helperText="Choose your preferred color scheme"
              />
            </div>
          </div>

          {/* Switch Section */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-4 text-2xl font-semibold text-text-primary">Switches</h2>

            <div className="space-y-6">
              {/* Switch Sizes */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-text-primary">Sizes</h3>
                <div className="space-y-3">
                  <Switch size="sm" label="Small switch" />
                  <Switch size="md" label="Medium switch" />
                  <Switch size="lg" label="Large switch" />
                </div>
              </div>

              {/* Switch States */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-text-primary">States</h3>
                <div className="space-y-3">
                  <Switch
                    label="Enable notifications"
                    description="Receive push notifications for important updates"
                    checked={formData.notifications}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, notifications: e.target.checked }));
                    }}
                  />

                  <Switch
                    label="Success state"
                    state="success"
                    successMessage="Feature enabled successfully"
                    checked
                  />

                  <Switch
                    label="Warning state"
                    state="warning"
                    warningMessage="This feature is experimental"
                  />

                  <Switch
                    label="Error state"
                    state="error"
                    errorMessage="Unable to enable this feature"
                  />

                  <Switch label="Disabled switch" disabled />
                </div>
              </div>

              {/* Label Positions */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-text-primary">Label Positions</h3>
                <div className="space-y-3">
                  <Switch label="Label on the right (default)" labelPosition="right" />
                  <Switch label="Label on the left" labelPosition="left" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Showcase Summary */}
        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Component Summary</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md bg-background p-4">
              <h3 className="font-medium text-text-primary">Buttons</h3>
              <p className="text-sm text-text-secondary">7 variants, 5 sizes, loading states</p>
            </div>
            <div className="rounded-md bg-background p-4">
              <h3 className="font-medium text-text-primary">Form Inputs</h3>
              <p className="text-sm text-text-secondary">Input, Textarea, Select with validation</p>
            </div>
            <div className="rounded-md bg-background p-4">
              <h3 className="font-medium text-text-primary">Selection</h3>
              <p className="text-sm text-text-secondary">Checkbox, Radio, Switch components</p>
            </div>
            <div className="rounded-md bg-background p-4">
              <h3 className="font-medium text-text-primary">Theming</h3>
              <p className="text-sm text-text-secondary">Dark/light mode support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
