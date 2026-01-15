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
 * import { Button } from '@dsai-io/react';
 * // Import the generated theme CSS from your local project
 * import './generated/dsai-theme-bs.css';
 *
 * function App() {
 *   return <Button variant="primary">Click me</Button>;
 * }
 * ```
 *
 * @remarks
 * Design tokens are generated locally by `@dsai-io/tools` into your project's
 * output directory (e.g., `./src/generated/`). Run `dsai tokens build` to
 * generate the theme CSS files.
 *
 * @example With Utilities
 * ```tsx
 * import { Button, cn, generateId } from '@dsai-io/react';
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
  Avatar,
  AvatarGroup,
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
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  CarouselPauseButton,
  Checkbox,
  CheckboxGroup,
  Display,
  Dropdown,
  Heading,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  Navbar,
  Pagination,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverHeader,
  Progress,
  Radio,
  RadioGroup,
  Scrollspy,
  ScrollspyProvider,
  Select,
  SelectableCard,
  Sheet,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  TabsPro,
  Text,
  Toast,
  ToastContainer,
  ToastProvider,
  Tooltip,
  Typography,
  createInitialPopoverFSMState,
  createInitialToastFSMState,
  getPopoverVisualState,
  getToastVisualState,
  isScrollspyObserving,
  isScrollspySectionActive,
  isScrollspySectionVisible,
  popoverFSMReducer,
  toastFSMReducer,
  useScrollspy,
  useToast,
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
  type AvatarGroupLayout,
  type AvatarGroupProps,
  type AvatarGroupSpacing,
  type AvatarProps,
  type AvatarShape,
  type AvatarSize,
  type AvatarStatus,
  type AvatarStatusPosition,
  type AvatarTone,
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
  type CarouselAnimation,
  type CarouselCaptionProps,
  type CarouselControlDirection,
  type CarouselControlProps,
  type CarouselFSMEvent,
  type CarouselFSMState,
  type CarouselIndicatorsProps,
  type CarouselItemProps,
  type CarouselPauseButtonProps,
  type CarouselProps,
  type CarouselVisualState,
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
  type PaginationAlignment,
  type PaginationItemData,
  type PaginationItemProps,
  type PaginationProps,
  type PaginationSize,
  type PopoverBodyProps,
  type PopoverCloseButtonProps,
  type PopoverContextValue,
  type PopoverFSMEvent,
  type PopoverFSMState,
  type PopoverHeaderProps,
  type PopoverPlacement,
  type PopoverProps,
  type PopoverTrigger,
  type PopoverVisualState,
  type ProgressBarProps,
  type ProgressProps,
  type ProgressSize,
  type ProgressVariant,
  type RadioGroupProps,
  type RadioProps,
  type RowId,
  type RowIdAccessor,
  type SafePopoverHTMLAttributes,
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
  type SelectOption,
  type SelectOptionGroup,
  type SelectProps,
  type SelectSize,
  type SelectableCardProps,
  type SheetBodyProps,
  type SheetContextValue,
  type SheetFooterProps,
  type SheetHeaderProps,
  type SheetMode,
  type SheetPlacement,
  type SheetProps,
  type SheetSize,
  type SheetSurface,
  type SheetTitleProps,
  type SortConfig,
  type SortDirection,
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
  type TableColor,
  type TableColumn,
  type TableFSMState,
  type TableProps,
  type TableSelectionMode,
  type TableSize,
  type TableVariant,
  type TableVisualState,
  type TabsOrientation,
  type TabsProItem,
  type TabsProProps,
  type TabsProps,
  type TabsVariant,
  type TextProps,
  type TextVariant,
  type ToastContainerProps,
  type ToastContextValue,
  type ToastData,
  type ToastFSMEvent,
  type ToastFSMState,
  type ToastOptions,
  type ToastPosition,
  type ToastProps,
  type ToastProviderProps,
  type ToastVariant,
  type ToastVisualState,
  type TooltipFSMEvent,
  type TooltipFSMState,
  type TooltipPlacement,
  type TooltipProps,
  type TooltipTrigger,
  type TooltipVisualState,
} from './components';

// ============================================================================
// Centralized Type Primitives
// ============================================================================

/**
 * Design system primitive types.
 * Use these to build custom components that align with the design system.
 *
 * @example
 * ```typescript
 * import type { SemanticColorVariant, ComponentSize } from '@dsai-io/react';
 *
 * interface CustomAlertProps {
 *   variant?: SemanticColorVariant;
 *   size?: ComponentSize;
 * }
 * ```
 */
export type {
  // Accessibility & Security - WCAG 2.2 AA compliant attributes
  ARIAProps,
  // Core primitives - Design system vocabulary
  Alignment,
  // Responsive values - Breakpoint-aware props (Bootstrap 5 breakpoints: xs/sm/md/lg/xl/xxl)
  // Note: Breakpoint is also exported from './hooks' - both use same Bootstrap 5 values
  Breakpoint,
  ComponentSize,
  ExtendedSize,
  // State machines - FSM primitives for component state management
  FSMConfig,
  FSMEventBase,
  FSMReducer,
  FSMStateBase,
  FeedbackVariant,
  Orientation,
  // Polymorphic components - Type-safe "as" prop support
  PolymorphicComponentProps,
  PolymorphicProps,
  PolymorphicRef,
  ResponsiveProp,
  ResponsiveValue,
  SafeHTMLAttributes,
  SemanticColorVariant,
  VisualStateBase,
} from './types';

// Responsive utilities (runtime)
export { getResponsiveValue, isResponsiveValue } from './types';

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
export { useClickOutside } from './hooks';
export type { UseClickOutsideCallback, UseClickOutsideOptions, UseClickOutsideRefs } from './hooks';

export { useFocusTrap } from './hooks';
export type { UseFocusTrapOptions, UseFocusTrapReturn } from './hooks';

export {
  BREAKPOINTS,
  breakpointBetween,
  breakpointDown,
  breakpointUp,
  getBreakpointValue,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMobile,
  useIsTablet,
  useMediaQuery,
} from './hooks';
// Note: Breakpoint type is exported from './types' above to avoid duplicate identifier
export type { UseMediaQueryOptions } from './hooks';

export { useReducedMotion } from './hooks';
export type { UseReducedMotionOptions } from './hooks';

export { useScrollLock } from './hooks';
export type { UseScrollLockOptions, UseScrollLockReturn } from './hooks';

// ============================================================================
// Tokens - Generate locally using @dsai-io/tools
// ============================================================================
// Note: Tokens are generated locally in each app using:
// dsai tokens build
// Then import from: import { colorBlue500 } from './generated/tokens';

// ============================================================================
// Icons - Bootstrap Icons as React components (inline SVG for Figma compatibility)
// ============================================================================
// Individual icons can be imported directly:
// import { ArrowLeftIcon, CheckCircleFillIcon } from '@dsai-io/react';
//
// Or use the Icon folder exports from components:
// import { ArrowLeftIcon } from '@dsai-io/react';
export * from './components/Icon';

// ============================================================================
// Utils - Pure utility functions
// ============================================================================
// Core utilities (convenience re-exports from utils/index.ts)
export { clamp, cn, generateId, isBrowser, mergeRefs, prefersReducedMotion } from './utils';

// Accessibility utilities
export {
  announceToScreenReader,
  focusableSelectorString,
  focusableSelectors,
  getAnimationDuration,
  shouldAnimate,
  trapFocus,
  type AnnounceOptions,
  type TrapFocusOptions,
} from './utils/a11y';

// Keyboard utilities
export { isEnterKey, isEscapeKey } from './utils/keyboard';

// Misc utilities
export {
  ClearIcon,
  clearAllEvent,
  getSafeInputProps,
  mapPlacement,
  normalizeTriggers,
  selectAllEvent,
  toggleAllEvent,
  toggleItemEvent,
} from './utils/misc';

// Object utilities
export { deepMerge, omit, pick } from './utils/object';

// String utilities
export { getVariantClass } from './utils/string';

// Timing utilities
export { debounce, throttle } from './utils/timing';

// Type utilities
export { isExternalUrl } from './utils/types';

// Validation utilities
export { isSafeHref, isValidEmail, isValidHref, isValidUrl } from './utils/validation';

// Async utilities
export {
  TimeoutError,
  createAbortable,
  createTaskQueue,
  exponentialBackoff,
  queueTask,
  retryWithBackoff,
  withTimeout,
} from './utils/async';
export type {
  AbortablePromise,
  ExponentialBackoffOptions,
  QueueTaskOptions,
  QueuedTask,
  QueuedTaskHandle,
  RetryResult,
  RetryWithBackoffOptions,
  TaskFunction,
  TaskQueue,
  TaskQueueOptions,
  TaskQueueState,
  TaskSchedule,
  WithTimeoutOptions,
} from './utils/async';

// ============================================================================
// Version
// ============================================================================
export const version = '0.0.1';
