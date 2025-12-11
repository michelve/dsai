/**
 * Core Design System Primitives
 *
 * Shared type primitives for component development.
 * These types eliminate duplication and ensure consistency across components.
 *
 * @module @dsai/react/types/primitives
 */

/**
 * Semantic color variants used across components
 *
 * @example
 * ```typescript
 * // Direct reuse
 * type AlertVariant = SemanticColorVariant;
 *
 * // Extended with additional variants
 * type ButtonVariant = SemanticColorVariant | `outline-${SemanticColorVariant}` | 'link';
 * ```
 */
export type SemanticColorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

/**
 * Standard component sizing scale
 *
 * @example
 * ```typescript
 * type ButtonSize = ComponentSize;
 * type InputSize = ComponentSize;
 * ```
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Extended size scale for components needing finer granularity
 *
 * Used by: Avatar, Spinner, Modal
 *
 * @example
 * ```typescript
 * // Full extended size
 * type AvatarSize = ExtendedSize;
 *
 * // Subset without '2xl'
 * type SpinnerSize = Exclude<ExtendedSize, '2xl'>;
 *
 * // Extended with custom sizes
 * type ModalSize = ComponentSize | 'xl' | 'fullscreen';
 * ```
 */
export type ExtendedSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Feedback/notification variants
 *
 * Used by: Toast, notification systems
 * Note: Uses 'error' instead of 'danger' for feedback semantics
 *
 * @example
 * ```typescript
 * type ToastVariant = FeedbackVariant;
 * ```
 */
export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

/**
 * Alignment options for layout components
 *
 * @example
 * ```typescript
 * interface FlexProps {
 *   align?: Alignment;
 *   justify?: Alignment;
 * }
 * ```
 */
export type Alignment = 'start' | 'center' | 'end';

/**
 * Orientation for components that support both directions
 *
 * @example
 * ```typescript
 * interface TabsProps {
 *   orientation?: Orientation;
 * }
 * ```
 */
export type Orientation = 'horizontal' | 'vertical';
