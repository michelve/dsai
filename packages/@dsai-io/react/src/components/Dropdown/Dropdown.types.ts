import type { SafeHTMLAttributes } from '../../types';
import type { FloatingContext } from '@floating-ui/react';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';

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
 * Button variants available for Dropdown.Toggle
 */
export type DropdownToggleVariant =
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
 * Link target attribute values for dropdown items
 */
export type DropdownLinkTarget = '_blank' | '_self' | '_parent' | '_top';

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

  /**
   * Whether keyboard navigation wraps from last item to first and vice versa
   * @default true
   */
  loop?: boolean;
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
  variant?: DropdownToggleVariant;

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

  /**
   * Maximum height for the menu, enabling scrolling for long lists
   * Accepts a number (pixels) or CSS string value
   */
  maxHeight?: number | string;
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
  target?: DropdownLinkTarget;

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

  /**
   * Called when the item is activated (click or keyboard).
   * Call event.preventDefault() to prevent the menu from closing.
   */
  onSelect?: (event: Event) => void;

  /**
   * Override auto-close behavior for this specific item.
   * - true: always close the menu on select
   * - false: never close the menu on select
   * - undefined: respect the parent Dropdown's autoClose setting
   */
  closeOnSelect?: boolean;

  /**
   * Visual variant of the item
   * - 'default': standard appearance
   * - 'destructive': red/danger styling for destructive actions
   * @default 'default'
   */
  variant?: 'default' | 'destructive';
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
 * Dropdown.Group component props
 *
 * Semantic grouping wrapper for related menu items.
 *
 * @example
 * ```tsx
 * <Dropdown.Menu>
 *   <Dropdown.Group label="File Operations">
 *     <Dropdown.Item>New</Dropdown.Item>
 *     <Dropdown.Item>Open</Dropdown.Item>
 *   </Dropdown.Group>
 *   <Dropdown.Divider />
 *   <Dropdown.Group label="Edit">
 *     <Dropdown.Item>Cut</Dropdown.Item>
 *     <Dropdown.Item>Copy</Dropdown.Item>
 *   </Dropdown.Group>
 * </Dropdown.Menu>
 * ```
 */
export interface DropdownGroupProps extends SafeDropdownHTMLAttributes {
  /**
   * Group content (typically Dropdown.Item components)
   */
  children: ReactNode;

  /**
   * Optional label for the group, rendered as a header and linked via aria-labelledby
   */
  label?: ReactNode;
}

/**
 * Dropdown.CheckboxItem component props
 *
 * A menu item that acts as a checkbox with menuitemcheckbox role.
 *
 * @example
 * ```tsx
 * <Dropdown.Menu>
 *   <Dropdown.CheckboxItem checked={bold} onCheckedChange={setBold}>
 *     Bold
 *   </Dropdown.CheckboxItem>
 *   <Dropdown.CheckboxItem checked={italic} onCheckedChange={setItalic}>
 *     Italic
 *   </Dropdown.CheckboxItem>
 * </Dropdown.Menu>
 * ```
 */
export interface DropdownCheckboxItemProps extends SafeDropdownHTMLAttributes {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * Controlled checked state
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled mode
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Callback when the checked state changes
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Called when the item is activated (click or keyboard)
   */
  onSelect?: (event: Event) => void;

  /**
   * Whether to close the menu when this item is toggled
   * @default false
   */
  closeOnSelect?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before the check indicator
   */
  startIcon?: ReactNode;

  /**
   * Icon to display after item text
   */
  endIcon?: ReactNode;
}

/**
 * Dropdown.RadioGroup component props
 *
 * Groups radio items together and manages single-selection state.
 *
 * @example
 * ```tsx
 * <Dropdown.Menu>
 *   <Dropdown.RadioGroup value={fontSize} onValueChange={setFontSize}>
 *     <Dropdown.RadioItem value="sm">Small</Dropdown.RadioItem>
 *     <Dropdown.RadioItem value="md">Medium</Dropdown.RadioItem>
 *     <Dropdown.RadioItem value="lg">Large</Dropdown.RadioItem>
 *   </Dropdown.RadioGroup>
 * </Dropdown.Menu>
 * ```
 */
export interface DropdownRadioGroupProps extends SafeDropdownHTMLAttributes {
  /**
   * Radio items
   */
  children: ReactNode;

  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: string;

  /**
   * Callback when the selected value changes
   */
  onValueChange?: (value: string) => void;
}

/**
 * Dropdown.RadioItem component props
 *
 * A menu item that acts as a radio button within a RadioGroup.
 *
 * @example
 * ```tsx
 * <Dropdown.RadioGroup value={size} onValueChange={setSize}>
 *   <Dropdown.RadioItem value="sm">Small</Dropdown.RadioItem>
 *   <Dropdown.RadioItem value="md">Medium</Dropdown.RadioItem>
 *   <Dropdown.RadioItem value="lg">Large</Dropdown.RadioItem>
 * </Dropdown.RadioGroup>
 * ```
 */
export interface DropdownRadioItemProps extends SafeDropdownHTMLAttributes {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * Unique value for this radio item (required)
   */
  value: string;

  /**
   * Called when the item is activated (click or keyboard)
   */
  onSelect?: (event: Event) => void;

  /**
   * Whether to close the menu when this item is selected
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before the radio indicator
   */
  startIcon?: ReactNode;

  /**
   * Icon to display after item text
   */
  endIcon?: ReactNode;
}

/**
 * Dropdown.Shortcut component props
 *
 * Displays a keyboard shortcut hint aligned to the right of a menu item.
 * Purely visual — does not register any keyboard shortcuts.
 *
 * @example
 * ```tsx
 * <Dropdown.Item>
 *   Save
 *   <Dropdown.Shortcut>Ctrl+S</Dropdown.Shortcut>
 * </Dropdown.Item>
 * ```
 */
export interface DropdownShortcutProps extends SafeDropdownHTMLAttributes {
  /**
   * Shortcut text (e.g., "Ctrl+S", "⌘K")
   */
  children: ReactNode;
}

/**
 * Internal context value for RadioGroup
 */
export interface DropdownRadioGroupContextValue {
  /** Currently selected value */
  value: string | undefined;
  /** Callback to change the selected value */
  onValueChange: (value: string) => void;
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
  listRef: React.RefObject<(HTMLElement | null)[]>;
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
  floatingContext: FloatingContext;
}
