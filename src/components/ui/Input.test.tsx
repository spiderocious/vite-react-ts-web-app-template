import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '../../test/utils';

import { Input } from './Input';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('border-neutral-300');
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Input size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-2', 'text-sm');

    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('px-4', 'py-3', 'text-base');
  });

  it('handles validation states', () => {
    const { rerender } = render(<Input state="error" errorMessage="Error message" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-error');
    expect(screen.getByText('Error message')).toBeInTheDocument();

    rerender(<Input state="success" successMessage="Success message" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-success');
    expect(screen.getByText('Success message')).toBeInTheDocument();

    rerender(<Input state="warning" warningMessage="Warning message" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-warning');
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Input helperText="Enter your username" />);

    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50');
  });

  it('handles value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // One for each character
  });

  it('renders with icons', () => {
    const StartIcon = () => <span data-testid="start-icon">🔍</span>;
    const EndIcon = () => <span data-testid="end-icon">❌</span>;

    render(<Input leftIcon={<StartIcon />} rightIcon={<EndIcon />} />);

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
