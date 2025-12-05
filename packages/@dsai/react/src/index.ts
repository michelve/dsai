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
  Alert,
  type AlertHeadingProps,
  type AlertLinkProps,
  type AlertProps,
  type AlertVariant,
  type AsyncLoader,
  Avatar,
  AvatarGroup,
  type AvatarGroupLayout,
  type AvatarGroupProps,
  type AvatarGroupSpacing,
  type AvatarProps,
  type AvatarShape,
  type AvatarSize,
  type AvatarStatus,
  type AvatarStatusPosition,
  type AvatarTone,
  Badge,
  type BadgeProps,
  type BadgeVariant,
  Breadcrumb,
  BreadcrumbItem,
  type BreadcrumbItemData,
  type BreadcrumbItemProps,
  type BreadcrumbProps,
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonType,
  type ButtonVariant,
  Card,
  CardBody,
  type CardBodyProps,
  type CardColor,
  CardFooter,
  type CardFooterProps,
  CardHeader,
  type CardHeaderProps,
  CardImage,
  type CardImageProps,
  CardImgOverlay,
  type CardImgOverlayProps,
  CardLink,
  type CardLinkProps,
  CardList,
  type CardListFSMState,
  type CardListItem,
  type CardListProps,
  type CardListSelectionMode,
  type CardListVisualState,
  type CardProps,
  type CardSelectionMode,
  CardText,
  type CardTextProps,
  CardTitle,
  type CardTitleProps,
  type CardVariant,
  Carousel,
  type CarouselAnimation,
  CarouselCaption,
  type CarouselCaptionProps,
  CarouselControl,
  type CarouselControlDirection,
  type CarouselControlProps,
  type CarouselFSMEvent,
  type CarouselFSMState,
  CarouselIndicators,
  type CarouselIndicatorsProps,
  CarouselItem,
  type CarouselItemProps,
  CarouselPauseButton,
  type CarouselPauseButtonProps,
  type CarouselProps,
  type CarouselVisualState,
  type CellAlign,
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupFSMState,
  type CheckboxGroupOption,
  type CheckboxGroupProps,
  type CheckboxProps,
  createInitialPopoverFSMState,
  createInitialToastFSMState,
  Display,
  type DisplayProps,
  type DisplaySize,
  Dropdown,
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
  getPopoverVisualState,
  getToastVisualState,
  Heading,
  type HeadingLevel,
  type HeadingProps,
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
  Modal,
  type ModalBodyProps,
  type ModalFooterProps,
  type ModalFullscreenBreakpoint,
  type ModalHeaderProps,
  type ModalProps,
  type ModalSize,
  type ModalTitleProps,
  Navbar,
  type NavbarBackground,
  type NavbarBrandProps,
  type NavbarCollapseProps,
  type NavbarContextValue,
  type NavbarExpandBreakpoint,
  type NavbarFSMEvent,
  type NavbarFSMState,
  type NavbarItemProps,
  type NavbarLinkProps,
  type NavbarNavProps,
  type NavbarOrientation,
  type NavbarPlacement,
  type NavbarProps,
  type NavbarTextProps,
  type NavbarToggleProps,
  type NavbarVariant,
  type NavbarVisibility,
  type NavbarVisualState,
  Pagination,
  type PaginationAlignment,
  type PaginationItemData,
  type PaginationItemProps,
  type PaginationProps,
  type PaginationSize,
  Popover,
  PopoverBody,
  type PopoverBodyProps,
  PopoverCloseButton,
  type PopoverCloseButtonProps,
  type PopoverContextValue,
  type PopoverFSMEvent,
  type PopoverFSMState,
  PopoverHeader,
  type PopoverHeaderProps,
  type PopoverPlacement,
  type PopoverProps,
  type PopoverTrigger,
  type PopoverVisualState,
  Progress,
  type ProgressBarProps,
  type ProgressProps,
  type ProgressSize,
  type ProgressVariant,
  popoverFSMReducer,
  Radio,
  RadioGroup,
  type RadioGroupProps,
  type RadioProps,
  type RowId,
  type RowIdAccessor,
  Scrollspy,
  ScrollspyProvider,
  type ScrollspyContextValue,
  type ScrollspyFSMEvent,
  type ScrollspyFSMState,
  type ScrollspyItem,
  type ScrollspyLinkProps,
  type ScrollspyOrientation,
  type ScrollspyPosition,
  type ScrollspyProps,
  type ScrollspyProviderProps,
  type ScrollspyVariant,
  type ScrollspyVisualState,
  isScrollspyObserving,
  isScrollspySectionActive,
  isScrollspySectionVisible,
  useScrollspy,
  type SafePopoverHTMLAttributes,
  Select,
  SelectableCard,
  type SelectableCardProps,
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
  type SelectSize,
  type SortConfig,
  type SortDirection,
  Spinner,
  type SpinnerAnimation,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerVariant,
  Switch,
  type SwitchProps,
  type SwitchSize,
  Tab,
  type TabItem,
  TabList,
  type TabListProps,
  Table,
  type TableColor,
  type TableColumn,
  type TableFSMState,
  type TableProps,
  type TableSelectionMode,
  type TableSize,
  type TableVariant,
  type TableVisualState,
  TabPanel,
  type TabPanelProps,
  type TabProps,
  Tabs,
  type TabsOrientation,
  TabsPro,
  type TabsProItem,
  type TabsProProps,
  type TabsProps,
  type TabsVariant,
  Text,
  type TextProps,
  type TextVariant,
  Toast,
  ToastContainer,
  type ToastContainerProps,
  type ToastContextValue,
  type ToastData,
  type ToastFSMEvent,
  type ToastFSMState,
  type ToastOptions,
  type ToastPosition,
  type ToastProps,
  ToastProvider,
  type ToastProviderProps,
  type ToastVariant,
  type ToastVisualState,
  Tooltip,
  type TooltipFSMEvent,
  type TooltipFSMState,
  type TooltipPlacement,
  type TooltipProps,
  type TooltipTrigger,
  type TooltipVisualState,
  Typography,
  toastFSMReducer,
  useToast,
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
