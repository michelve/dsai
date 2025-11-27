/**
 * DSAi React Component Library
 *
 * Enterprise-grade React components with Bootstrap 5 design tokens.
 * WCAG 2.2 AA compliant.
 *
 * @packageDocumentation
 *
 * @example Basic Usage
 * ```tsx
 * import { Button } from '@dsai/react';
 * import '@dsai/tokens/css/bootstrap.css';
 *
 * function App() {
 *   return <Button variant="primary">Click me</Button>;
 * }
 * ```
 *
 * @example With Utilities
 * ```tsx
 * import { Button, cn, generateId } from '@dsai/react';
 *
 * function MyComponent({ isActive }) {
 *   const id = generateId('my-button');
 *   return (
 *     <Button
 *       id={id}
 *       className={cn('custom-class', isActive && 'active')}
 *     >
 *       Click me
 *     </Button>
 *   );
 * }
 * ```
 */

// ============================================================================
// Components - Atomic UI building blocks
// ============================================================================
export {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  CardImgOverlay,
  CardLink,
  CardText,
  CardTitle,
  Checkbox,
  CheckboxGroup,
  Input,
  ListGroup,
  ListGroupItem,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type AlertHeadingProps,
  type AlertLinkProps,
  type AlertProps,
  type AlertVariant,
  type BadgeProps,
  type BadgeVariant,
  type BreadcrumbItemData,
  type BreadcrumbItemProps,
  type BreadcrumbProps,
  type ButtonProps,
  type ButtonSize,
  type ButtonType,
  type ButtonVariant,
  type CardBodyProps,
  type CardColor,
  type CardFooterProps,
  type CardHeaderProps,
  type CardImageProps,
  type CardImgOverlayProps,
  type CardLinkProps,
  type CardProps,
  type CardTextProps,
  type CardTitleProps,
  type CardVariant,
  type CheckboxGroupFSMState,
  type CheckboxGroupOption,
  type CheckboxGroupProps,
  type CheckboxProps,
  type GroupSelectionState,
  type InputProps,
  type InputSize,
  type InputType,
  type ListGroupItemData,
  type ListGroupItemProps,
  type ListGroupItemVariant,
  type ListGroupProps,
  type ListGroupVariant,
  type ProgressBarProps,
  type ProgressProps,
  type ProgressSize,
  type ProgressVariant,
  type RadioGroupProps,
  type RadioProps,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
  type SelectSize,
  type SpinnerAnimation,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerVariant,
  type SwitchProps,
  type SwitchSize,
  type TabItem,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsOrientation,
  type TabsProps,
  type TabsVariant,
} from './components';

// ============================================================================
// Compositions - Complex multi-component patterns
// ============================================================================
// Future composition exports (uncomment as implemented):
// export { Form, type FormProps } from './compositions';
// export { DataTable, type DataTableProps } from './compositions';
// export { Modal, type ModalProps } from './compositions';

// ============================================================================
// Patterns - Layout patterns and page templates
// ============================================================================
// Future pattern exports (uncomment as implemented):
// export { DashboardLayout, type DashboardLayoutProps } from './patterns';
// export { AuthLayout, type AuthLayoutProps } from './patterns';

// ============================================================================
// Hooks - Reusable stateful logic
// ============================================================================
// Future hook exports (uncomment as implemented):
// export { useMediaQuery } from './hooks';
// export { useDebounce } from './hooks';
// export { useLocalStorage } from './hooks';

// ============================================================================
// Tokens - Import from @dsai/tokens directly
// ============================================================================
// Note: Tokens are NOT re-exported to avoid TypeScript rootDir issues.
// Import tokens directly: import { tokens } from '@dsai/tokens';

// ============================================================================
// Icons - Bootstrap Icons as React components (inline SVG for Figma compatibility)
// ============================================================================
// Individual icons can be imported directly:
// import { ArrowLeftIcon, CheckCircleFillIcon } from '@dsai/react';
//
// Or use the Icon folder exports from components:
// import { ArrowLeftIcon } from '@dsai/react';
export * from './components/Icon';

// ============================================================================
// Utils - Pure utility functions
// ============================================================================
export { clamp, cn, generateId, isBrowser, mergeRefs, prefersReducedMotion } from './utils';

// ============================================================================
// Version
// ============================================================================
export const version = '0.0.1';
