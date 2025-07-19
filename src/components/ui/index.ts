/**
 * UI Components Barrel Export
 *
 * Central export point for all UI components.
 */

// Basic components
export { Button } from './Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button';

export { Input } from './Input';
export type { InputProps, InputSize, InputVariant, ValidationState } from './Input';

export { Textarea } from './Textarea';
export type { TextareaProps, TextareaSize, TextareaVariant } from './Textarea';

export { Select } from './Select';
export type { SelectOption, SelectProps, SelectSize, SelectVariant } from './Select';

export { Checkbox } from './Checkbox';
export type { CheckboxProps, CheckboxSize } from './Checkbox';

export { Radio, RadioGroup } from './Radio';
export type { RadioGroupProps, RadioOption, RadioProps, RadioSize } from './Radio';

export { Switch } from './Switch';
export type { SwitchProps, SwitchSize } from './Switch';

export { Badge } from './Badge';
export type { BadgeProps, BadgeSize, BadgeVariant } from './Badge';

export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';

export { Skeleton } from './Skeleton';
export type { SkeletonProps, SkeletonVariant } from './Skeleton';

export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './Spinner';

export { Progress, ProgressCircular } from './Progress';
export type { ProgressProps, ProgressSize, ProgressVariant } from './Progress';

export { RangeSlider, Slider } from './Slider';
export type { RangeSliderProps, SliderProps, SliderSize, SliderVariant } from './Slider';

export { Tooltip, useTooltip } from './Tooltip';
export type { TooltipPlacement, TooltipProps, TooltipSize, TooltipVariant } from './Tooltip';

export {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  usePopover,
} from './Popover';
export type { PopoverPlacement, PopoverProps, PopoverSize, PopoverVariant } from './Popover';

// Layout & Navigation components
export { Card, CardBody, CardFooter, CardHeader, CardImage } from './Card';
export type {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardImageProps,
  CardProps,
  CardSize,
  CardVariant,
} from './Card';

export {
  initModalApi,
  Modal,
  modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProvider,
  useModal,
} from './Modal';
export type { ModalProps, ModalSize, ModalVariant } from './Modal';

export { initToastApi, Toast, toast, ToastProvider, useToast } from './Toast';
export type { ToastPosition, ToastProps, ToastVariant } from './Toast';

export { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
export type {
  TabsContentProps,
  TabsListProps,
  TabsOrientation,
  TabsProps,
  TabsSize,
  TabsTriggerProps,
  TabsVariant,
} from './Tabs';

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';
export type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
  AccordionType,
  AccordionVariant,
} from './Accordion';

// Theme components
export type { Theme } from '../../contexts/ThemeContext';
export { ThemeToggle } from './ThemeToggle';
