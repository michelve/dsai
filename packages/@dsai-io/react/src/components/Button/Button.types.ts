import type {
  SafeHTMLAttributes as BaseSafeHTMLAttributes,
  ComponentSize,
  SemanticColorVariant,
  PolymorphicComponentProps,
} from '../../types';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

/**
 * Button component variants
 * Maps to Bootstrap 5 button styles using design tokens
 *
 * - Solid: 'primary', 'secondary', etc. — filled background
 * - Outline: 'outline-primary', etc. — bordered, transparent background
 * - Subtle: 'subtle-primary', etc. — lighter background using Bootstrap subtle utilities
 * - Ghost: transparent background with subtle hover feedback
 * - Link: styled as a hyperlink
 *
 * @see SemanticColorVariant
 */
export type ButtonVariant =
  | SemanticColorVariant
  | `outline-${SemanticColorVariant}`
  | `subtle-${SemanticColorVariant}`
  | 'ghost'
  | 'link';

/**
 * Button component sizes
 * sm: Small button (0.875rem font size)
 * md: Medium button (1rem font size) - default
 * lg: Large button (1.25rem font size)
 * icon: Square button for icon-only use (2.5rem × 2.5rem)
 * @see ComponentSize
 */
export type ButtonSize = ComponentSize | 'icon';

/**
 * Button HTML type attribute
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Safe HTML attributes that can be spread onto the button element
 * SECURITY: This whitelist prevents injection of dangerous attributes or event handlers
 * @see BaseSafeHTMLAttributes
 */
export interface SafeHTMLAttributes extends BaseSafeHTMLAttributes<HTMLButtonElement> {
  /** Associate button with a form by ID */
  form?: string;
  /** Override form action URL */
  formAction?: string;
  /** Override form HTTP method */
  formMethod?: 'get' | 'post' | 'dialog';
  /** Bypass form validation */
  formNoValidate?: boolean;
  /** Override form target */
  formTarget?: string;
}

/**
 * Button component props
 *
 * @example
 * ```tsx
 * // Basic button
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // Loading button
 * <Button variant="primary" loading>
 *   Saving...
 * </Button>
 *
 * // Button with icons
 * <Button variant="primary" startIcon={<SaveIcon />} endIcon={<ArrowIcon />}>
 *   Save
 * </Button>
 * ```
 */
export type ButtonElement = 'button';

export interface ButtonOwnProps extends SafeHTMLAttributes {
  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Button visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disabled state - prevents user interaction
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner and disables button
   * @default false
   */
  loading?: boolean;

  /**
   * Error state - visual indicator for error state (new in FSM version)
   * @default false
   */
  error?: boolean;

  /**
   * Text to show while loading (replaces children)
   * If not provided, children will be shown with spinner
   */
  loadingText?: string;

  /**
   * Position of the loading spinner relative to button text
   * @default 'start'
   */
  loadingPosition?: 'start' | 'center' | 'end';

  /**
   * Custom loading indicator element (replaces default Spinner)
   * @example <ThreeDotsIcon className="animate-pulse" />
   */
  loadingIndicator?: ReactNode;

  /**
   * Icon to display before button text (decorative, marked with aria-hidden)
   */
  startIcon?: ReactNode;

  /**
   * Icon to display after button text (decorative, marked with aria-hidden)
   */
  endIcon?: ReactNode;

  /**
   * Click event handler
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: ButtonType;

  /**
   * Full width button (100%)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * ARIA label for accessibility
   * Required when button content is not descriptive (e.g., icon-only buttons)
   */
  'aria-label'?: string;

  /**
   * ARIA described by - references element IDs providing additional description
   */
  'aria-describedby'?: string;

  /**
   * ARIA controls - IDs of elements controlled by this button
   */
  'aria-controls'?: string;

  /**
   * ARIA expanded - indicates if controlled element is expanded
   */
  'aria-expanded'?: boolean;

  /**
   * ARIA pressed - indicates pressed state for toggle buttons
   */
  'aria-pressed'?: boolean | 'mixed';

  /**
   * ARIA haspopup - indicates the button opens a popup element
   * Use 'menu' for dropdown menus, 'dialog' for popovers/modals, 'listbox' for select-like popups
   */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Name attribute
   */
  name?: string;

  /**
   * Value attribute
   */
  value?: string;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;

  /**
   * Auto focus on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Announcement text for dynamic state changes (shown to screen readers via aria-live)
   * Useful for announcing loading started, completed, or error states
   * @example "Saving changes..." or "Changes saved successfully"
   */
  announceText?: string;

  /**
   * Whether to announce state changes to screen readers
   * When true, announceText is announced with aria-live="polite"
   * @default true when announceText is provided
   */
  announce?: boolean;
}

export type ButtonProps = PolymorphicComponentProps<ButtonElement, ButtonOwnProps>;
