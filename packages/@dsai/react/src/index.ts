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
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonType,
  type ButtonVariant,
  Spinner,
  type SpinnerProps,
  type SpinnerAnimation,
  type SpinnerSize,
  type SpinnerVariant,
  Badge,
  type BadgeProps,
  type BadgeVariant,
  Alert,
  type AlertProps,
  type AlertVariant,
  type AlertLinkProps,
  type AlertHeadingProps,
  Breadcrumb,
  BreadcrumbItem,
  type BreadcrumbItemData,
  type BreadcrumbItemProps,
  type BreadcrumbProps,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  CardImgOverlay,
  CardLink,
  CardText,
  CardTitle,
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
  Progress,
  type ProgressProps,
  type ProgressBarProps,
  type ProgressVariant,
  type ProgressSize,
  Checkbox,
  type CheckboxProps,
  Radio,
  RadioGroup,
  type RadioProps,
  type RadioGroupProps,
  Input,
  type InputProps,
  type InputSize,
  type InputType,
  ListGroup,
  ListGroupItem,
  type ListGroupItemData,
  type ListGroupItemProps,
  type ListGroupItemVariant,
  type ListGroupProps,
  type ListGroupVariant,
  Select,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
  type SelectSize,
  Switch,
  type SwitchProps,
  type SwitchSize,
  Tab,
  TabList,
  TabPanel,
  Tabs,
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
// Utils - Pure utility functions
// ============================================================================
export { clamp, cn, generateId, isBrowser, mergeRefs, prefersReducedMotion } from './utils';

// ============================================================================
// Version
// ============================================================================
export const version = '0.0.1';
