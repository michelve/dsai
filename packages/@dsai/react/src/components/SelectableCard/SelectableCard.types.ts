import type { CSSProperties, ReactNode } from 'react';

import type { CardColor, CardVariant } from '../Card';

// =============================================================================
// Selection Mode
// =============================================================================

/**
 * Selection mode for SelectableCard
 *
 * - `none`: No selection control, renders as regular Card
 * - `checkbox`: Checkbox control for multi-selection scenarios
 * - `radio`: Radio control for single-selection scenarios
 */
export type CardSelectionMode = 'none' | 'checkbox' | 'radio';

// =============================================================================
// SelectableCard Props
// =============================================================================

/**
 * SelectableCard component props
 *
 * A card that behaves like a checkbox or radio option.
 * Click anywhere on the card to toggle/select, not just the small control.
 *
 * Uses existing Card, Checkbox, Radio primitives internally.
 *
 * @example
 * ```tsx
 * // Standalone checkbox card (uncontrolled)
 * <SelectableCard
 *   selectionMode="checkbox"
 *   title="Premium Plan"
 *   description="$29/month"
 *   defaultChecked
 * />
 *
 * // Controlled radio card (within CardList)
 * <SelectableCard
 *   selectionMode="radio"
 *   value="premium"
 *   name="plan"
 *   checked={selectedPlan === 'premium'}
 *   onChange={(checked) => setSelectedPlan(checked ? 'premium' : null)}
 *   title="Premium Plan"
 * />
 *
 * // No selection (regular card behavior)
 * <SelectableCard
 *   selectionMode="none"
 *   title="Info Card"
 *   description="Just displays content"
 * />
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Uses native `<input type="checkbox">` or `<input type="radio">`
 * - Card click forwards to the control (like clicking a label)
 * - Proper focus management
 * - Keyboard support via native controls
 */
export interface SelectableCardProps {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Unique value for this card (required when used in CardList)
   * Optional for standalone usage
   */
  value?: string;

  /**
   * ID attribute for the card container
   * Auto-generated if not provided
   */
  id?: string;

  // ===========================================================================
  // Selection
  // ===========================================================================

  /**
   * Selection mode
   * - `none`: No selection control (default)
   * - `checkbox`: Checkbox for multi-selection
   * - `radio`: Radio for single-selection
   *
   * @default 'none'
   */
  selectionMode?: CardSelectionMode;

  /**
   * Controlled checked state
   * When provided, component is controlled
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled mode
   * Only used when `checked` is not provided
   */
  defaultChecked?: boolean;

  /**
   * Change handler called when selection changes
   * Receives the new checked state
   */
  onChange?: (checked: boolean) => void;

  /**
   * Form field name (used for radio grouping)
   * Required when selectionMode is 'radio' and used in a group
   */
  name?: string;

  // ===========================================================================
  // States
  // ===========================================================================

  /**
   * Disabled state - prevents selection and shows disabled styling
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state - shows error styling on the card
   * @default false
   */
  error?: boolean;

  /**
   * Required field - shows required indicator
   * Native `required` is passed to the checkbox/radio input
   * @default false
   */
  required?: boolean;

  // ===========================================================================
  // Visual / Card Props
  // ===========================================================================

  /**
   * Card variant styling
   * @default 'outlined'
   */
  variant?: CardVariant;

  /**
   * Background color variant when selected
   * Applied only when the card is checked
   */
  selectedColor?: CardColor;

  /**
   * Horizontal layout (media on side)
   * @default false
   */
  horizontal?: boolean;

  // ===========================================================================
  // Content
  // ===========================================================================

  /**
   * Card title
   */
  title?: ReactNode;

  /**
   * Card subtitle (displayed below title)
   */
  subtitle?: ReactNode;

  /**
   * Card description text
   */
  description?: ReactNode;

  /**
   * Media content (image, icon, or custom element)
   * Rendered at the top of the card (or left side if horizontal)
   */
  media?: ReactNode;

  /**
   * Footer content
   */
  footer?: ReactNode;

  /**
   * Custom children - rendered inside CardBody
   * Use this for complex card content instead of title/description
   */
  children?: ReactNode;

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  /**
   * Accessible label for screen readers
   * Use when there's no visible title
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this card
   */
  'aria-labelledby'?: string;

  /**
   * ID of element that describes this card
   */
  'aria-describedby'?: string;

  // ===========================================================================
  // Styling
  // ===========================================================================

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  // ===========================================================================
  // Callbacks
  // ===========================================================================

  /**
   * Additional click handler (called after selection toggle)
   * Use for side effects beyond selection state
   */
  onCardClick?: () => void;
}
