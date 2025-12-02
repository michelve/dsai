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
  Accordion,
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
  CardList,
  CardText,
  CardTitle,
  Checkbox,
  CheckboxGroup,
  Display,
  Dropdown,
  Heading,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Select,
  SelectableCard,
  Spinner,
  Switch,
  Tab,
  Table,
  TabList,
  TabPanel,
  Tabs,
  TabsPro,
  Text,
  Typography,
  type AccordionButtonProps,
  type AccordionContextValue,
  type AccordionFSMEvent,
  type AccordionFSMState,
  type AccordionItemContextValue,
  type AccordionItemProps,
  type AccordionItemVisualState,
  type AccordionPanelProps,
  type AccordionProps,
  type AccordionSelectionMode,
  type AlertHeadingProps,
  type AlertLinkProps,
  type AlertProps,
  type AlertVariant,
  type AsyncLoader,
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
  type CardListFSMState,
  type CardListItem,
  type CardListProps,
  type CardListSelectionMode,
  type CardListVisualState,
  type CardProps,
  type CardSelectionMode,
  type CardTextProps,
  type CardTitleProps,
  type CardVariant,
  type CellAlign,
  type CheckboxGroupFSMState,
  type CheckboxGroupOption,
  type CheckboxGroupProps,
  type CheckboxProps,
  type DisplayProps,
  type DisplaySize,
  type DropdownAutoClose,
  type DropdownDividerProps,
  type DropdownHeaderProps,
  type DropdownItemProps,
  type DropdownItemTextProps,
  type DropdownMenuProps,
  type DropdownPlacement,
  type DropdownProps,
  type DropdownToggleProps,
  type GroupSelectionState,
  type GuardFn,
  type GuardResult,
  type HeadingLevel,
  type HeadingProps,
  type InputProps,
  type InputSize,
  type InputType,
  type ListGroupItemData,
  type ListGroupItemProps,
  type ListGroupItemVariant,
  type ListGroupProps,
  type ListGroupVariant,
  type ModalBodyProps,
  type ModalFooterProps,
  type ModalFullscreenBreakpoint,
  type ModalHeaderProps,
  type ModalProps,
  type ModalSize,
  type ModalTitleProps,
  type PaginationAlignment,
  type PaginationItemData,
  type PaginationItemProps,
  type PaginationProps,
  type PaginationSize,
  type ProgressBarProps,
  type ProgressProps,
  type ProgressSize,
  type ProgressVariant,
  type RadioGroupProps,
  type RadioProps,
  type RowId,
  type RowIdAccessor,
  type SelectableCardProps,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
  type SelectSize,
  type SortConfig,
  type SortDirection,
  type SpinnerAnimation,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerVariant,
  type SwitchProps,
  type SwitchSize,
  type TabItem,
  type TableColor,
  type TableColumn,
  type TableFSMState,
  type TableProps,
  type TableSelectionMode,
  type TableSize,
  type TableVariant,
  type TableVisualState,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsOrientation,
  type TabsProItem,
  type TabsProProps,
  type TabsProps,
  type TabsVariant,
  type TextProps,
  type TextVariant,
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
