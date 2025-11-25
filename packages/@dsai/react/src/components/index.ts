/**
 * DSAi Components
 *
 * Atomic, reusable UI components that form the building blocks of the design system.
 * Each component is self-contained with its own styles, tests, and Figma mapping.
 *
 * @example
 * ```tsx
 * import { Button, Input, Card } from '@dsai/react';
 * ```
 */

export type { AlertHeadingProps, AlertLinkProps, AlertProps, AlertVariant } from './Alert';
// Alert
export { Alert } from './Alert';

// Breadcrumb
export { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
export type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps } from './Breadcrumb';
export type { BadgeProps, BadgeVariant } from './Badge';
// Badge
export { Badge } from './Badge';
export type { ButtonProps, ButtonSize, ButtonType, ButtonVariant } from './Button';
// Button
export { Button } from './Button';
export type { SpinnerAnimation, SpinnerProps, SpinnerSize, SpinnerVariant } from './Spinner';
// Spinner
export { Spinner } from './Spinner';

// Progress
export { Progress } from './Progress';
export type { ProgressProps, ProgressBarProps, ProgressVariant, ProgressSize } from './Progress';

// Checkbox
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

// Radio
export { Radio, RadioGroup } from './Radio';
export type { RadioProps, RadioGroupProps } from './Radio';

// Input
export { Input } from './Input';
export type { InputProps, InputSize, InputType } from './Input';

// ListGroup
export { ListGroup, ListGroupItem } from './ListGroup';
export type {
  ListGroupItemData,
  ListGroupItemProps,
  ListGroupItemVariant,
  ListGroupProps,
  ListGroupVariant,
} from './ListGroup';

// Select
export { Select } from './Select';
export type { SelectOption, SelectOptionGroup, SelectProps, SelectSize } from './Select';

// Switch
export { Switch } from './Switch';
export type { SwitchProps, SwitchSize } from './Switch';

// Tabs
export { Tab, TabList, TabPanel, Tabs } from './Tabs';
export type {
  TabItem,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsOrientation,
  TabsProps,
  TabsVariant,
} from './Tabs';
