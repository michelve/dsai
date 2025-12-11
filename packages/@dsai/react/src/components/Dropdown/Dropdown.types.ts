import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { SafeHTMLAttributes } from '../../types';

/**
 * Dropdown placement options
 * Maps to Floating UI placement values
 * Note: Bootstrap uses direction classes but we use Floating UI for positioning
 */
export type DropdownPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Dropdown auto-close behavior
 * Matches Bootstrap 5 auto-close options
 *
 * @see https://getbootstrap.com/docs/5.3/components/dropdowns/#auto-close-behavior
 */
export type DropdownAutoClose = boolean | 'inside' | 'outside';

/**
 * Safe HTML attributes that can be spread onto dropdown elements
 * SECURITY: This whitelist prevents injection of dangerous attributes or event handlers
 * @see {@link SafeHTMLAttributes}
 */
export type SafeDropdownHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Dropdown component props
 *
 * The main container component that manages dropdown state, positioning,
 * keyboard navigation, and accessibility.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - aria-haspopup on trigger button
 * - aria-expanded state management
 * - Keyboard navigation (Arrow keys, Enter, Space, ESC, Tab)
 * - Focus management within dropdown menu
 * - Proper role attributes on menu and items
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - Safe href validation for dropdown items
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic dropdown
 * <Dropdown>
 *   <Dropdown.Toggle variant="primary">
 *     Options
 *   </Dropdown.Toggle>
 *   <Dropdown.Menu>
 *     <Dropdown.Item onClick={handleAction1}>Action 1</Dropdown.Item>
 *     <Dropdown.Item onClick={handleAction2}>Action 2</Dropdown.Item>
 *     <Dropdown.Divider />
 *     <Dropdown.Item onClick={handleAction3}>Action 3</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 *
 * // Dropdown with sections
 * <Dropdown placement="bottom-end">
 *   <Dropdown.Toggle variant="secondary">
 *     Settings
 *   </Dropdown.Toggle>
 *   <Dropdown.Menu>
 *     <Dropdown.Header>User Settings</Dropdown.Header>
 *     <Dropdown.Item href="/profile">Profile</Dropdown.Item>
 *     <Dropdown.Item href="/settings">Settings</Dropdown.Item>
 *     <Dropdown.Divider />
 *     <Dropdown.Header>System</Dropdown.Header>
 *     <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 *
 * // Controlled dropdown
 * const [isOpen, setIsOpen] = useState(false);
 * <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
 *   <Dropdown.Toggle>Controlled</Dropdown.Toggle>
 *   <Dropdown.Menu>
 *     <Dropdown.Item>Item</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 * ```
 */
export interface DropdownProps extends SafeDropdownHTMLAttributes {
  /**
   * Dropdown content (Toggle and Menu components)
   */
  children: ReactNode;

  /**
   * Controlled open state
   * If provided, dropdown becomes controlled
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes
   * Required when isOpen is provided (controlled mode)
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Default open state for uncontrolled mode
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Placement of the dropdown menu relative to the trigger
   * Uses Floating UI for positioning with auto-flip on viewport edges
   * @default 'bottom-start'
   */
  placement?: DropdownPlacement;

  /**
   * Auto-close behavior for the dropdown
   * - true: closes on click inside or outside (default)
   * - false: only closes programmatically
   * - 'inside': closes only when clicking inside the menu
   * - 'outside': closes only when clicking outside the menu
   * @default true
   */
  autoClose?: DropdownAutoClose;

  /**
   * Offset from the trigger element [skidding, distance]
   * @default [0, 2]
   */
  offset?: [number, number];

  /**
   * Whether dropdown is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback when dropdown opens (after animation)
   */
  onOpened?: () => void;

  /**
   * Callback when dropdown closes (after animation)
   */
  onClosed?: () => void;
}

/**
 * Dropdown.Toggle component props
 *
 * The trigger button that opens/closes the dropdown menu.
 * Extends Button component for consistent styling.
 *
 * @example
 * ```tsx
 * // Basic toggle
 * <Dropdown.Toggle>Options</Dropdown.Toggle>
 *
 * // Toggle with variant and size
 * <Dropdown.Toggle variant="success" size="lg">
 *   Large Success Dropdown
 * </Dropdown.Toggle>
 *
 * // Split button toggle (caret only)
 * <Dropdown.Toggle split aria-label="Toggle dropdown" />
 * ```
 */
export interface DropdownToggleProps extends SafeDropdownHTMLAttributes {
  /**
   * Toggle button content
   */
  children?: ReactNode;

  /**
   * Button variant (matches Button component)
   * @default 'secondary'
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-light'
    | 'outline-dark'
    | 'link';

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether this is a split button (caret only, used with btn-group)
   * When true, only renders the caret without children
   * @default false
   */
  split?: boolean;

  /**
   * Whether to show the dropdown caret indicator
   * @default true
   */
  caret?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * ARIA label for accessibility (required for split buttons)
   */
  'aria-label'?: string;
}

/**
 * Dropdown.Menu component props
 *
 * The container for dropdown items. Rendered in a portal for proper positioning.
 *
 * @example
 * ```tsx
 * // Basic menu
 * <Dropdown.Menu>
 *   <Dropdown.Item>Item 1</Dropdown.Item>
 *   <Dropdown.Item>Item 2</Dropdown.Item>
 * </Dropdown.Menu>
 *
 * // Menu with alignment
 * <Dropdown.Menu align="end">
 *   <Dropdown.Item>Right-aligned menu</Dropdown.Item>
 * </Dropdown.Menu>
 * ```
 */
export interface DropdownMenuProps extends SafeDropdownHTMLAttributes {
  /**
   * Menu content (typically Dropdown.Item, Dropdown.Divider, Dropdown.Header)
   */
  children: ReactNode;

  /**
   * Menu alignment (overrides parent placement for simple cases)
   * @default 'start'
   */
  align?: 'start' | 'end';

  /**
   * Whether to render the menu in a portal
   * @default true
   */
  portal?: boolean;

  /**
   * Container element for the portal
   * @default document.body
   */
  container?: HTMLElement | null;
}

/**
 * Dropdown.Item component props
 *
 * A clickable item within the dropdown menu.
 * Can be rendered as a button or anchor based on props.
 *
 * @example
 * ```tsx
 * // Button item (action)
 * <Dropdown.Item onClick={handleAction}>
 *   Perform Action
 * </Dropdown.Item>
 *
 * // Link item (navigation)
 * <Dropdown.Item href="/settings">
 *   Go to Settings
 * </Dropdown.Item>
 *
 * // Disabled item
 * <Dropdown.Item disabled>
 *   Unavailable Option
 * </Dropdown.Item>
 *
 * // Item with icon
 * <Dropdown.Item startIcon={<SettingsIcon />}>
 *   Settings
 * </Dropdown.Item>
 *
 * // Active item
 * <Dropdown.Item active>
 *   Current Selection
 * </Dropdown.Item>
 * ```
 */
export interface DropdownItemProps extends SafeDropdownHTMLAttributes {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * Click event handler (for button items)
   */
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Keyboard event handler
   */
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /**
   * Link href (renders as anchor instead of button)
   * SECURITY: Validated against dangerous protocols
   */
  href?: string;

  /**
   * Link target (only when href is provided)
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Link rel attribute (only when href is provided)
   * Automatically adds 'noopener noreferrer' for target="_blank"
   */
  rel?: string;

  /**
   * Whether the item is currently active/selected
   * @default false
   */
  active?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before item text
   */
  startIcon?: ReactNode;

  /**
   * Icon to display after item text
   */
  endIcon?: ReactNode;

  /**
   * HTML element type to render
   * Automatically determined based on href presence
   */
  as?: 'button' | 'a';
}

/**
 * Dropdown.Divider component props
 *
 * A horizontal separator between groups of items.
 *
 * @example
 * ```tsx
 * <Dropdown.Menu>
 *   <Dropdown.Item>Action 1</Dropdown.Item>
 *   <Dropdown.Divider />
 *   <Dropdown.Item>Action 2</Dropdown.Item>
 * </Dropdown.Menu>
 * ```
 */
export type DropdownDividerProps = SafeDropdownHTMLAttributes;

/**
 * Dropdown.Header component props
 *
 * A non-interactive header to label sections within the menu.
 *
 * @example
 * ```tsx
 * <Dropdown.Menu>
 *   <Dropdown.Header>User Actions</Dropdown.Header>
 *   <Dropdown.Item>Profile</Dropdown.Item>
 *   <Dropdown.Item>Settings</Dropdown.Item>
 *   <Dropdown.Divider />
 *   <Dropdown.Header>System</Dropdown.Header>
 *   <Dropdown.Item>Logout</Dropdown.Item>
 * </Dropdown.Menu>
 * ```
 */
export interface DropdownHeaderProps extends SafeDropdownHTMLAttributes {
  /**
   * Header content
   */
  children: ReactNode;
}

/**
 * Dropdown.ItemText component props
 *
 * Non-interactive text content within the menu.
 *
 * @example
 * ```tsx
 * <Dropdown.Menu>
 *   <Dropdown.ItemText>Signed in as</Dropdown.ItemText>
 *   <Dropdown.ItemText className="fw-bold">user@example.com</Dropdown.ItemText>
 *   <Dropdown.Divider />
 *   <Dropdown.Item>Sign out</Dropdown.Item>
 * </Dropdown.Menu>
 * ```
 */
export interface DropdownItemTextProps extends SafeDropdownHTMLAttributes {
  /**
   * Text content
   */
  children: ReactNode;
}

/**
 * Dropdown context value for sharing state between components
 */
export interface DropdownContextValue {
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** Toggle the dropdown open/closed */
  toggle: () => void;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown */
  close: () => void;
  /** Whether the dropdown is disabled */
  disabled: boolean;
  /** Current placement of the menu */
  placement: DropdownPlacement;
  /** Auto-close behavior */
  autoClose: DropdownAutoClose;
  /** Toggle button ID for aria-labelledby */
  toggleId: string;
  /** Menu ID for aria-controls */
  menuId: string;
  /** Currently focused item index for keyboard navigation */
  activeIndex: number | null;
  /** Set the active item index */
  setActiveIndex: (index: number | null) => void;
  /** List of item refs for focus management */
  listRef: React.MutableRefObject<(HTMLElement | null)[]>;
  /** Get props for dropdown items */
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  /** Floating UI refs */
  refs: {
    setReference: (node: HTMLElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  /** Floating UI styles for positioning */
  floatingStyles: CSSProperties;
  /** Get props for reference element */
  getReferenceProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  /** Get props for floating element */
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  /** Floating UI context for focus management */
  floatingContext: unknown;
}
