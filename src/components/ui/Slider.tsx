/**
 * Slider Component
 *
 * Range slider component for selecting values within a range.
 */

import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import { forwardRef, useCallback, useRef } from 'react';

export type SliderSize = 'sm' | 'md' | 'lg';
export type SliderVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Current value */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Size of the slider */
  size?: SliderSize;
  /** Visual variant */
  variant?: SliderVariant;
  /** Whether to show value tooltip */
  showValue?: boolean;
  /** Custom label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Warning message */
  warning?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Callback when value changes */
  onValueChange?: (value: number) => void;
  /** Array of marks to display */
  marks?: Array<{ value: number; label?: string }>;
}

const sliderSizes = {
  sm: {
    track: 'h-1',
    thumb: 'h-3 w-3',
    label: 'text-xs',
  },
  md: {
    track: 'h-1.5',
    thumb: 'h-4 w-4',
    label: 'text-sm',
  },
  lg: {
    track: 'h-2',
    thumb: 'h-5 w-5',
    label: 'text-base',
  },
};

const sliderVariants = {
  default: {
    track: 'bg-neutral-200',
    fill: 'bg-neutral-600',
    thumb: 'bg-neutral-600 border-neutral-600',
  },
  primary: {
    track: 'bg-primary-100',
    fill: 'bg-primary',
    thumb: 'bg-primary border-primary',
  },
  success: {
    track: 'bg-success-100',
    fill: 'bg-success',
    thumb: 'bg-success border-success',
  },
  warning: {
    track: 'bg-warning-100',
    fill: 'bg-warning',
    thumb: 'bg-warning border-warning',
  },
  error: {
    track: 'bg-error-100',
    fill: 'bg-error',
    thumb: 'bg-error border-error',
  },
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      size = 'md',
      variant = 'primary',
      showValue = false,
      label,
      helperText,
      error,
      success,
      warning,
      disabled = false,
      onValueChange,
      onChange,
      marks,
      ...props
    },
    ref
  ) => {
    const sliderRef = useRef<HTMLInputElement>(null);
    const currentValue = value ?? defaultValue;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    // Determine validation state
    const validationState = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';
    const currentVariant = validationState !== 'default' ? validationState : variant;
    const helpMessage = error || success || warning || helperText;

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(event.target.value);
        onValueChange?.(newValue);
        onChange?.(event);
      },
      [onValueChange, onChange]
    );

    return (
      <div ref={ref} className={clsx('w-full', className)}>
        {/* Label */}
        {label && (
          <label
            className={clsx('mb-2 block font-medium text-text-primary', sliderSizes[size].label)}
          >
            {label}
          </label>
        )}

        {/* Slider container */}
        <div className="relative">
          {/* Custom track */}
          <div
            className={clsx(
              'relative w-full rounded-full',
              sliderSizes[size].track,
              sliderVariants[currentVariant].track,
              disabled && 'opacity-50'
            )}
          >
            {/* Fill track */}
            <div
              className={clsx(
                'absolute left-0 top-0 rounded-full transition-all duration-200',
                sliderSizes[size].track,
                sliderVariants[currentVariant].fill
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Marks */}
            {marks?.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute top-1/2 h-2 w-0.5 -translate-x-1/2 -translate-y-1/2 transform bg-text-secondary"
                  style={{ left: `${markPercentage}%` }}
                />
              );
            })}
          </div>

          {/* Native input */}
          <input
            ref={sliderRef}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled}
            onChange={handleChange}
            className={clsx(
              'absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent',

              // Webkit thumb styles
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:border-2',
              '[&::-webkit-slider-thumb]:bg-white',
              '[&::-webkit-slider-thumb]:shadow-md',
              '[&::-webkit-slider-thumb]:transition-all',
              '[&::-webkit-slider-thumb]:duration-200',
              `[&::-webkit-slider-thumb]:${sliderSizes[size].thumb}`,
              `[&::-webkit-slider-thumb]:${sliderVariants[currentVariant].thumb}`,

              // Webkit hover
              '[&::-webkit-slider-thumb]:hover:scale-110',

              // Firefox thumb styles
              '[&::-moz-range-thumb]:appearance-none',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:border-2',
              '[&::-moz-range-thumb]:bg-white',
              '[&::-moz-range-thumb]:shadow-md',
              '[&::-moz-range-thumb]:transition-all',
              '[&::-moz-range-thumb]:duration-200',
              `[&::-moz-range-thumb]:${sliderSizes[size].thumb}`,
              `[&::-moz-range-thumb]:${sliderVariants[currentVariant].thumb}`,

              // Disabled state
              disabled && 'cursor-not-allowed opacity-50',

              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            {...props}
          />

          {/* Value tooltip */}
          {showValue && (
            <div
              className={clsx(
                'absolute -top-8 flex -translate-x-1/2 transform items-center justify-center',
                'rounded bg-text-primary px-2 py-1 text-xs text-white shadow-md',
                'transition-all duration-200'
              )}
              style={{ left: `${percentage}%` }}
            >
              {currentValue}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rotate-45 bg-text-primary" />
            </div>
          )}
        </div>

        {/* Marks labels */}
        {marks && marks.some((mark) => mark.label) && (
          <div className="relative mt-2">
            {marks.map((mark) => {
              if (!mark.label) return null;
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className={clsx(
                    'absolute -translate-x-1/2 transform text-xs text-text-secondary',
                    sliderSizes[size].label
                  )}
                  style={{ left: `${markPercentage}%` }}
                >
                  {mark.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Help message */}
        {helpMessage && (
          <p
            className={clsx('mt-1 text-xs', {
              'text-text-secondary': validationState === 'default',
              'text-success': validationState === 'success',
              'text-warning': validationState === 'warning',
              'text-error': validationState === 'error',
            })}
          >
            {helpMessage}
          </p>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

// Range slider component for selecting a range of values
export interface RangeSliderProps
  extends Omit<SliderProps, 'value' | 'defaultValue' | 'onValueChange'> {
  /** Current range values [min, max] */
  value?: [number, number];
  /** Default range values (uncontrolled) */
  defaultValue?: [number, number];
  /** Callback when range changes */
  onValueChange?: (value: [number, number]) => void;
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0, 100],
      min = 0,
      max = 100,
      step = 1,
      size = 'md',
      variant = 'primary',
      showValue = false,
      label,
      helperText,
      error,
      success,
      warning,
      disabled = false,
      onValueChange,
      marks,
      ...props
    },
    ref
  ) => {
    const [minValue, maxValue] = value ?? defaultValue;
    const minPercentage = ((minValue - min) / (max - min)) * 100;
    const maxPercentage = ((maxValue - min) / (max - min)) * 100;

    // Determine validation state
    const validationState = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';
    const currentVariant = validationState !== 'default' ? validationState : variant;
    const helpMessage = error || success || warning || helperText;

    const handleMinChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.min(Number(event.target.value), maxValue - step);
        onValueChange?.([newMin, maxValue]);
      },
      [onValueChange, maxValue, step]
    );

    const handleMaxChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.max(Number(event.target.value), minValue + step);
        onValueChange?.([minValue, newMax]);
      },
      [onValueChange, minValue, step]
    );

    return (
      <div ref={ref} className={clsx('w-full', className)}>
        {/* Label */}
        {label && (
          <label
            className={clsx('mb-2 block font-medium text-text-primary', sliderSizes[size].label)}
          >
            {label}
          </label>
        )}

        {/* Slider container */}
        <div className="relative">
          {/* Custom track */}
          <div
            className={clsx(
              'relative w-full rounded-full',
              sliderSizes[size].track,
              sliderVariants[currentVariant].track,
              disabled && 'opacity-50'
            )}
          >
            {/* Fill track */}
            <div
              className={clsx(
                'absolute top-0 rounded-full transition-all duration-200',
                sliderSizes[size].track,
                sliderVariants[currentVariant].fill
              )}
              style={{
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`,
              }}
            />

            {/* Marks */}
            {marks?.map((mark) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className="absolute top-1/2 h-2 w-0.5 -translate-x-1/2 -translate-y-1/2 transform bg-text-secondary"
                  style={{ left: `${markPercentage}%` }}
                />
              );
            })}
          </div>

          {/* Min input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            disabled={disabled}
            onChange={handleMinChange}
            className={clsx(
              'absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent',
              // Webkit styles
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:border-2',
              '[&::-webkit-slider-thumb]:bg-white',
              '[&::-webkit-slider-thumb]:shadow-md',
              '[&::-webkit-slider-thumb]:transition-all',
              '[&::-webkit-slider-thumb]:duration-200',
              '[&::-webkit-slider-thumb]:pointer-events-auto',
              '[&::-webkit-slider-thumb]:relative',
              '[&::-webkit-slider-thumb]:z-10',
              `[&::-webkit-slider-thumb]:${sliderSizes[size].thumb}`,
              `[&::-webkit-slider-thumb]:${sliderVariants[currentVariant].thumb}`,
              disabled && 'cursor-not-allowed opacity-50',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            {...props}
          />

          {/* Max input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            disabled={disabled}
            onChange={handleMaxChange}
            className={clsx(
              'absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent',
              // Webkit styles
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:border-2',
              '[&::-webkit-slider-thumb]:bg-white',
              '[&::-webkit-slider-thumb]:shadow-md',
              '[&::-webkit-slider-thumb]:transition-all',
              '[&::-webkit-slider-thumb]:duration-200',
              '[&::-webkit-slider-thumb]:pointer-events-auto',
              '[&::-webkit-slider-thumb]:relative',
              '[&::-webkit-slider-thumb]:z-20',
              `[&::-webkit-slider-thumb]:${sliderSizes[size].thumb}`,
              `[&::-webkit-slider-thumb]:${sliderVariants[currentVariant].thumb}`,
              disabled && 'cursor-not-allowed opacity-50',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            {...props}
          />

          {/* Value tooltips */}
          {showValue && (
            <>
              <div
                className={clsx(
                  'absolute -top-8 flex -translate-x-1/2 transform items-center justify-center',
                  'rounded bg-text-primary px-2 py-1 text-xs text-white shadow-md',
                  'transition-all duration-200'
                )}
                style={{ left: `${minPercentage}%` }}
              >
                {minValue}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rotate-45 bg-text-primary" />
              </div>
              <div
                className={clsx(
                  'absolute -top-8 flex -translate-x-1/2 transform items-center justify-center',
                  'rounded bg-text-primary px-2 py-1 text-xs text-white shadow-md',
                  'transition-all duration-200'
                )}
                style={{ left: `${maxPercentage}%` }}
              >
                {maxValue}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 transform rotate-45 bg-text-primary" />
              </div>
            </>
          )}
        </div>

        {/* Marks labels */}
        {marks && marks.some((mark) => mark.label) && (
          <div className="relative mt-2">
            {marks.map((mark) => {
              if (!mark.label) return null;
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={mark.value}
                  className={clsx(
                    'absolute -translate-x-1/2 transform text-xs text-text-secondary',
                    sliderSizes[size].label
                  )}
                  style={{ left: `${markPercentage}%` }}
                >
                  {mark.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Help message */}
        {helpMessage && (
          <p
            className={clsx('mt-1 text-xs', {
              'text-text-secondary': validationState === 'default',
              'text-success': validationState === 'success',
              'text-warning': validationState === 'warning',
              'text-error': validationState === 'error',
            })}
          >
            {helpMessage}
          </p>
        )}
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';
