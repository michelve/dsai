import type { ComponentSize, SafeHTMLAttributes, SemanticColorVariant } from '../../types';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Badge component color variants
 * Maps to Bootstrap 5 badge background utilities (text-bg-*)
 * @see SemanticColorVariant
 */
export type BadgeVariant = SemanticColorVariant;

/**
 * Badge size
 * Maps to Bootstrap-compatible font-size and padding scales
 */
export type BadgeSize = ComponentSize;

/**
 * Badge visual appearance / style treatment
 * - `solid` — filled background with contrasting text (default, Bootstrap text-bg-*)
 * - `outline` — transparent background with colored border and text
 * - `subtle` — light tinted background with darker text (Bootstrap bg-*-subtle)
 */
export type BadgeAppearance = 'solid' | 'outline' | 'subtle';

/**
 * Badge placement when used inside Badge.Wrapper
 */
export type BadgePlacement = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

/**
 * Badge overlap shape — adjusts offset for the anchor element's shape
 */
export type BadgeOverlap = 'rectangular' | 'circular';

/**
 * Safe HTML attributes for Badge component
 * Whitelists allowed HTML attributes to prevent unrestricted prop spreading
 * Blocks dangerous attributes like 'onclick', 'onchange', etc.
 * @see SafeHTMLAttributes
 */
export type SafeBadgeHTMLAttributes = SafeHTMLAttributes<HTMLSpanElement>;

/**
 * Badge component props
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge variant="primary">New</Badge>
 *
 * // Sized badge
 * <Badge variant="success" size="lg">Active</Badge>
 *
 * // Outline badge
 * <Badge variant="danger" appearance="outline">Alert</Badge>
 *
 * // Dismissible badge
 * <Badge variant="primary" onDismiss={() => remove(id)}>React</Badge>
 *
 * // Auto-truncated count
 * <Badge variant="danger" max={99}>{150}</Badge>  // renders "99+"
 *
 * // Badge wrapper (overlay on another element)
 * <Badge.Wrapper>
 *   <MailIcon />
 *   <Badge variant="danger" pill>4</Badge>
 * </Badge.Wrapper>
 * ```
 */
export interface BadgeProps extends SafeBadgeHTMLAttributes {
  /**
   * Badge content
   */
  children?: ReactNode;

  /**
   * Badge color variant
   * @default 'primary'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Visual appearance / style treatment
   * @default 'solid'
   */
  appearance?: BadgeAppearance;

  /**
   * Pill shape (fully rounded)
   * @default false
   */
  pill?: boolean;

  /**
   * Show dot indicator instead of/before content
   * Useful for status indicators
   * NOTE: Requires aria-label when used without visible text
   * @default false
   */
  dot?: boolean;

  /**
   * Icon to display alongside badge text
   * Will be hidden from screen readers (aria-hidden="true")
   */
  icon?: ReactNode;

  /**
   * Icon position relative to text content
   * @default 'start'
   */
  iconPosition?: 'start' | 'end';

  /**
   * Element to render as
   * @default 'span'
   */
  as?: 'span' | 'div';

  /**
   * Callback fired when the dismiss button is clicked.
   * When provided, a close button is rendered inside the badge.
   */
  onDismiss?: () => void;

  /**
   * Accessible label for the dismiss button
   * @default 'Remove'
   */
  dismissLabel?: string;

  /**
   * Maximum numeric value to display.
   * When children is a number exceeding max, displays "{max}+".
   * Only applies when children is a number.
   */
  max?: number;

  /**
   * If true, the badge is hidden visually (opacity 0, pointer-events none)
   * but remains in the DOM to preserve layout.
   * @default false
   */
  invisible?: boolean;

  /**
   * If false and children is the number 0, the badge is not rendered.
   * @default true
   */
  showZero?: boolean;

  /**
   * Enable mount and content-change animations
   * @default false
   */
  animated?: boolean;
}

/**
 * Badge.Wrapper props — positions a badge as an overlay on a child element
 */
export interface BadgeWrapperProps {
  /** The anchor element and badge element */
  children: ReactNode;

  /**
   * Badge placement relative to the anchor
   * @default 'top-end'
   */
  placement?: BadgePlacement;

  /**
   * Shape of the anchor element — adjusts badge offset
   * @default 'rectangular'
   */
  overlap?: BadgeOverlap;

  /** Additional CSS class */
  className?: string;

  /** Inline styles */
  style?: CSSProperties;
}
